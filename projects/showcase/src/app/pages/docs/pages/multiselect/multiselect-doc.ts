import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    CzMultiSelectComponent,
    CzButtonComponent,
    CzMessageComponent,
    CzToastService,
    CzMultiSelectLazyLoadEvent,
    CzMultiSelectSelectAllChangeEvent
} from 'codezium-ui';
import { LucideDynamicIcon, LucideMap, LucideMapPin, LucidePlus } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { MULTISELECT_DOC_I18N } from './multiselect-doc.i18n';

interface City { name: string; code: string }

@Component({
    selector: 'cz-multiselect-doc-page',
    imports: [
        CommonModule, LucideDynamicIcon, CzMultiSelectComponent, CzButtonComponent, CzMessageComponent,
        AppCodeComponent, ReactiveFormsModule, FormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="multiselect">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().description }}</p>

            <!-- ── IMPORT ── -->
            <section>
                <h2 id="import">{{ t().import }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="selectedCities" optionLabel="name"
                        [placeholder]="t().selectCities" [maxSelectedLabels]="3" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── CHIPS ── -->
            <section>
                <h2 id="chips">{{ t().chips }}</h2>
                <p>{{ t().chipsDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="chipCities" [placeholder]="t().selectCities"
                        optionLabel="name" display="chip" [showClear]="true" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="chipsCode" />
            </section>

            <!-- ── CLEAR ── -->
            <section>
                <h2 id="clear">{{ t().clear }}</h2>
                <p>{{ t().clearDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="clearCities" optionLabel="name"
                        [placeholder]="t().selectCities" [maxSelectedLabels]="3" [showClear]="true"
                        style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="clearCode" />
            </section>

            <!-- ── DISABLED ── -->
            <section>
                <h2 id="disabled">{{ t().disabled }}</h2>
                <p>{{ t().disabledDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="cities" [ngModel]="[cities[0], cities[1]]" [disabled]="true"
                        optionLabel="name" [placeholder]="t().selectCities" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="disabledCode" />
            </section>

            <!-- ── FILLED ── -->
            <section>
                <h2 id="filled">{{ t().filled }}</h2>
                <p>{{ t().filledDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="filledCities" variant="filled" optionLabel="name"
                        [placeholder]="t().selectCities" [maxSelectedLabels]="3" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="filledCode" />
            </section>

            <!-- ── FILTER ── -->
            <section>
                <h2 id="filter">{{ t().filter }}</h2>
                <p>{{ t().filterDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="filterCities" [filter]="true" optionLabel="name"
                        [placeholder]="t().selectCities" [maxSelectedLabels]="3" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="filterCode" />
            </section>

            <!-- ── FLOAT LABEL ── -->
            <section>
                <h2 id="floatlabel">{{ t().floatLabel }}</h2>
                <p>{{ t().floatLabelDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-items-end cz-gap-lg cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="floatCities1" optionLabel="name" label="Over Label"
                        labelPosition="over" [filter]="true" [maxSelectedLabels]="3" style="max-width: 18rem; width: 100%" />
                    <cz-multiselect [options]="cities" [(ngModel)]="floatCities2" optionLabel="name" label="In Label"
                        labelPosition="in" [filter]="true" [maxSelectedLabels]="3" style="max-width: 18rem; width: 100%" />
                    <cz-multiselect [options]="cities" [(ngModel)]="floatCities3" optionLabel="name" label="Float Label"
                        labelPosition="float" [filter]="true" [maxSelectedLabels]="3" style="max-width: 18rem; width: 100%" />
                </div>
                <app-code [code]="floatLabelCode" />
            </section>

            <!-- ── FLUID ── -->
            <section>
                <h2 id="fluid">{{ t().fluid }}</h2>
                <p>{{ t().fluidDesc }}</p>
                <cz-multiselect [options]="cities" [(ngModel)]="fluidCities" optionLabel="name"
                    [placeholder]="t().selectCities" [maxSelectedLabels]="3" [fluid]="true" class="cz-mb-md" />
                <app-code [code]="fluidCode" />
            </section>

            <!-- ── GROUP ── -->
            <section>
                <h2 id="group">{{ t().group }}</h2>
                <p>{{ t().groupDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="groupedCities" [group]="true" [(ngModel)]="groupCities"
                        [placeholder]="t().selectCities" scrollHeight="250px" display="chip" style="max-width: 20rem; width: 100%">
                        <ng-template #groupTemplate let-group>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ countryFlags[group.value] }}</span>
                                <span>{{ group.label }}</span>
                            </div>
                        </ng-template>
                    </cz-multiselect>
                </div>
                <app-code [code]="groupCode" />
            </section>

            <!-- ── IFTA LABEL ── -->
            <section>
                <h2 id="iftalabel">{{ t().iftaLabel }}</h2>
                <p>{{ t().iftaLabelDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="iftaCities" optionLabel="name" label="Cities"
                        labelPosition="in" [filter]="true" [maxSelectedLabels]="3" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="iftaLabelCode" />
            </section>

            <!-- ── INVALID ── -->
            <section>
                <h2 id="invalid">{{ t().invalid }}</h2>
                <p>{{ t().invalidDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-lg cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="invalidCities1" [invalid]="true" optionLabel="name"
                        [placeholder]="t().selectCities" [maxSelectedLabels]="3" style="max-width: 18rem; width: 100%" />
                    <cz-multiselect [options]="cities" [(ngModel)]="invalidCities2" [invalid]="true" optionLabel="name"
                        [placeholder]="t().selectCities" [maxSelectedLabels]="3" variant="filled" style="max-width: 18rem; width: 100%" />
                </div>
                <app-code [code]="invalidCode" />
            </section>

            <!-- ── LOADING STATE ── -->
            <section>
                <h2 id="loadingstate">{{ t().loadingState }}</h2>
                <p>{{ t().loadingStateDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="loadingCities" [loading]="true" optionLabel="name"
                        [placeholder]="t().loading" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="loadingStateCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p>{{ t().formsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="cz-flex cz-flex-col cz-gap-sm" style="width: 18rem">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-multiselect [options]="cities" formControlName="cities" optionLabel="name"
                            [placeholder]="t().selectCities" [maxSelectedLabels]="3" [fluid]="true" [invalid]="isInvalid('cities')" />
                        @if (isInvalid('cities')) {
                            <cz-message severity="danger" [text]="t().citiesRequired" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)" class="cz-flex cz-flex-col cz-gap-sm" style="width: 18rem">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-multiselect #citiesModel="ngModel" name="cities" [(ngModel)]="templateCities" [options]="cities"
                            optionLabel="name" [placeholder]="t().selectCities" [maxSelectedLabels]="3" required [fluid]="true"
                            [invalid]="!!(citiesModel.invalid && (citiesModel.touched || tdForm.submitted))" />
                        @if (citiesModel.invalid && (citiesModel.touched || tdForm.submitted)) {
                            <cz-message severity="danger" [text]="t().citiesRequired" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>
                </div>
                <app-code [code]="formsCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p>{{ t().sizesDesc }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-gap-lg cz-mb-md">
                    <cz-multiselect [(ngModel)]="sizeCities1" [options]="cities" optionLabel="name" [maxSelectedLabels]="3"
                        size="sm" [placeholder]="t().small" style="max-width: 20rem; width: 100%" />
                    <cz-multiselect [(ngModel)]="sizeCities2" [options]="cities" optionLabel="name" [maxSelectedLabels]="3"
                        [placeholder]="t().normal" style="max-width: 20rem; width: 100%" />
                    <cz-multiselect [(ngModel)]="sizeCities3" [options]="cities" optionLabel="name" [maxSelectedLabels]="3"
                        size="lg" [placeholder]="t().large" style="max-width: 20rem; width: 100%" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p>{{ t().templateDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="countries" [(ngModel)]="selectedCountries" [placeholder]="t().selectCountries"
                        optionLabel="name" display="chip" [filter]="true" style="max-width: 20rem; width: 100%">
                        <ng-template #itemTemplate let-country>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ countryFlags[country.code] }}</span>
                                <span>{{ country.name }}</span>
                            </div>
                        </ng-template>
                        <ng-template #dropdownIconTemplate>
                            <svg [lucideIcon]="MapIcon" [size]="18"></svg>
                        </ng-template>
                        <ng-template #filterIconTemplate>
                            <svg [lucideIcon]="MapPinIcon" [size]="14"></svg>
                        </ng-template>
                        <ng-template #headerTemplate>
                            <div class="cz-font-medium">{{ t().availableCountries }}</div>
                        </ng-template>
                        <ng-template #footerTemplate>
                            <div class="cz-flex cz-justify-between">
                                <cz-button [label]="t().addNew" severity="secondary" variant="text" size="sm" [icon]="PlusIcon" />
                                <cz-button [label]="t().removeAll" severity="danger" variant="text" size="sm" (onClick)="selectedCountries.set([])" />
                            </div>
                        </ng-template>
                    </cz-multiselect>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── VIRTUAL SCROLL ── -->
            <section>
                <h2 id="virtualscroll">{{ t().virtualScroll }}</h2>
                <p>{{ t().virtualScrollDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-multiselect [options]="virtualItems" [showToggleAll]="true" [selectAll]="selectAllVirtual()"
                        [(ngModel)]="selectedVirtualItems" optionLabel="label" [virtualScroll]="true" [virtualScrollItemSize]="43"
                        [placeholder]="t().selectItems" (onSelectAllChange)="onSelectAllChange($event)" [maxSelectedLabels]="3"
                        style="max-width: 20rem; width: 100%">
                        <ng-template #headerCheckboxIconTemplate let-allSelected="checked" let-partialSelected="partialSelected">
                            @if (allSelected) {
                                <span class="cz-select-doc-check">✓</span>
                            } @else if (partialSelected) {
                                <span class="cz-select-doc-check">−</span>
                            } @else {
                                <span class="cz-select-doc-check"></span>
                            }
                        </ng-template>
                    </cz-multiselect>
                </div>
                <app-code [code]="virtualScrollCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <h3 id="screenreader">{{ t().screenReader }}</h3>
                <p>{{ t().screenReaderDesc }}</p>
                <h3 id="keyboardsupport">{{ t().keyboardSupport }}</h3>
                <p>{{ t().keyboardDesc }}</p>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Key</th><th>Function</th></tr></thead>
                        <tbody>
                            <tr><td><code>tab</code></td><td>{{ t().keyTab }}</td></tr>
                            <tr><td><code>enter</code> <code>space</code></td><td>{{ t().keyEnter }}</td></tr>
                            <tr><td><code>escape</code></td><td>{{ t().keyEscape }}</td></tr>
                            <tr><td><code>down arrow</code> <code>up arrow</code></td><td>{{ t().keyArrows }}</td></tr>
                            <tr><td><code>backspace</code></td><td>{{ t().keyBackspace }}</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labels }}</h2>
                <p>{{ t().labelsDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-multiselect [options]="cities" [(ngModel)]="labelCities" optionLabel="name" [label]="t().labelFloat"
                        labelPosition="float" />
                    <cz-multiselect [options]="cities" [(ngModel)]="labelCities" optionLabel="name" [label]="t().labelOver"
                        labelPosition="over" />
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().neoTheme }} / {{ t().glassTheme }}</h2>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Neo Theme</small>
                        <cz-multiselect [options]="cities" [(ngModel)]="themeCities" optionLabel="name"
                            [placeholder]="t().selectCities" display="chip" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg cz-bg-dark" data-theme="glass">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Glass Theme</small>
                        <cz-multiselect [options]="cities" [(ngModel)]="themeCities" optionLabel="name"
                            [placeholder]="t().selectCities" display="chip" />
                    </div>
                </div>
                <app-code [code]="themesCode" />
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">API</h2>
                <h3 id="props">{{ t().props }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>options</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>An array of objects to display as the available options.</td></tr>
                            <tr><td><code>optionLabel / optionValue / optionDisabled</code></td><td><code>string | (item) =&gt; boolean</code></td><td><code>''</code></td><td>Field names for the option label, value and disabled state.</td></tr>
                            <tr><td><code>display</code></td><td><code>'comma' | 'chip'</code></td><td><code>'comma'</code></td><td>Defines how the selected items are displayed.</td></tr>
                            <tr><td><code>maxSelectedLabels</code></td><td><code>number</code></td><td><code>3</code></td><td>Decides how many selected item labels to show at most.</td></tr>
                            <tr><td><code>selectedItemsLabel</code></td><td><code>string</code></td><td><code>'&#123;0&#125; items selected'</code></td><td>Label to display after exceeding max selected labels; <code>&#123;0&#125;</code> is replaced with the count.</td></tr>
                            <tr><td><code>displaySelectedLabel</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to show labels of selected items or use the placeholder.</td></tr>
                            <tr><td><code>selectionLimit</code></td><td><code>number</code></td><td><code>undefined</code></td><td>Maximum number of selectable items.</td></tr>
                            <tr><td><code>showToggleAll</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to show the checkbox at header to toggle all items at once.</td></tr>
                            <tr><td><code>showHeader</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to show the header.</td></tr>
                            <tr><td><code>selectAll</code></td><td><code>boolean | null</code></td><td><code>null</code></td><td>When bound, the select-all checkbox delegates the logic to onSelectAllChange.</td></tr>
                            <tr><td><code>filter / filterBy / filterPlaceholder / filterMatchMode</code></td><td><code>—</code></td><td><code>false / '' / 'Search...' / 'contains'</code></td><td>Built-in filtering configuration.</td></tr>
                            <tr><td><code>group / optionGroupLabel / optionGroupChildren</code></td><td><code>—</code></td><td><code>false / 'label' / 'items'</code></td><td>Grouped options configuration.</td></tr>
                            <tr><td><code>showClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When enabled, a clear icon is displayed to clear the value.</td></tr>
                            <tr><td><code>loading / loadingIcon</code></td><td><code>boolean / LucideIconInput</code></td><td><code>false</code></td><td>Loading state and custom icon.</td></tr>
                            <tr><td><code>virtualScroll / virtualScrollItemSize</code></td><td><code>boolean / number</code></td><td><code>false / 34</code></td><td>Virtual scrolling configuration.</td></tr>
                            <tr><td><code>lazy</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Defines if data is loaded and interacted with in lazy manner.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string</code></td><td><code>'200px'</code></td><td>Height of the list viewport.</td></tr>
                            <tr><td><code>resetFilterOnHide</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Clears the filter value when hiding the panel.</td></tr>
                            <tr><td><code>focusOnHover / selectOnFocus / autoOptionFocus / autofocusFilter</code></td><td><code>boolean</code></td><td><code>true / false / false / false</code></td><td>Focus behavior configuration.</td></tr>
                            <tr><td><code>invalid / disabled / readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Component states.</td></tr>
                            <tr><td><code>variant</code></td><td><code>'outlined' | 'filled'</code></td><td><code>'outlined'</code></td><td>Input variant.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Size of the component.</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Spans 100% width of the container.</td></tr>
                            <tr><td><code>placeholder / name / inputId / tabindex / autofocus</code></td><td><code>—</code></td><td><code>—</code></td><td>Native and accessibility attributes.</td></tr>
                            <tr><td><code>ariaLabel / ariaLabelledBy</code></td><td><code>string</code></td><td><code>null</code></td><td>Accessibility labels.</td></tr>
                            <tr><td><code>panelStyleClass / zIndex</code></td><td><code>string / CzOverlayZIndex</code></td><td><code>'' / null</code></td><td>Overlay customization.</td></tr>
                            <tr><td><code>label / labelPosition / color</code></td><td><code>—</code></td><td><code>—</code></td><td>Codezium extras (inline labels and color variants).</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="emits">{{ t().emits }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>onChange</code></td><td><code>CzMultiSelectChangeEvent</code></td><td>Callback to invoke when the value changes.</td></tr>
                            <tr><td><code>onFilter</code></td><td><code>CzMultiSelectFilterEvent</code></td><td>Callback to invoke when data is filtered.</td></tr>
                            <tr><td><code>onFocus / onBlur</code></td><td><code>Event</code></td><td>Focus events.</td></tr>
                            <tr><td><code>onClick</code></td><td><code>MouseEvent</code></td><td>Callback to invoke when the component is clicked.</td></tr>
                            <tr><td><code>onClear</code></td><td><code>Event</code></td><td>Callback to invoke when the input is cleared.</td></tr>
                            <tr><td><code>onPanelShow / onPanelHide</code></td><td><code>Event</code></td><td>Callback to invoke when the overlay becomes visible or hidden.</td></tr>
                            <tr><td><code>onLazyLoad</code></td><td><code>CzMultiSelectLazyLoadEvent</code></td><td>Callback to invoke in lazy mode to load new data.</td></tr>
                            <tr><td><code>onRemove</code></td><td><code>CzMultiSelectRemoveEvent</code></td><td>Callback to invoke when an item is removed.</td></tr>
                            <tr><td><code>onSelectAllChange</code></td><td><code>CzMultiSelectSelectAllChangeEvent</code></td><td>Callback to invoke when all data is selected.</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="templates">{{ t().templates }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Context</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>#itemTemplate</code></td><td><code>let-option</code></td><td>Custom option content.</td></tr>
                            <tr><td><code>#groupTemplate</code></td><td><code>let-group</code></td><td>Custom group header.</td></tr>
                            <tr><td><code>#selectedItemsTemplate</code></td><td><code>let-selected</code></td><td>Custom selected items area (value array).</td></tr>
                            <tr><td><code>#headerTemplate / #footerTemplate</code></td><td>—</td><td>Custom header and footer.</td></tr>
                            <tr><td><code>#filterTemplate</code></td><td><code>let-options="options"</code></td><td>Custom filter input (<code>options.filter(event)</code>, <code>options.reset()</code>).</td></tr>
                            <tr><td><code>#emptyTemplate / #emptyFilterTemplate</code></td><td>—</td><td>Custom empty states.</td></tr>
                            <tr><td><code>#dropdownIconTemplate / #clearIconTemplate / #filterIconTemplate / #chipIconTemplate / #removeTokenIconTemplate / #loadingIconTemplate</code></td><td>—</td><td>Custom icons.</td></tr>
                            <tr><td><code>#headerCheckboxIconTemplate / #itemCheckboxIconTemplate</code></td><td><code>&#123; checked, partialSelected, class &#125;</code></td><td>Custom checkbox icons.</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="methods">{{ t().methods }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>updateModel(value, event?)</code></td><td>Updates the model value.</td></tr>
                            <tr><td><code>show() / hide()</code></td><td>Displays or hides the panel.</td></tr>
                            <tr><td><code>focus()</code></td><td>Applies focus to the trigger.</td></tr>
                            <tr><td><code>clear(event?) / resetFilter()</code></td><td>Clears the value or resets the filter.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class MultiSelectDocPage {
    private readonly langService = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => MULTISELECT_DOC_I18N[this.langService.currentLang()] || MULTISELECT_DOC_I18N.es);

    readonly MapIcon = LucideMap;
    readonly MapPinIcon = LucideMapPin;
    readonly PlusIcon = LucidePlus;

    readonly cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
    ];

    readonly countries = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' },
    ];

    readonly countryFlags: Record<string, string> = {
        AU: '🇦🇺', BR: '🇧🇷', CN: '🇨🇳', EG: '🇪🇬', FR: '🇫🇷', DE: '🇩🇪', IN: '🇮🇳', JP: '🇯🇵', ES: '🇪🇸', US: '🇺🇸',
    };

    readonly groupedCities = [
        {
            label: 'Germany', value: 'de',
            items: [
                { label: 'Berlin', value: 'Berlin' },
                { label: 'Frankfurt', value: 'Frankfurt' },
                { label: 'Hamburg', value: 'Hamburg' },
                { label: 'Munich', value: 'Munich' },
            ],
        },
        {
            label: 'USA', value: 'us',
            items: [
                { label: 'Chicago', value: 'Chicago' },
                { label: 'Los Angeles', value: 'Los Angeles' },
                { label: 'New York', value: 'New York' },
                { label: 'San Francisco', value: 'San Francisco' },
            ],
        },
        {
            label: 'Japan', value: 'jp',
            items: [
                { label: 'Kyoto', value: 'Kyoto' },
                { label: 'Osaka', value: 'Osaka' },
                { label: 'Tokyo', value: 'Tokyo' },
                { label: 'Yokohama', value: 'Yokohama' },
            ],
        },
    ];

    readonly virtualItems = Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i }));

    // Demo state
    selectedCities: City[] = [];
    chipCities: City[] = [];
    clearCities: City[] = [];
    filledCities: City[] = [];
    filterCities: City[] = [];
    floatCities1: City[] = [];
    floatCities2: City[] = [];
    floatCities3: City[] = [];
    fluidCities: City[] = [];
    groupCities: City[] = [];
    iftaCities: City[] = [];
    invalidCities1: City[] = [];
    invalidCities2: City[] = [];
    loadingCities: City[] = [];
    templateCities: City[] | undefined;
    sizeCities1: City[] = [];
    sizeCities2: City[] = [];
    sizeCities3: City[] = [];
    selectedCountries = signal<any[]>([]);
    selectedVirtualItems: any[] = [];
    selectAllVirtual = signal(false);
    labelCities: City[] = [];
    themeCities: City[] = [];

    readonly exampleForm = new FormGroup({
        cities: new FormControl<City[]>([], Validators.required),
    });
    formSubmitted = false;

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.toast.success(this.t().formSubmitted, 'MultiSelect');
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid && this.templateCities?.length) {
            this.toast.success(this.t().formSubmitted, 'MultiSelect');
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    onSelectAllChange(event: CzMultiSelectSelectAllChangeEvent): void {
        this.selectedVirtualItems = event.checked ? [...this.virtualItems] : [];
        this.selectAllVirtual.set(event.checked);
    }

    onLazyLoad(_event: CzMultiSelectLazyLoadEvent): void {
        // Load data on demand here
    }

    importCode: Code = {
        typescript: `import { CzMultiSelectComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="selectedCities" optionLabel="name"
    placeholder="Select Cities" [maxSelectedLabels]="3" />`,
        typescript: `cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' }
];
selectedCities: City[] = [];`
    };

    chipsCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="selectedCities" placeholder="Select Cities"
    optionLabel="name" display="chip" [showClear]="true" />`
    };

    clearCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="selectedCities" optionLabel="name"
    placeholder="Select Cities" [maxSelectedLabels]="3" [showClear]="true" />`
    };

    disabledCode: Code = {
        html: `<cz-multiselect [options]="cities" [ngModel]="selectedCities" [disabled]="true"
    optionLabel="name" placeholder="Select Cities" />`
    };

    filledCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="selectedCities" variant="filled"
    optionLabel="name" placeholder="Select Cities" [maxSelectedLabels]="3" />`
    };

    filterCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="selectedCities" [filter]="true"
    optionLabel="name" placeholder="Select Cities" [maxSelectedLabels]="3" />`
    };

    floatLabelCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="value1" optionLabel="name" label="Over Label"
    labelPosition="over" [filter]="true" [maxSelectedLabels]="3" />
<cz-multiselect [options]="cities" [(ngModel)]="value2" optionLabel="name" label="In Label"
    labelPosition="in" [filter]="true" [maxSelectedLabels]="3" />
<cz-multiselect [options]="cities" [(ngModel)]="value3" optionLabel="name" label="Float Label"
    labelPosition="float" [filter]="true" [maxSelectedLabels]="3" />`
    };

    fluidCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="selectedCities" optionLabel="name"
    placeholder="Select Cities" [maxSelectedLabels]="3" [fluid]="true" />`
    };

    groupCode: Code = {
        html: `<cz-multiselect [options]="groupedCities" [group]="true" [(ngModel)]="selectedCities"
    placeholder="Select Cities" scrollHeight="250px" display="chip">
    <ng-template #groupTemplate let-group>
        <div class="flex items-center gap-2">
            <span>{{ countryFlags[group.value] }}</span>
            <span>{{ group.label }}</span>
        </div>
    </ng-template>
</cz-multiselect>`
    };

    iftaLabelCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="selectedCities" optionLabel="name"
    label="Cities" labelPosition="in" [filter]="true" [maxSelectedLabels]="3" />`
    };

    invalidCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="value1" [invalid]="true" optionLabel="name"
    placeholder="Select Cities" [maxSelectedLabels]="3" />
<cz-multiselect [options]="cities" [(ngModel)]="value2" [invalid]="true" optionLabel="name"
    placeholder="Select Cities" [maxSelectedLabels]="3" variant="filled" />`
    };

    loadingStateCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="selectedCities" [loading]="true"
    optionLabel="name" placeholder="Loading..." />`
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-multiselect [options]="cities" formControlName="cities" optionLabel="name"
        placeholder="Select Cities" [maxSelectedLabels]="3" [fluid]="true" [invalid]="isInvalid('cities')" />
    @if (isInvalid('cities')) {
        <cz-message severity="danger" text="Cities are required." />
    }
    <cz-button label="Submit" type="submit" />
</form>

<!-- Template-driven forms -->
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
    <cz-multiselect #cities="ngModel" name="cities" [(ngModel)]="value" [options]="cities"
        optionLabel="name" required [maxSelectedLabels]="3" [fluid]="true"
        [invalid]="!!(cities.invalid && (cities.touched || form.submitted))" />
</form>`
    };

    sizesCode: Code = {
        html: `<cz-multiselect [(ngModel)]="value1" [options]="cities" optionLabel="name" [maxSelectedLabels]="3" size="sm" placeholder="Small" />
<cz-multiselect [(ngModel)]="value2" [options]="cities" optionLabel="name" [maxSelectedLabels]="3" placeholder="Normal" />
<cz-multiselect [(ngModel)]="value3" [options]="cities" optionLabel="name" [maxSelectedLabels]="3" size="lg" placeholder="Large" />`
    };

    templateCode: Code = {
        html: `<cz-multiselect [options]="countries" [(ngModel)]="selectedCountries" placeholder="Select Countries"
    optionLabel="name" display="chip" [filter]="true">
    <ng-template #itemTemplate let-country>
        <div class="flex items-center gap-2">
            <span>{{ countryFlags[country.code] }}</span>
            <span>{{ country.name }}</span>
        </div>
    </ng-template>
    <ng-template #dropdownIconTemplate><svg [lucideIcon]="MapIcon" [size]="18"></svg></ng-template>
    <ng-template #filterIconTemplate><svg [lucideIcon]="MapPinIcon" [size]="14"></svg></ng-template>
    <ng-template #headerTemplate><div class="font-medium">Available Countries</div></ng-template>
    <ng-template #footerTemplate>...</ng-template>
</cz-multiselect>`
    };

    virtualScrollCode: Code = {
        html: `<cz-multiselect [options]="items" [showToggleAll]="true" [selectAll]="selectAll()"
    [(ngModel)]="selectedItems" optionLabel="label" [virtualScroll]="true" [virtualScrollItemSize]="43"
    placeholder="Select Items" (onSelectAllChange)="onSelectAllChange($event)" [maxSelectedLabels]="3">
    <ng-template #headerCheckboxIconTemplate let-allSelected="checked" let-partialSelected="partialSelected">
        ...
    </ng-template>
</cz-multiselect>`,
        typescript: `items = Array.from({ length: 100000 }, (_, i) => ({ label: 'Item #' + i, value: i }));

onSelectAllChange(event: CzMultiSelectSelectAllChangeEvent) {
    this.selectedItems = event.checked ? [...this.items] : [];
    this.selectAll.set(event.checked);
}`
    };

    labelsCode: Code = {
        html: `<cz-multiselect [options]="cities" [(ngModel)]="value" optionLabel="name"
    label="Cities" labelPosition="float" />
<cz-multiselect [options]="cities" [(ngModel)]="value" optionLabel="name"
    label="Cities" labelPosition="over" />`
    };

    themesCode: Code = {
        html: `<div data-theme="neo">
    <cz-multiselect [options]="cities" [(ngModel)]="value" optionLabel="name"
        placeholder="Select Cities" display="chip" />
</div>

<div data-theme="glass">
    <cz-multiselect [options]="cities" [(ngModel)]="value" optionLabel="name"
        placeholder="Select Cities" display="chip" />
</div>`
    };
}
