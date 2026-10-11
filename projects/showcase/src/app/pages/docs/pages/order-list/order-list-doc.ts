import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzOrderListComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ORDER_LIST_DOC_I18N } from './order-list-doc.i18n';

@Component({
    selector: 'cz-order-list-doc-page',
    imports: [CzOrderListComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="order-list">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md" style="max-width: 24rem;">
                    <cz-order-list [ngModel]="items()" (ngModelChange)="items.set($event)" optionLabel="name" />
                    <span class="cz-text-sm">Order: {{ names() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" style="max-width: 24rem;">
                    <cz-order-list [ngModel]="items()" (ngModelChange)="items.set($event)" optionLabel="name" (onReorder)="reorders.set(reorders() + 1)" />
                    <span class="cz-text-sm">Reorders: {{ reorders() }}</span>
                    <cz-order-list [ngModel]="items()" optionLabel="name" [disabled]="true" />
                </div>
                <app-code [code]="optionsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used to display items.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>onReorder</code></td><td><code>output&lt;any[]&gt;</code></td><td>-</td><td>Emitted after every reorder.</td></tr>
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

    readonly items = signal([
        { name: 'Design' },
        { name: 'Development' },
        { name: 'Testing' },
        { name: 'Deployment' },
    ]);

    readonly reorders = signal(0);

    readonly names = computed(() => this.items().map((i) => i.name).join(' → '));

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

    optionsCode: Code = {
        html: `<cz-order-list [ngModel]="items()" optionLabel="name" (onReorder)="onReorder($event)" />

<cz-order-list [ngModel]="items()" optionLabel="name" [disabled]="true" />`,
    };
}
