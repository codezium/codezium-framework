import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzAvatarComponent, CzOrderListComponent, CzTagComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ORDER_LIST_DOC_I18N } from './order-list-doc.i18n';

interface Task {
    name: string;
    owner: string;
    status: 'todo' | 'doing' | 'done';
    image: string;
}

@Component({
    selector: 'cz-order-list-doc-page',
    imports: [CzOrderListComponent, CzTagComponent, CzAvatarComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="order-list">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md" style="max-width: 26rem;">
                    <cz-order-list [ngModel]="items()" (ngModelChange)="items.set($event)" optionLabel="name"
                        (onSelectionChange)="selected.set($event)" />
                    <span class="cz-text-sm">Order: {{ names() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── FILTER ── -->
            <section>
                <h2 id="filter">{{ t().filter }}</h2>
                <p [innerHTML]="t().filterDesc"></p>
                <div class="cz-mb-md" style="max-width: 26rem;">
                    <cz-order-list [ngModel]="items()" (ngModelChange)="items.set($event)" optionLabel="name"
                        filterBy="name" filterPlaceholder="Filter tasks…" />
                </div>
                <app-code [code]="filterCode" />
            </section>

            <!-- ── DRAG & DROP ── -->
            <section>
                <h2 id="dragdrop">{{ t().dragdrop }}</h2>
                <p [innerHTML]="t().dragdropDesc"></p>
                <div class="cz-mb-md" style="max-width: 26rem;">
                    <cz-order-list [ngModel]="items()" (ngModelChange)="items.set($event)" optionLabel="name"
                        [dragdrop]="true" [stripedRows]="true" scrollHeight="14rem" />
                </div>
                <app-code [code]="dragdropCode" />
            </section>

            <!-- ── CONTROLS POSITION ── -->
            <section>
                <h2 id="controls">{{ t().controls }}</h2>
                <p [innerHTML]="t().controlsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    <div style="min-width: 18rem;">
                        <cz-order-list [ngModel]="items()" optionLabel="name" controlsPosition="right" />
                    </div>
                    <div style="min-width: 18rem;">
                        <cz-order-list [ngModel]="items()" optionLabel="name" controlsPosition="left" />
                    </div>
                </div>
                <app-code [code]="controlsCode" />
            </section>

            <!-- ── ITEM TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p [innerHTML]="t().templateDesc"></p>
                <div class="cz-mb-md" style="max-width: 30rem;">
                    <cz-order-list [ngModel]="tasks()" (ngModelChange)="tasks.set($event)" [itemTemplate]="taskTpl"
                        filterBy="name" filterPlaceholder="Filter tasks…" [dragdrop]="true" />

                    <ng-template #taskTpl let-task let-selected="selected">
                        <span class="cz-flex cz-items-center cz-gap-sm cz-w-full">
                            <cz-avatar [image]="task.image" shape="circle" size="sm" [ariaLabel]="task.name" />
                            <span class="cz-flex cz-flex-col cz-grow" style="min-width: 0;">
                                <strong class="cz-truncate">{{ task.name }}</strong>
                                <span class="cz-text-xs" [class]="selected ? '' : 'cz-text-muted'">{{ task.owner }}</span>
                            </span>
                            <cz-tag [value]="task.status" [severity]="statusSeverity(task.status)" size="sm" />
                        </span>
                    </ng-template>
                </div>
                <app-code [code]="templateCode" />
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
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used to display items.</td></tr>
                            <tr><td><code>filterBy</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Enables the filter input and decides which field to search against.</td></tr>
                            <tr><td><code>filterPlaceholder</code></td><td><code>string</code></td><td><code>'Filter'</code></td><td>Placeholder of the filter input.</td></tr>
                            <tr><td><code>dragdrop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables drag &amp; drop reordering.</td></tr>
                            <tr><td><code>controlsPosition</code></td><td><code>'left' | 'right'</code></td><td><code>'right'</code></td><td>Location of the move controls relative to the list.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Height of the list viewport (scrolls beyond it). Null = theme default.</td></tr>
                            <tr><td><code>stripedRows</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Alternating row colors.</td></tr>
                            <tr><td><code>itemTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom item content (<code>$implicit</code> item, <code>index</code>, <code>selected</code>).</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Order list'</code></td><td>Accessible label of the listbox.</td></tr>
                            <tr><td><code>onReorder</code></td><td><code>output&lt;any[]&gt;</code></td><td><code>—</code></td><td>Emitted after every reorder with the new order.</td></tr>
                            <tr><td><code>onSelectionChange</code></td><td><code>output&lt;number&gt;</code></td><td><code>—</code></td><td>Emitted when the selected item changes.</td></tr>
                            <tr><td><code>ngModel</code></td><td><code>ControlValueAccessor</code></td><td><code>[]</code></td><td>Two-way bindable collection.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class OrderListDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => ORDER_LIST_DOC_I18N[this.lang.currentLang()] || ORDER_LIST_DOC_I18N.es);

    readonly selected = signal(-1);

    readonly items = signal([
        { name: 'Design' },
        { name: 'Development' },
        { name: 'Testing' },
        { name: 'Deployment' },
    ]);

    readonly tasks = signal<Task[]>([
        { name: 'Landing page', owner: 'Anna Fali', status: 'doing', image: '/images/dataview/product-1.svg' },
        { name: 'Design system audit', owner: 'Asiya Javayant', status: 'todo', image: '/images/dataview/product-2.svg' },
        { name: 'API integration', owner: 'Onyama Limba', status: 'doing', image: '/images/dataview/product-3.svg' },
        { name: 'QA automation', owner: 'Stephen Shaw', status: 'todo', image: '/images/dataview/product-4.svg' },
        { name: 'Release notes', owner: 'Bernardo Dominic', status: 'done', image: '/images/dataview/product-5.svg' },
    ]);

    readonly names = computed(() => this.items().map(i => i.name).join(' → '));

    statusSeverity(status: Task['status']): 'info' | 'warning' | 'success' {
        switch (status) {
            case 'doing': return 'warning';
            case 'done': return 'success';
            default: return 'info';
        }
    }

    importCode: Code = {
        typescript: `import { CzOrderListComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-order-list [ngModel]="items()" (ngModelChange)="items.set($event)" optionLabel="name" />`,
        typescript: `items = signal([
    { name: 'Design' },
    { name: 'Development' },
]);`,
    };

    filterCode: Code = {
        html: `<cz-order-list
    [ngModel]="items()"
    optionLabel="name"
    filterBy="name"
    filterPlaceholder="Filter tasks…"
/>`,
    };

    dragdropCode: Code = {
        html: `<cz-order-list
    [ngModel]="items()"
    optionLabel="name"
    [dragdrop]="true"
    [stripedRows]="true"
    scrollHeight="14rem"
/>`,
    };

    controlsCode: Code = {
        html: `<cz-order-list [ngModel]="items()" optionLabel="name" controlsPosition="right" />
<cz-order-list [ngModel]="items()" optionLabel="name" controlsPosition="left" />`,
    };

    templateCode: Code = {
        html: `<!-- Compose the row with any library component -->
<cz-order-list [ngModel]="tasks()" [itemTemplate]="taskTpl" [dragdrop]="true" />

<ng-template #taskTpl let-task let-selected="selected">
    <span class="task-row">
        <cz-avatar [image]="task.image" shape="circle" size="sm" />
        <span>
            <strong>{{ task.name }}</strong>
            <small [class.muted]="!selected">{{ task.owner }}</small>
        </span>
        <cz-tag [value]="task.status" [severity]="severity(task.status)" />
    </span>
</ng-template>`,
    };
}
