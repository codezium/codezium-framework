import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {
    CzAvatarComponent,
    CzButtonComponent,
    CzListboxComponent,
    CzMessageComponent,
    CzTagComponent,
} from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { LISTBOX_DOC_I18N } from './listbox-doc.i18n';

@Component({
    selector: 'cz-listbox-doc-page',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CzListboxComponent,
        CzAvatarComponent,
        CzButtonComponent,
        CzTagComponent,
        CzMessageComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="listbox">{{ t().title }}</h1>
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
                    <cz-listbox [(ngModel)]="selectedCity" [options]="cities" optionLabel="name" optionValue="code" />
                </div>
                <span class="cz-text-sm">{{ t().selected }}: {{ selectedCity || '-' }}</span>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── MULTIPLE & METAKEY ── -->
            <section>
                <h2 id="multiple">{{ t().multiple }}</h2>
                <p [innerHTML]="t().multipleDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-xl">
                    <div>
                        <strong class="cz-text-sm">{{ t().multiple }}</strong>
                        <cz-listbox [(ngModel)]="selectedCities" [options]="cities" optionLabel="name" optionValue="code"
                            [multiple]="true" [metaKeySelection]="false" />
                        <span class="cz-text-sm">{{ t().selectedCount }}: {{ selectedCities.length }}</span>
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().metaKey }}</strong>
                        <cz-listbox [(ngModel)]="metaCities" [options]="cities" optionLabel="name" optionValue="code"
                            [multiple]="true" [metaKeySelection]="true" />
                    </div>
                </div>
                <app-code [code]="multipleCode" />
            </section>

            <!-- ── CHECKBOX ── -->
            <section>
                <h2 id="checkbox">{{ t().checkbox }}</h2>
                <p [innerHTML]="t().checkboxDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-listbox [(ngModel)]="checkboxCities" [options]="cities" optionLabel="name" optionValue="code"
                        [multiple]="true" [checkbox]="true" />
                </div>
                <app-code [code]="checkboxCode" />
            </section>

            <!-- ── CHECKMARK ── -->
            <section>
                <h2 id="checkmark">{{ t().checkmark }}</h2>
                <p [innerHTML]="t().checkmarkDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-listbox [(ngModel)]="checkmarkCity" [options]="cities" optionLabel="name" optionValue="code"
                        [checkmark]="true" [highlightOnSelect]="false" />
                </div>
                <app-code [code]="checkmarkCode" />
            </section>

            <!-- ── OPTION TEMPLATE ── -->
            <section>
                <h2 id="option">{{ t().option }}</h2>
                <p [innerHTML]="t().optionDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-listbox [(ngModel)]="selectedProduct" [options]="products" optionLabel="name" optionValue="id"
                        scrollHeight="16rem">
                        <ng-template #itemTemplate let-product let-selected="selected">
                            <span class="cz-flex cz-items-center cz-gap-sm cz-w-full">
                                <cz-avatar [image]="product.image" shape="circle" size="sm" [ariaLabel]="product.name" />
                                <span class="cz-flex-1">{{ product.name }}</span>
                                <cz-tag [value]="'$' + product.price" severity="secondary" size="sm" />
                            </span>
                        </ng-template>
                    </cz-listbox>
                </div>
                <app-code [code]="optionCode" />
            </section>

            <!-- ── GROUP ── -->
            <section>
                <h2 id="group">{{ t().group }}</h2>
                <p [innerHTML]="t().groupDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-xl">
                    <cz-listbox [(ngModel)]="groupedCity" [options]="groupedCities" optionLabel="label" optionValue="value"
                        [group]="true" scrollHeight="250px" />
                    <cz-listbox [(ngModel)]="customGroupedCity" [options]="groupedCities" optionLabel="label"
                        optionValue="value" [group]="true" scrollHeight="250px">
                        <ng-template #groupTemplate let-group>
                            <span class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ countryFlags[group.value] }}</span>
                                <span>{{ group.label }}</span>
                            </span>
                        </ng-template>
                    </cz-listbox>
                </div>
                <app-code [code]="groupCode" />
            </section>

            <!-- ── FILTER ── -->
            <section>
                <h2 id="filter">{{ t().filter }}</h2>
                <p [innerHTML]="t().filterDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-xl">
                    <cz-listbox [(ngModel)]="filterCity" [options]="cities" optionLabel="name" optionValue="code"
                        [filter]="true" [filterPlaceholder]="t().searchCity" />
                    <cz-listbox [(ngModel)]="filterStrictCity" [options]="cities" optionLabel="name" optionValue="code"
                        [filter]="true" [filterMatchMode]="'startsWith'" [filterPlaceholder]="t().searchCity" />
                </div>
                <app-code [code]="filterCode" />
            </section>

            <!-- ── STATES ── -->
            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p [innerHTML]="t().statesDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-xl">
                    <cz-listbox [options]="cities" optionLabel="name" optionValue="code" [disabled]="true" />
                    <cz-listbox [(ngModel)]="invalidCity" [options]="cities" optionLabel="name" optionValue="code"
                        [invalid]="!invalidCity" />
                    <cz-listbox [(ngModel)]="disabledOptionCity" [options]="citiesWithDisabled" optionLabel="name"
                        optionValue="code" optionDisabled="disabled" />
                </div>
                <app-code [code]="statesCode" />
            </section>

            <!-- ── FOCUS BEHAVIOR ── -->
            <section>
                <h2 id="focus">{{ t().focus }}</h2>
                <p [innerHTML]="t().focusDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-sm">
                    <cz-button [label]="'autoOptionFocus: ' + autoOptionFocus()" size="sm"
                        [severity]="autoOptionFocus() ? 'primary' : 'secondary'"
                        (onClick)="autoOptionFocus.set(!autoOptionFocus())" />
                    <cz-button [label]="'selectOnFocus: ' + selectOnFocus()" size="sm"
                        [severity]="selectOnFocus() ? 'primary' : 'secondary'"
                        (onClick)="selectOnFocus.set(!selectOnFocus())" />
                    <cz-button [label]="'focusOnHover: ' + focusOnHover()" size="sm"
                        [severity]="focusOnHover() ? 'primary' : 'secondary'"
                        (onClick)="focusOnHover.set(!focusOnHover())" />
                </div>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-listbox [(ngModel)]="focusCity" [options]="cities" optionLabel="name" optionValue="code"
                        [autoOptionFocus]="autoOptionFocus()" [selectOnFocus]="selectOnFocus()"
                        [focusOnHover]="focusOnHover()" />
                </div>
                <app-code [code]="focusCode" />
            </section>

            <!-- ── DRAGDROP ── -->
            <section>
                <h2 id="dragdrop">{{ t().dragdrop }}</h2>
                <p [innerHTML]="t().dragdropDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-listbox [(ngModel)]="dragCity" [options]="dragCities" optionLabel="name" optionValue="code"
                        [dragdrop]="true" />
                </div>
                <app-code [code]="dragdropCode" />
            </section>

            <!-- ── VIRTUAL SCROLL ── -->
            <section>
                <h2 id="virtual">{{ t().virtual }}</h2>
                <p [innerHTML]="t().virtualDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-listbox [(ngModel)]="virtualItems" [options]="manyItems" optionLabel="label" optionValue="value"
                        [multiple]="true" [checkbox]="true" [filter]="true" [virtualScroll]="true"
                        [virtualScrollItemSize]="40" [striped]="true" scrollHeight="250px"
                        [selectAll]="selectAll()" (onSelectAllChange)="onSelectAllChange($event)"
                        (onChange)="onVirtualChange($event)" />
                </div>
                <span class="cz-text-sm">{{ t().selectedCount }}: {{ virtualItems.length }}</span>
                <app-code [code]="virtualCode" />
            </section>

            <!-- ── PREVIEW ── -->
            <section>
                <h2 id="preview">{{ t().preview }}</h2>
                <p [innerHTML]="t().previewDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-gap-sm" style="max-width: 20rem; margin-inline: auto;">
                    <div class="cz-flex cz-items-center cz-justify-between">
                        <strong class="cz-text-sm">{{ t().chooseAirport }}</strong>
                        <span class="cz-text-xs cz-text-muted">{{ airports.length }} {{ t().airports }}</span>
                    </div>
                    <cz-listbox [(ngModel)]="selectedAirport" [options]="airports" optionLabel="name" optionValue="code"
                        scrollHeight="auto">
                        <ng-template #itemTemplate let-airport>
                            <span class="cz-flex cz-items-center cz-justify-between cz-gap-md cz-w-full">
                                <span class="cz-flex cz-items-center cz-gap-sm" style="min-width: 0;">
                                    <cz-avatar [label]="airport.country" shape="circle" size="sm" [ariaLabel]="airport.country" />
                                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ airport.name }}</span>
                                </span>
                                <code class="cz-text-xs cz-p-xs cz-rounded-sm"
                                    style="background: var(--cz-theme-surface-hover); font-family: var(--cz-font-code);">{{ airport.code }}</code>
                            </span>
                        </ng-template>
                    </cz-listbox>
                </div>
                <app-code [code]="previewCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p [innerHTML]="t().formsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 15rem;">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-listbox formControlName="selectedCity" [options]="cities" optionLabel="name" optionValue="code"
                            [invalid]="isInvalid('selectedCity')" />
                        @if (isInvalid('selectedCity')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 15rem;">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-listbox #city="ngModel" name="city" [(ngModel)]="templateCity" [options]="cities"
                            optionLabel="name" optionValue="code" required
                            [invalid]="!!city.invalid && (city.touched || tdForm.submitted)" />
                        @if (!!city.invalid && (city.touched || tdForm.submitted)) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>
                </div>
                <app-code [code]="formsCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
                    <li [innerHTML]="t().a11yItems"></li>
                    <li [innerHTML]="t().a11yKeyboard"></li>
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
                            <tr><td><code>options</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>Items to display.</td></tr>
                            <tr><td><code>optionLabel / optionValue</code></td><td><code>string</code></td><td><code>''</code></td><td>Fields used as the label and the value.</td></tr>
                            <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Allows selecting multiple values.</td></tr>
                            <tr><td><code>checkbox</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders checkboxes per option (multiple mode).</td></tr>
                            <tr><td><code>checkmark</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a checkmark on the selected option.</td></tr>
                            <tr><td><code>highlightOnSelect</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Highlights the selected option.</td></tr>
                            <tr><td><code>metaKeySelection</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Requires Ctrl/Cmd to add to the selection.</td></tr>
                            <tr><td><code>showToggleAll</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Header select-all checkbox (multiple + checkbox).</td></tr>
                            <tr><td><code>selectAll</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether all data is selected (bind with <code>onSelectAllChange</code>).</td></tr>
                            <tr><td><code>filter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays a filter input.</td></tr>
                            <tr><td><code>filterBy / filterFields</code></td><td><code>string</code></td><td><code>optionLabel</code></td><td>Fields searched by the filter.</td></tr>
                            <tr><td><code>filterMatchMode</code></td><td><code>'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notContains' | 'notEquals' | 'gt' | 'gte' | 'lt' | 'lte'</code></td><td><code>'contains'</code></td><td>How the filter matches values.</td></tr>
                            <tr><td><code>filterPlaceholder / ariaFilterLabel</code></td><td><code>string</code></td><td><code>'Search...'</code></td><td>Filter input placeholder and label.</td></tr>
                            <tr><td><code>filterValue</code></td><td><code>string</code></td><td><code>''</code></td><td>Initial filter value.</td></tr>
                            <tr><td><code>group / optionGroupLabel / optionGroupChildren</code></td><td><code>boolean / string / string</code></td><td><code>false / 'label' / 'items'</code></td><td>Grouped options configuration.</td></tr>
                            <tr><td><code>optionDisabled</code></td><td><code>string | (item) =&gt; boolean | null</code></td><td><code>null</code></td><td>Field or function marking options as disabled.</td></tr>
                            <tr><td><code>dataKey</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Property that uniquely identifies an option.</td></tr>
                            <tr><td><code>disabled / readonly / invalid / fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>States.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Component size.</td></tr>
                            <tr><td><code>striped</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Alternating row colors.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string</code></td><td><code>''</code></td><td>Height of the scrollable viewport.</td></tr>
                            <tr><td><code>virtualScroll / virtualScrollItemSize</code></td><td><code>boolean / number</code></td><td><code>false / 36</code></td><td>Virtual scrolling over large data sets.</td></tr>
                            <tr><td><code>dragdrop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Drag and drop reordering.</td></tr>
                            <tr><td><code>autoOptionFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Focuses the first option when the list gets focus.</td></tr>
                            <tr><td><code>selectOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Selects the focused option while navigating.</td></tr>
                            <tr><td><code>focusOnHover</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Moves the focus with mouse hover.</td></tr>
                            <tr><td><code>emptyMessage / emptyFilterMessage</code></td><td><code>string</code></td><td><code>'No results found'</code></td><td>Empty states.</td></tr>
                            <tr><td><code>ariaLabel / id / tabindex / listStyleClass</code></td><td><code>—</code></td><td><code>—</code></td><td>Native attributes and accessibility.</td></tr>
                            <tr><td><code>itemTemplate / groupTemplate / headerTemplate / filterTemplate / footerTemplate / emptyTemplate / emptyFilterTemplate / checkmarkTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Content templates.</td></tr>
                            <tr><td><code>onChange</code></td><td><code>output&lt;&#123; value, originalEvent &#125;&gt;</code></td><td><code>—</code></td><td>Emitted on selection change.</td></tr>
                            <tr><td><code>onClick / onDblClick</code></td><td><code>output&lt;&#123; option, value, index &#125;&gt;</code></td><td><code>—</code></td><td>Option click events.</td></tr>
                            <tr><td><code>onFilter / onFocus / onBlur</code></td><td><code>output</code></td><td><code>—</code></td><td>Filter and focus events.</td></tr>
                            <tr><td><code>onSelectAllChange</code></td><td><code>output&lt;&#123; checked &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when the select-all checkbox is toggled.</td></tr>
                            <tr><td><code>onDrop</code></td><td><code>output&lt;&#123; previousIndex, currentIndex, value &#125;&gt;</code></td><td><code>—</code></td><td>Emitted when an item is dropped (dragdrop).</td></tr>
                            <tr><td><code>updateModel(value, event)</code></td><td><code>method</code></td><td><code>—</code></td><td>Updates the model value and emits the change events.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ListboxDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => LISTBOX_DOC_I18N[this.lang.currentLang()] || LISTBOX_DOC_I18N.es);

    readonly cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
    ];

    readonly citiesWithDisabled = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN', disabled: true },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS', disabled: true },
    ];

    readonly products = [
        { id: 1, name: 'UltraBook Pro', price: 1499, image: '/images/dataview/product-1.svg' },
        { id: 2, name: 'Nova Phone X', price: 999, image: '/images/dataview/product-2.svg' },
        { id: 3, name: 'Pulse Watch S2', price: 349, image: '/images/dataview/product-3.svg' },
        { id: 4, name: 'Echo Headphones', price: 249, image: '/images/dataview/product-4.svg' },
        { id: 5, name: 'VisionCam 4K', price: 549, image: '/images/dataview/product-5.svg' },
        { id: 6, name: 'BoomBox Mini', price: 129, image: '/images/dataview/product-6.svg' },
    ];

    readonly groupedCities = [
        {
            label: 'Germany',
            value: 'de',
            items: [
                { label: 'Berlin', value: 'Berlin' },
                { label: 'Frankfurt', value: 'Frankfurt' },
                { label: 'Hamburg', value: 'Hamburg' },
                { label: 'Munich', value: 'Munich' },
            ],
        },
        {
            label: 'USA',
            value: 'us',
            items: [
                { label: 'Chicago', value: 'Chicago' },
                { label: 'Los Angeles', value: 'Los Angeles' },
                { label: 'New York', value: 'New York' },
                { label: 'San Francisco', value: 'San Francisco' },
            ],
        },
        {
            label: 'Japan',
            value: 'jp',
            items: [
                { label: 'Kyoto', value: 'Kyoto' },
                { label: 'Osaka', value: 'Osaka' },
                { label: 'Tokyo', value: 'Tokyo' },
                { label: 'Yokohama', value: 'Yokohama' },
            ],
        },
    ];

    readonly countryFlags: Record<string, string> = { de: '🇩🇪', us: '🇺🇸', jp: '🇯🇵' };

    readonly manyItems = Array.from({ length: 10000 }, (_, i) => ({ label: `Item #${i}`, value: i }));

    readonly airports = [
        { name: 'John F. Kennedy', code: 'JFK', country: 'US' },
        { name: 'Heathrow', code: 'LHR', country: 'GB' },
        { name: 'Charles de Gaulle', code: 'CDG', country: 'FR' },
        { name: 'Frankfurt', code: 'FRA', country: 'DE' },
        { name: 'Schiphol', code: 'AMS', country: 'NL' },
        { name: 'Istanbul', code: 'IST', country: 'TR' },
        { name: 'Dubai', code: 'DXB', country: 'AE' },
        { name: 'Changi', code: 'SIN', country: 'SG' },
        { name: 'Haneda', code: 'HND', country: 'JP' },
    ];

    selectedCity: any;
    selectedCities: any[] = [];
    metaCities: any[] = [];
    checkboxCities: any[] = [];
    checkmarkCity: any;
    selectedProduct: any;
    groupedCity: any;
    customGroupedCity: any;
    filterCity: any;
    filterStrictCity: any;
    invalidCity: any;
    disabledOptionCity: any;
    focusCity: any;
    dragCity: any;
    dragCities = [...this.cities];
    virtualItems: any[] = [];
    selectedAirport: any;
    templateCity: any;

    readonly autoOptionFocus = signal(true);
    readonly selectOnFocus = signal(false);
    readonly focusOnHover = signal(true);
    readonly selectAll = signal(false);

    readonly exampleForm = new FormGroup({
        selectedCity: new FormControl('', Validators.required),
    });
    formSubmitted = false;

    onSelectAllChange(event: { checked: boolean }): void {
        this.selectAll.set(event.checked);
    }

    onVirtualChange(event: { value: any[] }): void {
        this.selectAll.set(Array.isArray(event.value) && event.value.length === this.manyItems.length);
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
        typescript: `import { CzListboxComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-listbox [(ngModel)]="selectedCity" [options]="cities" optionLabel="name" optionValue="code" />`,
        typescript: `cities = [{ name: 'New York', code: 'NY' }, ...];`,
    };

    multipleCode: Code = {
        html: `<!-- Multiple: each click toggles -->
<cz-listbox [(ngModel)]="selectedCities" [options]="cities" optionLabel="name" optionValue="code"
    [multiple]="true" [metaKeySelection]="false" />

<!-- MetaKey: Ctrl/Cmd keeps existing selections -->
<cz-listbox [(ngModel)]="selectedCities" [options]="cities" optionLabel="name" optionValue="code"
    [multiple]="true" [metaKeySelection]="true" />`,
    };

    checkboxCode: Code = {
        html: `<!-- Checkboxes + header select-all (showToggleAll) -->
<cz-listbox [(ngModel)]="selected" [options]="cities" optionLabel="name" optionValue="code"
    [multiple]="true" [checkbox]="true" [showToggleAll]="true" />`,
    };

    checkmarkCode: Code = {
        html: `<!-- Checkmark-only styling -->
<cz-listbox [(ngModel)]="selected" [options]="cities" optionLabel="name" optionValue="code"
    [checkmark]="true" [highlightOnSelect]="false" />`,
    };

    optionCode: Code = {
        html: `<cz-listbox [(ngModel)]="selectedProduct" [options]="products" optionLabel="name" optionValue="id">
    <ng-template #itemTemplate let-product let-selected="selected">
        <cz-avatar [image]="product.image" shape="circle" size="sm" />
        <span>{{ product.name }}</span>
        <cz-tag [value]="'$' + product.price" severity="secondary" size="sm" />
    </ng-template>
</cz-listbox>`,
    };

    groupCode: Code = {
        html: `<!-- Grouped options -->
<cz-listbox [(ngModel)]="selected" [options]="groupedCities" optionLabel="label" optionValue="value"
    [group]="true" scrollHeight="250px" />

<!-- Custom group header -->
<cz-listbox [(ngModel)]="selected" [options]="groupedCities" optionLabel="label" optionValue="value" [group]="true">
    <ng-template #groupTemplate let-group>
        <span>{{ countryFlags[group.value] }} {{ group.label }}</span>
    </ng-template>
</cz-listbox>`,
        typescript: `groupedCities = [{ label: 'Germany', value: 'de', items: [{ label: 'Berlin', value: 'Berlin' }] }];`,
    };

    filterCode: Code = {
        html: `<cz-listbox [options]="cities" [filter]="true" filterPlaceholder="Search city" ... />

<!-- Match mode -->
<cz-listbox [options]="cities" [filter]="true" [filterMatchMode]="'startsWith'" ... />`,
        typescript: `// filterBy / filterFields select the searched fields (defaults to optionLabel)`,
    };

    statesCode: Code = {
        html: `<!-- Disabled -->
<cz-listbox [options]="cities" [disabled]="true" />

<!-- Invalid -->
<cz-listbox [options]="cities" [invalid]="!value" />

<!-- Disabled options by field -->
<cz-listbox [options]="cities" optionDisabled="disabled" />`,
    };

    focusCode: Code = {
        html: `<cz-listbox
    [options]="cities"
    [autoOptionFocus]="autoOptionFocus"
    [selectOnFocus]="selectOnFocus"
    [focusOnHover]="focusOnHover"
/>`,
    };

    dragdropCode: Code = {
        html: `<!-- Reorder items with drag and drop -->
<cz-listbox [options]="cities" [dragdrop]="true" (onDrop)="onDrop($event)" />`,
        typescript: `// onDrop: { previousIndex, currentIndex, value }`,
    };

    virtualCode: Code = {
        html: `<cz-listbox
    [options]="items"
    [multiple]="true"
    [checkbox]="true"
    [filter]="true"
    [virtualScroll]="true"
    [virtualScrollItemSize]="40"
    [striped]="true"
    scrollHeight="250px"
    [selectAll]="selectAll"
    (onSelectAllChange)="onSelectAllChange($event)"
    (onChange)="onChange($event)"
/>`,
        typescript: `items = Array.from({ length: 100000 }, (_, i) => ({ label: 'Item #' + i, value: i }));

onSelectAllChange(event: { checked: boolean }): void {
    this.selectedItems = event.checked ? [...this.items] : [];
    this.selectAll = event.checked;
}`,
    };

    previewCode: Code = {
        html: `<cz-listbox [(ngModel)]="selectedAirport" [options]="airports" optionLabel="name" optionValue="code">
    <ng-template #itemTemplate let-airport>
        <cz-avatar [label]="airport.country" shape="circle" size="sm" />
        <span>{{ airport.name }}</span>
        <code>{{ airport.code }}</code>
    </ng-template>
</cz-listbox>`,
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-listbox formControlName="selectedCity" [options]="cities" [invalid]="isInvalid('selectedCity')" />
    @if (isInvalid('selectedCity')) {
        <cz-message severity="danger" text="City is required." />
    }
</form>

<!-- Template-driven forms -->
<cz-listbox #city="ngModel" name="city" [(ngModel)]="selectedCity" required
    [invalid]="city.invalid && city.touched" [options]="cities" />`,
    };
}
