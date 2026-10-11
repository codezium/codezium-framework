import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    TemplateRef,
    ViewChild,
    computed,
    contentChild,
    inject,
    input,
    Optional,
    output,
    Self,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
    LucideBold,
    LucideCode,
    LucideDynamicIcon,
    LucideEraser,
    LucideHighlighter,
    LucideImage,
    LucideItalic,
    LucideLink,
    LucideList,
    LucideListOrdered,
    LucidePalette,
    LucideUnderline,
} from '@lucide/angular';

export type CzEditorSource = 'user' | 'api';

export interface CzEditorRange {
    index: number;
    length: number;
}

export interface CzEditorTextChangeEvent {
    htmlValue: string;
    textValue: string;
    source: CzEditorSource;
}

export interface CzEditorSelectionChangeEvent {
    range: CzEditorRange;
    source: CzEditorSource;
}

export interface CzEditorChangeEvent {
    htmlValue: string;
    textValue: string;
    range: CzEditorRange;
}

export interface CzEditorFocusEvent {
    source: CzEditorSource;
}

export interface CzEditorBlurEvent {
    source: CzEditorSource;
}

/** Imperative API exposed to templates and `onEditorInit` */
export interface CzEditorApi {
    exec(command: string, value?: string): void;
    formatBlock(tag: string): void;
    setColor(color: string): void;
    setBackground(color: string): void;
    setFont(family: string): void;
    setFontSize(px: number): void;
    insertList(ordered: boolean): void;
    insertLink(url?: string): void;
    insertImage(url?: string): void;
    insertImageFile(file: File): void;
    pickImage(): void;
    toggleCodeBlock(): void;
    clean(): void;
    getHtml(): string;
    getText(): string;
    getSelection(): CzEditorRange;
    focus(): void;
}

export interface CzEditorInitEvent {
    editor: CzEditorApi;
}

export interface CzEditorHeaderFormat {
    label: string;
    value: string;
}

@Component({
    selector: 'cz-editor',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-editor',
        '[class.cz-editor--disabled]': 'actualDisabled()',
        '[class.cz-editor--readonly]': 'readonly()',
        '[class.cz-editor--invalid]': 'invalid()',
        '[class]': 'styleClass()',
    },
})
export class CzEditorComponent implements ControlValueAccessor, AfterViewInit {
    /** Placeholder shown when the editor is empty */
    placeholder = input<string>('');

    /** Read-only mode */
    readonly = input<boolean>(false);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Invalid state */
    invalid = input<boolean>(false);

    /** Whitelist of allowed formats (e.g. ['bold', 'italic', 'list']) */
    formats = input<string[] | null>(null);

    /** Style class of the host element */
    styleClass = input<string>('');

    /** Font families available in the toolbar */
    fontFamilies = input<string[]>(['Sora', 'Inter', 'JetBrains Mono', 'Georgia', 'Arial', 'Times New Roman']);

    /** Font sizes (px) available in the toolbar */
    fontSizes = input<number[]>([12, 14, 16, 18, 20, 24, 32]);

    /** Custom toolbar template: receives the `editor` API */
    headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');

    /** Emitted when the editor is initialized */
    onEditorInit = output<CzEditorInitEvent>();

    /** Emitted when the text changes */
    onTextChange = output<CzEditorTextChangeEvent>();

    /** Emitted when the selection changes */
    onSelectionChange = output<CzEditorSelectionChangeEvent>();

    /** Emitted when content or selection changes */
    onEditorChange = output<CzEditorChangeEvent>();

    /** Emitted on focus */
    onFocusEvent = output<CzEditorFocusEvent>({ alias: 'onFocus' });

    /** Emitted on blur */
    onBlurEvent = output<CzEditorBlurEvent>({ alias: 'onBlur' });

    @ViewChild('contentEl') contentEl?: ElementRef<HTMLDivElement>;

    @ViewChild('imageInput') imageInput?: ElementRef<HTMLInputElement>;

    /** Current HTML value */
    html = signal<string>('');

    /** Active formats (for toolbar state) */
    activeFormats = signal<Record<string, boolean>>({});

