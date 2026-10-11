import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzTooltipDirective } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TOOLTIP_DOC_I18N } from './tooltip-doc.i18n';

@Component({
    selector: 'cz-tooltip-doc-page',
    imports: [CzTooltipDirective, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="tooltip">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Hover me" czTooltip="This is a tooltip" />
                    <button class="cz-btn cz-btn--secondary" czTooltip="Works on any element">Native button</button>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Top" severity="secondary" czTooltip="Tooltip on top" tooltipPosition="top" />
                    <cz-button label="Bottom" severity="secondary" czTooltip="Tooltip on bottom" tooltipPosition="bottom" />
                    <cz-button label="Right" severity="info" czTooltip="Tooltip on right" tooltipPosition="right" />
                    <cz-button label="Disabled" severity="warning" czTooltip="Never shown" [tooltipDisabled]="true" />
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
                            <tr><td><code>czTooltip</code></td><td><code>string</code></td><td><code>''</code></td><td>Tooltip text.</td></tr>
                            <tr><td><code>tooltipPosition</code></td><td><code>'top' | 'bottom' | 'left' | 'right'</code></td><td><code>'top'</code></td><td>Tooltip position.</td></tr>
                            <tr><td><code>tooltipDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the tooltip.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TooltipDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TOOLTIP_DOC_I18N[this.lang.currentLang()] || TOOLTIP_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzTooltipDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-button label="Hover me" czTooltip="This is a tooltip" />`,
    };

    optionsCode: Code = {
        html: `<cz-button label="Top" czTooltip="Tooltip on top" tooltipPosition="top" />
<cz-button label="Right" czTooltip="Tooltip on right" tooltipPosition="right" />
<cz-button label="Disabled" czTooltip="Never shown" [tooltipDisabled]="true" />`,
    };
}
