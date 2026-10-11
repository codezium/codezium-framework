import { ChangeDetectionStrategy, Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    CzAvatarComponent,
    CzButtonComponent,
    CzSelectButtonComponent,
    CzSkeletonComponent,
    CzVirtualScrollerComponent,
} from 'codezium-ui';
import { LucideRefreshCw } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { VIRTUAL_SCROLLER_DOC_I18N } from './virtual-scroller-doc.i18n';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

@Component({
    selector: 'cz-virtual-scroller-doc-page',
    imports: [
        FormsModule,
        CzVirtualScrollerComponent,
        CzAvatarComponent,
        CzButtonComponent,
        CzSelectButtonComponent,
        CzSkeletonComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="virtual-scroller">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md" style="max-width: 32rem;">
                    <cz-virtual-scroller [items]="products" [itemSize]="48" scrollHeight="250px"
                        [itemTemplate]="basicItemTpl() ?? null" />
                </div>
                <app-code [code]="basicCode" />

                <ng-template #basicItem let-item>
                    <span class="cz-flex cz-items-center cz-gap-sm cz-w-full">
                        <cz-avatar [image]="item.image" shape="circle" size="sm" [ariaLabel]="item.name" />
                        <span class="cz-flex-1">{{ item.name }}</span>
                        <span class="cz-text-sm cz-font-semibold">\${{ item.price }}</span>
                    </span>
                </ng-template>
            </section>

            <!-- ── HORIZONTAL ── -->
            <section>
                <h2 id="horizontal">{{ t().horizontal }}</h2>
                <p [innerHTML]="t().horizontalDesc"></p>
                <div class="cz-mb-md">
                    <cz-virtual-scroller [items]="products" orientation="horizontal" [itemSize]="170"
                        scrollWidth="100%" scrollHeight="140px" [itemTemplate]="horizontalItemTpl() ?? null" />
                </div>
                <app-code [code]="horizontalCode" />

                <ng-template #horizontalItem let-item>
                    <span class="cz-flex cz-flex-col cz-items-center cz-gap-xs cz-w-full">
                        <cz-avatar [image]="item.image" shape="circle" size="md" [ariaLabel]="item.name" />
                        <span class="cz-text-sm">{{ item.name }}</span>
                    </span>
                </ng-template>
            </section>

            <!-- ── GRID ── -->
            <section>
                <h2 id="grid">{{ t().grid }}</h2>
                <p [innerHTML]="t().gridDesc"></p>
                <div class="cz-mb-md">
                    <cz-virtual-scroller [items]="gridItems" orientation="both" [itemSize]="[80, 180]"
                        scrollHeight="260px" [itemTemplate]="gridItemTpl() ?? null" />
                </div>
                <app-code [code]="gridCode" />

                <ng-template #gridItem let-item>
                    <span class="cz-flex cz-items-center cz-gap-sm cz-w-full">
                        <cz-avatar [image]="item.image" shape="circle" size="sm" [ariaLabel]="item.name" />
                        <span class="cz-flex-1">{{ item.name }}</span>
                    </span>
                </ng-template>
            </section>

            <!-- ── DELAY ── -->
            <section>
                <h2 id="delay">{{ t().delay }}</h2>
                <p [innerHTML]="t().delayDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-select-button [options]="delayOptions" optionLabel="label" optionValue="value"
                        [ngModel]="delay()" (ngModelChange)="delay.set($event)" ariaLabel="Delay" />
                </div>
                <div class="cz-mb-md" style="max-width: 32rem;">
                    <cz-virtual-scroller [items]="chipItems" [itemSize]="32" scrollHeight="200px"
                        [delay]="delay()" [itemTemplate]="plainItemTpl() ?? null" />
                </div>
                <app-code [code]="delayCode" />

                <ng-template #plainItem let-item>
                    <span>{{ item }}</span>
                </ng-template>
            </section>

            <!-- ── LOADING ── -->
            <section>
                <h2 id="loading">{{ t().loading }}</h2>
                <p [innerHTML]="t().loadingDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-button [label]="t().refresh" size="sm" [icon]="RefreshIcon" [loading]="loading()"
                        (onClick)="refresh()" />
                </div>
                <div class="cz-mb-md" style="max-width: 32rem;">
                    <cz-virtual-scroller [items]="products" [itemSize]="48" scrollHeight="250px"
                        [showLoader]="loading()" [loaderTemplate]="loaderTpl() ?? null"
                        [itemTemplate]="basicItemTpl() ?? null" />
                </div>
                <app-code [code]="loadingCode" />

                <ng-template #loaderRows let-placeholders>
                    <div class="cz-w-full cz-p-md cz-flex cz-flex-col cz-gap-sm">
                        @for (row of placeholders; track $index) {
                            <cz-skeleton height="1.5rem" borderRadius="6px" />
                        }
                    </div>
                </ng-template>
            </section>

            <!-- ── LAZY ── -->
            <section>
                <h2 id="lazy">{{ t().lazy }}</h2>
                <p [innerHTML]="t().lazyDesc"></p>
                <div class="cz-mb-md" style="max-width: 32rem;">
                    <cz-virtual-scroller [items]="lazyItems()" [itemSize]="40" scrollHeight="250px" [lazy]="true"
                        [loading]="lazyLoading()" (onLazyLoad)="loadLazyChunk($event)"
                        [itemTemplate]="lazyItemTpl() ?? null" />
                </div>
                <app-code [code]="lazyCode" />

                <ng-template #lazyItem let-item let-loading="loading">
                    @if (loading) {
                        <span class="cz-flex cz-items-center cz-gap-sm cz-w-full">
                            <cz-skeleton shape="circle" width="1rem" height="1rem" />
                            <cz-skeleton width="12rem" borderRadius="4px" />
                        </span>
                    } @else {
                        <span>{{ item }}</span>
                    }
                </ng-template>
            </section>

            <!-- ── PROGRAMMATIC ── -->
            <section>
                <h2 id="programmatic">{{ t().programmatic }}</h2>
                <p [innerHTML]="t().programmaticDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-button [label]="t().goTo500" size="sm" (onClick)="goTo(500)" />
                    <cz-button [label]="t().goTo2500" size="sm" (onClick)="goTo(2500)" />
                    <cz-button [label]="t().reset" size="sm" variant="outlined" (onClick)="goTo(0)" />
                </div>
                <div class="cz-mb-md" style="max-width: 32rem;">
                    <cz-virtual-scroller #scroller [items]="chipItems" [itemSize]="32" scrollHeight="200px"
                        [itemTemplate]="plainItemTpl() ?? null" />
                </div>
                <app-code [code]="programmaticCode" />
            </section>

            <!-- ── TEMPLATES ── -->
            <section>
                <h2 id="templates">{{ t().templates }}</h2>
                <p [innerHTML]="t().templatesDesc"></p>
                <div class="cz-mb-md" style="max-width: 32rem;">
                    <cz-virtual-scroller [items]="chipItems" [itemSize]="32" scrollHeight="200px"
                        [contentTemplate]="chipContentTpl() ?? null" />
                </div>
                <app-code [code]="templatesCode" />

                <ng-template #chipContent let-entries>
                    @for (entry of entries; track entry.index) {
                        <li class="cz-virtual-scroller-item" style="height: 2rem;">
                            <span class="cz-p-xs cz-rounded-sm" style="background: var(--cz-theme-surface-hover);">
                                {{ entry.value }}
                            </span>
                        </li>
                    }
                </ng-template>
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
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
                            <tr><td><code>items</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>An array of objects to display.</td></tr>
                            <tr><td><code>itemSize</code></td><td><code>number | number[]</code></td><td><code>40</code></td><td>The height/width of an item according to the orientation (array <code>[height, width]</code> for grid).</td></tr>
                            <tr><td><code>scrollHeight / scrollWidth</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Height / width of the scroll viewport.</td></tr>
                            <tr><td><code>orientation</code></td><td><code>'vertical' | 'horizontal' | 'both'</code></td><td><code>'vertical'</code></td><td>The orientation of the scrollbar.</td></tr>
                            <tr><td><code>delay</code></td><td><code>number</code></td><td><code>0</code></td><td>Delay in ms before new data is rendered while scrolling.</td></tr>
                            <tr><td><code>lazy</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Defines if data is loaded and interacted with in lazy manner.</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the mask in lazy mode while a chunk is loading.</td></tr>
                            <tr><td><code>showLoader</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows the loader overlay.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Eliminates the scroller feature and displays the content directly.</td></tr>
                            <tr><td><code>inline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Specifies whether the scroller should be displayed inline.</td></tr>
                            <tr><td><code>columns</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Fixed number of columns for the grid orientation (auto by default).</td></tr>
                            <tr><td><code>numToleratedItems</code></td><td><code>number | null</code></td><td><code>null</code></td><td>How many additional items to render outside of the viewport.</td></tr>
                            <tr><td><code>trackBy</code></td><td><code>Function | null</code></td><td><code>null</code></td><td>Function to optimize the item list rendering.</td></tr>
                            <tr><td><code>tabindex / styleClass</code></td><td><code>number | string</code></td><td><code>null / ''</code></td><td>Tabbing order and host style class.</td></tr>
                            <tr><td><code>itemTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Item template (<code>$implicit</code> item, <code>index</code>, <code>count</code>, <code>first</code>, <code>last</code>, <code>even</code>, <code>odd</code>, <code>loading</code>).</td></tr>
                            <tr><td><code>contentTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Replaces the default item list (<code>$implicit</code> visible items, <code>first</code>, <code>last</code>, <code>count</code>).</td></tr>
                            <tr><td><code>loaderTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Overlay content (<code>$implicit</code> placeholders, <code>count</code>), e.g. skeletons.</td></tr>
                            <tr><td><code>loaderIconTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom loading icon.</td></tr>
                            <tr><td><code>onLazyLoad</code></td><td><code>output&lt;&#123; first, last &#125;&gt;</code></td><td><code>—</code></td><td>Emitted in lazy mode when scrolling requires a new chunk of data.</td></tr>
                            <tr><td><code>onScroll</code></td><td><code>output&lt;&#123; originalEvent, scrollTop, scrollLeft &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when the scroll position changes.</td></tr>
                            <tr><td><code>onScrollIndexChange</code></td><td><code>output&lt;&#123; first, last &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when the rendered range changes.</td></tr>
                            <tr><td><code>scrollToIndex(index)</code></td><td><code>method</code></td><td><code>—</code></td><td>Scrolls to a specific item index.</td></tr>
                            <tr><td><code>scrollTo(options)</code></td><td><code>method</code></td><td><code>—</code></td><td>Scrolls to an absolute position.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class VirtualScrollerDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => VIRTUAL_SCROLLER_DOC_I18N[this.lang.currentLang()] || VIRTUAL_SCROLLER_DOC_I18N.es);

    readonly RefreshIcon = LucideRefreshCw;

    readonly delay = signal(0);
    readonly loading = signal(false);
    readonly lazyLoading = signal(false);
    readonly lazyItems = signal<any[]>(Array.from({ length: 10000 }));

    readonly delayOptions = [
        { label: 'No delay', value: 0 },
        { label: '150ms', value: 150 },
        { label: '500ms', value: 500 },
    ];

    readonly products: Product[] = [
        { id: 1, name: 'UltraBook Pro', price: 1499, image: '/images/dataview/product-1.svg' },
        { id: 2, name: 'Nova Phone X', price: 999, image: '/images/dataview/product-2.svg' },
        { id: 3, name: 'Pulse Watch S2', price: 349, image: '/images/dataview/product-3.svg' },
        { id: 4, name: 'Echo Headphones', price: 249, image: '/images/dataview/product-4.svg' },
        { id: 5, name: 'VisionCam 4K', price: 549, image: '/images/dataview/product-5.svg' },
        { id: 6, name: 'BoomBox Mini', price: 129, image: '/images/dataview/product-6.svg' },
        { id: 7, name: 'UltraBook Air', price: 1199, image: '/images/dataview/product-1.svg' },
        { id: 8, name: 'Nova Phone SE', price: 649, image: '/images/dataview/product-2.svg' },
        { id: 9, name: 'Pulse Watch Lite', price: 199, image: '/images/dataview/product-3.svg' },
        { id: 10, name: 'Echo Buds', price: 99, image: '/images/dataview/product-4.svg' },
        { id: 11, name: 'VisionCam Mini', price: 299, image: '/images/dataview/product-5.svg' },
        { id: 12, name: 'BoomBox Max', price: 219, image: '/images/dataview/product-6.svg' },
    ];

    readonly gridItems = Array.from({ length: 96 }, (_, i) => ({ ...this.products[i % 12], id: i }));

    readonly chipItems = Array.from({ length: 10000 }, (_, i) => `Item #${i + 1}`);

    /* Templates (viewChild) */
    readonly basicItemTpl = viewChild<TemplateRef<unknown>>('basicItem');
    readonly horizontalItemTpl = viewChild<TemplateRef<unknown>>('horizontalItem');
    readonly gridItemTpl = viewChild<TemplateRef<unknown>>('gridItem');
    readonly plainItemTpl = viewChild<TemplateRef<unknown>>('plainItem');
    readonly loaderTpl = viewChild<TemplateRef<unknown>>('loaderRows');
    readonly lazyItemTpl = viewChild<TemplateRef<unknown>>('lazyItem');
    readonly chipContentTpl = viewChild<TemplateRef<unknown>>('chipContent');

    readonly scroller = viewChild<CzVirtualScrollerComponent>('scroller');

    goTo(index: number): void {
        this.scroller()?.scrollToIndex(index);
    }

    refresh(): void {
        this.loading.set(true);
        setTimeout(() => this.loading.set(false), 1500);
    }

    loadLazyChunk(event: { first: number; last: number }): void {
        const items = [...this.lazyItems()];
        let pending = false;

        for (let i = event.first; i < event.last; i++) {
            if (items[i] == null) {
                items[i] = `Item #${i + 1}`;
                pending = true;
            }
        }

        if (!pending) return;

        this.lazyLoading.set(true);
        this.lazyItems.set(items);
        setTimeout(() => this.lazyLoading.set(false), 400);
    }

    importCode: Code = {
        typescript: `import { CzVirtualScrollerComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-virtual-scroller
    [items]="products"
    [itemSize]="48"
    scrollHeight="250px"
    [itemTemplate]="item"
/>

<ng-template #item let-product>
    <cz-avatar [image]="product.image" shape="circle" size="sm" />
    <span>{{ product.name }}</span>
    <span>{{ product.price }}</span>
</ng-template>`,
        typescript: `// items + itemSize + item template are required;
// the viewport is sized with scrollHeight / scrollWidth or CSS width/height`,
    };

    horizontalCode: Code = {
        html: `<cz-virtual-scroller
    [items]="products"
    orientation="horizontal"
    [itemSize]="170"
    scrollWidth="100%"
    scrollHeight="140px"
    [itemTemplate]="item"
/>`,
        typescript: `// In horizontal mode itemSize refers to the width of an item`,
    };

    gridCode: Code = {
        html: `<cz-virtual-scroller
    [items]="products"
    orientation="both"
    [itemSize]="[80, 180]"
    scrollHeight="260px"
    [itemTemplate]="item"
/>`,
        typescript: `// Grid mode scrolls both directions: itemSize = [height, width]
// columns are computed from the viewport width (override with [columns])`,
    };

    delayCode: Code = {
        html: `<cz-virtual-scroller
    [items]="items"
    [itemSize]="32"
    scrollHeight="200px"
    [delay]="150"
    [itemTemplate]="item"
/>`,
        typescript: `// delay (ms) waits before rendering the new window while scrolling`,
    };

    loadingCode: Code = {
        html: `<cz-virtual-scroller
    [items]="products"
    [itemSize]="48"
    scrollHeight="250px"
    [showLoader]="loading()"
    [loaderTemplate]="loader"
/>

<ng-template #loader let-placeholders>
    @for (row of placeholders; track $index) {
        <cz-skeleton height="1.5rem" borderRadius="6px" />
    }
</ng-template>`,
    };

    lazyCode: Code = {
        html: `<cz-virtual-scroller
    [items]="items()"
    [itemSize]="40"
    scrollHeight="250px"
    [lazy]="true"
    [loading]="loading()"
    (onLazyLoad)="loadChunk($event)"
    [itemTemplate]="item"
/>

<ng-template #item let-item let-loading="loading">
    @if (loading) {
        <cz-skeleton shape="circle" width="1rem" height="1rem" />
        <cz-skeleton width="12rem" borderRadius="4px" />
    } @else {
        {{ item }}
    }
</ng-template>`,
        typescript: `// Start with a placeholder array of the total length
items = signal<any[]>(Array.from({ length: 10000 }));

loadChunk(event: { first: number; last: number }): void {
    const chunk = this.fetchChunk(event.first, event.last);
    // patch items[event.first..event.last] with the loaded chunk
}`,
    };

    programmaticCode: Code = {
        html: `<cz-virtual-scroller #scroller [items]="items" [itemSize]="32" scrollHeight="200px" />

<cz-button label="Go to 500" (onClick)="scroller.scrollToIndex(500)" />`,
        typescript: `@ViewChild('scroller') scroller!: CzVirtualScrollerComponent;

goTo(index: number): void {
    this.scroller.scrollToIndex(index);
}

// Absolute positions: this.scroller.scrollTo({ top: 0, behavior: 'smooth' })`,
    };

    templatesCode: Code = {
        html: `<!-- item: $implicit item, index, count, first, last, even, odd, loading -->
<ng-template #item let-item let-index="index">{{ index }} — {{ item }}</ng-template>

<!-- content: replaces the default list with your own markup -->
<ng-template #content let-entries>
    @for (entry of entries; track entry.index) {
        <li class="cz-virtual-scroller-item">{{ entry.value }}</li>
    }
</ng-template>

<!-- loader: overlay content; loadericon: custom loading icon -->
<ng-template #loader let-placeholders>...</ng-template>
<ng-template #loadericon><cz-progress-spinner [size]="32" /></ng-template>`,
    };
}
