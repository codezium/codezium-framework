import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    TemplateRef,
    computed,
    effect,
    input,
    output,
    signal,
    viewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideCircleCheck,
    LucideDynamicIcon,
    LucideFile,
    LucideTrash2,
    LucideUpload,
    LucideX,
    type LucideIconInput,
} from '@lucide/angular';
import { CzSeverity } from '../../types';
import { CzMessageComponent } from '../../molecules/message';

export type CzFileUploadMode = 'advanced' | 'basic';

export interface CzFileUploadSelectEvent {
    files: File[];
    currentFiles: File[];
    originalEvent: Event;
}

export interface CzFileUploadProgressEvent {
    progress: number;
    originalEvent?: ProgressEvent;
}

export interface CzFileUploadEvent {
    files: File[];
    originalEvent?: Event;
}

export interface CzFileUploadHandlerEvent {
    files: File[];
}

export interface CzFileUploadErrorEvent {
    files: File[];
    error?: unknown;
}

export interface CzFileRemoveEvent {
    file: File;
    index: number;
}

export interface CzFileUploadMessage {
    severity: CzSeverity;
    summary: string;
    detail: string;
}

@Component({
    selector: 'cz-file-upload',
    imports: [CommonModule, LucideDynamicIcon, CzMessageComponent],
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-file-upload',
        '[class.cz-file-upload--disabled]': 'disabled()',
    },
})
export class CzFileUploadComponent {
    private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

    /** UI mode: advanced (header + dropzone) or basic (choose button only) */
    mode = input<CzFileUploadMode>('advanced');

    /** Name of the request parameter to identify the files at the backend */
    name = input<string>('');

    /** Remote url to upload the files */
    url = input<string>('');

    /** HTTP method to send the files */
    method = input<'post' | 'put'>('post');

    /** Allows selecting multiple files */
    multiple = input<boolean>(false);

    /** Comma separated list of allowed mime types / extensions */
    accept = input<string>('');

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Uploads automatically after selection */
    auto = input<boolean>(false);

    /** Cross-site requests using credentials */
    withCredentials = input<boolean>(false);

    /** Maximum file size allowed in bytes (0 = unlimited) */
    maxFileSize = input<number>(0);

    /** Maximum number of files */
    fileLimit = input<number | null>(null);

    /** Use a custom upload implementation through `uploadHandler` */
    customUpload = input<boolean>(false);

    /** Preset files */
    filesInput = input<File[]>([]);

    /** Style class of the root element */
    styleClass = input<string>('');

    /** Width of the image thumbnail in pixels */
    previewWidth = input<number>(50);

    /** Choose button label */
    chooseLabel = input<string>('Choose');

    /** Upload button label */
    uploadLabel = input<string>('Upload');

    /** Cancel button label */
    cancelLabel = input<string>('Cancel');

    /** Choose button icon */
    chooseIcon = input<LucideIconInput>(LucideUpload);

    /** Upload button icon */
    uploadIcon = input<LucideIconInput>(LucideUpload);

    /** Cancel button icon */
    cancelIcon = input<LucideIconInput>(LucideX);

    /** Whether to show the upload button */
    showUploadButton = input<boolean>(true);

    /** Whether to show the cancel button */
    showCancelButton = input<boolean>(true);

    /** Default dropzone label */
    dragLabel = input<string>('Drag and drop files here');

    invalidFileSizeMessageSummary = input<string>('File is too large');
    invalidFileSizeMessageDetail = input<string>('{0} exceeds the maximum file size.');
    invalidFileTypeMessageSummary = input<string>('Invalid file type');
    invalidFileTypeMessageDetail = input<string>('{0} has an invalid file type.');
    invalidFileLimitMessageSummary = input<string>('Maximum number of files exceeded');
    invalidFileLimitMessageDetail = input<string>('Up to {0} files are allowed.');

