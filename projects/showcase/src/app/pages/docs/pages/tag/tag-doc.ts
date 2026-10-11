import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzTagComponent } from 'codezium-ui';
import { LucideCheck, LucideCircleAlert, LucideInfo } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TAG_DOC_I18N } from './tag-doc.i18n';

@Component({
    selector: 'cz-tag-doc-page',
    imports: [CzTagComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tag">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-tag value="New" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="severities">{{ t().severities }}</h2>
                <p [innerHTML]="t().severitiesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-tag value="Primary" severity="primary" />
                    <cz-tag value="Secondary" severity="secondary" />
                    <cz-tag value="Success" severity="success" />
                    <cz-tag value="Info" severity="info" />
                    <cz-tag value="Warning" severity="warning" />
                    <cz-tag value="Danger" severity="danger" />
                    <cz-tag value="Dark" severity="dark" />
                </div>
                <app-code [code]="severitiesCode" />
            </section>

            <section>
                <h2 id="icons">{{ t().icons }}</h2>
                <p [innerHTML]="t().iconsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-tag value="Completed" severity="success" [icon]="CheckIcon" />
                    <cz-tag value="Warning" severity="warning" [icon]="AlertIcon" [rounded]="true" />
                    <cz-tag value="Info" severity="info" [icon]="InfoIcon" [rounded]="true" size="lg" />
                </div>
                <app-code [code]="iconsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>Text of the tag.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Semantic color.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Optional Lucide icon.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Tag size.</td></tr>
                            <tr><td><code>rounded</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Pill shape.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TagDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TAG_DOC_I18N[this.lang.currentLang()] || TAG_DOC_I18N.es);

    readonly CheckIcon = LucideCheck;
    readonly AlertIcon = LucideCircleAlert;
    readonly InfoIcon = LucideInfo;

    importCode: Code = {
        typescript: `import { CzTagComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-tag value="New" />`,
    };

    severitiesCode: Code = {
        html: `<cz-tag value="Success" severity="success" />
<cz-tag value="Warning" severity="warning" />
<cz-tag value="Danger" severity="danger" />`,
    };

    iconsCode: Code = {
        html: `<cz-tag value="Completed" severity="success" [icon]="CheckIcon" />
<cz-tag value="Warning" severity="warning" [icon]="AlertIcon" [rounded]="true" />`,
        typescript: `import { LucideCheck, LucideCircleAlert } from '@lucide/angular';

export class MyComponent {
    CheckIcon = LucideCheck;
    AlertIcon = LucideCircleAlert;
}`,
    };
}
