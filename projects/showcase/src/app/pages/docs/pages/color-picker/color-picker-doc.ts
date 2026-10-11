import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzColorPickerComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { COLOR_PICKER_DOC_I18N } from './color-picker-doc.i18n';

@Component({
    selector: 'cz-color-picker-doc-page',
    imports: [CzColorPickerComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="color-picker">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-color-picker [(ngModel)]="color" ariaLabel="Pick a color" />
                    <span class="cz-text-sm">Value: {{ color() }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-lg cz-items-center cz-mb-md">
                    <cz-color-picker size="sm" [(ngModel)]="color" />
                    <cz-color-picker size="md" [(ngModel)]="color" />
                    <cz-color-picker size="lg" [(ngModel)]="color" />
                    <cz-color-picker [showValue]="false" [(ngModel)]="color" />
                    <cz-color-picker [disabled]="true" [(ngModel)]="color" />
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
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Swatch size.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the hex label.</td></tr>
                            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Color'</code></td><td>Accessible label.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ColorPickerDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => COLOR_PICKER_DOC_I18N[this.lang.currentLang()] || COLOR_PICKER_DOC_I18N.es);

    readonly color = signal('#15745e');

    importCode: Code = {
        typescript: `import { CzColorPickerComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-color-picker [(ngModel)]="color" ariaLabel="Pick a color" />`,
        typescript: `color = signal('#15745e');`,
    };

    optionsCode: Code = {
        html: `<cz-color-picker size="sm" [(ngModel)]="color" />
<cz-color-picker size="md" [(ngModel)]="color" />
<cz-color-picker size="lg" [(ngModel)]="color" />
<cz-color-picker [showValue]="false" [(ngModel)]="color" />
<cz-color-picker [disabled]="true" [(ngModel)]="color" />`,
    };
}
