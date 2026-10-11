import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzPopoverComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { POPOVER_DOC_I18N } from './popover-doc.i18n';

@Component({
    selector: 'cz-popover-doc-page',
    imports: [CzPopoverComponent, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="popover">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    <cz-popover>
                        <cz-button label="Open popover" czPopoverTrigger />
                        <div class="cz-flex cz-flex-col cz-gap-sm">
                            <strong>Popover title</strong>
                            <span class="cz-text-sm">This is the popover content.</span>
                        </div>
                    </cz-popover>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-mb-md">
                    <cz-popover position="right">
                        <cz-button label="Right" severity="secondary" czPopoverTrigger />
                        <span class="cz-text-sm">Panel on the right.</span>
                    </cz-popover>

                    <cz-popover position="top">
                        <cz-button label="Top" severity="info" czPopoverTrigger />
                        <span class="cz-text-sm">Panel on top.</span>
                    </cz-popover>
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
                            <tr><td><code>visible</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Visibility (two-way).</td></tr>
                            <tr><td><code>position</code></td><td><code>'top' | 'bottom' | 'left' | 'right'</code></td><td><code>'bottom'</code></td><td>Panel position.</td></tr>
                            <tr><td><code>dismissable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes on outside click.</td></tr>
                            <tr><td><code>[czPopoverTrigger]</code></td><td><code>attribute</code></td><td>-</td><td>Marks the trigger element.</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class PopoverDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => POPOVER_DOC_I18N[this.lang.currentLang()] || POPOVER_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzPopoverComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-popover>
    <cz-button label="Open popover" czPopoverTrigger />
    <div>
        <strong>Popover title</strong>
        <span>This is the popover content.</span>
    </div>
</cz-popover>`,
    };

    optionsCode: Code = {
        html: `<cz-popover position="right">
    <cz-button label="Right" czPopoverTrigger />
    <span>Panel on the right.</span>
</cz-popover>`,
    };
}
