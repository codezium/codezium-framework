import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzInputGroupAddonComponent, CzInputGroupComponent, CzInputTextComponent } from 'codezium-ui';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { INPUT_GROUP_DOC_I18N } from './input-group-doc.i18n';

@Component({
    selector: 'cz-input-group-doc-page',
    imports: [
        CzInputGroupComponent,
        CzInputGroupAddonComponent,
        CzInputTextComponent,
        CzButtonComponent,
        LucideDynamicIcon,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="input-group">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-input-group>
                        <cz-input-group-addon>$</cz-input-group-addon>
                        <input class="cz-input-native" placeholder="Amount" />
                        <cz-input-group-addon>.00</cz-input-group-addon>
                    </cz-input-group>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="addons">{{ t().addons }}</h2>
                <p [innerHTML]="t().addonsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-input-group>
                        <cz-input-group-addon>
                            <svg [lucideIcon]="SearchIcon" [size]="16"></svg>
                        </cz-input-group-addon>
                        <cz-input-text placeholder="Search" />
                    </cz-input-group>

                    <cz-input-group>
                        <cz-input-text placeholder="Username" />
                        <cz-button label="Go" severity="primary" />
                    </cz-input-group>
                </div>
                <app-code [code]="addonsCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Component</th><th>Selector</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>CzInputGroupComponent</code></td><td><code>cz-input-group</code></td><td>Flex wrapper that joins controls and addons.</td></tr>
                            <tr><td><code>CzInputGroupAddonComponent</code></td><td><code>cz-input-group-addon</code></td><td>Text, icon or button attached to the control.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class InputGroupDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INPUT_GROUP_DOC_I18N[this.lang.currentLang()] || INPUT_GROUP_DOC_I18N.es);

    readonly SearchIcon = LucideSearch;

    importCode: Code = {
        typescript: `import { CzInputGroupComponent, CzInputGroupAddonComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-input-group>
    <cz-input-group-addon>$</cz-input-group-addon>
    <input class="cz-input-native" placeholder="Amount" />
    <cz-input-group-addon>.00</cz-input-group-addon>
</cz-input-group>`,
    };

    addonsCode: Code = {
        html: `<cz-input-group>
    <cz-input-group-addon><svg [lucideIcon]="SearchIcon" [size]="16"></svg></cz-input-group-addon>
    <cz-input-text placeholder="Search" />
</cz-input-group>

<cz-input-group>
    <cz-input-text placeholder="Username" />
    <cz-button label="Go" severity="primary" />
</cz-input-group>`,
    };
}