    /** Internal forms disabled state */
    formsDisabled = signal<boolean>(false);

    /** Editor has been initialized */
    private initialized = false;
    private lastEmitted = '';

    /** Last selection inside the content (restored before running commands) */
    private savedRange: Range | null = null;

    private readonly destroyRef = inject(DestroyRef);
    private readonly onDocumentSelectionChange = (): void => {
        if (this.isFocused()) {
            this.saveSelection();
            this.updateActiveFormats();
        }
    };

    readonly actualDisabled = computed(() => this.disabled() || this.formsDisabled());
    readonly editable = computed(() => !this.actualDisabled() && !this.readonly());
    readonly isRequired = computed(() => false);

    readonly BoldIcon = LucideBold;
    readonly ItalicIcon = LucideItalic;
    readonly UnderlineIcon = LucideUnderline;
    readonly ListIcon = LucideList;
    readonly ListOrderedIcon = LucideListOrdered;
    readonly LinkIcon = LucideLink;
    readonly ImageIcon = LucideImage;
    readonly CodeIcon = LucideCode;
    readonly CleanIcon = LucideEraser;
    readonly ColorIcon = LucidePalette;
    readonly BackgroundIcon = LucideHighlighter;

    readonly headerFormats: CzEditorHeaderFormat[] = [
        { label: 'Normal', value: 'div' },
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
    ];

    readonly colorOptions = [
        '#000000', '#4B5563', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
    ];

    readonly backgroundOptions = [
        '#FEF08A', '#BBF7D0', '#BFDBFE', '#DDD6FE', '#FBCFE8', '#FED7AA', '#E5E7EB', '#000000',
    ];

    /** Imperative API shared with templates */
    readonly api: CzEditorApi = {
        exec: (command, value) => this.exec(command, value),
        formatBlock: (tag) => this.formatBlock(tag),
        setColor: (color) => this.setColor(color),
        setBackground: (color) => this.setBackground(color),
        setFont: (family) => this.setFont(family),
        setFontSize: (px) => this.setFontSize(px),
        insertList: (ordered) => this.insertList(ordered),
        insertLink: (url) => this.insertLink(url),
        insertImage: (url) => this.insertImage(url),
        insertImageFile: (file) => this.insertImageFile(file),
        pickImage: () => this.pickImage(),
        toggleCodeBlock: () => this.toggleCodeBlock(),
        clean: () => this.clean(),
        getHtml: () => this.getHtml(),
        getText: () => this.getText(),
        getSelection: () => this.getSelection(),
        focus: () => this.focus(),
    };

    // CVA callbacks
    onChange: Function = (_: any) => {};
    onTouched: Function = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngAfterViewInit(): void {
        this.initialized = true;
        this.syncDomValue();
        this.updateActiveFormats();
        this.onEditorInit.emit({ editor: this.api });

        document.addEventListener('selectionchange', this.onDocumentSelectionChange);
        this.destroyRef.onDestroy(() =>
            document.removeEventListener('selectionchange', this.onDocumentSelectionChange),
        );
    }

    /* ── Formats whitelist ── */

    isFormatAllowed(format: string): boolean {
        const formats = this.formats();
        if (!formats || !formats.length) return true;
        return formats.includes(format);
    }

    /* ── Commands ── */

    private ensureFocus(): void {
        const element = this.contentEl?.nativeElement;
        if (element && !element.contains(document.activeElement)) {
            element.focus();
        }
    }

