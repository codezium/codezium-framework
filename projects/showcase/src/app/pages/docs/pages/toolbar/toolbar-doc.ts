import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzToolbarComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TOOLBAR_DOC_I18N } from './toolbar-doc.i18n';

@Component({
    selector: 'cz-toolbar-doc-page',
    imports: [CzToolbarComponent, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="toolbar">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-toolbar>
                        <cz-button label="New" czToolbarStart />
                        <cz-button label="Upload" severity="secondary" czToolbarStart variant="outlined" />
                        <cz-button label="Save" czToolbarEnd />
                    </cz-toolbar>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Selector</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>cz-toolbar</code></td><td>Flex container with start/end groups.</td></tr>
                            <tr><td><code>[czToolbarStart]</code></td><td>Projects content into the start group.</td></tr>
                            <tr><td><code>[czToolbarEnd]</code></td><td>Projects content into the end group.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ToolbarDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TOOLBAR_DOC_I18N[this.lang.currentLang()] || TOOLBAR_DOC_I18N.es);

    importCode: Code = {
        typescript: `import { CzToolbarComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-toolbar>
    <cz-button label="New" czToolbarStart />
    <cz-button label="Upload" severity="secondary" variant="outlined" czToolbarStart />
    <cz-button label="Save" czToolbarEnd />
</cz-toolbar>`,
    };
}
