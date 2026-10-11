import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CzPaginatorComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { PAGINATOR_DOC_I18N } from './paginator-doc.i18n';

@Component({
    selector: 'cz-paginator-doc-page',
    imports: [CommonModule, CzPaginatorComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="paginator">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-paginator [totalRecords]="95" [rows]="10" [(ngModel)]="page" ariaLabel="Pages" />
                    <span class="cz-text-sm">Page (0-based): {{ page() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-paginator [totalRecords]="120" [rows]="10" [rowsPerPageOptions]="[10, 20, 50]" (onPageChange)="lastState.set($event)" ariaLabel="Pages" />
                    <span class="cz-text-sm">State: {{ lastState() | json }}</span>
                    <cz-paginator [totalRecords]="95" [rows]="10" [disabled]="true" />
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
                            <tr><td><code>totalRecords</code></td><td><code>number</code></td><td><code>0</code></td><td>Total amount of records.</td></tr>
                            <tr><td><code>rows</code></td><td><code>number</code></td><td><code>10</code></td><td>Rows per page.</td></tr>
                            <tr><td><code>rowsPerPageOptions</code></td><td><code>number[]</code></td><td><code>[]</code></td><td>Options for the rows select.</td></tr>
                            <tr><td><code>showFirstLastIcon</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows first/last buttons.</td></tr>
                            <tr><td><code>onPageChange</code></td><td><code>output&lt;CzPaginatorState&gt;</code></td><td>-</td><td>Emitted on page change.</td></tr>
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

    importCode: Code = {
        typescript: `import { CzPaginatorComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-paginator [totalRecords]="95" [rows]="10" [(ngModel)]="page" />`,
        typescript: `page = signal(0);`,
    };

    optionsCode: Code = {
        html: `<cz-paginator
    [totalRecords]="120"
    [rows]="10"
    [rowsPerPageOptions]="[10, 20, 50]"
    (onPageChange)="onPageChange($event)"
/>

<cz-paginator [totalRecords]="95" [rows]="10" [disabled]="true" />`,
        typescript: `onPageChange(state: CzPaginatorState) {
    console.log(state.page, state.first, state.rows, state.pageCount);
}`,
    };
}
