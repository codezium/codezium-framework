import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CzButtonComponent, CzDatePickerComponent, CzIconComponent, CzMessageComponent } from 'codezium-ui';
import { LucideCalendar, LucideClock } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DATE_PICKER_DOC_I18N } from './date-picker-doc.i18n';

@Component({
    selector: 'cz-date-picker-doc-page',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CzDatePickerComponent,
        CzButtonComponent,
        CzIconComponent,
        CzMessageComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="date-picker">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-date-picker [(ngModel)]="date" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── RANGE ── -->
            <section>
                <h2 id="range">{{ t().range }}</h2>
                <p [innerHTML]="t().rangeDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-date-picker [(ngModel)]="rangeDates" selectionMode="range" [readonlyInput]="true"
                        [showButtonBar]="true" />
                </div>
                <span class="cz-text-sm">{{ t().nights }}: {{ nights }}</span>
                <app-code [code]="rangeCode" />
            </section>

            <!-- ── MULTIPLE ── -->
            <section>
                <h2 id="multiple">{{ t().multiple }}</h2>
                <p [innerHTML]="t().multipleDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-date-picker [(ngModel)]="multipleDates" selectionMode="multiple" [readonlyInput]="true" />
                </div>
                <span class="cz-text-sm">{{ t().selected }}: {{ multipleDates?.length || 0 }}</span>
                <app-code [code]="multipleCode" />
            </section>

            <!-- ── BUTTON BAR ── -->
            <section>
                <h2 id="button-bar">{{ t().buttonBar }}</h2>
                <p [innerHTML]="t().buttonBarDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-lg">
                    <cz-date-picker [(ngModel)]="barDate" [showButtonBar]="true" [placeholder]="t().basic" />
                    <cz-date-picker [(ngModel)]="barRange" [showButtonBar]="true" selectionMode="range"
                        [readonlyInput]="true" [placeholder]="t().customized">
                        <ng-template #buttonBarTemplate let-todayCallback="todayCallback" let-clearCallback="clearCallback">
                            <div class="cz-flex cz-items-center cz-justify-between cz-w-full">
                                <span class="cz-text-sm cz-text-muted">{{ t().customized }}</span>
                                <span class="cz-flex cz-items-center cz-gap-sm">
                                    <cz-button [label]="t().today" size="sm" variant="outlined"
                                        (onClick)="todayCallback($event)" />
                                    <cz-button [label]="t().clear" size="sm" variant="text" severity="danger"
                                        (onClick)="clearCallback($event)" />
                                </span>
                            </div>
                        </ng-template>
                    </cz-date-picker>
                </div>
                <app-code [code]="buttonBarCode" />
            </section>

            <!-- ── CLEAR ICON ── -->
            <section>
                <h2 id="clear-icon">{{ t().clearIcon }}</h2>
                <p [innerHTML]="t().clearIconDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-date-picker [(ngModel)]="clearDate" [showClear]="true" />
                </div>
                <app-code [code]="clearIconCode" />
            </section>

            <!-- ── DATE TEMPLATE ── -->
            <section>
                <h2 id="date-template">{{ t().dateTemplate }}</h2>
                <p [innerHTML]="t().dateTemplateDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-date-picker [(ngModel)]="templateDate" [inline]="true">
                        <ng-template #dateTemplate let-date let-selected="selected">
                            <span class="cz-flex cz-flex-col cz-items-center" style="line-height: 1;">
                                <span [style.color]="isWeekend(date) && !selected ? 'var(--cz-color-danger)' : null">
                                    {{ date.day }}
                                </span>
                                @if (!date.otherMonth && date.day % 5 === 0) {
                                    <span style="width: 4px; height: 4px; border-radius: 50%; background: var(--cz-color-primary);"
                                        [style.opacity]="selected ? 0.6 : 1"></span>
                                }
                            </span>
                        </ng-template>
                    </cz-date-picker>
                </div>
                <app-code [code]="dateTemplateCode" />
            </section>

            <!-- ── INLINE ── -->
            <section>
                <h2 id="inline">{{ t().inline }}</h2>
                <p [innerHTML]="t().inlineDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-date-picker [(ngModel)]="inlineDate" [inline]="true" [showWeek]="true" />
                </div>
                <app-code [code]="inlineCode" />
            </section>

            <!-- ── TIME ── -->
            <section>
                <h2 id="time">{{ t().time }}</h2>
                <p [innerHTML]="t().timeDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-items-start cz-justify-center cz-gap-lg">
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <strong class="cz-text-sm">{{ t().format12h }}</strong>
                        <cz-date-picker [(ngModel)]="datetime12h" [showTime]="true" [hourFormat]="12"
                            [showSeconds]="true" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <strong class="cz-text-sm">{{ t().format24h }}</strong>
                        <cz-date-picker [(ngModel)]="datetime24h" [showTime]="true" [hourFormat]="24" />
                    </div>
                    <div class="cz-flex cz-flex-col cz-gap-xs">
                        <strong class="cz-text-sm">{{ t().timeOnly }}</strong>
                        <cz-date-picker [(ngModel)]="timeOnly" [timeOnly]="true" />
                    </div>
                </div>
                <app-code [code]="timeCode" />
            </section>

            <!-- ── MONTH / YEAR ── -->
            <section>
                <h2 id="month-year">{{ t().monthYear }}</h2>
                <p [innerHTML]="t().monthYearDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-lg">
                    <cz-date-picker [(ngModel)]="monthDate" view="month" dateFormat="mm/yy" [readonlyInput]="true" />
                    <cz-date-picker [(ngModel)]="yearDate" view="year" dateFormat="yy" />
                </div>
                <app-code [code]="monthYearCode" />
            </section>

            <!-- ── FORMAT & MODEL ── -->
            <section>
                <h2 id="format">{{ t().format }}</h2>
                <p [innerHTML]="t().formatDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-lg">
                    <cz-date-picker [(ngModel)]="formatDate" dateFormat="dd/mm/yy" />
                    <cz-date-picker [(ngModel)]="stringDate" dataType="string" dateFormat="DD, MM d, yy" />
                </div>
                <span class="cz-text-sm">{{ t().modelValue }}: {{ stringDate || '-' }}</span>
                <app-code [code]="formatCode" />
            </section>

            <!-- ── ICON ── -->
            <section>
                <h2 id="icon">{{ t().icon }}</h2>
                <p [innerHTML]="t().iconDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-lg">
                    <cz-date-picker [(ngModel)]="iconDate1" [showIcon]="true" [showOnFocus]="false" />
                    <cz-date-picker [(ngModel)]="iconDate2" [showIcon]="true" iconDisplay="input" />
                    <cz-date-picker [(ngModel)]="iconDate3" [showIcon]="true" iconDisplay="input" [timeOnly]="true">
                        <ng-template #inputIconTemplate let-clickCallBack="clickCallBack">
                            <span (click)="clickCallBack($event)">
                                <cz-icon [icon]="ClockIcon" [size]="16" />
                            </span>
                        </ng-template>
                    </cz-date-picker>
                </div>
                <app-code [code]="iconCode" />
            </section>

            <!-- ── MIN / MAX ── -->
            <section>
                <h2 id="min-max">{{ t().minMax }}</h2>
                <p [innerHTML]="t().minMaxDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-date-picker [(ngModel)]="minMaxDate" [minDate]="minDate" [maxDate]="maxDate"
                        [readonlyInput]="true" />
                </div>
                <app-code [code]="minMaxCode" />
            </section>

            <!-- ── STATES & SIZES ── -->
            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p [innerHTML]="t().statesDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-items-center cz-gap-md">
                    <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-lg">
                        <cz-date-picker [(ngModel)]="stateDate1" [invalid]="!stateDate1" [placeholder]="t().invalid" />
                        <cz-date-picker [(ngModel)]="stateDate2" variant="filled" [placeholder]="t().filled" />
                        <cz-date-picker [disabled]="true" [placeholder]="t().disabled" />
                    </div>
                    <div class="cz-flex cz-flex-wrap cz-items-center cz-justify-center cz-gap-lg">
                        <cz-date-picker [(ngModel)]="sizeSmall" size="sm" [placeholder]="t().small" [showIcon]="true"
                            iconDisplay="input" />
                        <cz-date-picker [(ngModel)]="sizeNormal" [placeholder]="t().normal" [showIcon]="true"
                            iconDisplay="input" />
                        <cz-date-picker [(ngModel)]="sizeLarge" size="lg" [placeholder]="t().large" [showIcon]="true"
                            iconDisplay="input" />
                    </div>
                </div>
                <app-code [code]="statesCode" />
            </section>

            <!-- ── FLOAT LABEL ── -->
            <section>
                <h2 id="float-label">{{ t().floatLabel }}</h2>
                <p [innerHTML]="t().floatLabelDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-items-end cz-justify-center cz-gap-lg">
                    <cz-date-picker [(ngModel)]="floatDate1" [label]="t().overLabel" labelPosition="over"
                        [showIcon]="true" iconDisplay="input" />
                    <cz-date-picker [(ngModel)]="floatDate2" [label]="t().inLabel" labelPosition="in"
                        [showIcon]="true" iconDisplay="input" />
                    <cz-date-picker [(ngModel)]="floatDate3" [label]="t().floatLabelText" labelPosition="float"
                        [showIcon]="true" iconDisplay="input" />
                </div>
                <app-code [code]="floatLabelCode" />
            </section>

            <!-- ── FLUID & TOUCH UI ── -->
            <section>
                <h2 id="fluid-touch">{{ t().fluidTouch }}</h2>
                <p [innerHTML]="t().fluidTouchDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-gap-lg">
                    <cz-date-picker [(ngModel)]="fluidDate" [fluid]="true" />
                    <cz-date-picker [(ngModel)]="touchDate" [touchUI]="true" [readonlyInput]="true" />
                </div>
                <app-code [code]="fluidTouchCode" />
            </section>

            <!-- ── TEMPLATES ── -->
            <section>
                <h2 id="templates">{{ t().templates }}</h2>
                <p [innerHTML]="t().templatesDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-date-picker [(ngModel)]="slotsDate" [inline]="true">
                        <ng-template #headerTemplate>
                            <div class="cz-font-medium">{{ t().pickDate }}</div>
                        </ng-template>
                        <ng-template #footerTemplate>
                            <div class="cz-flex cz-justify-center">
                                <cz-button [label]="t().today" size="sm" variant="text"
                                    (onClick)="slotsToday.set(!slotsToday())" />
                            </div>
                        </ng-template>
                    </cz-date-picker>
                </div>
                <app-code [code]="templatesCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p [innerHTML]="t().formsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 15rem;">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-date-picker formControlName="selectedDate" [invalid]="isInvalid('selectedDate')" />
                        @if (isInvalid('selectedDate')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 15rem;">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-date-picker #dp="ngModel" name="dp" [(ngModel)]="templateDate" required
                            [invalid]="!!dp.invalid && (dp.touched || tdForm.submitted)" />
                        @if (!!dp.invalid && (dp.touched || tdForm.submitted)) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>
                </div>
                <app-code [code]="formsCode" />
            </section>

            <!-- ── EVENTS ── -->
            <section>
                <h2 id="events">{{ t().events }}</h2>
                <p [innerHTML]="t().eventsDesc"></p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Parameters</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>onSelect</code></td><td><code>value</code></td><td>{{ t().evSelect }}</td></tr>
                            <tr><td><code>onFocus / onBlur</code></td><td><code>event</code></td><td>{{ t().evFocus }}</td></tr>
                            <tr><td><code>onShow / onClose</code></td><td><code>event</code></td><td>{{ t().evShow }}</td></tr>
                            <tr><td><code>onClickOutside</code></td><td><code>event</code></td><td>{{ t().evOutside }}</td></tr>
                            <tr><td><code>onInput</code></td><td><code>text</code></td><td>{{ t().evInput }}</td></tr>
                            <tr><td><code>onTodayClick / onClearClick</code></td><td><code>event</code></td><td>{{ t().evButtons }}</td></tr>
                            <tr><td><code>onMonthChange / onYearChange</code></td><td><code>&#123; month, year &#125;</code></td><td>{{ t().evNavigate }}</td></tr>
                            <tr><td><code>onClear</code></td><td><code>—</code></td><td>{{ t().evClear }}</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yInput"></li>
                    <li [innerHTML]="t().a11yDialog"></li>
                    <li [innerHTML]="t().a11yGrid"></li>
                </ul>
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>selectionMode</code></td><td><code>'single' | 'multiple' | 'range'</code></td><td><code>'single'</code></td><td>Quantity of the selection.</td></tr>
                            <tr><td><code>view</code></td><td><code>'date' | 'month' | 'year'</code></td><td><code>'date'</code></td><td>Type of view to display.</td></tr>
                            <tr><td><code>dateFormat</code></td><td><code>string</code></td><td><code>'mm/dd/yy'</code></td><td>Format tokens: <code>d</code>, <code>dd</code>, <code>o</code>, <code>oo</code>, <code>D</code>, <code>DD</code>, <code>m</code>, <code>mm</code>, <code>M</code>, <code>MM</code>, <code>y</code>, <code>yy</code>, <code>@</code>, <code>!</code>, literals.</td></tr>
                            <tr><td><code>dataType</code></td><td><code>'date' | 'string'</code></td><td><code>'date'</code></td><td>Type of the value written to the model.</td></tr>
                            <tr><td><code>inline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays the calendar inline.</td></tr>
                            <tr><td><code>showTime / timeOnly / hourFormat</code></td><td><code>boolean / boolean / 12 | 24</code></td><td><code>false / false / 24</code></td><td>Time picker configuration.</td></tr>
                            <tr><td><code>stepHour / stepMinute / stepSecond / showSeconds / timeSeparator</code></td><td><code>number / boolean / string</code></td><td><code>1 / 1 / 1 / false / ':'</code></td><td>Time steps and seconds.</td></tr>
                            <tr><td><code>numberOfMonths</code></td><td><code>number</code></td><td><code>1</code></td><td>Number of months to display.</td></tr>
                            <tr><td><code>showWeek / startWeekFromFirstDayOfYear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Week numbers column.</td></tr>
                            <tr><td><code>showOtherMonths / selectOtherMonths</code></td><td><code>boolean</code></td><td><code>true / false</code></td><td>Dates of other months.</td></tr>
                            <tr><td><code>showIcon / iconDisplay / showOnFocus</code></td><td><code>boolean / 'input' | 'button' / boolean</code></td><td><code>false / 'button' / true</code></td><td>Calendar icon and opening behavior.</td></tr>
                            <tr><td><code>showClear / showButtonBar</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Clear trigger and today/clear buttons.</td></tr>
                            <tr><td><code>readonlyInput / keepInvalid / hideOnDateTimeSelect</code></td><td><code>boolean</code></td><td><code>false / false / true</code></td><td>Input and overlay behavior.</td></tr>
                            <tr><td><code>minDate / maxDate</code></td><td><code>Date | null</code></td><td><code>null</code></td><td>Selectable range boundaries.</td></tr>
                            <tr><td><code>disabledDates / disabledDays</code></td><td><code>Date[] / number[]</code></td><td><code>[]</code></td><td>Disabled dates and weekdays.</td></tr>
                            <tr><td><code>defaultDate</code></td><td><code>Date | null</code></td><td><code>null</code></td><td>Highlighted date on first opening.</td></tr>
                            <tr><td><code>maxDateCount</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Maximum selectable dates in multiple mode.</td></tr>
                            <tr><td><code>multipleSeparator / rangeSeparator</code></td><td><code>string</code></td><td><code>',' / '-'</code></td><td>Separators for multiple/range display.</td></tr>
                            <tr><td><code>firstDayOfWeek</code></td><td><code>number</code></td><td><code>0</code></td><td>First day of the week.</td></tr>
                            <tr><td><code>locale</code></td><td><code>string</code></td><td><code>'en-US'</code></td><td>Locale for month/day names and parsing.</td></tr>
                            <tr><td><code>size / variant / fluid / invalid / disabled</code></td><td><code>—</code></td><td><code>—</code></td><td>Visual states and sizing.</td></tr>
                            <tr><td><code>label / labelPosition</code></td><td><code>string / 'none' | 'over' | 'in' | 'float'</code></td><td><code>'' / 'none'</code></td><td>Visible label and its position.</td></tr>
                            <tr><td><code>touchUI</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Overlay optimized for touch devices.</td></tr>
                            <tr><td><code>inputId / inputStyleClass / panelStyleClass / ariaLabel / ariaLabelledBy / iconAriaLabel / tabindex</code></td><td><code>—</code></td><td><code>—</code></td><td>Native attributes and accessibility labels.</td></tr>
                            <tr><td><code>dateTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Date cell template (<code>&#123; day, month, year, date, otherMonth &#125;</code>, <code>selected</code>).</td></tr>
                            <tr><td><code>headerTemplate / footerTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Panel header and footer.</td></tr>
                            <tr><td><code>decadeTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Year picker header (<code>[startYear, endYear]</code>).</td></tr>
                            <tr><td><code>disabledDateTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Disabled date cells.</td></tr>
                            <tr><td><code>buttonBarTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Custom button bar (<code>todayCallback</code>, <code>clearCallback</code>).</td></tr>
                            <tr><td><code>previousIconTemplate / nextIconTemplate / triggerIconTemplate / clearIconTemplate / inputIconTemplate / incrementIconTemplate / decrementIconTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Icon templates.</td></tr>
                            <tr><td><code>toggle()</code></td><td><code>method</code></td><td><code>—</code></td><td>Toggles the visibility of the calendar.</td></tr>
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

    readonly ClockIcon = LucideClock;
    readonly CalendarIcon = LucideCalendar;

    date: Date | undefined;
    rangeDates: Date[] | undefined;
    multipleDates: Date[] | undefined;
    barDate: Date | undefined;
    barRange: Date[] | undefined;
    clearDate: Date | undefined;
    templateDate: Date | undefined;
    inlineDate: Date | undefined;
    datetime12h: Date | undefined;
    datetime24h: Date | undefined;
    timeOnly: Date | undefined;
    monthDate: Date | undefined;
    yearDate: Date | undefined;
    formatDate: Date | undefined;
    stringDate: string | undefined;
    iconDate1: Date | undefined;
    iconDate2: Date | undefined;
    iconDate3: Date | undefined;
    minMaxDate: Date | undefined;
    stateDate1: Date | undefined;
    stateDate2: Date | undefined;
    sizeSmall: Date | undefined;
    sizeNormal: Date | undefined;
    sizeLarge: Date | undefined;
    floatDate1: Date | undefined;
    floatDate2: Date | undefined;
    floatDate3: Date | undefined;
    fluidDate: Date | undefined;
    touchDate: Date | undefined;
    slotsDate: Date | undefined;
    templateFormDate: Date | undefined;

    readonly slotsToday = signal(false);

    readonly minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    readonly maxDate = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0);

    readonly exampleForm = new FormGroup({
        selectedDate: new FormControl(null, Validators.required),
    });
    formSubmitted = false;

    get nights(): number {
        if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
            const diff = this.rangeDates[1].getTime() - this.rangeDates[0].getTime();
            return Math.round(diff / 86400000);
        }
        return 0;
    }

    isWeekend(date: { year: number; month: number; day: number }): boolean {
        const day = new Date(date.year, date.month, date.day).getDay();
        return day === 0 || day === 6;
    }

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.notify(this.t().formSubmitted);
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid) {
            this.notify(this.t().formSubmitted);
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    notify(message: string): void {
        console.log(message);
    }

    importCode: Code = {
        typescript: `import { CzDatePickerComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" />`,
    };

    rangeCode: Code = {
        html: `<!-- The bound value is an array with the start and end dates -->
<cz-date-picker [(ngModel)]="rangeDates" selectionMode="range" [readonlyInput]="true" />`,
    };

    multipleCode: Code = {
        html: `<!-- Multiple mode: the value binding is an array -->
<cz-date-picker [(ngModel)]="dates" selectionMode="multiple" [readonlyInput]="true"
    [maxDateCount]="3" />`,
    };

    buttonBarCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [showButtonBar]="true" />

<!-- Customized button bar -->
<cz-date-picker [(ngModel)]="dates" selectionMode="range" [showButtonBar]="true">
    <ng-template #buttonBarTemplate let-todayCallback="todayCallback" let-clearCallback="clearCallback">
        <cz-button label="Today" (onClick)="todayCallback($event)" />
        <cz-button label="Clear" severity="danger" (onClick)="clearCallback($event)" />
    </ng-template>
</cz-date-picker>`,
    };

    clearIconCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [showClear]="true" />`,
    };

    dateTemplateCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [inline]="true">
    <ng-template #dateTemplate let-date let-selected="selected">
        <span [style.color]="isWeekend(date) && !selected ? 'var(--cz-color-danger)' : null">
            {{ date.day }}
        </span>
        @if (!date.otherMonth && date.day % 5 === 0) {
            <span class="event-dot"></span>
        }
    </ng-template>
</cz-date-picker>`,
        typescript: `// The context provides { day, month, year, date, otherMonth } and \`selected\``,
    };

    inlineCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [inline]="true" [showWeek]="true" />`,
    };

    timeCode: Code = {
        html: `<cz-date-picker [(ngModel)]="datetime" [showTime]="true" [hourFormat]="12" [showSeconds]="true" />
