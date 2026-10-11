import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzBreadcrumbComponent, CzBreadcrumbItem } from 'codezium-ui';
import { LucideHouse } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { BREADCRUMB_DOC_I18N } from './breadcrumb-doc.i18n';

@Component({
    selector: 'cz-breadcrumb-doc-page',
    imports: [CzBreadcrumbComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="breadcrumb">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md">
                    <cz-breadcrumb [items]="items" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <cz-breadcrumb [home]="home" [items]="items" separator=">" />
                    <cz-breadcrumb [items]="urlItems" />
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
                            <tr><td><code>items</code></td><td><code>CzBreadcrumbItem[]</code></td><td><code>[]</code></td><td>Items to display.</td></tr>
                            <tr><td><code>home</code></td><td><code>CzBreadcrumbItem | null</code></td><td><code>null</code></td><td>Optional home item.</td></tr>
                            <tr><td><code>separator</code></td><td><code>string</code></td><td><code>'/'</code></td><td>Separator between items.</td></tr>
                            <tr><td><code>itemClick</code></td><td><code>output&lt;CzBreadcrumbItem&gt;</code></td><td>-</td><td>Emitted when an item is clicked.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class BreadcrumbDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => BREADCRUMB_DOC_I18N[this.lang.currentLang()] || BREADCRUMB_DOC_I18N.es);

    readonly home: CzBreadcrumbItem = { label: 'Home', routerLink: '/', icon: LucideHouse };

    readonly items: CzBreadcrumbItem[] = [
        { label: 'Components', routerLink: '/docs/components/button' },
        { label: 'Breadcrumb' },
    ];

    readonly urlItems: CzBreadcrumbItem[] = [
        { label: 'Library', url: '#' },
        { label: 'Current page' },
    ];

    importCode: Code = {
        typescript: `import { CzBreadcrumbComponent, CzBreadcrumbItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-breadcrumb [items]="items" />`,
        typescript: `items: CzBreadcrumbItem[] = [
    { label: 'Components', routerLink: '/components' },
    { label: 'Breadcrumb' },
];`,
    };

    optionsCode: Code = {
        html: `<cz-breadcrumb [home]="home" [items]="items" separator=">" />

<!-- Using plain urls -->
<cz-breadcrumb [items]="urlItems" />`,
        typescript: `home: CzBreadcrumbItem = { label: 'Home', routerLink: '/', icon: LucideHouse };

urlItems: CzBreadcrumbItem[] = [
    { label: 'Library', url: 'https://example.com' },
    { label: 'Current page' },
];`,
    };
}
