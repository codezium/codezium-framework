import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent } from 'codezium-ui';
import { LucideCheck, LucideChevronRight, LucideDownload, LucideTrash } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { BUTTON_DOC_I18N } from './button-doc.i18n';

@Component({
    selector: 'cz-button-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="button">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Save" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="severities">{{ t().severities }}</h2>
                <p [innerHTML]="t().severitiesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Primary" severity="primary" />
                    <cz-button label="Secondary" severity="secondary" />
                    <cz-button label="Success" severity="success" />
                    <cz-button label="Info" severity="info" />
                    <cz-button label="Warning" severity="warning" />
                    <cz-button label="Danger" severity="danger" />
                    <cz-button label="Dark" severity="dark" />
                </div>
                <app-code [code]="severitiesCode" />
            </section>

            <section>
                <h2 id="variants">{{ t().variants }}</h2>
                <p [innerHTML]="t().variantsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Solid" />
                    <cz-button label="Outlined" variant="outlined" />
                    <cz-button label="Text" variant="text" />
                </div>
                <app-code [code]="variantsCode" />
            </section>

            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Small" size="sm" />
                    <cz-button label="Medium" size="md" />
                    <cz-button label="Large" size="lg" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <section>
                <h2 id="icons">{{ t().icons }}</h2>
                <p [innerHTML]="t().iconsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Download" [icon]="DownloadIcon" />
                    <cz-button label="Next" [icon]="ChevronRightIcon" iconPos="right" variant="outlined" />
                    <cz-button [icon]="CheckIcon" ariaLabel="Confirm" />
                    <cz-button severity="danger" [icon]="TrashIcon" ariaLabel="Delete" [rounded]="true" />
                </div>
                <app-code [code]="iconsCode" />
            </section>

            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p [innerHTML]="t().statesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <div class="cz-flex cz-flex-wrap cz-gap-md">
                        <cz-button label="Loading" [loading]="true" />
                        <cz-button label="Disabled" [disabled]="true" />
                        <cz-button label="Raised" [raised]="true" severity="success" />
                        <cz-button label="Rounded" [rounded]="true" severity="info" />
                    </div>
                    <cz-button label="Fluid Button" [fluid]="true" />
                </div>
                <app-code [code]="statesCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Text of the button.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Optional Lucide icon.</td></tr>
                            <tr><td><code>iconPos</code></td><td><code>'left' | 'right'</code></td><td><code>'left'</code></td><td>Icon position.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Semantic color.</td></tr>
                            <tr><td><code>variant</code></td><td><code>'solid' | 'outlined' | 'text'</code></td><td><code>'solid'</code></td><td>Visual variant.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size.</td></tr>
                            <tr><td><code>raised</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Adds elevation.</td></tr>
                            <tr><td><code>rounded</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Pill shape.</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows spinner and blocks clicks.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Full width.</td></tr>
                            <tr><td><code>onClick</code></td><td><code>output&lt;MouseEvent&gt;</code></td><td>-</td><td>Emitted on click.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ButtonDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => BUTTON_DOC_I18N[this.lang.currentLang()] || BUTTON_DOC_I18N.es);

    readonly DownloadIcon = LucideDownload;
    readonly ChevronRightIcon = LucideChevronRight;
    readonly CheckIcon = LucideCheck;
    readonly TrashIcon = LucideTrash;

    importCode: Code = {
        typescript: `import { CzButtonComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-button label="Save" (onClick)="save()" />`,
    };

    severitiesCode: Code = {
        html: `<cz-button label="Primary" severity="primary" />
<cz-button label="Secondary" severity="secondary" />
<cz-button label="Success" severity="success" />
<cz-button label="Info" severity="info" />
<cz-button label="Warning" severity="warning" />
<cz-button label="Danger" severity="danger" />
<cz-button label="Dark" severity="dark" />`,
    };

    variantsCode: Code = {
        html: `<cz-button label="Solid" />
<cz-button label="Outlined" variant="outlined" />
<cz-button label="Text" variant="text" />`,
    };

    sizesCode: Code = {
        html: `<cz-button label="Small" size="sm" />
<cz-button label="Medium" size="md" />
<cz-button label="Large" size="lg" />`,
    };

    iconsCode: Code = {
        html: `<cz-button label="Download" [icon]="DownloadIcon" />
<cz-button label="Next" [icon]="ChevronRightIcon" iconPos="right" variant="outlined" />
<cz-button [icon]="CheckIcon" ariaLabel="Confirm" />`,
        typescript: `import { LucideCheck, LucideChevronRight, LucideDownload } from '@lucide/angular';

export class MyComponent {
    DownloadIcon = LucideDownload;
    ChevronRightIcon = LucideChevronRight;
    CheckIcon = LucideCheck;
}`,
    };

    statesCode: Code = {
        html: `<cz-button label="Loading" [loading]="true" />
<cz-button label="Disabled" [disabled]="true" />
<cz-button label="Fluid Button" [fluid]="true" />`,
    };
}
