import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzDatePickerComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DATE_PICKER_DOC_I18N } from './date-picker-doc.i18n';

@Component({
    selector: 'cz-date-picker-doc-page',
    imports: [CzDatePickerComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="date-picker">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md" style="max-width: 20rem;">
                    <cz-date-picker [(ngModel)]="date" placeholder="Select a date" ariaLabel="Select a date" />
                    <span class="cz-text-sm">Value: {{ date() ? date()!.toDateString() : '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md" style="max-width: 20rem;">
                    <cz-date-picker [(ngModel)]="date" [minDate]="minDate" [maxDate]="maxDate" placeholder="Limited range" />
                    <cz-date-picker [(ngModel)]="date" locale="es-ES" placeholder="Español" />
                    <cz-date-picker [(ngModel)]="date" [showClear]="false" placeholder="No clear" />
                    <cz-date-picker [(ngModel)]="date" [disabled]="true" placeholder="Disabled" />
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
                            <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>''</code></td><td>Input placeholder.</td></tr>
                            <tr><td><code>showClear</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows the clear button.</td></tr>
                            <tr><td><code>locale</code></td><td><code>string</code></td><td><code>'en-US'</code></td><td>Locale used for names and format.</td></tr>
                            <tr><td><code>firstDayOfWeek</code></td><td><code>number</code></td><td><code>0</code></td><td>First day of the week (0 = Sunday).</td></tr>
                            <tr><td><code>minDate</code> / <code>maxDate</code></td><td><code>Date | null</code></td><td><code>null</code></td><td>Selectable range limits.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;CzDatePickerChangeEvent&gt;</code></td><td>-</td><td>Emitted on date change.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class DatePickerDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => DATE_PICKER_DOC_I18N[this.lang.currentLang()] || DATE_PICKER_DOC_I18N.es);

    readonly date = signal<Date | null>(new Date(2024, 4, 15));
    readonly minDate = new Date(2024, 4, 1);
    readonly maxDate = new Date(2024, 4, 31);

    importCode: Code = {
        typescript: `import { CzDatePickerComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" placeholder="Select a date" />`,
        typescript: `date = signal<Date | null>(new Date());`,
    };

    optionsCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [minDate]="minDate" [maxDate]="maxDate" />
<cz-date-picker [(ngModel)]="date" locale="es-ES" />
<cz-date-picker [(ngModel)]="date" [showClear]="false" />
<cz-date-picker [(ngModel)]="date" [disabled]="true" />`,
    };
}
