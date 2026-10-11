import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzSplitterComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SPLITTER_DOC_I18N } from './splitter-doc.i18n';

@Component({
    selector: 'cz-splitter-doc-page',
    imports: [CzSplitterComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="splitter">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md" style="height: 12rem;">
                    <cz-splitter>
                        <div class="cz-p-md">Panel A</div>
                        <div class="cz-p-md">Panel B</div>
                    </cz-splitter>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <div style="height: 10rem;">
                        <cz-splitter [panelSizes]="[30, 70]">
                            <div class="cz-p-md">30%</div>
                            <div class="cz-p-md">70%</div>
                        </cz-splitter>
                    </div>
                    <div style="height: 12rem;">
                        <cz-splitter orientation="vertical" [panelSizes]="[50, 50]">
                            <div class="cz-p-md">Top</div>
                            <div class="cz-p-md">Bottom</div>
                        </cz-splitter>
                    </div>
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
                            <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>Layout direction.</td></tr>
                            <tr><td><code>panelSizes</code></td><td><code>number[]</code></td><td><code>[50, 50]</code></td><td>Initial sizes (percentages).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class SplitterDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SPLITTER_DOC_I18N[this.lang.currentLang()] || SPLITTER_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzSplitterComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-splitter>
    <div>Panel A</div>
    <div>Panel B</div>
</cz-splitter>`,
    };

    optionsCode: Code = {
        html: `<cz-splitter [panelSizes]="[30, 70]">
    <div>30%</div>
    <div>70%</div>
</cz-splitter>

<cz-splitter orientation="vertical" [panelSizes]="[50, 50]">
    <div>Top</div>
    <div>Bottom</div>
</cz-splitter>`,
    };
}