<cz-date-picker [(ngModel)]="datetime" [showTime]="true" [hourFormat]="24" />
<cz-date-picker [(ngModel)]="time" [timeOnly]="true" />`,
        typescript: `// stepHour / stepMinute / stepSecond adjust the spinner steps
// timeSeparator customizes the separator (default ':')`,
    };

    monthYearCode: Code = {
        html: `<!-- Month picker -->
<cz-date-picker [(ngModel)]="date" view="month" dateFormat="mm/yy" />

<!-- Year picker -->
<cz-date-picker [(ngModel)]="date" view="year" dateFormat="yy" />`,
    };

    formatCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" dateFormat="dd/mm/yy" />

<!-- The model can hold a string -->
<cz-date-picker [(ngModel)]="stringDate" dataType="string" dateFormat="DD, MM d, yy" />`,
        typescript: `// Tokens: d, dd, o, oo, D, DD, m, mm, M, MM, y, yy, @, !, 'literal'`,
    };

    iconCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [showIcon]="true" [showOnFocus]="false" />

<!-- Icon inside the input -->
<cz-date-picker [(ngModel)]="date" [showIcon]="true" iconDisplay="input" />

<!-- Custom input icon -->
<cz-date-picker [(ngModel)]="time" [showIcon]="true" iconDisplay="input" [timeOnly]="true">
    <ng-template #inputIconTemplate let-clickCallBack="clickCallBack">
        <cz-icon [icon]="ClockIcon" [size]="16" (click)="clickCallBack($event)" />
    </ng-template>
