import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzAvatarComponent, CzPickListComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { PICK_LIST_DOC_I18N } from './pick-list-doc.i18n';

interface Member {
    name: string;
    role: string;
}

interface Product {
    name: string;
    category: string;
    price: number;
    image: string;
}

@Component({
    selector: 'cz-pick-list-doc-page',
    imports: [CzPickListComponent, CzAvatarComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="pick-list">{{ t().title }}</h1>
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
                    <cz-pick-list [source]="members" optionLabel="name" sourceHeader="Available members"
                        targetHeader="Team members" [ngModel]="team()" (ngModelChange)="team.set($event)" />
                    <span class="cz-text-sm">Team: {{ teamNames() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── FILTER ── -->
            <section>
                <h2 id="filter">{{ t().filter }}</h2>
                <p [innerHTML]="t().filterDesc"></p>
                <div class="cz-mb-md">
                    <cz-pick-list [source]="members" optionLabel="name" sourceHeader="Available members"
                        targetHeader="Team members" filterBy="name,role" sourceFilterPlaceholder="Search members…"
                        targetFilterPlaceholder="Search team…" scrollHeight="14rem" [stripedRows]="true"
                        [ngModel]="team()" (ngModelChange)="team.set($event)" />
                </div>
                <app-code [code]="filterCode" />
            </section>

            <!-- ── REORDER CONTROLS ── -->
            <section>
                <h2 id="controls">{{ t().controls }}</h2>
                <p [innerHTML]="t().controlsDesc"></p>
                <div class="cz-mb-md">
                    <cz-pick-list [source]="members" optionLabel="name" sourceHeader="Available members"
                        targetHeader="Priority team" [showSourceControls]="true" [showTargetControls]="true"
                        [ngModel]="priority()" (ngModelChange)="priority.set($event)"
                        (onTargetReorder)="lastReorder.set('target reordered')" />
                    <span class="cz-text-sm">{{ lastReorder() }}</span>
                </div>
                <app-code [code]="controlsCode" />
            </section>

            <!-- ── DRAG & DROP ── -->
            <section>
                <h2 id="dragdrop">{{ t().dragdrop }}</h2>
                <p [innerHTML]="t().dragdropDesc"></p>
                <div class="cz-mb-md">
                    <cz-pick-list [source]="members" optionLabel="name" sourceHeader="Available members"
                        targetHeader="Team members" [dragdrop]="true" [ngModel]="team()"
                        (ngModelChange)="team.set($event)" />
                </div>
                <app-code [code]="dragdropCode" />
            </section>

            <!-- ── ITEM TEMPLATE (avatar / image) ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p [innerHTML]="t().templateDesc"></p>
                <div class="cz-mb-md">
                    <cz-pick-list [source]="catalog()" [itemTemplate]="productTpl" [dragdrop]="true"
                        sourceHeader="Catalog" targetHeader="Featured products" filterBy="name,category"
                        scrollHeight="15rem" [ngModel]="featured()" (ngModelChange)="featured.set($event)">
                        <ng-template #productTpl let-product let-selected="selected">
                            <span class="cz-flex cz-items-center cz-gap-sm cz-w-full">
                                <cz-avatar [image]="product.image" shape="circle" size="sm" [ariaLabel]="product.name" />
                                <span class="cz-flex cz-flex-col cz-grow" style="min-width: 0;">
                                    <strong class="cz-truncate">{{ product.name }}</strong>
                                    <span class="cz-text-xs" [class]="selected ? '' : 'cz-text-muted'">
                                        {{ product.category }}
                                    </span>
                                </span>
                                <span class="cz-font-semibold">\${{ product.price }}</span>
                            </span>
                        </ng-template>
                    </cz-pick-list>
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
                            <tr><td><code>source</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>Available items.</td></tr>
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Property used to display items.</td></tr>
                            <tr><td><code>sourceHeader</code> / <code>targetHeader</code></td><td><code>string</code></td><td><code>''</code></td><td>Captions of both lists.</td></tr>
                            <tr><td><code>filterBy</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Comma separated fields used by the filter inputs.</td></tr>
                            <tr><td><code>sourceFilterPlaceholder</code> / <code>targetFilterPlaceholder</code></td><td><code>string</code></td><td><code>'Search…'</code></td><td>Placeholders of the filter inputs.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Height of each list viewport. Null = theme default.</td></tr>
                            <tr><td><code>stripedRows</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Alternating row colors.</td></tr>
                            <tr><td><code>dragdrop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables drag &amp; drop reordering and transfers.</td></tr>
                            <tr><td><code>showSourceControls</code> / <code>showTargetControls</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the reorder controls (top/up/down/bottom) on each list.</td></tr>
                            <tr><td><code>itemTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom item content (<code>$implicit</code> item, <code>index</code>, <code>selected</code>).</td></tr>
                            <tr><td><code>emptySourceTemplate</code> / <code>emptyTargetTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom empty states.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Pick list'</code></td><td>Accessible label of the component.</td></tr>
                            <tr><td><code>onMoveToTarget</code> / <code>onMoveToSource</code></td><td><code>output&lt;any[]&gt;</code></td><td><code>—</code></td><td>Emitted with the transferred items.</td></tr>
                            <tr><td><code>onSourceReorder</code> / <code>onTargetReorder</code></td><td><code>output&lt;any[]&gt;</code></td><td><code>—</code></td><td>Emitted after reordering inside a list.</td></tr>
                            <tr><td><code>ngModel</code></td><td><code>ControlValueAccessor</code></td><td><code>[]</code></td><td>Two-way bindable target list.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class PickListDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => PICK_LIST_DOC_I18N[this.lang.currentLang()] || PICK_LIST_DOC_I18N.es);

    readonly members: Member[] = [
        { name: 'Amy Elsner', role: 'Designer' },
        { name: 'Asiya Javayant', role: 'Engineer' },
        { name: 'Onyama Limba', role: 'Product Manager' },
        { name: 'Anna Fali', role: 'Engineer' },
        { name: 'Bernardo Dominic', role: 'Designer' },
        { name: 'Elwin Sharvill', role: 'Engineer' },
        { name: 'Ioni Bowcher', role: 'QA' },
        { name: 'Stephen Shaw', role: 'Engineer' },
    ];

    readonly team = signal<Member[]>([this.members[0]]);
    readonly priority = signal<Member[]>([this.members[1], this.members[2]]);
    readonly lastReorder = signal('');

    readonly catalog = signal<Product[]>([
        { name: 'UltraBook Pro', category: 'Laptops', price: 1499, image: '/images/dataview/product-1.svg' },
        { name: 'Nova Phone X', category: 'Phones', price: 999, image: '/images/dataview/product-2.svg' },
        { name: 'Pulse Watch S2', category: 'Wearables', price: 349, image: '/images/dataview/product-3.svg' },
        { name: 'Echo Headphones', category: 'Audio', price: 249, image: '/images/dataview/product-4.svg' },
        { name: 'VisionCam 4K', category: 'Cameras', price: 549, image: '/images/dataview/product-5.svg' },
        { name: 'BoomBox Mini', category: 'Audio', price: 129, image: '/images/dataview/product-6.svg' },
    ]);
    readonly featured = signal<Product[]>([
        { name: 'UltraBook Pro', category: 'Laptops', price: 1499, image: '/images/dataview/product-1.svg' },
    ]);

    readonly teamNames = computed(() => this.team().map(m => m.name).join(', ') || '-');

    importCode: Code = {
        typescript: `import { CzPickListComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-pick-list
    [source]="members"
    optionLabel="name"
    sourceHeader="Available members"
    targetHeader="Team members"
    [ngModel]="team()"
    (ngModelChange)="team.set($event)"
/>`,
        typescript: `members = [
    { name: 'Amy Elsner', role: 'Designer' },
    { name: 'Asiya Javayant', role: 'Engineer' },
];
team = signal([this.members[0]]);`,
    };

    filterCode: Code = {
        html: `<cz-pick-list
    [source]="members"
    optionLabel="name"
    filterBy="name,role"
    sourceFilterPlaceholder="Search members…"
    targetFilterPlaceholder="Search team…"
    scrollHeight="14rem"
    [stripedRows]="true"
    [ngModel]="team()"
/>`,
    };

    controlsCode: Code = {
        html: `<cz-pick-list
    [source]="members"
    optionLabel="name"
    [showSourceControls]="true"
    [showTargetControls]="true"
    [ngModel]="team()"
    (onTargetReorder)="onReorder($event)"
/>`,
    };

    dragdropCode: Code = {
        html: `<cz-pick-list
    [source]="members"
    optionLabel="name"
    [dragdrop]="true"
    [ngModel]="team()"
/>`,
    };

    templateCode: Code = {
        html: `<!-- Compose each row with any library component (e.g. cz-avatar) -->
<cz-pick-list
    [source]="catalog()"
    [itemTemplate]="productTpl"
    [dragdrop]="true"
    sourceHeader="Catalog"
    targetHeader="Featured products"
    [ngModel]="featured()"
    (ngModelChange)="featured.set($event)"
>
    <ng-template #productTpl let-product let-selected="selected">
        <span class="product-row">
            <cz-avatar [image]="product.image" shape="circle" size="sm" />
            <span>
                <strong>{{ product.name }}</strong>
                <small [class.muted]="!selected">{{ product.category }}</small>
            </span>
            <span>\${{ product.price }}</span>
        </span>
    </ng-template>
</cz-pick-list>`,
    };
}