    /** Saves the current selection inside the content */
    saveSelection(): void {
        const element = this.contentEl?.nativeElement;
        const selection = window.getSelection();
        if (!element || !selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (element.contains(range.startContainer)) {
            this.savedRange = range.cloneRange();
        }
    }

    /** Restores the last saved selection (needed after interacting with toolbar controls) */
    private restoreSelection(): void {
        const element = this.contentEl?.nativeElement;
        if (!element || !this.savedRange) return;
        if (!element.contains(this.savedRange.startContainer)) return;

        const selection = window.getSelection();
        if (!selection) return;

        element.focus();
        selection.removeAllRanges();
        selection.addRange(this.savedRange);
    }

    /** Restores the selection and focuses the content before running a command */
    private prepareCommand(): void {
        this.restoreSelection();
        this.ensureFocus();
    }

    private runCommand(command: string, value?: string): void {
        try {
            document.execCommand(command, false, value);
        } catch {
            // Not implemented in non-browser environments (e.g. tests)
        }
    }

    exec(command: string, value?: string): void {
        if (!this.editable()) return;
        this.prepareCommand();
        this.runCommand(command, value);
        this.afterCommand('api');
    }

    formatBlock(tag: string): void {
        if (!this.editable() || !this.isFormatAllowed('header')) return;
        this.prepareCommand();
        this.runCommand('formatBlock', tag);
        this.afterCommand('api');
    }

    setColor(color: string): void {
        this.exec('foreColor', color);
    }

    setBackground(color: string): void {
        this.exec('hiliteColor', color);
    }

    setFont(family: string): void {
        if (!this.editable() || !this.isFormatAllowed('font-family')) return;

        this.prepareCommand();
        this.runCommand('fontName', family);

        // Replace the <font face> wrappers with inline styles so they are not flattened by resets
        const element = this.contentEl?.nativeElement;
        element?.querySelectorAll('font[face]').forEach((font) => {
            const span = document.createElement('span');
            span.style.fontFamily = font.getAttribute('face') || family;
            while (font.firstChild) span.appendChild(font.firstChild);
            font.replaceWith(span);
        });

        this.afterCommand('api');
    }

    setFontSize(px: number): void {
        if (!this.editable() || !this.isFormatAllowed('font-size')) return;

        this.prepareCommand();
        this.runCommand('fontSize', '7');

        // Replace the size-7 <font> wrappers with real px styles
        const element = this.contentEl?.nativeElement;
        element?.querySelectorAll('font[size="7"]').forEach((font) => {
            const span = document.createElement('span');
            span.style.fontSize = `${px}px`;
            while (font.firstChild) span.appendChild(font.firstChild);
            font.replaceWith(span);
        });

        this.afterCommand('api');
    }

    /** Opens the native file picker to insert an image */
    pickImage(): void {
        if (!this.editable() || !this.isFormatAllowed('image')) return;
        this.imageInput?.nativeElement.click();
    }

    onImageInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';

        if (file) {
            this.insertImageFile(file);
        }
    }

