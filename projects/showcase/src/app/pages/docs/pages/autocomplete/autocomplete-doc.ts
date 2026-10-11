import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {
    CzAutocompleteComponent,
    CzAvatarComponent,
    CzButtonComponent,
    CzIconComponent,
    CzInputGroupAddonComponent,
    CzInputGroupComponent,
    CzMessageComponent,
    CzTagComponent,
} from 'codezium-ui';
import { LucidePlus, LucideX } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { AUTOCOMPLETE_DOC_I18N } from './autocomplete-doc.i18n';

interface Command { label: string; shortcut: string; }
interface Country { name: string; code: string; }
interface TeamMember { id: number; name: string; role: string; avatar: string; statusClass: string; }
interface TechGroup { label: string; code: string; items: { label: string; value: string }[]; }

@Component({
    selector: 'cz-autocomplete-doc-page',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CzAutocompleteComponent,
        CzAvatarComponent,
        CzButtonComponent,
        CzTagComponent,
        CzMessageComponent,
        CzIconComponent,
        CzInputGroupComponent,
        CzInputGroupAddonComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="autocomplete">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedCommand" [suggestions]="filteredCommands"
                        [optionLabel]="'label'" [delay]="0" [scrollHeight]="'14rem'"
                        [placeholder]="t().commandPlaceholder" [fluid]="true"
                        (completeMethod)="searchCommands($event)" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── OBJECTS ── -->
            <section>
                <h2 id="objects">{{ t().objects }}</h2>
                <p [innerHTML]="t().objectsDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedCountry" [suggestions]="filteredCountries"
                        [optionLabel]="'name'" [delay]="0" [scrollHeight]="'14rem'"
                        [placeholder]="t().countryPlaceholder" [fluid]="true"
                        (completeMethod)="searchCountries($event)" />
                </div>
                <app-code [code]="objectsCode" />
            </section>

            <!-- ── MULTIPLE ── -->
            <section>
                <h2 id="multiple">{{ t().multiple }}</h2>
                <p [innerHTML]="t().multipleDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedTechs" [suggestions]="filteredTechs"
                        [optionLabel]="'label'" [multiple]="true" [unique]="true" [delay]="0"
                        [scrollHeight]="'14rem'" [placeholder]="t().techPlaceholder"
                        [fluid]="true" (completeMethod)="searchTechs($event)" />
                </div>
                <span class="cz-text-sm">{{ t().selected }}: {{ selectedTechs.length }}</span>
                <app-code [code]="multipleCode" />
            </section>

            <!-- ── CLEAR ICON ── -->
            <section>
                <h2 id="clear-icon">{{ t().clearIcon }}</h2>
                <p [innerHTML]="t().clearIconDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedCategory" [suggestions]="filteredCategories"
                        [optionLabel]="'label'" [showClear]="true" [delay]="0" [scrollHeight]="'14rem'"
                        [placeholder]="t().categoryPlaceholder" [fluid]="true"
                        (completeMethod)="searchCategories($event)">
                        <ng-template #itemTemplate let-category>
                            <span class="cz-flex cz-items-center cz-justify-between cz-w-full">
                                <span>{{ category.label }}</span>
                                <cz-tag [value]="category.count.toString()" severity="secondary" size="sm" />
                            </span>
                        </ng-template>
                    </cz-autocomplete>
                </div>
                <app-code [code]="clearIconCode" />
            </section>

            <!-- ── DROPDOWN ── -->
            <section>
                <h2 id="dropdown">{{ t().dropdown }}</h2>
                <p [innerHTML]="t().dropdownDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="dropdownValue" [dropdown]="true" [suggestions]="dropdownItems"
                        [delay]="0" [scrollHeight]="'14rem'" [fluid]="true"
                        (completeMethod)="searchItems($event)" />
                </div>
                <app-code [code]="dropdownCode" />
            </section>

            <!-- ── GROUP ── -->
            <section>
                <h2 id="group">{{ t().group }}</h2>
                <p [innerHTML]="t().groupDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedGroupedTech" [suggestions]="filteredTechGroups"
                        [optionLabel]="'label'" [group]="true" [optionGroupLabel]="'label'"
                        [optionGroupChildren]="'items'" [delay]="0" [scrollHeight]="'14rem'"
                        [placeholder]="t().techPlaceholder" [fluid]="true"
                        (completeMethod)="searchTechGroups($event)" />
                </div>
                <app-code [code]="groupCode" />
            </section>

            <!-- ── CUSTOM GROUP ── -->
            <section>
                <h2 id="custom-group">{{ t().customGroup }}</h2>
                <p [innerHTML]="t().customGroupDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedCity" [suggestions]="filteredCityGroups"
                        [optionLabel]="'label'" [group]="true" [optionGroupLabel]="'label'"
                        [optionGroupChildren]="'items'" [delay]="0" [scrollHeight]="'18rem'"
                        [placeholder]="t().cityPlaceholder" [fluid]="true"
                        (completeMethod)="searchCities($event)">
                        <ng-template #groupTemplate let-group>
                            <span class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ countryFlags[group.value] }}</span>
                                <span>{{ group.label }}</span>
                            </span>
                        </ng-template>
                    </cz-autocomplete>
                </div>
                <app-code [code]="customGroupCode" />
            </section>

            <!-- ── CUSTOM OPTION ── -->
            <section>
                <h2 id="custom-option">{{ t().customOption }}</h2>
                <p [innerHTML]="t().customOptionDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedMember" [suggestions]="filteredMembers"
                        [optionLabel]="'name'" [delay]="0" [scrollHeight]="'16rem'"
                        [placeholder]="t().memberPlaceholder" [fluid]="true"
                        (completeMethod)="searchMembers($event)">
                        <ng-template #itemTemplate let-member>
                            <span class="cz-flex cz-items-center cz-gap-sm cz-py-xs">
                                <cz-avatar [label]="member.avatar" shape="circle" size="sm" />
                                <span class="cz-flex cz-flex-col">
                                    <span class="cz-font-medium">{{ member.name }}</span>
                                    <span class="cz-text-xs cz-text-muted">{{ member.role }}</span>
                                </span>
                            </span>
                        </ng-template>
                    </cz-autocomplete>
                </div>
                <app-code [code]="customOptionCode" />
            </section>

            <!-- ── TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p [innerHTML]="t().templateDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedCountry" [suggestions]="filteredCountries"
                        [optionLabel]="'name'" [delay]="0" [scrollHeight]="'14rem'"
                        [placeholder]="t().countryPlaceholder" [fluid]="true"
                        (completeMethod)="searchCountries($event)">
                        <ng-template #itemTemplate let-country>
                            <span class="cz-flex cz-items-center cz-gap-sm">
                                <span class="cz-font-semibold">{{ country.code }}</span>
                                <span>{{ country.name }}</span>
                            </span>
                        </ng-template>
                        <ng-template #headerTemplate>
                            <div class="cz-font-medium">{{ t().availableCountries }}</div>
                        </ng-template>
                        <ng-template #footerTemplate>
                            <cz-button [label]="t().addNew" size="sm" variant="text" [icon]="PlusIcon"
                                (onClick)="notify(t().addNew)" />
                        </ng-template>
                    </cz-autocomplete>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── STATES (disabled / filled / sizes / invalid) ── -->
            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p [innerHTML]="t().statesDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-col cz-items-center cz-gap-md">
                    <cz-autocomplete [disabled]="true" [suggestions]="[]" [placeholder]="t().disabled"
                        [fluid]="true" />
                    <cz-autocomplete [(ngModel)]="stateFilled" [variant]="'filled'" [suggestions]="stateItems"
                        [delay]="0" [placeholder]="t().filled" [fluid]="true"
                        (completeMethod)="searchItems($event)" />
                    <div class="cz-flex cz-flex-wrap cz-items-center cz-justify-center cz-gap-md">
                        <div style="width: 10rem;">
                            <cz-autocomplete [(ngModel)]="stateSmall" [size]="'sm'" [suggestions]="stateItems"
                                [delay]="0" [placeholder]="t().small" [fluid]="true"
                                (completeMethod)="searchItems($event)" />
                        </div>
                        <div style="width: 10rem;">
                            <cz-autocomplete [(ngModel)]="stateNormal" [suggestions]="stateItems" [delay]="0"
                                [placeholder]="t().normal" [fluid]="true"
                                (completeMethod)="searchItems($event)" />
                        </div>
                        <div style="width: 10rem;">
                            <cz-autocomplete [(ngModel)]="stateLarge" [size]="'lg'" [suggestions]="stateItems"
                                [delay]="0" [placeholder]="t().large" [fluid]="true"
                                (completeMethod)="searchItems($event)" />
                        </div>
                    </div>
                    <cz-autocomplete [(ngModel)]="stateInvalid" [suggestions]="stateItems" [invalid]="!stateInvalid"
                        [delay]="0" [placeholder]="t().invalid" [fluid]="true"
                        (completeMethod)="searchItems($event)" />
                </div>
                <app-code [code]="statesCode" />
            </section>

            <!-- ── FLOAT LABEL ── -->
            <section>
                <h2 id="float-label">{{ t().floatLabel }}</h2>
                <p [innerHTML]="t().floatLabelDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-items-end cz-justify-center cz-gap-lg">
                    <div style="width: 12rem;">
                        <cz-autocomplete [(ngModel)]="floatValue1" [label]="t().floatLabel" labelPosition="float"
                            [suggestions]="stateItems" [delay]="0" [scrollHeight]="'14rem'"
                            (completeMethod)="searchItems($event)" />
                    </div>
                    <div style="width: 12rem;">
                        <cz-autocomplete [(ngModel)]="floatValue2" [label]="t().inLabel" labelPosition="in"
                            [suggestions]="stateItems" [delay]="0" [scrollHeight]="'14rem'"
                            (completeMethod)="searchItems($event)" />
                    </div>
                    <div style="width: 12rem;">
                        <cz-autocomplete [(ngModel)]="floatValue3" [label]="t().overLabel" labelPosition="over"
                            [suggestions]="stateItems" [delay]="0" [scrollHeight]="'14rem'"
                            (completeMethod)="searchItems($event)" />
                    </div>
                </div>
                <app-code [code]="floatLabelCode" />
            </section>

            <!-- ── FLUID ── -->
            <section>
                <h2 id="fluid">{{ t().fluid }}</h2>
                <p [innerHTML]="t().fluidDesc"></p>
                <div class="cz-mb-md">
                    <cz-autocomplete [(ngModel)]="fluidValue" [fluid]="true" [suggestions]="stateItems"
                        [delay]="0" [scrollHeight]="'14rem'" (completeMethod)="searchItems($event)" />
                </div>
                <app-code [code]="fluidCode" />
            </section>

            <!-- ── FOCUS BEHAVIOR ── -->
            <section>
                <h2 id="focus-behavior">{{ t().focusBehavior }}</h2>
                <p [innerHTML]="t().focusBehaviorDesc"></p>
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
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="focusValue" [suggestions]="stateItems"
                        [autoOptionFocus]="autoOptionFocus()" [selectOnFocus]="selectOnFocus()"
                        [focusOnHover]="focusOnHover()" [delay]="0" [scrollHeight]="'14rem'"
                        [placeholder]="t().cityPlaceholder" [fluid]="true"
                        (completeMethod)="searchItems($event)" />
                </div>
                <app-code [code]="focusBehaviorCode" />
            </section>

            <!-- ── FORCE SELECTION ── -->
            <section>
                <h2 id="force-selection">{{ t().forceSelection }}</h2>
                <p [innerHTML]="t().forceSelectionDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedCountry" [forceSelection]="true"
                        [suggestions]="filteredCountries" [optionLabel]="'name'" [delay]="0"
                        [scrollHeight]="'14rem'" [placeholder]="t().countryPlaceholder"
                        [fluid]="true" (completeMethod)="searchCountries($event)" />
                </div>
                <app-code [code]="forceSelectionCode" />
            </section>

            <!-- ── LOADING ── -->
            <section>
                <h2 id="loading">{{ t().loading }}</h2>
                <p [innerHTML]="t().loadingDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <div style="width: 14rem;">
                        <cz-input-group>
                            <cz-autocomplete [(ngModel)]="loadingValue" [suggestions]="loadingItems"
                                [delay]="0" [scrollHeight]="'14rem'" (completeMethod)="searchLoading($event)" />
                            <cz-input-group-addon>
                                @if (loadingSearch()) {
                                    <span class="cz-flex cz-items-center cz-gap-xs cz-text-xs cz-text-muted">
                                        {{ t().searching }}
                                    </span>
                                } @else {
                                    <cz-icon [icon]="XIcon" [size]="14" />
                                }
                            </cz-input-group-addon>
                        </cz-input-group>
                    </div>
                </div>
                <app-code [code]="loadingCode" />
            </section>

            <!-- ── VIRTUAL SCROLL ── -->
            <section>
                <h2 id="virtual-scroll">{{ t().virtualScroll }}</h2>
                <p [innerHTML]="t().virtualScrollDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center" style="max-width: 15rem; margin-inline: auto;">
                    <cz-autocomplete [(ngModel)]="selectedVirtual" [virtualScroll]="true"
                        [suggestions]="filteredVirtualItems" [virtualScrollItemSize]="34" [optionLabel]="'label'"
                        [dropdown]="true" [delay]="0" [scrollHeight]="'14rem'" [fluid]="true"
                        (completeMethod)="searchVirtual($event)" />
                </div>
                <app-code [code]="virtualScrollCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p [innerHTML]="t().formsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 14rem;">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-autocomplete formControlName="value" [suggestions]="stateItems" [delay]="0"
                            [invalid]="isInvalid('value')" [fluid]="true"
                            (completeMethod)="searchItems($event)" />
                        @if (isInvalid('value')) {
                            <cz-message severity="danger" [text]="t().requiredMessage" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)"
                        class="cz-flex cz-flex-col cz-gap-sm" style="width: 14rem;">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-autocomplete #val="ngModel" name="val" [(ngModel)]="templateValue"
                            [suggestions]="stateItems" [delay]="0" required [fluid]="true"
                            [invalid]="!!val.invalid && (val.touched || tdForm.submitted)"
                            (completeMethod)="searchItems($event)" />
                        @if (!!val.invalid && (val.touched || tdForm.submitted)) {
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
                    <li [innerHTML]="t().a11yMultiple"></li>
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
                            <tr><td><code>suggestions</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>An array of suggestions to display.</td></tr>
                            <tr><td><code>optionLabel</code></td><td><code>string | (item) =&gt; string | null</code></td><td><code>null</code></td><td>Property name or getter function used as the option label.</td></tr>
                            <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Specifies if multiple values can be selected (chips).</td></tr>
                            <tr><td><code>unique</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Ensures uniqueness of selected items in multiple mode.</td></tr>
                            <tr><td><code>dropdown</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays a trigger button next to the input.</td></tr>
                            <tr><td><code>dropdownMode</code></td><td><code>'blank' | 'current'</code></td><td><code>'blank'</code></td><td>Dropdown behavior: sends an empty query or the current value.</td></tr>
                            <tr><td><code>showClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays a clear icon to reset the value.</td></tr>
                            <tr><td><code>group / optionGroupLabel / optionGroupChildren</code></td><td><code>boolean / string / string</code></td><td><code>false / 'label' / 'items'</code></td><td>Grouped options configuration.</td></tr>
                            <tr><td><code>forceSelection</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Clears manual input that does not match the suggestions.</td></tr>
                            <tr><td><code>minQueryLength / minLength</code></td><td><code>number</code></td><td><code>1</code></td><td>Minimum characters to initiate a search.</td></tr>
                            <tr><td><code>delay</code></td><td><code>number</code></td><td><code>300</code></td><td>Delay between keystrokes before sending a query.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string</code></td><td><code>''</code></td><td>Maximum height of the suggestions panel.</td></tr>
                            <tr><td><code>emptyMessage / showEmptyMessage</code></td><td><code>string / boolean</code></td><td><code>'No results found' / true</code></td><td>Empty state configuration.</td></tr>
                            <tr><td><code>virtualScroll / virtualScrollItemSize</code></td><td><code>boolean / number</code></td><td><code>false / 34</code></td><td>Virtual scrolling over large suggestion sets.</td></tr>
                            <tr><td><code>autoOptionFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Focuses the first option when the panel opens.</td></tr>
                            <tr><td><code>selectOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Selects the focused option while navigating.</td></tr>
                            <tr><td><code>focusOnHover</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Focuses the hovered option.</td></tr>
                            <tr><td><code>invalid / variant / size / fluid / filled</code></td><td><code>boolean / 'outlined' | 'filled' / 'sm' | 'md' | 'lg' / boolean</code></td><td><code>—</code></td><td>Visual states and sizing.</td></tr>
                            <tr><td><code>inputId / name / tabindex / autofocus</code></td><td><code>—</code></td><td><code>—</code></td><td>Native input attributes.</td></tr>
                            <tr><td><code>ariaLabel / ariaLabelledBy / dropdownAriaLabel</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Accessibility labels.</td></tr>
                            <tr><td><code>inputStyleClass / panelStyleClass</code></td><td><code>string</code></td><td><code>''</code></td><td>Style classes for the input and the panel.</td></tr>
                            <tr><td><code>completeMethod</code></td><td><code>output&lt;&#123; originalEvent, query &#125;&gt;</code></td><td><code>—</code></td><td>Callback to search for suggestions.</td></tr>
                            <tr><td><code>onSelect / onUnselect</code></td><td><code>output&lt;any&gt;</code></td><td><code>—</code></td><td>Emitted when a suggestion is selected / removed.</td></tr>
                            <tr><td><code>onClear / onDropdownClick / onFocus / onBlur</code></td><td><code>output</code></td><td><code>—</code></td><td>Interaction events.</td></tr>
                            <tr><td><code>itemTemplate / selectedItemTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Custom option and chip templates.</td></tr>
                            <tr><td><code>groupTemplate / headerTemplate / footerTemplate / emptyTemplate</code></td><td><code>TemplateRef</code></td><td><code>—</code></td><td>Group header, panel header/footer and empty state templates.</td></tr>
                            <tr><td><code>clear()</code></td><td><code>method</code></td><td><code>—</code></td><td>Clears the value and the typed query.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class AutocompleteDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => AUTOCOMPLETE_DOC_I18N[this.lang.currentLang()] || AUTOCOMPLETE_DOC_I18N.es);

    readonly PlusIcon = LucidePlus;
    readonly XIcon = LucideX;

    /* Basic — commands */
    readonly commands: Command[] = [
        { label: 'New File', shortcut: '⌘N' },
        { label: 'Open File', shortcut: '⌘O' },
        { label: 'Save', shortcut: '⌘S' },
        { label: 'Save As', shortcut: '⇧⌘S' },
        { label: 'Find', shortcut: '⌘F' },
        { label: 'Replace', shortcut: '⌘H' },
        { label: 'Go to Line', shortcut: '⌘G' },
        { label: 'Toggle Sidebar', shortcut: '⌘B' },
        { label: 'Close Tab', shortcut: '⌘W' },
    ];
    selectedCommand: Command | undefined;
    filteredCommands: Command[] = [];

    searchCommands(event: { query: string }): void {
        const query = event.query.toLowerCase();
        this.filteredCommands = query ? this.commands.filter(cmd => cmd.label.toLowerCase().includes(query)) : [...this.commands];
    }

    /* Objects — countries */
    readonly countries: Country[] = [
        { name: 'United States', code: 'US' },
        { name: 'United Kingdom', code: 'GB' },
        { name: 'Brazil', code: 'BR' },
        { name: 'Argentina', code: 'AR' },
        { name: 'Germany', code: 'DE' },
        { name: 'Japan', code: 'JP' },
    ];
    selectedCountry: Country | undefined;
    filteredCountries: Country[] = [];

    searchCountries(event: { query: string }): void {
        const query = event.query.toLowerCase();
        this.filteredCountries = query
            ? this.countries.filter(country => country.name.toLowerCase().startsWith(query))
            : [...this.countries];
    }

    /* Multiple */
    readonly techs = [
        { label: 'Angular', value: 'angular' },
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' },
        { label: 'Svelte', value: 'svelte' },
        { label: 'Node.js', value: 'nodejs' },
        { label: 'Python', value: 'python' },
    ];
    selectedTechs: any[] = [];
    filteredTechs: any[] = [];

    searchTechs(event: { query: string }): void {
        const query = event.query.toLowerCase();
        this.filteredTechs = query ? this.techs.filter(tech => tech.label.toLowerCase().includes(query)) : [...this.techs];
    }

    /* Clear icon — categories */
    readonly categories = [
        { label: 'Electronics', count: 1247 },
        { label: 'Clothing', count: 856 },
        { label: 'Garden', count: 634 },
        { label: 'Sports', count: 421 },
        { label: 'Books', count: 2103 },
    ];
    selectedCategory: any;
    filteredCategories: any[] = [];

    searchCategories(event: { query: string }): void {
        const query = event.query.toLowerCase();
        this.filteredCategories = query
            ? this.categories.filter(category => category.label.toLowerCase().includes(query))
            : [...this.categories];
    }

    /* Dropdown / states / loading / focus — generic items */
    dropdownValue: any;
    dropdownItems: string[] = [];
    stateItems: string[] = [];
    loadingItems: string[] = [];
    stateFilled: any;
    stateSmall: any;
    stateNormal: any;
    stateLarge: any;
    stateInvalid: any;
    loadingValue: any;
    focusValue: any;
    fluidValue: any;
    floatValue1: any;
    floatValue2: any;
    floatValue3: any;
    readonly loadingSearch = signal(false);

    searchItems(event: { query: string }): void {
        this.stateItems = [...Array(10).keys()].map(item => `${event.query}-${item}`);
        this.dropdownItems = this.stateItems;
    }

    searchLoading(event: { query: string }): void {
        this.loadingSearch.set(true);
        setTimeout(() => {
            this.loadingItems = [...Array(6).keys()].map(item => `${event.query}-${item}`);
            this.loadingSearch.set(false);
        }, 800);
    }

    /* Group */
    readonly techGroups: TechGroup[] = [
        { label: 'Frontend', code: 'FE', items: [{ label: 'React', value: 'react' }, { label: 'Angular', value: 'angular' }] },
        { label: 'Backend', code: 'BE', items: [{ label: 'Node.js', value: 'nodejs' }, { label: 'Python', value: 'python' }] },
        { label: 'Database', code: 'DB', items: [{ label: 'PostgreSQL', value: 'postgresql' }, { label: 'MongoDB', value: 'mongodb' }] },
    ];
    selectedGroupedTech: any;
    filteredTechGroups: TechGroup[] = [];

    searchTechGroups(event: { query: string }): void {
        const query = event.query.toLowerCase();
        this.filteredTechGroups = this.techGroups
            .map(group => ({ ...group, items: query ? group.items.filter(item => item.label.toLowerCase().includes(query)) : group.items }))
            .filter(group => group.items.length);
    }

    /* Custom group — cities */
    readonly countryFlags: Record<string, string> = { de: '🇩🇪', us: '🇺🇸', jp: '🇯🇵' };
    readonly cityGroups = [
        { label: 'Germany', value: 'de', items: [{ label: 'Berlin' }, { label: 'Frankfurt' }, { label: 'Hamburg' }] },
        { label: 'USA', value: 'us', items: [{ label: 'Chicago' }, { label: 'Los Angeles' }, { label: 'New York' }] },
        { label: 'Japan', value: 'jp', items: [{ label: 'Kyoto' }, { label: 'Osaka' }, { label: 'Tokyo' }] },
    ];
    selectedCity: any;
    filteredCityGroups: any[] = [];

    searchCities(event: { query: string }): void {
        const query = event.query.toLowerCase();
        this.filteredCityGroups = this.cityGroups
            .map(group => ({ ...group, items: query ? group.items.filter(item => item.label.toLowerCase().includes(query)) : group.items }))
            .filter(group => group.items.length);
    }

    /* Custom option — team members */
    readonly teamMembers: TeamMember[] = [
        { id: 1, name: 'Sarah Chen', role: 'Engineering Lead', avatar: 'SC', statusClass: 'bg-green-400' },
        { id: 2, name: 'Alex Rivera', role: 'Senior Developer', avatar: 'AR', statusClass: 'bg-green-400' },
        { id: 3, name: 'Jordan Kim', role: 'UX Designer', avatar: 'JK', statusClass: 'bg-amber-400' },
        { id: 4, name: 'Taylor Morgan', role: 'Product Manager', avatar: 'TM', statusClass: 'bg-zinc-400' },
        { id: 5, name: 'Morgan Lee', role: 'DevOps Engineer', avatar: 'ML', statusClass: 'bg-green-400' },
    ];
    selectedMember: TeamMember | undefined;
    filteredMembers: TeamMember[] = [];

    searchMembers(event: { query: string }): void {
        const query = event.query.toLowerCase();
        this.filteredMembers = query
            ? this.teamMembers.filter(member => member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query))
            : [...this.teamMembers];
    }

    /* Virtual scroll */
    readonly virtualItems = Array.from({ length: 10000 }, (_, i) => ({ label: `Item ${i}`, value: `Item ${i}` }));
    selectedVirtual: any;
    filteredVirtualItems: any[] = [];

    searchVirtual(event: { query: string }): void {
        const query = event.query.toLowerCase();
        this.filteredVirtualItems = this.virtualItems.filter(item => item.label.toLowerCase().startsWith(query)).slice(0, 2000);
    }

    /* Focus behavior */
    readonly autoOptionFocus = signal(true);
    readonly selectOnFocus = signal(false);
    readonly focusOnHover = signal(true);

    /* Forms */
    readonly exampleForm = new FormGroup({
        value: new FormControl('', Validators.required),
    });
    formSubmitted = false;
    templateValue: any;

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
        typescript: `import { CzAutocompleteComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-autocomplete
    [(ngModel)]="selectedCommand"
    [suggestions]="filteredCommands"
    optionLabel="label"
    placeholder="Type a command..."
    (completeMethod)="search($event)"
/>

<ng-template #itemTemplate let-command>
    {{ command.label }}
</ng-template>`,
        typescript: `search(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.filteredCommands = this.commands.filter(cmd => cmd.label.toLowerCase().includes(query));
}`,
    };

    objectsCode: Code = {
        html: `<cz-autocomplete
    [(ngModel)]="selectedCountry"
    [suggestions]="filteredCountries"
    optionLabel="name"
    (completeMethod)="search($event)"
/>`,
        typescript: `// optionLabel displays the label while the model keeps the object instance`,
    };

    multipleCode: Code = {
        html: `<!-- Multiple mode (chips) -->
<cz-autocomplete
    [(ngModel)]="selectedTechs"
    [suggestions]="filteredTechs"
    optionLabel="label"
    [multiple]="true"
    [unique]="true"
    (completeMethod)="search($event)"
/>

<!-- Custom chip content -->
<ng-template #selectedItemTemplate let-tech>
    <span>{{ tech.label }}</span>
</ng-template>`,
        typescript: `selectedTechs: any[] = []; // two-way array model`,
    };

    clearIconCode: Code = {
        html: `<cz-autocomplete
    [(ngModel)]="selectedCategory"
    [suggestions]="filteredCategories"
    optionLabel="label"
    [showClear]="true"
    (completeMethod)="search($event)"
>
    <ng-template #itemTemplate let-category>
        <span class="flex justify-between">
            {{ category.label }}
            <cz-tag [value]="category.count.toString()" />
        </span>
    </ng-template>
</cz-autocomplete>`,
    };

    dropdownCode: Code = {
        html: `<!-- dropdownMode: 'blank' (default) sends an empty query, 'current' sends the input value -->
<cz-autocomplete
    [(ngModel)]="value"
    [dropdown]="true"
    [dropdownMode]="'blank'"
    [suggestions]="items"
    (completeMethod)="search($event)"
/>`,
    };

    groupCode: Code = {
        html: `<cz-autocomplete
    [(ngModel)]="selectedTech"
    [suggestions]="filteredGroups"
    optionLabel="label"
    [group]="true"
    optionGroupLabel="label"
    optionGroupChildren="items"
    (completeMethod)="search($event)"
/>`,
        typescript: `// suggestions: [{ label: 'Frontend', items: [{ label: 'Angular' }] }, ...]`,
    };

    customGroupCode: Code = {
        html: `<cz-autocomplete [group]="true" optionGroupLabel="label" optionGroupChildren="items" ...>
    <ng-template #groupTemplate let-group>
        <span>{{ countryFlags[group.value] }} {{ group.label }}</span>
    </ng-template>
</cz-autocomplete>`,
    };

    customOptionCode: Code = {
        html: `<cz-autocomplete [suggestions]="filteredMembers" optionLabel="name" (completeMethod)="search($event)">
    <ng-template #itemTemplate let-member>
        <div class="flex items-center gap-3">
            <cz-avatar [label]="member.avatar" shape="circle" size="sm" />
            <div class="flex flex-col">
                <span class="font-medium">{{ member.name }}</span>
                <span class="text-xs text-muted">{{ member.role }}</span>
            </div>
        </div>
    </ng-template>
</cz-autocomplete>`,
    };

    templateCode: Code = {
        html: `<cz-autocomplete [suggestions]="filteredCountries" optionLabel="name" ...>
    <ng-template #itemTemplate let-country>
        <span><b>{{ country.code }}</b> {{ country.name }}</span>
    </ng-template>

    <ng-template #headerTemplate>
        <div class="font-medium">Available Countries</div>
    </ng-template>

    <ng-template #footerTemplate>
        <cz-button label="Add New" variant="text" (onClick)="add()" />
    </ng-template>
</cz-autocomplete>`,
    };

    statesCode: Code = {
        html: `<!-- Disabled -->
<cz-autocomplete [disabled]="true" [suggestions]="[]" />

<!-- Filled variant -->
<cz-autocomplete variant="filled" [suggestions]="items" />

<!-- Sizes: sm | md | lg -->
<cz-autocomplete size="sm" [suggestions]="items" />
<cz-autocomplete size="lg" [suggestions]="items" />

<!-- Invalid state -->
<cz-autocomplete [invalid]="!value" [suggestions]="items" />`,
    };

    floatLabelCode: Code = {
        html: `<cz-autocomplete label="Over Label" labelPosition="over" ... />
<cz-autocomplete label="In Label" labelPosition="in" ... />
<cz-autocomplete label="Float Label" labelPosition="float" ... />`,
    };

    fluidCode: Code = {
        html: `<cz-autocomplete [fluid]="true" [suggestions]="items" (completeMethod)="search($event)" />`,
    };

    focusBehaviorCode: Code = {
        html: `<cz-autocomplete
    [autoOptionFocus]="autoOptionFocus"
    [selectOnFocus]="selectOnFocus"
    [focusOnHover]="focusOnHover"
    [suggestions]="items"
/>`,
        typescript: `// autoOptionFocus: focus the first option when the panel opens
// selectOnFocus: select the option while navigating with the keyboard
// focusOnHover: focus the hovered option`,
    };

    forceSelectionCode: Code = {
        html: `<cz-autocomplete
    [(ngModel)]="selectedCountry"
    [forceSelection]="true"
    [suggestions]="filteredCountries"
    optionLabel="name"
/>`,
        typescript: `// invalid manual input is cleared on blur: the model only accepts suggestions`,
    };

    loadingCode: Code = {
        html: `<cz-input-group>
    <cz-autocomplete [(ngModel)]="value" [suggestions]="items" (completeMethod)="search($event)" />
    <cz-input-group-addon>
        @if (searching()) {
            <cz-progress-spinner [size]="16" />
        }
    </cz-input-group-addon>
</cz-input-group>`,
    };

    virtualScrollCode: Code = {
        html: `<cz-autocomplete
    [(ngModel)]="selectedItem"
    [virtualScroll]="true"
    [suggestions]="filteredItems"
    [virtualScrollItemSize]="34"
    [dropdown]="true"
    optionLabel="label"
    (completeMethod)="filter($event)"
/>`,
        typescript: `// only the visible window of options is rendered for large data sets`,
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-autocomplete formControlName="value" [invalid]="isInvalid('value')" [suggestions]="items"
        (completeMethod)="search($event)" />
    @if (isInvalid('value')) {
        <cz-message severity="danger" text="Value is required." />
    }
</form>

<!-- Template-driven forms -->
<cz-autocomplete #val="ngModel" name="val" [(ngModel)]="value" required
    [invalid]="val.invalid && val.touched" [suggestions]="items" (completeMethod)="search($event)" />`,
    };
}
