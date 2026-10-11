import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    CzTreeSelectComponent,
    CzTreeSelectNode,
    CzMessageComponent,
    CzButtonComponent,
    CzToastService
} from 'codezium-ui';
import { LucideDynamicIcon, LucideFolder, LucideFile } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TREE_SELECT_DOC_I18N } from './tree-select-doc.i18n';

@Component({
    selector: 'cz-tree-select-doc-page',
    imports: [
        CommonModule, LucideDynamicIcon, CzTreeSelectComponent, CzMessageComponent, CzButtonComponent,
        AppCodeComponent, ReactiveFormsModule, FormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="treeselect">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().description }}</p>

            <!-- ── IMPORT ── -->
            <section>
                <h2 id="import">{{ t().import }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-tree-select [options]="files" [(ngModel)]="basicValue" [placeholder]="t().selectNode"
                        style="max-width: 20rem" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── MULTIPLE ── -->
            <section>
                <h2 id="multiple">{{ t().multiple }}</h2>
                <p>{{ t().multipleDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-tree-select [options]="files" [(ngModel)]="multipleValue" selectionMode="multiple"
                        [metaKeySelection]="true" [placeholder]="t().selectNodes" style="max-width: 20rem" />
                </div>
                <app-code [code]="multipleCode" />
            </section>

            <!-- ── CHECKBOX ── -->
            <section>
                <h2 id="checkbox">{{ t().checkbox }}</h2>
                <p>{{ t().checkboxDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-tree-select [options]="files" [(ngModel)]="checkboxValue" selectionMode="checkbox"
                        [placeholder]="t().selectNodes" style="max-width: 20rem" />
                </div>
                <app-code [code]="checkboxCode" />
            </section>

            <!-- ── CHIPS ── -->
            <section>
                <h2 id="chips">{{ t().chips }}</h2>
                <p>{{ t().chipsDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-tree-select [options]="files" [(ngModel)]="chipsValue" selectionMode="checkbox" display="chip"
                        [placeholder]="t().selectNodes" style="max-width: 24rem; width: 100%" />
                </div>
                <app-code [code]="chipsCode" />
            </section>

            <!-- ── FILTER ── -->
            <section>
                <h2 id="filter">{{ t().filter }}</h2>
                <p>{{ t().filterDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-tree-select [options]="files" [(ngModel)]="filterValue2" [filter]="true" filterBy="label"
                        [placeholder]="t().selectNode" style="max-width: 20rem" />
                </div>
                <app-code [code]="filterCode" />
            </section>

            <!-- ── STATES ── -->
            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p>{{ t().statesDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-lg cz-mb-md">
                    <cz-tree-select [options]="files" [ngModel]="files[0]" [disabled]="true" [placeholder]="t().disabled" />
                    <cz-tree-select [options]="files" [ngModel]="files[0]" variant="filled" [placeholder]="t().filled" />
                    <cz-tree-select [options]="files" [ngModel]="null" [invalid]="true" [placeholder]="t().invalid" />
                </div>
                <app-code [code]="statesCode" />
            </section>

            <!-- ── FLUID ── -->
            <section>
                <h2 id="fluid">{{ t().fluid }}</h2>
                <p>{{ t().fluidDesc }}</p>
                <cz-tree-select [options]="files" [(ngModel)]="fluidValue" [placeholder]="t().selectNode" [fluid]="true" class="cz-mb-md" />
                <app-code [code]="fluidCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p>{{ t().sizesDesc }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-gap-lg cz-mb-md">
                    <cz-tree-select [options]="files" [(ngModel)]="sizeValue1" size="sm" [placeholder]="t().small" style="max-width: 20rem; width: 100%" />
                    <cz-tree-select [options]="files" [(ngModel)]="sizeValue2" [placeholder]="t().normal" style="max-width: 20rem; width: 100%" />
                    <cz-tree-select [options]="files" [(ngModel)]="sizeValue3" size="lg" [placeholder]="t().large" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p>{{ t().templateDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-tree-select [options]="files" [(ngModel)]="templateValue" [placeholder]="t().selectNode" style="max-width: 20rem">
                        <ng-template #valueTemplate let-node>
                            @if (node) {
                                <span class="cz-flex cz-items-center cz-gap-sm">
                                    <svg [lucideIcon]="node.children ? FolderIcon : FileIcon" [size]="14"></svg>
                                    <span>{{ node.label }}</span>
                                </span>
                            }
                        </ng-template>
                        <ng-template #itemTemplate let-node>
                            <span class="cz-flex cz-items-center cz-gap-sm">
                                <svg [lucideIcon]="node.children ? FolderIcon : FileIcon" [size]="14"></svg>
                                <span>{{ node.label }}</span>
                            </span>
                        </ng-template>
                    </cz-tree-select>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p>{{ t().formsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="cz-flex cz-flex-col cz-gap-sm" style="width: 18rem">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-tree-select [options]="files" formControlName="node" [invalid]="isInvalid('node')"
                            [placeholder]="t().selectNode" [fluid]="true" />
                        @if (isInvalid('node')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)" class="cz-flex cz-flex-col cz-gap-sm" style="width: 18rem">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-tree-select #nodeModel="ngModel" name="node" [(ngModel)]="templateFormValue" [options]="files"
                            [placeholder]="t().selectNode" required [fluid]="true"
                            [invalid]="!!(nodeModel.invalid && (nodeModel.touched || tdForm.submitted))" />
                        @if (nodeModel.invalid && (nodeModel.touched || tdForm.submitted)) {
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
                <h3 id="screenreader">{{ t().screenReader }}</h3>
                <p>{{ t().screenReaderDesc }}</p>
                <h3 id="keyboardsupport">{{ t().keyboardSupport }}</h3>
                <p>{{ t().keyboardDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Key</th><th>Function</th></tr></thead>
                        <tbody>
                            <tr><td><code>tab</code></td><td>{{ t().keyTab }}</td></tr>
                            <tr><td><code>enter</code> <code>space</code></td><td>{{ t().keyEnter }}</td></tr>
                            <tr><td><code>down arrow</code> <code>up arrow</code></td><td>{{ t().keyArrows }}</td></tr>
                            <tr><td><code>right arrow</code></td><td>{{ t().keyRight }}</td></tr>
                            <tr><td><code>left arrow</code></td><td>{{ t().keyLeft }}</td></tr>
                            <tr><td><code>escape</code></td><td>{{ t().keyEscape }}</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().neoTheme }} / {{ t().glassTheme }}</h2>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Neo Theme</small>
                        <cz-tree-select [options]="files" [(ngModel)]="themeValue" selectionMode="checkbox" [placeholder]="t().selectNode" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg cz-bg-dark" data-theme="glass">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Glass Theme</small>
                        <cz-tree-select [options]="files" [(ngModel)]="themeValue" selectionMode="checkbox" [placeholder]="t().selectNode" />
                    </div>
                </div>
                <app-code [code]="themesCode" />
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">API</h2>
                <h3 id="props">{{ t().props }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>options</code></td><td><code>CzTreeSelectNode[]</code></td><td><code>[]</code></td><td>An array of hierarchical nodes to display as options.</td></tr>
                            <tr><td><code>selectionMode</code></td><td><code>'single' | 'multiple' | 'checkbox'</code></td><td><code>'single'</code></td><td>Defines the selection mode.</td></tr>
                            <tr><td><code>display</code></td><td><code>'combo' | 'chip'</code></td><td><code>'combo'</code></td><td>Defines how selected items are displayed in multiple/checkbox mode.</td></tr>
                            <tr><td><code>metaKeySelection</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Multiple mode: whether meta/ctrl key is required to toggle items.</td></tr>
                            <tr><td><code>optionLabel / optionValue / dataKey</code></td><td><code>string</code></td><td><code>'label' / 'value' / ''</code></td><td>Field names for label, value and identity.</td></tr>
                            <tr><td><code>filter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays an input field to filter the nodes.</td></tr>
                            <tr><td><code>filterBy / filterPlaceholder / filterMode</code></td><td><code>—</code></td><td><code>'' / 'Search...' / 'lenient'</code></td><td>Filtering configuration.</td></tr>
                            <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a clear icon to reset the value.</td></tr>
                            <tr><td><code>emptyMessage / emptyFilterMessage</code></td><td><code>string</code></td><td><code>'No results found'</code></td><td>Text to display when there is no data.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string</code></td><td><code>''</code></td><td>Height of the tree viewport.</td></tr>
                            <tr><td><code>invalid / disabled / readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Component states.</td></tr>
                            <tr><td><code>variant</code></td><td><code>'outlined' | 'filled'</code></td><td><code>'outlined'</code></td><td>Input variant.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size of the component.</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Spans 100% width of the container.</td></tr>
                            <tr><td><code>placeholder / name / inputId / tabindex / autofocus</code></td><td><code>—</code></td><td><code>—</code></td><td>Native and accessibility attributes.</td></tr>
                            <tr><td><code>ariaLabel / ariaLabelledBy</code></td><td><code>string</code></td><td><code>null</code></td><td>Accessibility labels.</td></tr>
                            <tr><td><code>label / labelPosition</code></td><td><code>string / CzLabelPosition</code></td><td><code>'' / 'none'</code></td><td>Optional inline label (Codezium extra).</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>CzOverlayZIndex</code></td><td><code>null</code></td><td>Overlay z-index (Codezium extra).</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="emits">{{ t().emits }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>onChange</code></td><td><code>CzTreeSelectChangeEvent</code></td><td>Callback to invoke when the value changes.</td></tr>
                            <tr><td><code>onNodeSelect / onNodeUnselect</code></td><td><code>CzTreeSelectNodeEvent</code></td><td>Callback to invoke when a node is selected or unselected.</td></tr>
                            <tr><td><code>onNodeExpand / onNodeCollapse</code></td><td><code>CzTreeSelectNodeEvent</code></td><td>Callback to invoke when a node is expanded or collapsed.</td></tr>
                            <tr><td><code>onFilter</code></td><td><code>&#123; originalEvent, filter &#125;</code></td><td>Callback to invoke when data is filtered.</td></tr>
                            <tr><td><code>onClear / onFocus / onBlur / onShow / onHide</code></td><td><code>Event</code></td><td>Component lifecycle events.</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="templates">{{ t().templates }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Context</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>#valueTemplate</code></td><td><code>let-node</code></td><td>Custom selected value content (node or node array).</td></tr>
                            <tr><td><code>#itemTemplate</code></td><td><code>let-node</code></td><td>Custom node content.</td></tr>
                            <tr><td><code>#headerTemplate / #footerTemplate</code></td><td>—</td><td>Custom header and footer.</td></tr>
                            <tr><td><code>#emptyTemplate / #emptyFilterTemplate</code></td><td>—</td><td>Custom empty states.</td></tr>
                            <tr><td><code>#dropdownIconTemplate / #clearIconTemplate / #filterIconTemplate</code></td><td>—</td><td>Custom icons.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class TreeSelectDocPage {
    private readonly langService = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => TREE_SELECT_DOC_I18N[this.langService.currentLang()] || TREE_SELECT_DOC_I18N.es);

    readonly FolderIcon = LucideFolder;
    readonly FileIcon = LucideFile;

    readonly files: CzTreeSelectNode[] = [
        {
            label: 'Documents',
            value: 'docs',
            children: [
                {
                    label: 'Work',
                    value: 'work',
                    children: [
                        { label: 'Invoices', value: 'invoices', leaf: true },
                        { label: 'Estimates', value: 'estimates', leaf: true },
                    ],
                },
                {
                    label: 'Personal',
                    value: 'personal',
                    children: [
                        { label: 'Expenses', value: 'expenses', leaf: true },
                        { label: 'Vacation', value: 'vacation', leaf: true },
                    ],
                },
            ],
        },
        {
            label: 'Events',
            value: 'events',
            children: [
                { label: 'Meeting', value: 'meeting', leaf: true },
                { label: 'Product Launch', value: 'launch', leaf: true },
            ],
        },
        { label: 'Movies', value: 'movies', children: [{ label: 'Action', value: 'action', leaf: true }] },
        { label: 'Photos', value: 'photos', leaf: true },
    ];

    basicValue: string | undefined;
    multipleValue: string[] = [];
    checkboxValue: string[] = [];
    chipsValue: string[] = ['invoices', 'vacation'];
    filterValue2: string | undefined;
    fluidValue: string | undefined;
    sizeValue1: string | undefined;
    sizeValue2: string | undefined;
    sizeValue3: string | undefined;
    templateValue: string | undefined;
    templateFormValue: string | undefined;
    themeValue: string[] = [];

    readonly exampleForm = new FormGroup({
        node: new FormControl<string | null>(null, Validators.required),
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.toast.success(this.t().formSubmitted, 'TreeSelect');
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid && this.templateFormValue) {
            this.toast.success(this.t().formSubmitted, 'TreeSelect');
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    importCode: Code = {
        typescript: `import { CzTreeSelectComponent, CzTreeSelectNode } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="value" placeholder="Select a node" />`,
        typescript: `files: CzTreeSelectNode[] = [
    {
        label: 'Documents', value: 'docs',
        children: [
            { label: 'Work', value: 'work', children: [
                { label: 'Invoices', value: 'invoices', leaf: true }
            ]}
        ]
    },
    { label: 'Photos', value: 'photos', leaf: true }
];
value: string | undefined;`
    };

    multipleCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="values" selectionMode="multiple"
    [metaKeySelection]="true" placeholder="Select nodes" />`,
        typescript: `values: string[] = []; // meta/ctrl key toggles items`
    };

    checkboxCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="values" selectionMode="checkbox"
    placeholder="Select nodes" />`,
        typescript: `// Selecting a parent toggles its whole subtree; parents show checked/partial state`
    };

    chipsCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="values" selectionMode="checkbox"
    display="chip" placeholder="Select nodes" />`
    };

    filterCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="value" [filter]="true" filterBy="label"
    placeholder="Select a node" />`
    };

    statesCode: Code = {
        html: `<!-- Disabled -->
<cz-tree-select [options]="files" [ngModel]="value" [disabled]="true" />
<!-- Filled variant -->
<cz-tree-select [options]="files" [ngModel]="value" variant="filled" />
<!-- Invalid -->
<cz-tree-select [options]="files" [ngModel]="null" [invalid]="true" />`
    };

    fluidCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="value" placeholder="Select a node" [fluid]="true" />`
    };

    sizesCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="value1" size="sm" placeholder="Small" />
<cz-tree-select [options]="files" [(ngModel)]="value2" placeholder="Normal" />
<cz-tree-select [options]="files" [(ngModel)]="value3" size="lg" placeholder="Large" />`
    };

    templateCode: Code = {
        html: `<cz-tree-select [options]="files" [(ngModel)]="value" placeholder="Select a node">
    <ng-template #valueTemplate let-node>
        @if (node) {
            <span class="flex items-center gap-2">
                <svg [lucideIcon]="node.children ? FolderIcon : FileIcon" [size]="14"></svg>
                <span>{{ node.label }}</span>
            </span>
        }
    </ng-template>
    <ng-template #itemTemplate let-node>
        <span class="flex items-center gap-2">
            <svg [lucideIcon]="node.children ? FolderIcon : FileIcon" [size]="14"></svg>
            <span>{{ node.label }}</span>
        </span>
    </ng-template>
</cz-tree-select>`,
        typescript: `import { LucideFolder, LucideFile } from '@lucide/angular';

FolderIcon = LucideFolder;
FileIcon = LucideFile;`
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-tree-select [options]="files" formControlName="node" [invalid]="isInvalid('node')"
        placeholder="Select a node" [fluid]="true" />
    @if (isInvalid('node')) {
        <cz-message severity="danger" text="A node is required." />
    }
    <cz-button label="Submit" type="submit" />
</form>

<!-- Template-driven forms -->
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
    <cz-tree-select #node="ngModel" name="node" [(ngModel)]="value" [options]="files"
        required [fluid]="true"
        [invalid]="!!(node.invalid && (node.touched || form.submitted))" />
</form>`
    };

    themesCode: Code = {
        html: `<div data-theme="neo">
    <cz-tree-select [options]="files" [(ngModel)]="value" selectionMode="checkbox" />
</div>

<div data-theme="glass">
    <cz-tree-select [options]="files" [(ngModel)]="value" selectionMode="checkbox" />
</div>`
    };
}
