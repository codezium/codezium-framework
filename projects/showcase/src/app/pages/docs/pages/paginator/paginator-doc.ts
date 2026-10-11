import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CzButtonComponent, CzPaginatorComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { PAGINATOR_DOC_I18N } from './paginator-doc.i18n';

@Component({
    selector: 'cz-paginator-doc-page',
    imports: [CommonModule, CzPaginatorComponent, CzButtonComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="paginator">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-paginator [totalRecords]="95" [rows]="10" [(ngModel)]="page" ariaLabel="Pages" />
                    <span class="cz-text-sm">Page (0-based): {{ page() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── ROWS PER PAGE ── -->
            <section>
                <h2 id="rows">{{ t().rows }}</h2>
                <p [innerHTML]="t().rowsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-paginator [totalRecords]="120" [rows]="rows()" [rowsPerPageOptions]="[10, 20, 50]"
                        [ngModel]="rowsPage()" (ngModelChange)="onRowsPage($event)"
                        (onPageChange)="lastState.set($event)" ariaLabel="Pages" />
                    <span class="cz-text-sm">Rows: {{ rows() }} · Page: {{ rowsPage() }} · First: {{ rowsPage() * rows()
                        }}</span>
                </div>
                <app-code [code]="rowsCode" />
            </section>

            <!-- ── PAGE LINKS ── -->
            <section>
                <h2 id="links">{{ t().links }}</h2>
                <p [innerHTML]="t().linksDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button [label]="t().showAll" size="sm" severity="secondary"
                        (onClick)="linkSize.set(linkSize() === 5 ? 0 : 5)" />
                </div>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-paginator [totalRecords]="240" [rows]="10" [pageLinkSize]="linkSize()" [(ngModel)]="linksPage"
                        ariaLabel="Pages" />
                    <span class="cz-text-sm">pageLinkSize: {{ linkSize() === 0 ? '0 (all)' : linkSize() }} ·
                        Page: {{ linksPage() }}</span>
                </div>
                <app-code [code]="linksCode" />
            </section>

            <!-- ── FIRST/LAST ICONS ── -->
            <section>
                <h2 id="icons">{{ t().icons }}</h2>
                <p [innerHTML]="t().iconsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-paginator [totalRecords]="95" [rows]="10" [showFirstLastIcon]="true" [(ngModel)]="iconsPage"
                        ariaLabel="Pages with first/last" />
                    <cz-paginator [totalRecords]="95" [rows]="10" [showFirstLastIcon]="false" [(ngModel)]="iconsPage"
                        ariaLabel="Pages without first/last" />
                </div>
                <app-code [code]="iconsCode" />
            </section>

            <!-- ── DISABLED ── -->
            <section>
                <h2 id="disabled">{{ t().disabledTitle }}</h2>
                <p [innerHTML]="t().disabledDesc"></p>
                <div class="cz-mb-md">
                    <cz-paginator [totalRecords]="95" [rows]="10" [disabled]="true" />
                </div>
                <app-code [code]="disabledCode" />
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
                            <tr><td><code>totalRecords</code></td><td><code>number</code></td><td><code>0</code></td><td>Total amount of records.</td></tr>
                            <tr><td><code>rows</code></td><td><code>number</code></td><td><code>10</code></td><td>Rows per page.</td></tr>
                            <tr><td><code>rowsPerPageOptions</code></td><td><code>number[]</code></td><td><code>[]</code></td><td>Options for the rows select (the select is hidden when empty).</td></tr>
                            <tr><td><code>pageLinkSize</code></td><td><code>number</code></td><td><code>5</code></td><td>Number of page links displayed; the window slides around the current page (<code>0</code> = all).</td></tr>
                            <tr><td><code>showFirstLastIcon</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the first/last page buttons.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Pagination'</code></td><td>Accessible label of the navigation landmark.</td></tr>
                            <tr><td><code>onPageChange</code></td><td><code>output&lt;CzPaginatorState&gt;</code></td><td><code>—</code></td><td>Emitted on page change: <code>&#123; page, first, rows, pageCount &#125;</code>.</td></tr>
                            <tr><td><code>ngModel</code></td><td><code>ControlValueAccessor</code></td><td><code>0</code></td><td>Two-way bindable current page (0-based).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class PaginatorDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => PAGINATOR_DOC_I18N[this.lang.currentLang()] || PAGINATOR_DOC_I18N.es);

    readonly page = signal(0);
    readonly lastState = signal<unknown>(null);

    readonly rows = signal(10);
    readonly rowsPage = signal(0);

    readonly linkSize = signal(5);
    readonly linksPage = signal(0);

    readonly iconsPage = signal(0);

    onRowsPage(page: number): void {
        this.rowsPage.set(page);
    }

    importCode: Code = {
        typescript: `import { CzPaginatorComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-paginator [totalRecords]="95" [rows]="10" [(ngModel)]="page" />`,
        typescript: `page = signal(0);`,
    };

    rowsCode: Code = {
        html: `<cz-paginator
    [totalRecords]="120"
    [rows]="rows()"
    [rowsPerPageOptions]="[10, 20, 50]"
    [(ngModel)]="page"
    (onPageChange)="onPageChange($event)"
/>`,
        typescript: `onPageChange(state: CzPaginatorState) {
    this.rows.set(state.rows); // the rows select updates the state
}`,
    };

    linksCode: Code = {
        html: `<cz-paginator [totalRecords]="240" [rows]="10" [pageLinkSize]="5" [(ngModel)]="page" />

<!-- 0 shows every page link -->
<cz-paginator [totalRecords]="240" [rows]="10" [pageLinkSize]="0" [(ngModel)]="page" />`,
    };

    iconsCode: Code = {
        html: `<cz-paginator [totalRecords]="95" [rows]="10" [showFirstLastIcon]="true" [(ngModel)]="page" />
<cz-paginator [totalRecords]="95" [rows]="10" [showFirstLastIcon]="false" [(ngModel)]="page" />`,
    };

    disabledCode: Code = {
        html: `<cz-paginator [totalRecords]="95" [rows]="10" [disabled]="true" />`,
    };
}
