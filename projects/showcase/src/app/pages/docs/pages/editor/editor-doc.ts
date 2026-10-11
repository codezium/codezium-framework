import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CzButtonComponent, CzEditorComponent, CzEditorTextChangeEvent, CzMessageComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { EDITOR_DOC_I18N } from './editor-doc.i18n';

@Component({
    selector: 'cz-editor-doc-page',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CzEditorComponent,
        CzButtonComponent,
        CzMessageComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="editor">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-editor [(ngModel)]="text" style="height: 16rem;" />
                </div>
                <span class="cz-text-sm">{{ t().characters }}: {{ plainText().length }}</span>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── PLACEHOLDER & FORMATS ── -->
            <section>
                <h2 id="placeholder">{{ t().placeholderSection }}</h2>
                <p [innerHTML]="t().placeholderDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-gap-lg">
                    <cz-editor [(ngModel)]="placeholderText" [placeholder]="t().placeholderText" style="height: 10rem;" />
                    <cz-editor [(ngModel)]="limitedText" [formats]="['bold', 'italic', 'underline', 'list']"
                        style="height: 10rem;" />
                </div>
                <app-code [code]="placeholderCode" />
            </section>

            <!-- ── CUSTOM TOOLBAR ── -->
            <section>
                <h2 id="custom-toolbar">{{ t().customToolbar }}</h2>
                <p [innerHTML]="t().customToolbarDesc"></p>
                <div class="cz-mb-md">
                    <cz-editor [(ngModel)]="customText" style="height: 14rem;">
                        <ng-template #headerTemplate let-editor="editor">
                            <span class="cz-flex cz-flex-wrap cz-items-center cz-gap-sm">
                                <cz-button [label]="t().bold" size="sm" variant="outlined"
                                    (onClick)="editor.exec('bold')" />
                                <cz-button [label]="t().italic" size="sm" variant="outlined"
                                    (onClick)="editor.exec('italic')" />
                                <cz-button [label]="t().underline" size="sm" variant="outlined"
                                    (onClick)="editor.exec('underline')" />
                                <cz-button [label]="t().highlight" size="sm" variant="outlined"
                                    (onClick)="editor.setBackground('#FEF08A')" />
                                <cz-button [label]="t().link" size="sm" variant="outlined"
                                    (onClick)="editor.insertLink('https://angular.dev')" />
                                <cz-button [label]="t().clean" size="sm" variant="text" severity="secondary"
                                    (onClick)="editor.clean()" />
                            </span>
                        </ng-template>
                    </cz-editor>
                </div>
                <app-code [code]="customToolbarCode" />
            </section>

            <!-- ── READONLY & DISABLED ── -->
            <section>
                <h2 id="readonly">{{ t().readonly }}</h2>
                <p [innerHTML]="t().readonlyDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-gap-lg">
                    <cz-editor [(ngModel)]="readonlyText" [readonly]="true" style="height: 10rem;" />
                    <cz-editor [(ngModel)]="disabledText" [disabled]="true" style="height: 10rem;" />
                </div>
                <app-code [code]="readonlyCode" />
            </section>

            <!-- ── INVALID ── -->
            <section>
                <h2 id="invalid">{{ t().invalid }}</h2>
                <p [innerHTML]="t().invalidDesc"></p>
                <div class="cz-mb-md">
                    <cz-editor [(ngModel)]="invalidText" [invalid]="!invalidText" [placeholder]="t().invalidHint"
                        style="height: 10rem;" />
                </div>
                <app-code [code]="invalidCode" />
            </section>

            <!-- ── FONTS & SIZES ── -->
            <section>
                <h2 id="fonts">{{ t().fonts }}</h2>
                <p [innerHTML]="t().fontsDesc"></p>
                <div class="cz-mb-md">
                    <cz-editor [(ngModel)]="fontsText" [placeholder]="t().fontsPlaceholder" style="height: 12rem;" />
                </div>
                <app-code [code]="fontsCode" />
            </section>

            <!-- ── IMAGES ── -->
            <section>
                <h2 id="images">{{ t().images }}</h2>
                <p [innerHTML]="t().imagesDesc"></p>
                <div class="cz-mb-md">
                    <cz-editor [(ngModel)]="imagesText" [placeholder]="t().imagesPlaceholder" style="height: 12rem;"
                        (onEditorInit)="imagesEditor.set($event.editor)" />
                </div>
                <span class="cz-text-sm">{{ t().imagesTry }}</span>
                <app-code [code]="imagesCode" />
            </section>

            <!-- ── EVENTS ── -->
            <section>
                <h2 id="events">{{ t().events }}</h2>
                <p [innerHTML]="t().eventsDesc"></p>
                <div class="cz-mb-md">
                    <cz-editor [(ngModel)]="eventsText" (onTextChange)="lastTextChange.set($event)"
                        (onSelectionChange)="lastSelection.set($event)" style="height: 10rem;" />
                    <span class="cz-text-sm">{{ t().lastTextChange }}: {{ textChangeLabel() }}</span>
                    <br />
                    <span class="cz-text-sm">{{ t().lastSelection }}: {{ selectionLabel() }}</span>
                </div>
                <app-code [code]="eventsCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p [innerHTML]="t().formsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-items-start cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 24rem;">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-editor formControlName="content" [invalid]="isInvalid('content')" style="height: 10rem;" />
                        @if (isInvalid('content')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 24rem;">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-editor #content="ngModel" name="content" [(ngModel)]="templateText" required
                            [invalid]="!!content.invalid && (content.touched || tdForm.submitted)"
                            style="height: 10rem;" />
                        @if (!!content.invalid && (content.touched || tdForm.submitted)) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>
                </div>
                <app-code [code]="formsCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
                    <li [innerHTML]="t().a11yToolbar"></li>
                    <li [innerHTML]="t().a11yKeyboard"></li>
                </ul>
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>Placeholder shown when the editor is empty.</td></tr>
                            <tr><td><code>readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>The value cannot be edited.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>invalid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Invalid state for failed validation.</td></tr>
                            <tr><td><code>formats</code></td><td><code>string[] | null</code></td><td><code>null</code></td><td>Whitelist of allowed formats (<code>bold</code>, <code>italic</code>, <code>underline</code>, <code>header</code>, <code>font-family</code>, <code>font-size</code>, <code>color</code>, <code>background</code>, <code>list</code>, <code>link</code>, <code>image</code>, <code>code-block</code>, <code>clean</code>).</td></tr>
                            <tr><td><code>fontFamilies</code></td><td><code>string[]</code></td><td><code>['Sora', 'Inter', ...]</code></td><td>Font families available in the toolbar.</td></tr>
                            <tr><td><code>fontSizes</code></td><td><code>number[]</code></td><td><code>[12, 14, 16, 18, 20, 24, 32]</code></td><td>Font sizes (px) available in the toolbar.</td></tr>
                            <tr><td><code>styleClass</code></td><td><code>string</code></td><td><code>''</code></td><td>Style class of the host element.</td></tr>
                            <tr><td><code>headerTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Custom toolbar; the context provides the <code>editor</code> API.</td></tr>
                            <tr><td><code>onEditorInit</code></td><td><code>output&lt;&#123; editor &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when the editor is initialized (provides the command API).</td></tr>
                            <tr><td><code>onTextChange</code></td><td><code>output&lt;&#123; htmlValue, textValue, source &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when the text changes.</td></tr>
                            <tr><td><code>onSelectionChange</code></td><td><code>output&lt;&#123; range, source &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when the selection changes.</td></tr>
                            <tr><td><code>onEditorChange</code></td><td><code>output&lt;&#123; htmlValue, textValue, range &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when content or selection changes.</td></tr>
                            <tr><td><code>onFocus / onBlur</code></td><td><code>output&lt;&#123; source &#125;&gt;</code></td><td><code>—</code></td><td>Emitted on focus/blur.</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3>Editor API</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Method</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>exec(command, value?)</code></td><td>Runs a formatting command (<code>bold</code>, <code>italic</code>, <code>underline</code>, <code>foreColor</code>, <code>hiliteColor</code>, <code>createLink</code>, <code>insertImage</code>, ...).</td></tr>
                            <tr><td><code>formatBlock(tag)</code></td><td>Changes the block format (<code>div</code>, <code>h1</code>…<code>h4</code>, <code>pre</code>).</td></tr>
                            <tr><td><code>setFont(family) / setFontSize(px)</code></td><td>Applies a font family or a pixel font size to the selection.</td></tr>
                            <tr><td><code>pickImage()</code></td><td>Opens the native image file picker and inserts the chosen image.</td></tr>
                            <tr><td><code>insertImageFile(file)</code></td><td>Inserts a <code>File</code> as a data URL image.</td></tr>
                            <tr><td><code>setColor(color) / setBackground(color)</code></td><td>Sets the text or highlight color.</td></tr>
                            <tr><td><code>insertList(ordered)</code></td><td>Inserts a bullet or ordered list.</td></tr>
                            <tr><td><code>insertLink(url?) / insertImage(url?)</code></td><td>Inserts a link or an image (asks for the URL when omitted).</td></tr>
                            <tr><td><code>toggleCodeBlock()</code></td><td>Toggles the code block format.</td></tr>
                            <tr><td><code>clean()</code></td><td>Removes all formatting.</td></tr>
                            <tr><td><code>getHtml() / getText() / getSelection()</code></td><td>Reads the current content and selection.</td></tr>
                            <tr><td><code>focus()</code></td><td>Focuses the editor.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class EditorDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => EDITOR_DOC_I18N[this.lang.currentLang()] || EDITOR_DOC_I18N.es);

    text = '<div>Hello World!</div><div>Codezium <b>Editor</b> Rocks</div><div><br></div>';
    placeholderText: string | undefined;
    limitedText: string | undefined;
    customText = '<p>Customize the <i>toolbar</i> with your own controls.</p>';
    readonlyText = '<p>Always bet on <b>Codezium</b>!</p>';
    disabledText = '<p>This editor is disabled.</p>';
    invalidText: string | undefined;
    fontsText = '<p>Change the <b>font</b> and the <span style="font-size: 24px;">size</span> with the toolbar selects.</p>';
    imagesText: string | undefined;
    readonly imagesEditor = signal<{ insertImageFile: (file: File) => void } | null>(null);
    eventsText: string | undefined;
    templateText: string | undefined;

    readonly lastTextChange = signal<CzEditorTextChangeEvent | null>(null);
    readonly lastSelection = signal<{ range: { index: number; length: number } } | null>(null);

    readonly plainText = computed(() => this.text.replace(/<[^>]*>/g, ''));
    readonly textChangeLabel = computed(() => {
        const change = this.lastTextChange();
        return change ? `${change.source} (${change.textValue.trim().slice(0, 30)})` : '-';
    });
    readonly selectionLabel = computed(() => {
        const selection = this.lastSelection();
        return selection ? `${selection.range.index} / ${selection.range.length}` : '-';
    });

    readonly exampleForm = new FormGroup({
        content: new FormControl('', Validators.required),
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.notify(this.t().formSubmitted);
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid) {
            this.notify(this.t().formSubmitted);
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    notify(message: string): void {
        console.log(message);
    }

    importCode: Code = {
        typescript: `import { CzEditorComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-editor [(ngModel)]="text" style="height: 320px;" />`,
        typescript: `// The model holds the HTML string of the content`,
    };

    placeholderCode: Code = {
        html: `<!-- Placeholder shown while empty -->
<cz-editor [(ngModel)]="text" placeholder="Write something..." />

<!-- Restrict the available formats -->
<cz-editor [(ngModel)]="text" [formats]="['bold', 'italic', 'underline', 'list']" />`,
    };

    customToolbarCode: Code = {
        html: `<cz-editor [(ngModel)]="text">
    <ng-template #headerTemplate let-editor="editor">
        <cz-button label="Bold" (onClick)="editor.exec('bold')" />
        <cz-button label="Italic" (onClick)="editor.exec('italic')" />
        <cz-button label="Highlight" (onClick)="editor.setBackground('#FEF08A')" />
        <cz-button label="Link" (onClick)="editor.insertLink('https://angular.dev')" />
        <cz-button label="Clean" (onClick)="editor.clean()" />
    </ng-template>
</cz-editor>`,
        typescript: `// The template context exposes the full editor API (exec, formatBlock,
// setColor, insertList, insertLink, insertImage, toggleCodeBlock, clean, ...)`,
    };

    readonlyCode: Code = {
        html: `<cz-editor [(ngModel)]="text" [readonly]="true" />
<cz-editor [(ngModel)]="text" [disabled]="true" />`,
    };

    invalidCode: Code = {
        html: `<cz-editor [(ngModel)]="text" [invalid]="!text" placeholder="Content is required" />`,
    };

    fontsCode: Code = {
        html: `<!-- The default toolbar includes font family and font size selects -->
<cz-editor [(ngModel)]="text" />

<!-- Configure the available options -->
<cz-editor
    [(ngModel)]="text"
    [fontFamilies]="['Sora', 'Inter', 'Georgia', 'Arial']"
    [fontSizes]="[12, 14, 16, 18, 24, 32]"
/>`,
        typescript: `// Through the API (e.g. from a custom toolbar):
editor.setFont('Georgia');
editor.setFontSize(24);`,
    };

    imagesCode: Code = {
        html: `<cz-editor [(ngModel)]="text" />

<!-- Insert with the toolbar button: opens the native image picker -->
<!-- Paste images directly from the clipboard: Ctrl/Cmd + V -->`,
        typescript: `// Or programmatically:
editor.pickImage();                    // opens the file picker
editor.insertImageFile(file);          // File -> data URL
editor.insertImage('https://...');     // remote URL`,
    };

    eventsCode: Code = {
        html: `<cz-editor
    [(ngModel)]="text"
    (onTextChange)="lastTextChange.set($event)"
    (onSelectionChange)="lastSelection.set($event)"
    (onEditorChange)="onEditorChange($event)"
    (onFocus)="onFocus()"
    (onBlur)="onBlur()"
/>

<!-- onTextChange: { htmlValue, textValue, source: 'user' | 'api' } -->
<!-- onSelectionChange: { range: { index, length }, source } -->`,
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-editor formControlName="content" [invalid]="isInvalid('content')" />
    @if (isInvalid('content')) {
        <cz-message severity="danger" text="Content is required." />
    }
</form>

<!-- Template-driven forms -->
<cz-editor #content="ngModel" name="content" [(ngModel)]="text" required
    [invalid]="content.invalid && content.touched" />`,
    };
}
