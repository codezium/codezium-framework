import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzFluidDirective, CzInputTextComponent, CzSelectComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { FLUID_DOC_I18N } from './fluid-doc.i18n';

@Component({
    selector: 'cz-fluid-doc-page',
    imports: [CzFluidDirective, CzInputTextComponent, CzSelectComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="fluid">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" czFluid>
                    <cz-input-text label="Full width input" labelPosition="float" />
                    <cz-select label="Full width select" labelPosition="float" [options]="cities" optionLabel="label" optionValue="value" />
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
                            <tr><td><code>[czFluid]</code></td><td>Adds <code>cz-fluid</code> and stretches descendant components.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class FluidDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => FLUID_DOC_I18N[this.lang.currentLang()] || FLUID_DOC_I18N.es);

    readonly cities = [
        { label: 'New York', value: 'NY' },
        { label: 'Rome', value: 'RM' },
    ];

    importCode: Code = {
        typescript: `import { CzFluidDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<div czFluid>
    <cz-input-text label="Full width input" labelPosition="float" />
    <cz-select label="Full width select" [options]="cities" />
</div>`,
    };
}