    /** Inserts an image from a File as a data URL */
    insertImageFile(file: File): void {
        if (!this.editable()) return;

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            if (typeof loadEvent.target?.result === 'string') {
                this.prepareCommand();
                this.runCommand('insertImage', loadEvent.target.result);
                this.afterCommand('api');
            }
        };
        reader.readAsDataURL(file);
    }

    /** Pastes images directly from the clipboard */
    onContentPaste(event: ClipboardEvent): void {
        if (!this.editable()) return;

        const items = event.clipboardData?.items;
        if (!items) return;

        const images: File[] = [];
        for (const item of Array.from(items)) {
            if (item.kind === 'file' && item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) images.push(file);
            }
        }

        if (!images.length) return;

        event.preventDefault();
        for (const file of images) {
            this.insertImageFile(file);
        }
    }

    insertList(ordered: boolean): void {
        if (!this.editable() || !this.isFormatAllowed('list')) return;
        this.exec(ordered ? 'insertOrderedList' : 'insertUnorderedList');
    }

    insertLink(url?: string): void {
        if (!this.editable() || !this.isFormatAllowed('link')) return;
        const href = url ?? window.prompt('Enter the URL') ?? '';
        if (!href) return;
        this.exec('createLink', href);
    }

    insertImage(url?: string): void {
        if (!this.editable() || !this.isFormatAllowed('image')) return;

        if (!url) {
            this.pickImage();
            return;
        }

        this.exec('insertImage', url);
    }

    toggleCodeBlock(): void {
        if (!this.editable() || !this.isFormatAllowed('code-block')) return;
        const active = this.activeFormats()['code-block'];
        this.prepareCommand();
        this.runCommand('formatBlock', active ? 'div' : 'pre');
        this.afterCommand('api');
    }

    clean(): void {
        if (!this.editable()) return;
        this.prepareCommand();
        this.runCommand('removeFormat');
        this.runCommand('formatBlock', 'div');
        this.afterCommand('api');
    }

    onToolbarMouseDown(event: Event): void {
        const target = event.target as HTMLElement | null;

        // Native selects and inputs must keep their default behavior (e.g. open the dropdown)
        if (target?.closest('select, input')) {
            this.saveSelection();
            return;
        }

        // Keep the text selection while clicking toolbar buttons
        event.preventDefault();
        this.saveSelection();
    }

    /* ── Content ── */

    onContentInput(): void {
        if (!this.editable()) return;
        const html = this.getHtml();
        this.html.set(html);
        this.lastEmitted = html;
        this.onChange(html);
        this.onTextChange.emit({ htmlValue: html, textValue: this.getText(), source: 'user' });
        this.onEditorChange.emit({ htmlValue: html, textValue: this.getText(), range: this.getSelection() });
        this.updateActiveFormats();
    }

    onContentFocus(): void {
        this.onFocusEvent.emit({ source: 'user' });
    }

    onContentBlur(): void {
        this.onTouched();
        this.onBlurEvent.emit({ source: 'user' });
    }

    onContentSelectionChange(): void {
        if (!this.isFocused()) return;
        this.updateActiveFormats();
        this.onSelectionChange.emit({ range: this.getSelection(), source: 'user' });
        this.onEditorChange.emit({ htmlValue: this.getHtml(), textValue: this.getText(), range: this.getSelection() });
    }

    private afterCommand(source: CzEditorSource): void {
        const html = this.getHtml();
        this.html.set(html);
        this.lastEmitted = html;
        this.onChange(html);
        this.updateActiveFormats();
        this.onTextChange.emit({ htmlValue: html, textValue: this.getText(), source });
        this.onEditorChange.emit({ htmlValue: html, textValue: this.getText(), range: this.getSelection() });

        // Browsers update the command state asynchronously
        setTimeout(() => this.updateActiveFormats());
    }

    private updateActiveFormats(): void {
        if (!this.initialized) return;

        const state: Record<string, boolean> = {};
        const commands = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];

        for (const command of commands) {
            try {
                state[command] = document.queryCommandState(command);
            } catch {
                state[command] = false;
            }
        }

        try {
            state['code-block'] = !!document.queryCommandValue('formatBlock')?.match(/^pre$/i);
        } catch {
            state['code-block'] = false;
        }

        this.activeFormats.set(state);
    }

    isActive(command: string): boolean {
        return this.activeFormats()[command] === true;
    }

    isFocused(): boolean {
        const element = this.contentEl?.nativeElement;
        return !!element && element.contains(document.activeElement);
    }

    focus(): void {
        this.contentEl?.nativeElement.focus();
    }

    getHtml(): string {
        return this.contentEl?.nativeElement.innerHTML ?? this.html();
    }

    getText(): string {
        return this.contentEl?.nativeElement.textContent ?? '';
    }

    getSelection(): CzEditorRange {
        const element = this.contentEl?.nativeElement;
        const selection = window.getSelection();

        if (!element || !selection || selection.rangeCount === 0) {
            return { index: 0, length: 0 };
        }

        const range = selection.getRangeAt(0);
        if (!element.contains(range.startContainer)) {
            return { index: 0, length: 0 };
        }

        const preRange = range.cloneRange();
        preRange.selectNodeContents(element);
        preRange.setEnd(range.startContainer, range.startOffset);

        return { index: preRange.toString().length, length: range.toString().length };
    }

    /* ── ControlValueAccessor ── */

    writeValue(value: any): void {
        const html = value ?? '';
        this.html.set(html);
        this.lastEmitted = html;

        if (this.initialized && html !== this.getHtml()) {
            this.syncDomValue();
        }
    }

    private syncDomValue(): void {
        const element = this.contentEl?.nativeElement;
        if (element) {
            element.innerHTML = this.html() || '';
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.formsDisabled.set(isDisabled);
    }
}
