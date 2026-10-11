import { ChangeDetectionStrategy, Component, TemplateRef, computed, inject, viewChild } from '@angular/core';
import {
    CzSkeletonComponent,
    CzTableColumn,
    CzTableComponent,
} from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SKELETON_DOC_I18N } from './skeleton-doc.i18n';

@Component({
    selector: 'cz-skeleton-doc-page',
    imports: [CzSkeletonComponent, CzTableComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="skeleton">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md cz-flex cz-gap-md" style="max-width: 20rem;">
                    <cz-skeleton shape="circle" size="2.5rem" />
                    <div class="cz-flex-1 cz-flex cz-flex-col cz-gap-sm">
                        <cz-skeleton width="100%" height="0.75rem" borderRadius="4px" />
                        <cz-skeleton width="90%" height="0.75rem" borderRadius="4px" />
                    </div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── SHAPES ── -->
            <section>
                <h2 id="shapes">{{ t().shapes }}</h2>
                <p [innerHTML]="t().shapesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md" style="max-width: 24rem;">
                    <div>
                        <strong class="cz-text-sm">{{ t().circle }}</strong>
                        <div class="cz-flex cz-items-end cz-gap-md cz-mt-sm">
                            <cz-skeleton shape="circle" size="5rem" />
                            <cz-skeleton shape="circle" size="4rem" />
                            <cz-skeleton shape="circle" size="3rem" />
                            <cz-skeleton shape="circle" size="2rem" />
                        </div>
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().square }}</strong>
                        <div class="cz-flex cz-items-end cz-gap-md cz-mt-sm">
                            <cz-skeleton size="5rem" />
                            <cz-skeleton size="4rem" />
                            <cz-skeleton size="3rem" />
                            <cz-skeleton size="2rem" />
                        </div>
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().rectangle }}</strong>
                        <div class="cz-flex cz-flex-col cz-gap-sm cz-mt-sm">
                            <cz-skeleton />
                            <cz-skeleton width="12rem" />
                            <cz-skeleton width="7rem" />
                            <cz-skeleton height="4rem" />
                            <cz-skeleton width="12rem" height="4rem" />
                        </div>
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().rounded }}</strong>
                        <div class="cz-flex cz-flex-col cz-gap-sm cz-mt-sm">
                            <cz-skeleton borderRadius="16px" />
                            <cz-skeleton width="12rem" borderRadius="16px" />
                            <cz-skeleton width="7rem" borderRadius="16px" />
                            <cz-skeleton height="4rem" borderRadius="16px" />
                            <cz-skeleton width="12rem" height="4rem" borderRadius="16px" />
                        </div>
                    </div>
                </div>
                <app-code [code]="shapesCode" />
            </section>

            <!-- ── CARD ── -->
            <section>
                <h2 id="card">{{ t().card }}</h2>
                <p [innerHTML]="t().cardDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <div class="cz-w-full cz-flex cz-flex-col cz-gap-md" style="max-width: 24rem;">
                        <div class="cz-flex cz-gap-md">
                            <cz-skeleton shape="circle" size="3.5rem" />
                            <div class="cz-flex-1">
                                <div class="cz-flex cz-items-center cz-justify-between">
                                    <cz-skeleton width="40%" height="1.5rem" />
                                </div>
                                <div class="cz-flex cz-flex-col cz-gap-sm cz-mt-sm">
                                    <cz-skeleton width="100%" height="0.75rem" borderRadius="4px" />
                                    <cz-skeleton width="90%" height="0.75rem" borderRadius="4px" />
                                </div>
                                <cz-skeleton class="cz-mt-md" height="8rem" borderRadius="8px" />
                                <div class="cz-flex cz-items-center cz-gap-md cz-mt-md">
                                    <cz-skeleton width="4rem" height="1.75rem" borderRadius="6px" />
                                    <cz-skeleton width="4rem" height="1.75rem" borderRadius="6px" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <app-code [code]="cardCode" />
            </section>

            <!-- ── LIST ── -->
            <section>
                <h2 id="list">{{ t().list }}</h2>
                <p [innerHTML]="t().listDesc"></p>
                <div class="cz-mb-md cz-p-md cz-bg-surface cz-border cz-rounded-md" style="max-width: 26rem;">
                    @for (row of listRows; track row) {
                        <div class="cz-flex cz-gap-sm cz-mb-md">
                            <cz-skeleton shape="circle" size="3rem" />
                            <div class="cz-flex-1 cz-flex cz-flex-col cz-gap-sm" style="align-self: center;">
                                <cz-skeleton width="100%" height="0.75rem" />
                                <cz-skeleton width="75%" height="0.75rem" />
                            </div>
                        </div>
                    }
                </div>
                <app-code [code]="listCode" />
            </section>

            <!-- ── GRID ── -->
            <section>
                <h2 id="grid">{{ t().grid }}</h2>
                <p [innerHTML]="t().gridDesc"></p>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-3 cz-gap-lg cz-mb-md">
                    @for (card of gridCards; track card) {
                        <div class="cz-p-md cz-rounded-md" style="background: var(--cz-theme-surface-hover);">
                            <cz-skeleton height="10rem" borderRadius="8px" />
                            <div class="cz-mt-md cz-flex cz-gap-sm">
                                <cz-skeleton shape="circle" size="2.5rem" />
                                <div class="cz-flex-1 cz-flex cz-flex-col cz-gap-sm">
                                    <cz-skeleton width="100%" height="0.75rem" borderRadius="4px" />
                                    <cz-skeleton width="90%" height="0.75rem" borderRadius="4px" />
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <app-code [code]="gridCode" />
            </section>

            <!-- ── DATA TABLE ── -->
            <section>
                <h2 id="data-table">{{ t().dataTable }}</h2>
                <p [innerHTML]="t().dataTableDesc"></p>
                <div class="cz-mb-md">
                    <cz-table [columns]="tableColumns" [value]="tableRows" [rowTemplate]="tableRowTpl() ?? null" />

                    <ng-template #tableRow let-row>
                        <tr class="cz-table-row">
                            <td><cz-skeleton width="5rem" height="0.875rem" borderRadius="4px" /></td>
                            <td><cz-skeleton width="100%" height="0.875rem" borderRadius="4px" /></td>
                            <td><cz-skeleton width="7rem" height="0.875rem" borderRadius="4px" /></td>
                            <td><cz-skeleton width="4rem" height="0.875rem" borderRadius="4px" /></td>
                        </tr>
                    </ng-template>
                </div>
                <app-code [code]="dataTableCode" />
            </section>

            <!-- ── COLOR ── -->
            <section>
                <h2 id="color">{{ t().color }}</h2>
                <p [innerHTML]="t().colorDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" style="max-width: 20rem;">
                    <cz-skeleton height="1.5rem" borderRadius="4px" animation="none"
                        [style.--cz-skeleton-background]="'#3B82F6'" />
                    <cz-skeleton height="1.5rem" borderRadius="4px" animation="none"
                        [style.--cz-skeleton-background]="'#EF4444'" />
                    <cz-skeleton height="1.5rem" borderRadius="4px" animation="wave"
                        [style.--cz-skeleton-background]="'color-mix(in srgb, #3B82F6 22%, transparent)'"
                        [style.--cz-skeleton-animation-background]="blueShimmer" />
                    <cz-skeleton height="1.5rem" borderRadius="4px" animation="wave"
                        [style.--cz-skeleton-background]="'color-mix(in srgb, #EF4444 22%, transparent)'"
                        [style.--cz-skeleton-animation-background]="redShimmer" />
                </div>
                <app-code [code]="colorCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
                    <li [innerHTML]="t().a11yList2"></li>
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
                            <tr><td><code>shape</code></td><td><code>'rectangle' | 'circle'</code></td><td><code>'rectangle'</code></td><td>Shape of the element.</td></tr>
                            <tr><td><code>size</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>Size of the skeleton (sets width and height).</td></tr>
                            <tr><td><code>width</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>Width of the element (default <code>100%</code>, <code>3rem</code> for circles).</td></tr>
                            <tr><td><code>height</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>Height of the element (default <code>1rem</code>).</td></tr>
                            <tr><td><code>borderRadius</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Border radius of the element, defaults to <code>--cz-skeleton-border-radius</code> (<code>50%</code> for circles).</td></tr>
                            <tr><td><code>animation</code></td><td><code>'pulse' | 'wave' | 'none'</code></td><td><code>'pulse'</code></td><td>Type of the animation: opacity pulse or shimmer wave.</td></tr>
                            <tr><td><code>--cz-skeleton-background</code></td><td><code>CSS variable</code></td><td><code>—</code></td><td>Background color token.</td></tr>
                            <tr><td><code>--cz-skeleton-animation-background</code></td><td><code>CSS variable</code></td><td><code>—</code></td><td>Shimmer gradient token used by the wave animation.</td></tr>
                            <tr><td><code>--cz-skeleton-border-radius</code></td><td><code>CSS variable</code></td><td><code>—</code></td><td>Default border radius token.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class SkeletonDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SKELETON_DOC_I18N[this.lang.currentLang()] || SKELETON_DOC_I18N.es);

    readonly listRows = [1, 2, 3, 4];
    readonly gridCards = [1, 2, 3];
    readonly tableRows = Array.from({ length: 5 }, (_, i) => ({ id: i }));

    readonly tableColumns: CzTableColumn[] = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'category', header: 'Category' },
        { field: 'quantity', header: 'Quantity' },
    ];

    readonly blueShimmer = 'linear-gradient(90deg, transparent 0%, #3B82F6 50%, transparent 100%)';
    readonly redShimmer = 'linear-gradient(90deg, transparent 0%, #EF4444 50%, transparent 100%)';

    readonly tableRowTpl = viewChild<TemplateRef<unknown>>('tableRow');

    importCode: Code = {
        typescript: `import { CzSkeletonComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<div class="flex gap-4 max-w-xs">
    <cz-skeleton shape="circle" size="2.5rem" />
    <div class="flex-1 flex flex-col gap-2">
        <cz-skeleton width="100%" borderRadius="4px" />
        <cz-skeleton width="90%" borderRadius="4px" />
    </div>
</div>`,
    };

    shapesCode: Code = {
        html: `<!-- Circle -->
<cz-skeleton shape="circle" size="5rem" />

<!-- Square (equal width and height) -->
<cz-skeleton size="5rem" />

<!-- Rectangle -->
<cz-skeleton />
<cz-skeleton width="12rem" />
<cz-skeleton height="4rem" />
<cz-skeleton width="12rem" height="4rem" />

<!-- Rounded -->
<cz-skeleton borderRadius="16px" />
<cz-skeleton width="12rem" borderRadius="16px" />`,
    };

    cardCode: Code = {
        html: `<div class="card">
    <div class="flex gap-4">
        <cz-skeleton shape="circle" size="3.5rem" />
        <div class="flex-1">
            <cz-skeleton width="40%" height="1.5rem" />
            <cz-skeleton class="mt-3" width="100%" borderRadius="4px" />
            <cz-skeleton class="mt-1" width="90%" borderRadius="4px" />
            <cz-skeleton class="mt-4" height="8rem" borderRadius="8px" />
            <div class="flex gap-4 mt-4">
                <cz-skeleton width="4rem" height="1.75rem" />
                <cz-skeleton width="4rem" height="1.75rem" />
            </div>
        </div>
    </div>
</div>`,
    };

    listCode: Code = {
        html: `<ul class="list">
    @for (row of rows; track row) {
        <li class="flex gap-2 mb-4">
            <cz-skeleton shape="circle" size="3rem" />
            <div class="flex-1 flex flex-col gap-2 self-center">
                <cz-skeleton width="100%" />
                <cz-skeleton width="75%" />
            </div>
        </li>
    }
</ul>`,
    };

    gridCode: Code = {
        html: `<div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
    @for (card of cards; track card) {
        <div class="card">
            <cz-skeleton height="10rem" />
            <div class="flex gap-3 mt-4">
                <cz-skeleton shape="circle" size="2.5rem" />
                <div class="flex-1 flex flex-col gap-2">
                    <cz-skeleton width="100%" borderRadius="4px" />
                    <cz-skeleton width="90%" borderRadius="4px" />
                </div>
            </div>
        </div>
    }
</div>`,
    };

    dataTableCode: Code = {
        html: `<!-- Skeleton rows inside a table body via rowTemplate -->
<cz-table [columns]="columns" [value]="rows" [rowTemplate]="row" />

<ng-template #row let-row>
    <tr>
        <td><cz-skeleton width="5rem" /></td>
        <td><cz-skeleton /></td>
        <td><cz-skeleton width="7rem" /></td>
        <td><cz-skeleton width="4rem" /></td>
    </tr>
</ng-template>`,
        typescript: `// rows = Array.from({ length: 5 }) — one skeleton row per placeholder item`,
    };

    colorCode: Code = {
        html: `<!-- Custom background -->
<cz-skeleton borderRadius="4px" animation="none" style="--cz-skeleton-background: #3B82F6" />

<!-- Custom background + custom shimmer -->
<cz-skeleton
    borderRadius="4px"
    animation="wave"
    style="
        --cz-skeleton-background: color-mix(in srgb, #3B82F6 22%, transparent);
        --cz-skeleton-animation-background: linear-gradient(90deg, transparent, #3B82F6, transparent);
    "
/>`,
    };
}