</cz-date-picker>`,
    };

    minMaxCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [minDate]="minDate" [maxDate]="maxDate" [readonlyInput]="true" />`,
        typescript: `// disabledDates: Date[] and disabledDays: number[] are also available`,
    };

    statesCode: Code = {
        html: `<!-- Invalid -->
<cz-date-picker [(ngModel)]="date" [invalid]="!date" />

<!-- Filled variant -->
<cz-date-picker [(ngModel)]="date" variant="filled" />

<!-- Disabled -->
<cz-date-picker [disabled]="true" />

<!-- Sizes: sm | md | lg -->
<cz-date-picker [(ngModel)]="date" size="sm" [showIcon]="true" iconDisplay="input" />
<cz-date-picker [(ngModel)]="date" size="lg" [showIcon]="true" iconDisplay="input" />`,
    };

    floatLabelCode: Code = {
        html: `<cz-date-picker label="Over Label" labelPosition="over" [showIcon]="true" iconDisplay="input" />
<cz-date-picker label="In Label" labelPosition="in" [showIcon]="true" iconDisplay="input" />
<cz-date-picker label="Float Label" labelPosition="float" [showIcon]="true" iconDisplay="input" />`,
    };

    fluidTouchCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [fluid]="true" />

<!-- Optimized overlay for touch devices -->
<cz-date-picker [(ngModel)]="date" [touchUI]="true" [readonlyInput]="true" />`,
    };

    templatesCode: Code = {
        html: `<cz-date-picker [(ngModel)]="date" [inline]="true">
    <ng-template #headerTemplate>
        <div class="font-medium">Pick a date</div>
    </ng-template>

    <ng-template #footerTemplate>
        <cz-button label="Today" variant="text" (onClick)="goToday()" />
    </ng-template>
</cz-date-picker>`,
        typescript: `// decadeTemplate, disabledDateTemplate, previousIconTemplate, nextIconTemplate,
// triggerIconTemplate, clearIconTemplate, incrementIconTemplate and decrementIconTemplate
// are also available`,
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-date-picker formControlName="selectedDate" [invalid]="isInvalid('selectedDate')" />
    @if (isInvalid('selectedDate')) {
        <cz-message severity="danger" text="Date is required." />
    }
</form>

<!-- Template-driven forms -->
<cz-date-picker #dp="ngModel" name="dp" [(ngModel)]="date" required
    [invalid]="dp.invalid && dp.touched" />`,
    };
}