    /** Custom file template (per row): `$implicit` file, `index`, `removeCallback` */
    fileTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom header template: `files`, `uploadedFiles`, `chooseCallback`, `uploadCallback`, `clearCallback` */
    headerTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom content template: `files`, `uploadedFiles`, `removeFileCallback`, `removeUploadedFileCallback`, `messages`, `chooseCallback`, `uploadCallback` */
    contentTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom toolbar template replacing the default header buttons */
    toolbarTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom empty state template */
    emptyTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom choose icon template */
    chooseIconTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom file label template */
    fileLabelTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom upload icon template */
    uploadIconTemplate = input<TemplateRef<unknown> | null>(null);

    /** Custom cancel icon template */
    cancelIconTemplate = input<TemplateRef<unknown> | null>(null);

    /** Emitted when files are selected (input or drop) */
    onSelect = output<CzFileUploadSelectEvent>();

    /** Emitted when a pending file is removed */
    onRemove = output<CzFileRemoveEvent>();

    /** Emitted when the pending files are cleared without uploading */
    onClear = output<void>();

    /** Emitted when the default upload completes */
    onUpload = output<CzFileUploadEvent>();

    /** Emitted while the default upload progresses */
    onProgress = output<CzFileUploadProgressEvent>();

    /** Emitted when the default upload fails */
    onError = output<CzFileUploadErrorEvent>();

    /** Emitted in custom upload mode to upload the files manually */
    uploadHandler = output<CzFileUploadHandlerEvent>();

    /** Emitted when an uploaded file is removed */
    onRemoveUploadedFile = output<CzFileRemoveEvent>();

    /** Emitted when an image thumbnail fails to load */
    onImageError = output<Event>();

    /** Pending files */
    files = signal<File[]>([]);

    /** Uploaded files */
    uploadedFiles = signal<File[]>([]);

    /** Validation messages */
    messages = signal<CzFileUploadMessage[]>([]);

    /** Upload progress (0-100) */
    progress = signal<number>(0);

    /** Upload in progress */
    uploading = signal<boolean>(false);

    /** Drag state */
    isDragging = signal<boolean>(false);

    readonly hasFiles = computed(() => this.files().length > 0);
    readonly hasUploadedFiles = computed(() => this.uploadedFiles().length > 0);

    readonly CheckIcon = LucideCircleCheck;
    readonly FileIcon = LucideFile;
    readonly TrashIcon = LucideTrash2;

    private readonly objectUrls = new Map<File, string>();

    constructor() {
        effect(() => {
            const preset = this.filesInput();
            if (preset?.length) {
                this.files.set([...preset]);
            }
        });
    }

    /* ── Selection ── */

    choose(): void {
        if (this.disabled()) return;
        this.inputRef()?.nativeElement.click();
    }

    onFileInput(event: Event): void {
        const inputEl = event.target as HTMLInputElement;
        const selected = inputEl.files ? Array.from(inputEl.files) : [];
        this.addFiles(selected, event);
        inputEl.value = '';
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragging.set(false);
        if (this.disabled()) return;

        const dropped = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
        this.addFiles(dropped, event);
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        if (!this.disabled()) {
            this.isDragging.set(true);
        }
    }

    onDragLeave(): void {
        this.isDragging.set(false);
    }

    private addFiles(selected: File[], originalEvent: Event): void {
        if (this.disabled() || selected.length === 0) return;

        const valid: File[] = [];
        const messages: CzFileUploadMessage[] = [];
        let current = this.multiple() ? [...this.files()] : [];

        for (const file of selected) {
            if (this.maxFileSize() > 0 && file.size > this.maxFileSize()) {
                messages.push({
                    severity: 'danger',
                    summary: this.invalidFileSizeMessageSummary(),
                    detail: this.invalidFileSizeMessageDetail().replace('{0}', file.name),
                });
                continue;
            }

            if (this.accept() && !this.matchesAccept(file)) {
                messages.push({
                    severity: 'danger',
                    summary: this.invalidFileTypeMessageSummary(),
                    detail: this.invalidFileTypeMessageDetail().replace('{0}', file.name),
                });
                continue;
            }

            const limit = this.fileLimit();
            if (limit != null && current.length + valid.length >= limit) {
                messages.push({
                    severity: 'danger',
                    summary: this.invalidFileLimitMessageSummary(),
                    detail: this.invalidFileLimitMessageDetail().replace('{0}', String(limit)),
                });
                break;
            }

            valid.push(file);
        }

        current = this.multiple() ? [...current, ...valid] : valid.slice(0, 1);

        this.files.set(current);
        this.messages.set(messages);

        if (valid.length > 0) {
            this.onSelect.emit({ files: valid, currentFiles: current, originalEvent });

            if (this.auto()) {
                this.upload();
            }
        }
    }

    private matchesAccept(file: File): boolean {
        const patterns = this.accept()
            .split(',')
            .map(pattern => pattern.trim().toLowerCase())
            .filter(Boolean);
        if (!patterns.length) return true;

        const name = file.name.toLowerCase();
        const type = file.type.toLowerCase();

        return patterns.some(pattern => {
            if (pattern.startsWith('.')) return name.endsWith(pattern);
            if (pattern.endsWith('/*')) return type.startsWith(pattern.slice(0, -1));
            return type === pattern;
        });
    }

    /* ── Upload ── */

    upload(): void {
        if (this.disabled() || this.uploading()) return;

        const files = this.files();
        if (!files.length) return;

        if (this.customUpload()) {
            this.uploadHandler.emit({ files });
            return;
        }

        const url = this.url();
        if (!url) return;

        this.uploading.set(true);
        this.progress.set(0);

        const formData = new FormData();
        const name = this.name() || 'files';
        for (const file of files) {
            formData.append(name, file, file.name);
        }

        const xhr = new XMLHttpRequest();
        xhr.open(this.method().toUpperCase(), url, true);
        if (this.withCredentials()) xhr.withCredentials = true;

        xhr.upload.onprogress = (event: ProgressEvent) => {
            const progress = event.lengthComputable ? Math.round((event.loaded * 100) / event.total) : 0;
            this.progress.set(progress);
            this.onProgress.emit({ progress, originalEvent: event });
        };

        xhr.onload = () => {
            this.uploading.set(false);
            this.progress.set(100);
            this.uploadedFiles.update(uploaded => [...uploaded, ...files]);
            this.files.set([]);
            this.onUpload.emit({ files, originalEvent: xhr as unknown as Event });
        };

        xhr.onerror = () => {
            this.uploading.set(false);
            this.onError.emit({ files, error: xhr });
        };

        xhr.send(formData);
    }

    /** Moves the pending (or given) files to the uploaded list — helper for custom upload implementations */
    markUploaded(files?: File[]): void {
        const target = files ?? this.files();
        if (!target.length) return;

        this.uploadedFiles.update(uploaded => [...uploaded, ...target]);
        this.files.update(pending => pending.filter(file => !target.includes(file)));
    }

    /* ── Removal ── */

    remove(event: Event, index: number): void {
        event?.stopPropagation();

        const files = [...this.files()];
        const [removed] = files.splice(index, 1);
        if (!removed) return;

        this.files.set(files);
        this.onRemove.emit({ file: removed, index });
    }

    removeUploadedFile(index: number): void {
        const uploaded = [...this.uploadedFiles()];
        const [removed] = uploaded.splice(index, 1);
        if (!removed) return;

        this.uploadedFiles.set(uploaded);
        this.onRemoveUploadedFile.emit({ file: removed, index });
    }

    /** Clears the pending files without uploading */
    clear(): void {
        this.files.set([]);
        this.messages.set([]);
        this.onClear.emit();
    }

    /* ── Template callbacks (bound so they can be called from outlet contexts) ── */

    readonly chooseCallback = (): void => this.choose();

    readonly uploadCallback = (): void => this.upload();

    readonly clearCallback = (): void => this.clear();

    readonly removeFileCallback = (event: Event, index: number): void => this.remove(event, index);

    readonly removeUploadedFileCallback = (index: number): void => this.removeUploadedFile(index);

    /* ── Helpers ── */

    isImage(file: File): boolean {
        return file.type.startsWith('image/');
    }

    objectUrl(file: File): string {
        let url = this.objectUrls.get(file);
        if (!url) {
            url = URL.createObjectURL(file);
            this.objectUrls.set(file, url);
        }
        return url;
    }

    sizeLabel(file: File): string {
        return this.formatSize(file.size);
    }

    formatSize(bytes: number): string {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    }
}
