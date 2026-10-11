import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    CzSelectComponent,
    CzButtonComponent,
    CzCheckboxComponent,
    CzMessageComponent,
    CzTagComponent,
    CzChipComponent,
    CzAvatarComponent,
    CzInputGroupComponent,
    CzInputGroupAddonComponent,
    CzToastService,
    CzSelectLazyLoadEvent
} from 'codezium-ui';
import { LucideDynamicIcon, LucideSearch, LucideX, LucideMap, LucidePlus } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SELECT_DOC_I18N } from './select-doc.i18n';

interface City { name: string; code: string }

@Component({
    selector: 'cz-select-doc-page',
    imports: [
        CommonModule, LucideDynamicIcon, CzSelectComponent, CzButtonComponent, CzCheckboxComponent, CzMessageComponent,
        CzTagComponent, CzChipComponent, CzAvatarComponent, CzInputGroupComponent,
        CzInputGroupAddonComponent, AppCodeComponent, ReactiveFormsModule, FormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="select">{{ t().title }}</h1>
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
                    <cz-select [options]="languages" [(ngModel)]="selectedLanguage" optionLabel="label" optionValue="value"
                        [placeholder]="t().selectLanguage" [fluid]="true" style="max-width: 16rem" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── CHECKBOX SELECTION ── -->
            <section>
                <h2 id="checkboxselection">{{ t().checkboxSelection }}</h2>
                <p>{{ t().checkboxSelectionDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="selectedCities" [multiple]="true" optionLabel="name"
                        optionValue="code" [showClear]="true" [placeholder]="t().selectCities" style="max-width: 16rem; width: 100%">
                        <ng-template #headerTemplate>
                            <cz-checkbox [ngModel]="allCitiesSelected()" [binary]="true" [indeterminate]="citiesIndeterminate()"
                                (ngModelChange)="onToggleAllCities($event)" [label]="t().selectAll" />
                        </ng-template>
                        <ng-template #selectedItemTemplate>
                            <span>{{ citiesTriggerLabel() }}</span>
                        </ng-template>
                        <ng-template #itemTemplate let-city>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <cz-checkbox [ngModel]="isCitySelected(city)" [binary]="true" [readonly]="true" [tabindex]="-1" />
                                <span>{{ city.name }}</span>
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="checkboxSelectionCode" />
            </section>

            <!-- ── CHECKMARK ── -->
            <section>
                <h2 id="checkmark">{{ t().checkmark }}</h2>
                <p>{{ t().checkmarkDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="themes" [(ngModel)]="selectedTheme" [checkmark]="true" optionLabel="label"
                        [placeholder]="t().selectTheme" scrollHeight="auto" style="max-width: 18rem; width: 100%">
                        <ng-template #selectedItemTemplate let-theme>
                            @if (theme) {
                                <div class="cz-flex cz-items-center cz-gap-sm">
                                    <span>{{ theme.icon }}</span><span>{{ theme.label }}</span>
                                </div>
                            }
                        </ng-template>
                        <ng-template #itemTemplate let-theme>
                            <div class="cz-flex cz-items-center cz-gap-md">
                                <span style="font-size: 1.25rem">{{ theme.icon }}</span>
                                <div class="cz-flex cz-flex-col">
                                    <span class="cz-font-medium">{{ theme.label }}</span>
                                    <span class="cz-text-xs cz-text-muted">{{ theme.description }}</span>
                                </div>
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="checkmarkCode" />
            </section>

            <!-- ── CHIPS ── -->
            <section>
                <h2 id="chips">{{ t().chips }}</h2>
                <p>{{ t().chipsDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="members" [(ngModel)]="selectedMembers" [multiple]="true" optionLabel="name"
                        optionValue="code" [showClear]="true" [placeholder]="t().selectMembers" style="max-width: 22rem; width: 100%">
                        <ng-template #itemTemplate let-member>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <cz-avatar [label]="member.initials" size="sm" />
                                <span>{{ member.name }}</span>
                            </div>
                        </ng-template>
                        <ng-template #selectedItemTemplate>
                            <div class="cz-flex cz-flex-wrap cz-gap-xs">
                                @for (code of selectedMembers(); track code) {
                                    <cz-chip [label]="getMemberFirstName(code)" [removable]="true" (onRemove)="removeMember($event, code)" />
                                }
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="chipsCode" />
            </section>

            <!-- ── CLEAR ── -->
            <section>
                <h2 id="clear">{{ t().clear }}</h2>
                <p>{{ t().clearDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="categories" [(ngModel)]="selectedCategory" optionLabel="label"
                        [placeholder]="t().category" [showClear]="true" style="max-width: 16rem; width: 100%">
                        <ng-template #itemTemplate let-category>
                            <div class="cz-flex cz-items-center cz-justify-between" style="width: 100%">
                                <span>{{ category.label }}</span>
                                <cz-tag [value]="'' + category.count" severity="secondary" [rounded]="true" />
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="clearCode" />
            </section>

            <!-- ── CUSTOM FILTER ── -->
            <section>
                <h2 id="customfilter">{{ t().customFilter }}</h2>
                <p>{{ t().customFilterDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="countries" [(ngModel)]="filteredCountry" optionLabel="name" [filter]="true"
                        filterBy="name" [showClear]="true" [placeholder]="t().selectCountry" style="max-width: 16rem; width: 100%">
                        <ng-template #filterTemplate let-options="options">
                            <div class="cz-flex cz-gap-xs" (click)="$event.stopPropagation()">
                                <cz-input-group>
                                    <cz-input-group-addon><svg [lucideIcon]="SearchIcon" [size]="14"></svg></cz-input-group-addon>
                                    <input class="cz-input-native" [placeholder]="t().filter" [(ngModel)]="customFilterValue"
                                        (keyup)="options.filter($event)" />
                                </cz-input-group>
                                <cz-button [iconOnly]="true" [icon]="XIcon" severity="secondary" variant="outlined" size="sm"
                                    (onClick)="resetCustomFilter(options)" />
                            </div>
                        </ng-template>
                        <ng-template #selectedItemTemplate let-country>
                            @if (country) {
                                <div class="cz-flex cz-items-center cz-gap-sm">
                                    <span>{{ countryFlags[country.code] }}</span>
                                    <span>{{ country.name }}</span>
                                </div>
                            }
                        </ng-template>
                        <ng-template #itemTemplate let-country>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ countryFlags[country.code] }}</span>
                                <span>{{ country.name }}</span>
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="customFilterCode" />
            </section>

            <!-- ── CUSTOM GROUP ── -->
            <section>
                <h2 id="customgroup">{{ t().customGroup }}</h2>
                <p>{{ t().customGroupDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="groupedCities" [(ngModel)]="groupedCity" [group]="true"
                        [placeholder]="t().selectCity" style="max-width: 16rem; width: 100%">
                        <ng-template #groupTemplate let-group>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ countryFlags[group.value] }}</span>
                                <span>{{ group.label }}</span>
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="customGroupCode" />
            </section>

            <!-- ── DISABLED ── -->
            <section>
                <h2 id="disabled">{{ t().disabled }}</h2>
                <p>{{ t().disabledDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="cities" [ngModel]="cities[0]" optionLabel="name" [disabled]="true"
                        [placeholder]="t().selectCity" style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="disabledCode" />
            </section>

            <!-- ── EDITABLE ── -->
            <section>
                <h2 id="editable">{{ t().editable }}</h2>
                <p>{{ t().editableDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="editableCity" [editable]="true" optionLabel="name"
                        [placeholder]="t().selectCity" style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="editableCode" />
            </section>

            <!-- ── FILLED ── -->
            <section>
                <h2 id="filled">{{ t().filled }}</h2>
                <p>{{ t().filledDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="filledCity" variant="filled" optionLabel="name"
                        [placeholder]="t().selectCity" style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="filledCode" />
            </section>

            <!-- ── FILTER ── -->
            <section>
                <h2 id="filter">{{ t().filter }}</h2>
                <p>{{ t().filterDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="countries" [(ngModel)]="selectedCountry" optionLabel="name" [filter]="true"
                        filterBy="name" [showClear]="true" [placeholder]="t().selectCountry" style="max-width: 16rem; width: 100%">
                        <ng-template #selectedItemTemplate let-country>
                            @if (country) {
                                <div class="cz-flex cz-items-center cz-gap-sm">
                                    <span>{{ countryFlags[country.code] }}</span><span>{{ country.name }}</span>
                                </div>
                            }
                        </ng-template>
                        <ng-template #itemTemplate let-country>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ countryFlags[country.code] }}</span><span>{{ country.name }}</span>
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="filterCode" />
            </section>

            <!-- ── FLOAT LABEL ── -->
            <section>
                <h2 id="floatlabel">{{ t().floatLabel }}</h2>
                <p>{{ t().floatLabelDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-items-end cz-gap-lg cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="floatCity1" optionLabel="name" label="Over Label"
                        labelPosition="over" style="max-width: 14rem; width: 100%" />
                    <cz-select [options]="cities" [(ngModel)]="floatCity2" optionLabel="name" label="In Label"
                        labelPosition="in" variant="filled" style="max-width: 14rem; width: 100%" />
                    <cz-select [options]="cities" [(ngModel)]="floatCity3" optionLabel="name" label="Float Label"
                        labelPosition="float" style="max-width: 14rem; width: 100%" />
                </div>
                <app-code [code]="floatLabelCode" />
            </section>

            <!-- ── FLUID ── -->
            <section>
                <h2 id="fluid">{{ t().fluid }}</h2>
                <p>{{ t().fluidDesc }}</p>
                <cz-select [options]="cities" [(ngModel)]="fluidCity" optionLabel="name" [placeholder]="t().selectCity"
                    [fluid]="true" class="cz-mb-md" />
                <app-code [code]="fluidCode" />
            </section>

            <!-- ── FOCUS BEHAVIOR ── -->
            <section>
                <h2 id="focusbehavior">{{ t().focusBehavior }}</h2>
                <p>{{ t().focusBehaviorDesc }}</p>
                <div class="cz-flex cz-flex-col cz-items-center cz-gap-lg cz-mb-md">
                    <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-sm">
                        <cz-button [label]="'autoOptionFocus: ' + autoOptionFocus()" size="sm"
                            [severity]="autoOptionFocus() ? 'primary' : 'secondary'" (onClick)="autoOptionFocus.set(!autoOptionFocus())" />
                        <cz-button [label]="'selectOnFocus: ' + selectOnFocus()" size="sm"
                            [severity]="selectOnFocus() ? 'primary' : 'secondary'" (onClick)="selectOnFocus.set(!selectOnFocus())" />
                        <cz-button [label]="'focusOnHover: ' + focusOnHover()" size="sm"
                            [severity]="focusOnHover() ? 'primary' : 'secondary'" (onClick)="focusOnHover.set(!focusOnHover())" />
                    </div>
                    <cz-select [options]="cities" [(ngModel)]="focusCity" optionLabel="name" optionValue="code"
                        [autoOptionFocus]="autoOptionFocus()" [selectOnFocus]="selectOnFocus()" [focusOnHover]="focusOnHover()"
                        [placeholder]="t().selectCity" style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="focusBehaviorCode" />
            </section>

            <!-- ── GROUP ── -->
            <section>
                <h2 id="group">{{ t().group }}</h2>
                <p>{{ t().groupDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="jobCategories" [(ngModel)]="selectedPosition" [group]="true" optionLabel="label"
                        optionValue="value" [placeholder]="t().selectPosition" style="max-width: 18rem; width: 100%" />
                </div>
                <app-code [code]="groupCode" />
            </section>

            <!-- ── GROUP CHECKBOX FILTER ── -->
            <section>
                <h2 id="groupcheckboxfilter">{{ t().groupCheckboxFilter }}</h2>
                <p>{{ t().groupCheckboxFilterDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="labelGroups" [(ngModel)]="selectedLabels" [multiple]="true" [group]="true"
                        [filter]="true" filterBy="label" [filterPlaceholder]="t().search" optionLabel="label" optionValue="value"
                        [placeholder]="t().selectLabels" style="max-width: 18rem; width: 100%">
                        <ng-template #headerTemplate>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <cz-button [label]="t().selectAll" variant="text" size="sm" (onClick)="selectAllLabels()" />
                                <cz-button [label]="t().clearSelection" variant="text" size="sm" severity="secondary"
                                    (onClick)="selectedLabels.set([])" />
                            </div>
                        </ng-template>
                        <ng-template #selectedItemTemplate>
                            <span class="cz-select-doc-badge">{{ labelsTriggerLabel() }}</span>
                        </ng-template>
                        <ng-template #groupTemplate let-group>
                            <span class="cz-text-xs cz-font-semibold cz-text-muted">{{ group.label }}</span>
                        </ng-template>
                        <ng-template #itemTemplate let-item>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <cz-checkbox [ngModel]="selectedLabels().includes(item.value)" [binary]="true" [readonly]="true" [tabindex]="-1" />
                                <span>{{ item.label }}</span>
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="groupCheckboxFilterCode" />
            </section>

            <!-- ── IFTA LABEL ── -->
            <section>
                <h2 id="iftalabel">{{ t().iftaLabel }}</h2>
                <p>{{ t().iftaLabelDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="iftaCity" optionLabel="name" label="City" labelPosition="in"
                        style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="iftaLabelCode" />
            </section>

            <!-- ── INVALID ── -->
            <section>
                <h2 id="invalid">{{ t().invalid }}</h2>
                <p>{{ t().invalidDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-lg cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="invalidCity1" optionLabel="name" [showClear]="true"
                        [invalid]="true" [placeholder]="t().selectCity" style="max-width: 16rem; width: 100%" />
                    <cz-select [options]="cities" [(ngModel)]="invalidCity2" optionLabel="name" [showClear]="true"
                        [invalid]="true" variant="filled" [placeholder]="t().selectCity" style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="invalidCode" />
            </section>

            <!-- ── LAZY VIRTUAL SCROLL ── -->
            <section>
                <h2 id="lazyvirtualscroll">{{ t().lazyVirtualScroll }}</h2>
                <p>{{ t().lazyVirtualScrollDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="lazyItems()" [(ngModel)]="lazyItem" [placeholder]="t().selectItem"
                        [virtualScroll]="true" [virtualScrollItemSize]="32" [lazy]="true" [loading]="lazyLoading()"
                        (onLazyLoad)="onLazyLoad($event)" style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="lazyVirtualScrollCode" />
            </section>

            <!-- ── LOADING STATE ── -->
            <section>
                <h2 id="loadingstate">{{ t().loadingState }}</h2>
                <p>{{ t().loadingStateDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="loadingCity" [loading]="true" optionLabel="name"
                        [placeholder]="t().loading" style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="loadingStateCode" />
            </section>

            <!-- ── MULTIPLE ── -->
            <section>
                <h2 id="multiple">{{ t().multiple }}</h2>
                <p>{{ t().multipleDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="toppings" [(ngModel)]="selectedToppings" [multiple]="true" [checkmark]="true"
                        optionLabel="label" optionValue="value" [showClear]="true" [placeholder]="t().selectToppings"
                        style="max-width: 16rem; width: 100%">
                        <ng-template #selectedItemTemplate>
                            <span>{{ toppingsTriggerLabel() }}</span>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="multipleCode" />
            </section>

            <!-- ── CUSTOM OPTION ── -->
            <section>
                <h2 id="customoption">{{ t().customOption }}</h2>
                <p>{{ t().customOptionDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="teamMembers" [(ngModel)]="assignee" optionLabel="name"
                        [placeholder]="t().selectMember" style="max-width: 18rem; width: 100%">
                        <ng-template #selectedItemTemplate let-member>
                            @if (member) {
                                <div class="cz-flex cz-items-center cz-gap-sm">
                                    <span class="cz-select-doc-dot" [style.background]="member.statusColor"></span>
                                    <span>{{ member.name }}</span>
                                </div>
                            }
                        </ng-template>
                        <ng-template #itemTemplate let-member>
                            <div class="cz-flex cz-items-center cz-gap-md">
                                <div class="cz-select-doc-avatar">
                                    <cz-avatar [label]="member.initials" size="sm" />
                                    <span class="cz-select-doc-dot" [style.background]="member.statusColor"></span>
                                </div>
                                <div class="cz-flex cz-flex-col">
                                    <span class="cz-font-medium">{{ member.name }}</span>
                                    <span class="cz-text-xs cz-text-muted">{{ member.role }}</span>
                                </div>
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="customOptionCode" />
            </section>

            <!-- ── PREVIEW ── -->
            <section>
                <h2 id="preview">{{ t().preview }}</h2>
                <p>{{ t().previewDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="languagesFull" [(ngModel)]="previewLanguage" optionLabel="label" [filter]="true"
                        filterBy="label" [checkmark]="true" [placeholder]="t().selectLanguage" style="max-width: 16rem; width: 100%">
                        <ng-template #selectedItemTemplate let-language>
                            @if (language) {
                                <div class="cz-flex cz-items-center cz-gap-sm">
                                    <span>{{ language.flag }}</span><span>{{ language.label }}</span>
                                </div>
                            }
                        </ng-template>
                        <ng-template #itemTemplate let-language>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ language.flag }}</span><span>{{ language.label }}</span>
                            </div>
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="previewCode" />
            </section>

            <!-- ── FORMS ── -->
            <section>
                <h2 id="forms">{{ t().forms }}</h2>
                <p>{{ t().formsDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-justify-center cz-gap-xl cz-mb-md">
                    <form [formGroup]="exampleForm" (ngSubmit)="onSubmit()" class="cz-flex cz-flex-col cz-gap-sm" style="width: 14rem">
                        <strong class="cz-text-sm">{{ t().reactiveForms }}</strong>
                        <cz-select formControlName="city" [options]="cities" [invalid]="isInvalid('city')" optionLabel="name"
                            [placeholder]="t().selectCity" [fluid]="true" />
                        @if (isInvalid('city')) {
                            <cz-message severity="danger" [text]="t().cityRequired" />
                        }
                        <cz-button [label]="t().submit" severity="secondary" type="submit" />
                    </form>

                    <form #tdForm="ngForm" (ngSubmit)="onTemplateSubmit(tdForm)" class="cz-flex cz-flex-col cz-gap-sm" style="width: 14rem">
                        <strong class="cz-text-sm">{{ t().templateDrivenForms }}</strong>
                        <cz-select #cityModel="ngModel" name="city" [(ngModel)]="templateCity" [options]="cities" optionLabel="name"
                            [placeholder]="t().selectCity" required
                            [invalid]="!!(cityModel.invalid && (cityModel.touched || tdForm.submitted))" [fluid]="true" />
                        @if (cityModel.invalid && (cityModel.touched || tdForm.submitted)) {
                            <cz-message severity="danger" [text]="t().cityRequired" />
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
                    <cz-select [(ngModel)]="sizeCity1" [options]="cities" optionLabel="name" size="sm" [placeholder]="t().small"
                        style="max-width: 16rem; width: 100%" />
                    <cz-select [(ngModel)]="sizeCity2" [options]="cities" optionLabel="name" [placeholder]="t().normal"
                        style="max-width: 16rem; width: 100%" />
                    <cz-select [(ngModel)]="sizeCity3" [options]="cities" optionLabel="name" size="lg" [placeholder]="t().large"
                        style="max-width: 16rem; width: 100%" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <!-- ── TEMPLATE ── -->
            <section>
                <h2 id="template">{{ t().template }}</h2>
                <p>{{ t().templateDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="countries" [(ngModel)]="templateCountry" optionLabel="name"
                        [placeholder]="t().selectCountry" style="max-width: 16rem; width: 100%">
                        <ng-template #selectedItemTemplate let-country>
                            @if (country) {
                                <div class="cz-flex cz-items-center cz-gap-sm">
                                    <span>{{ countryFlags[country.code] }}</span><span>{{ country.name }}</span>
                                </div>
                            }
                        </ng-template>
                        <ng-template #itemTemplate let-country>
                            <div class="cz-flex cz-items-center cz-gap-sm">
                                <span>{{ countryFlags[country.code] }}</span><span>{{ country.name }}</span>
                            </div>
                        </ng-template>
                        <ng-template #dropdownIconTemplate>
                            <svg [lucideIcon]="MapIcon" [size]="18"></svg>
                        </ng-template>
                        <ng-template #headerTemplate>
                            <div class="cz-font-medium">{{ t().availableCountries }}</div>
                        </ng-template>
                        <ng-template #footerTemplate>
                            <cz-button [label]="t().addNew" severity="secondary" variant="text" size="sm" [icon]="PlusIcon" />
                        </ng-template>
                    </cz-select>
                </div>
                <app-code [code]="templateCode" />
            </section>

            <!-- ── VIRTUAL SCROLL ── -->
            <section>
                <h2 id="virtualscroll">{{ t().virtualScroll }}</h2>
                <p>{{ t().virtualScrollDesc }}</p>
                <div class="cz-flex cz-justify-center cz-mb-md">
                    <cz-select [options]="virtualItems" [(ngModel)]="virtualItem" [placeholder]="t().selectItem"
                        [virtualScroll]="true" [virtualScrollItemSize]="32" style="max-width: 16rem; width: 100%" />
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
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labels }}</h2>
                <p>{{ t().labelsDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="labelCity1" optionLabel="name" [label]="t().labelRight" labelPosition="float" />
                    <cz-select [options]="cities" [(ngModel)]="labelCity2" optionLabel="name" [label]="t().labelLeft" labelPosition="over" />
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── COLORS ── -->
            <section>
                <h2 id="colors">{{ t().colors }}</h2>
                <p>{{ t().colorsDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-select [options]="cities" [(ngModel)]="colorCity" optionLabel="name" color="primary" label="Primary" labelPosition="float" />
                    <cz-select [options]="cities" [(ngModel)]="colorCity" optionLabel="name" color="success" label="Success" labelPosition="float" />
                    <cz-select [options]="cities" [(ngModel)]="colorCity" optionLabel="name" color="danger" label="Danger" labelPosition="float" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── THEMES ── -->
            <section>
                <h2 id="themes">{{ t().neoTheme }} / {{ t().glassTheme }}</h2>
                <div class="cz-grid cz-grid-cols-1 cz-md:grid-cols-2 cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" data-theme="neo">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Neo Theme</small>
                        <cz-select [options]="cities" [(ngModel)]="themeCity" optionLabel="name" [placeholder]="t().selectCity" />
                    </div>
                    <div class="cz-p-md cz-border cz-rounded-lg cz-bg-dark" data-theme="glass">
                        <small class="cz-text-muted cz-mb-sm cz-display-block">Glass Theme</small>
                        <cz-select [options]="cities" [(ngModel)]="themeCity" optionLabel="name" [placeholder]="t().selectCity" />
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
                            <tr><td><code>optionLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Name of the label field of an option.</td></tr>
                            <tr><td><code>optionValue</code></td><td><code>string</code></td><td><code>''</code></td><td>Name of the value field of an option.</td></tr>
                            <tr><td><code>optionDisabled</code></td><td><code>string | (item) =&gt; boolean</code></td><td><code>null</code></td><td>Name of the disabled field or predicate.</td></tr>
                            <tr><td><code>multiple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When enabled, allows multiple items to be selected.</td></tr>
                            <tr><td><code>checkmark</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the selected option will be shown with a check mark.</td></tr>
                            <tr><td><code>editable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When present, custom value instead of predefined options can be entered.</td></tr>
                            <tr><td><code>filter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays an input field to filter the items.</td></tr>
                            <tr><td><code>filterBy</code></td><td><code>string</code></td><td><code>''</code></td><td>Field(s) (comma separated) to search against.</td></tr>
                            <tr><td><code>filterMatchMode</code></td><td><code>CzSelectFilterMatchMode</code></td><td><code>'contains'</code></td><td>Defines how the items are filtered.</td></tr>
                            <tr><td><code>showClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>When enabled, a clear icon is displayed to clear the value.</td></tr>
                            <tr><td><code>group</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether to display options as grouped.</td></tr>
                            <tr><td><code>optionGroupLabel / optionGroupChildren</code></td><td><code>string</code></td><td><code>'label' / 'items'</code></td><td>Group field names.</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the select is in loading state.</td></tr>
                            <tr><td><code>lazy</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Defines if data is loaded and interacted with in lazy manner.</td></tr>
                            <tr><td><code>virtualScroll</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the data should be loaded on demand during scroll.</td></tr>
                            <tr><td><code>virtualScrollItemSize</code></td><td><code>number</code></td><td><code>34</code></td><td>Height of an item in the list for VirtualScrolling.</td></tr>
                            <tr><td><code>scrollHeight</code></td><td><code>string</code></td><td><code>''</code></td><td>Height of the list viewport.</td></tr>
                            <tr><td><code>resetFilterOnHide</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Clears the filter value when hiding the panel.</td></tr>
                            <tr><td><code>focusOnHover</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Focus on options when hovering them.</td></tr>
                            <tr><td><code>selectOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Determines if the option will be selected on focus.</td></tr>
                            <tr><td><code>autoOptionFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focus the first visible or selected element when the panel is shown.</td></tr>
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
                            <tr><td><code>onChange</code></td><td><code>CzSelectChangeEvent</code></td><td>Callback to invoke when the value changes.</td></tr>
                            <tr><td><code>onFilter</code></td><td><code>CzSelectFilterEvent</code></td><td>Callback to invoke when data is filtered.</td></tr>
                            <tr><td><code>onFocus / onBlur</code></td><td><code>Event</code></td><td>Focus events.</td></tr>
                            <tr><td><code>onClick</code></td><td><code>MouseEvent</code></td><td>Callback to invoke when the component is clicked.</td></tr>
                            <tr><td><code>onShow / onHide</code></td><td><code>Event</code></td><td>Callback to invoke when the overlay becomes visible or hidden.</td></tr>
                            <tr><td><code>onClear</code></td><td><code>Event</code></td><td>Callback to invoke when the value is cleared.</td></tr>
                            <tr><td><code>onLazyLoad</code></td><td><code>CzSelectLazyLoadEvent</code></td><td>Callback to invoke in lazy mode to load new data.</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="templates">{{ t().templates }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Context</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>#itemTemplate</code></td><td><code>let-option</code></td><td>Custom option content.</td></tr>
                            <tr><td><code>#selectedItemTemplate</code></td><td><code>let-selectedOption</code></td><td>Custom trigger content (option or value array in multiple mode).</td></tr>
                            <tr><td><code>#groupTemplate</code></td><td><code>let-group</code></td><td>Custom group header.</td></tr>
                            <tr><td><code>#headerTemplate</code></td><td>—</td><td>Custom header above the list.</td></tr>
                            <tr><td><code>#footerTemplate</code></td><td>—</td><td>Custom footer below the list.</td></tr>
                            <tr><td><code>#filterTemplate</code></td><td><code>let-options="options"</code></td><td>Custom filter input (<code>options.filter(event)</code>, <code>options.reset()</code>).</td></tr>
                            <tr><td><code>#emptyTemplate / #emptyFilterTemplate</code></td><td>—</td><td>Custom empty states.</td></tr>
                            <tr><td><code>#dropdownIconTemplate / #clearIconTemplate / #loadingIconTemplate</code></td><td>—</td><td>Custom icons.</td></tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="methods">{{ t().methods }}</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead><tr><th>Name</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>show() / hide()</code></td><td>Displays or hides the panel.</td></tr>
                            <tr><td><code>focus()</code></td><td>Applies focus to the trigger.</td></tr>
                            <tr><td><code>clear(event?)</code></td><td>Clears the model.</td></tr>
                            <tr><td><code>resetFilter()</code></td><td>Resets the filter value.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class SelectDocPage {
    private readonly langService = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => SELECT_DOC_I18N[this.langService.currentLang()] || SELECT_DOC_I18N.es);

    readonly SearchIcon = LucideSearch;
    readonly XIcon = LucideX;
    readonly MapIcon = LucideMap;
    readonly PlusIcon = LucidePlus;

    readonly languages = [
        { label: 'English', value: 'en' },
        { label: 'Deutsch', value: 'de' },
        { label: 'Español', value: 'es' },
        { label: 'Français', value: 'fr' },
        { label: 'Italiano', value: 'it' },
        { label: 'Türkçe', value: 'tr' },
        { label: '日本語', value: 'ja' },
        { label: '中文', value: 'zh' },
    ];

    readonly languagesFull = this.languages.map((l, i) => ({
        ...l,
        flag: ['🇺🇸', '🇩🇪', '🇪🇸', '🇫🇷', '🇮🇹', '🇹🇷', '🇯🇵', '🇨🇳'][i],
    }));

    readonly cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' },
    ];

    readonly themes = [
        { label: 'Light', value: 'light', icon: '☀️', description: 'Clean and bright interface' },
        { label: 'Dark', value: 'dark', icon: '🌙', description: 'Easy on the eyes' },
        { label: 'System', value: 'system', icon: '💻', description: 'Match your device settings' },
        { label: 'High Contrast', value: 'high-contrast', icon: '◐', description: 'Maximum readability' },
    ];

    readonly members = [
        { name: 'Amy Elsner', code: 'AE', initials: 'AE' },
        { name: 'Anna Fali', code: 'AF', initials: 'AF' },
        { name: 'Asiya Javayant', code: 'AJ', initials: 'AJ' },
        { name: 'Bernardo Dominic', code: 'BD', initials: 'BD' },
        { name: 'Elwin Sharvill', code: 'ES', initials: 'ES' },
        { name: 'Ioni Bowcher', code: 'IB', initials: 'IB' },
        { name: 'Ivan Magalhaes', code: 'IM', initials: 'IM' },
        { name: 'Stephen Shaw', code: 'SS', initials: 'SS' },
    ];

    readonly categories = [
        { label: 'Electronics', value: 'electronics', count: 1247 },
        { label: 'Clothing', value: 'clothing', count: 856 },
        { label: 'Garden', value: 'home', count: 634 },
        { label: 'Sports', value: 'sports', count: 421 },
        { label: 'Books', value: 'books', count: 2103 },
        { label: 'Toys', value: 'toys', count: 312 },
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
            label: 'Germany', value: 'DE',
            items: [
                { label: 'Berlin', value: 'Berlin' },
                { label: 'Frankfurt', value: 'Frankfurt' },
                { label: 'Hamburg', value: 'Hamburg' },
                { label: 'Munich', value: 'Munich' },
            ],
        },
        {
            label: 'USA', value: 'US',
            items: [
                { label: 'Chicago', value: 'Chicago' },
                { label: 'Los Angeles', value: 'Los Angeles' },
                { label: 'New York', value: 'New York' },
                { label: 'San Francisco', value: 'San Francisco' },
            ],
        },
        {
            label: 'Japan', value: 'JP',
            items: [
                { label: 'Kyoto', value: 'Kyoto' },
                { label: 'Osaka', value: 'Osaka' },
                { label: 'Tokyo', value: 'Tokyo' },
                { label: 'Yokohama', value: 'Yokohama' },
            ],
        },
    ];

    readonly jobCategories = [
        {
            label: 'Engineering', value: 'eng',
            items: [
                { label: 'Frontend Developer', value: 'frontend' },
                { label: 'Backend Developer', value: 'backend' },
                { label: 'Full Stack Developer', value: 'fullstack' },
                { label: 'DevOps Engineer', value: 'devops' },
                { label: 'QA Engineer', value: 'qa' },
            ],
        },
        {
            label: 'Design', value: 'design',
            items: [
                { label: 'UI Designer', value: 'ui' },
                { label: 'UX Designer', value: 'ux' },
                { label: 'Product Designer', value: 'product-design' },
                { label: 'Brand Designer', value: 'brand' },
            ],
        },
        {
            label: 'Product', value: 'product',
            items: [
                { label: 'Product Manager', value: 'pm' },
                { label: 'Product Owner', value: 'po' },
                { label: 'Business Analyst', value: 'ba' },
            ],
        },
        {
            label: 'Marketing', value: 'marketing',
            items: [
                { label: 'Growth Manager', value: 'growth' },
                { label: 'Content Strategist', value: 'content' },
                { label: 'SEO Specialist', value: 'seo' },
            ],
        },
    ];

    readonly labelGroups = [
        { label: 'Critical', value: 'critical', items: [{ label: 'Security', value: 'security' }, { label: 'Performance', value: 'performance' }] },
        { label: 'Optional', value: 'optional', items: [{ label: 'Feature', value: 'feature' }, { label: 'Other', value: 'other' }] },
    ];

    readonly toppings = [
        { label: 'Pepperoni', value: 'pepperoni' },
        { label: 'Mushrooms', value: 'mushrooms' },
        { label: 'Onions', value: 'onions' },
        { label: 'Black Olives', value: 'olives' },
        { label: 'Green Peppers', value: 'peppers' },
        { label: 'Mozzarella', value: 'mozzarella' },
        { label: 'Basil', value: 'basil' },
        { label: 'Tomatoes', value: 'tomatoes' },
    ];

    readonly teamMembers = [
        { name: 'Sarah Chen', role: 'Engineering Lead', initials: 'SC', statusColor: '#fbbf24' },
        { name: 'Alex Rivera', role: 'Senior Developer', initials: 'AR', statusColor: '#4ade80' },
        { name: 'Jordan Kim', role: 'UX Designer', initials: 'JK', statusColor: '#fbbf24' },
        { name: 'Taylor Morgan', role: 'Product Manager', initials: 'TM', statusColor: '#a1a1aa' },
        { name: 'Morgan Lee', role: 'DevOps Engineer', initials: 'ML', statusColor: '#4ade80' },
        { name: 'Casey Jones', role: 'QA Engineer', initials: 'CJ', statusColor: '#f87171' },
    ];

    readonly virtualItems = Array.from({ length: 10000 }, (_, i) => ({ label: 'Item ' + i, value: 'Item ' + i }));

    // Demo state
    selectedLanguage: string | undefined;
    selectedCities = signal<string[]>([]);
    selectedTheme: any;
    selectedMembers = signal<string[]>([]);
    selectedCategory: any;
    filteredCountry: any;
    customFilterValue = '';
    groupedCity: string | undefined;
    editableCity: any;
    filledCity: any;
    selectedCountry: any;
    floatCity1: any;
    floatCity2: any;
    floatCity3: any;
    fluidCity: any;
    autoOptionFocus = signal(true);
    selectOnFocus = signal(false);
    focusOnHover = signal(true);
    focusCity: string | undefined;
    selectedPosition: string | undefined;
    selectedLabels = signal<string[]>(['security']);
    iftaCity: any;
    invalidCity1: any;
    invalidCity2: any;
    lazyItem: any;
    loadingCity: any;
    selectedToppings = signal<string[]>([]);
    assignee: any;
    previewLanguage: any;
    templateCity: any;
    sizeCity1: any;
    sizeCity2: any;
    sizeCity3: any;
    templateCountry: any;
    virtualItem: string | undefined;
    labelCity1: any;
    labelCity2: any;
    colorCity: any;
    themeCity: any;

    // Lazy virtual scroll demo state
    lazyItems = signal<any[]>(Array.from({ length: 10000 }, (_, i) => ({ label: 'Item ' + i, value: 'Item ' + i })));
    lazyLoading = signal(false);
    private lazyTimeout: any;

    readonly exampleForm = new FormGroup({
        city: new FormControl<City | null>(null, Validators.required),
    });
    formSubmitted = false;

    // Computeds for the checkbox selection demo
    allCitiesSelected = computed(() => this.selectedCities().length === this.cities.length);
    citiesIndeterminate = computed(() => this.selectedCities().length > 0 && !this.allCitiesSelected());
    citiesTriggerLabel = computed(() => this.buildTriggerLabel(this.selectedCities(), this.cities, 'name'));
    toppingsTriggerLabel = computed(() => this.buildTriggerLabel(this.selectedToppings(), this.toppings, 'label'));
    labelsTriggerLabel = computed(() => {
        const all = this.labelGroups.flatMap((g) => g.items);
        return this.buildTriggerLabel(this.selectedLabels(), all, 'label');
    });

    private buildTriggerLabel(values: string[], source: any[], labelField: string): string {
        if (!values.length) return '';
        const first = source.find((o) => o.value === values[0])?.[labelField] ?? values[0];
        return values.length > 1 ? `${first} (+${values.length - 1} more)` : first;
    }

    isCitySelected(city: City): boolean {
        return this.selectedCities().includes(city.code);
    }

    onToggleAllCities(checked: boolean): void {
        this.selectedCities.set(checked ? this.cities.map((c) => c.code) : []);
    }

    getMemberFirstName(code: string): string {
        const member = this.members.find((m) => m.code === code);
        return member ? member.name.split(' ')[0] : code;
    }

    removeMember(event: MouseEvent, code: string): void {
        event.stopPropagation();
        this.selectedMembers.update((list) => list.filter((c) => c !== code));
    }

    resetCustomFilter(options: { reset: () => void }): void {
        options.reset();
        this.customFilterValue = '';
    }

    selectAllLabels(): void {
        this.selectedLabels.set(this.labelGroups.flatMap((g) => g.items.map((i) => i.value)));
    }

    onLazyLoad(event: CzSelectLazyLoadEvent): void {
        this.lazyLoading.set(true);
        if (this.lazyTimeout) clearTimeout(this.lazyTimeout);
        this.lazyTimeout = setTimeout(() => {
            const { first, last } = event;
            const items = [...this.lazyItems()];
            for (let i = first; i < last; i++) {
                items[i] = { label: `Item #${i}`, value: i };
            }
            this.lazyItems.set(items);
            this.lazyLoading.set(false);
        }, 400);
    }

    onSubmit(): void {
        this.formSubmitted = true;
        if (this.exampleForm.valid) {
            this.toast.success(this.t().formSubmitted, 'Select');
        }
    }

    onTemplateSubmit(form: NgForm): void {
        if (form.valid && this.templateCity) {
            this.toast.success(this.t().formSubmitted, 'Select');
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.exampleForm.get(controlName);
        return !!control?.invalid && (control.touched || this.formSubmitted);
    }

    importCode: Code = {
        typescript: `import { CzSelectComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-select [options]="languages" [(ngModel)]="selectedLanguage"
    optionLabel="label" optionValue="value" placeholder="Select a language" />`,
        typescript: `languages = [
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' }
];
selectedLanguage: string | undefined;`
    };

    checkboxSelectionCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="selectedCities" [multiple]="true"
    optionLabel="name" optionValue="code" [showClear]="true" placeholder="Select Cities">
    <ng-template #headerTemplate>
        <cz-checkbox [ngModel]="allSelected()" [binary]="true" [indeterminate]="indeterminate()"
            (ngModelChange)="onToggleAll($event)" label="Select All" />
    </ng-template>
    <ng-template #selectedItemTemplate>
        <span>{{ getLabel() }}</span>
    </ng-template>
    <ng-template #itemTemplate let-city>
        <div class="flex items-center gap-2">
            <cz-checkbox [ngModel]="isItemSelected(city)" [binary]="true" [readonly]="true" [tabindex]="-1" />
            <span>{{ city.name }}</span>
        </div>
    </ng-template>
</cz-select>`
    };

    checkmarkCode: Code = {
        html: `<cz-select [options]="themes" [(ngModel)]="selectedTheme" [checkmark]="true"
    optionLabel="label" placeholder="Select a Theme" scrollHeight="auto">`
    };

    chipsCode: Code = {
        html: `<cz-select [options]="members" [(ngModel)]="selected" [multiple]="true"
    optionLabel="name" optionValue="code" [showClear]="true" placeholder="Select Members">
    <ng-template #selectedItemTemplate>
        <div class="flex flex-wrap gap-1">
            @for (code of selected(); track code) {
                <cz-chip [label]="getFirstName(code)" [removable]="true"
                    (onRemove)="removeItem($event, code)" />
            }
        </div>
    </ng-template>
</cz-select>`
    };

    clearCode: Code = {
        html: `<cz-select [options]="categories" [(ngModel)]="selectedCategory"
    optionLabel="label" placeholder="Category" [showClear]="true">
    <ng-template #itemTemplate let-category>
        <div class="flex items-center justify-between w-full">
            <span>{{ category.label }}</span>
            <cz-tag [value]="'' + category.count" severity="secondary" [rounded]="true" />
        </div>
    </ng-template>
</cz-select>`
    };

    customFilterCode: Code = {
        html: `<cz-select [options]="countries" [(ngModel)]="selectedCountry" optionLabel="name"
    [filter]="true" filterBy="name" [showClear]="true" placeholder="Select a Country">
    <ng-template #filterTemplate let-options="options">
        <div class="flex gap-1" (click)="$event.stopPropagation()">
            <cz-input-group>
                <cz-input-group-addon><svg [lucideIcon]="SearchIcon" [size]="14"></svg></cz-input-group-addon>
                <input class="cz-input-native" placeholder="Filter"
                    [(ngModel)]="filterValue" (keyup)="options.filter($event)" />
            </cz-input-group>
            <cz-button [iconOnly]="true" [icon]="XIcon" severity="secondary" variant="outlined" size="sm"
                (onClick)="resetFilter(options)" />
        </div>
    </ng-template>
</cz-select>`
    };

    customGroupCode: Code = {
        html: `<cz-select [options]="groupedCities" [(ngModel)]="selectedCity" [group]="true"
    placeholder="Select a City">
    <ng-template #groupTemplate let-group>
        <div class="flex items-center gap-2">
            <span>{{ countryFlags[group.value] }}</span>
            <span>{{ group.label }}</span>
        </div>
    </ng-template>
</cz-select>`
    };

    disabledCode: Code = {
        html: `<cz-select [options]="cities" [ngModel]="value" optionLabel="name" [disabled]="true"
    placeholder="Select a City" />`
    };

    editableCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" [editable]="true"
    optionLabel="name" placeholder="Select a City" />`
    };

    filledCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" variant="filled"
    optionLabel="name" placeholder="Select a City" />`
    };

    filterCode: Code = {
        html: `<cz-select [options]="countries" [(ngModel)]="selectedCountry" optionLabel="name"
    [filter]="true" filterBy="name" [showClear]="true" placeholder="Select a Country" />`
    };

    floatLabelCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    label="Over Label" labelPosition="over" />
<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    label="In Label" labelPosition="in" variant="filled" />
<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    label="Float Label" labelPosition="float" />`
    };

    fluidCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    placeholder="Select a City" [fluid]="true" />`
    };

    focusBehaviorCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name" optionValue="code"
    [autoOptionFocus]="autoOptionFocus" [selectOnFocus]="selectOnFocus"
    [focusOnHover]="focusOnHover" placeholder="Select a city" />`,
        typescript: `autoOptionFocus = signal(true);
selectOnFocus = signal(false);
focusOnHover = signal(true);`
    };

    groupCode: Code = {
        html: `<cz-select [options]="jobCategories" [(ngModel)]="selectedPosition" [group]="true"
    optionLabel="label" optionValue="value" placeholder="Select a position..." />`,
        typescript: `jobCategories = [
    { label: 'Engineering', value: 'eng', items: [{ label: 'Frontend Developer', value: 'frontend' }] },
    { label: 'Design', value: 'design', items: [{ label: 'UI Designer', value: 'ui' }] }
];`
    };

    groupCheckboxFilterCode: Code = {
        html: `<cz-select [options]="labelGroups" [(ngModel)]="selected" [multiple]="true" [group]="true"
    [filter]="true" filterBy="label" filterPlaceholder="Search..."
    optionLabel="label" optionValue="value" placeholder="Select labels">
    <ng-template #headerTemplate>
        <button (click)="selectAll()">Select All</button>
        <button (click)="selected.set([])">Clear</button>
    </ng-template>
    <ng-template #groupTemplate let-group>
        <span class="text-xs font-semibold uppercase">{{ group.label }}</span>
    </ng-template>
    <ng-template #itemTemplate let-item>
        <div class="flex items-center gap-2">
            <cz-checkbox [ngModel]="selected().includes(item.value)" [binary]="true" [readonly]="true" [tabindex]="-1" />
            <span>{{ item.label }}</span>
        </div>
    </ng-template>
</cz-select>`
    };

    iftaLabelCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    label="City" labelPosition="in" />`
    };

    invalidCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name" [showClear]="true"
    [invalid]="true" placeholder="Select a City" />
<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name" [showClear]="true"
    [invalid]="true" variant="filled" placeholder="Select a City" />`
    };

    lazyVirtualScrollCode: Code = {
        html: `<cz-select [options]="items()" [(ngModel)]="selectedItem" placeholder="Select Item"
    [virtualScroll]="true" [virtualScrollItemSize]="32" [lazy]="true" [loading]="loading()"
    (onLazyLoad)="onLazyLoad($event)" />`,
        typescript: `onLazyLoad(event: CzSelectLazyLoadEvent) {
    this.loading.set(true);
    setTimeout(() => {
        const { first, last } = event;
        const items = [...this.items()];
        for (let i = first; i < last; i++) {
            items[i] = { label: 'Item #' + i, value: i };
        }
        this.items.set(items);
        this.loading.set(false);
    }, 400);
}`
    };

    loadingStateCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" [loading]="true"
    optionLabel="name" placeholder="Loading..." />`
    };

    multipleCode: Code = {
        html: `<cz-select [options]="toppings" [(ngModel)]="selected" [multiple]="true" [checkmark]="true"
    optionLabel="label" optionValue="value" [showClear]="true" placeholder="Select Toppings">
    <ng-template #selectedItemTemplate>
        <span>{{ getLabel() }}</span>
    </ng-template>
</cz-select>`
    };

    customOptionCode: Code = {
        html: `<cz-select [options]="teamMembers" [(ngModel)]="assignee" optionLabel="name"
    placeholder="Select team member...">
    <ng-template #itemTemplate let-member>
        <div class="flex items-center gap-3">
            <cz-avatar [label]="member.initials" size="sm" />
            <div class="flex flex-col">
                <span class="font-medium">{{ member.name }}</span>
                <span class="text-xs text-surface-500">{{ member.role }}</span>
            </div>
        </div>
    </ng-template>
</cz-select>`
    };

    previewCode: Code = {
        html: `<cz-select [options]="languages" [(ngModel)]="selectedLanguage" optionLabel="label"
    [filter]="true" filterBy="label" [checkmark]="true" placeholder="Select a language">
    <ng-template #selectedItemTemplate let-language>
        @if (language) {
            <div class="flex items-center gap-2">
                <span>{{ language.flag }}</span><span>{{ language.label }}</span>
            </div>
        }
    </ng-template>
</cz-select>`
    };

    formsCode: Code = {
        html: `<!-- Reactive forms -->
<form [formGroup]="exampleForm" (ngSubmit)="onSubmit()">
    <cz-select formControlName="city" [options]="cities" [invalid]="isInvalid('city')"
        optionLabel="name" placeholder="Select a City" [fluid]="true" />
    @if (isInvalid('city')) {
        <cz-message severity="danger" text="City is required." />
    }
    <cz-button label="Submit" type="submit" />
</form>

<!-- Template-driven forms -->
<form #form="ngForm" (ngSubmit)="onSubmit(form)">
    <cz-select #city="ngModel" name="city" [(ngModel)]="value" [options]="cities" optionLabel="name"
        required [invalid]="!!(city.invalid && (city.touched || form.submitted))" [fluid]="true" />
</form>`
    };

    sizesCode: Code = {
        html: `<cz-select [(ngModel)]="value1" [options]="cities" optionLabel="name" size="sm" placeholder="Small" />
<cz-select [(ngModel)]="value2" [options]="cities" optionLabel="name" placeholder="Normal" />
<cz-select [(ngModel)]="value3" [options]="cities" optionLabel="name" size="lg" placeholder="Large" />`
    };

    templateCode: Code = {
        html: `<cz-select [options]="countries" [(ngModel)]="selectedCountry" optionLabel="name"
    placeholder="Select a country">
    <ng-template #selectedItemTemplate let-country>...</ng-template>
    <ng-template #itemTemplate let-country>...</ng-template>
    <ng-template #dropdownIconTemplate>
        <svg [lucideIcon]="MapIcon" [size]="18"></svg>
    </ng-template>
    <ng-template #headerTemplate>
        <div class="font-medium">Available Countries</div>
    </ng-template>
    <ng-template #footerTemplate>
        <cz-button label="Add New" severity="secondary" variant="text" size="sm" [icon]="PlusIcon" />
    </ng-template>
</cz-select>`
    };

    virtualScrollCode: Code = {
        html: `<cz-select [options]="items" [(ngModel)]="selectedItem" placeholder="Select Item"
    [virtualScroll]="true" [virtualScrollItemSize]="32" />`,
        typescript: `items = Array.from({ length: 10000 }, (_, i) => ({ label: 'Item ' + i, value: 'Item ' + i }));`
    };

    labelsCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    label="Rate your experience" labelPosition="float" />
<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    label="Calificación" labelPosition="over" />`
    };

    colorsCode: Code = {
        html: `<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    color="primary" label="Primary" labelPosition="float" />
<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    color="success" label="Success" labelPosition="float" />
<cz-select [options]="cities" [(ngModel)]="value" optionLabel="name"
    color="danger" label="Danger" labelPosition="float" />`
    };

    themesCode: Code = {
        html: `<div data-theme="neo">
    <cz-select [options]="cities" [(ngModel)]="value" optionLabel="name" placeholder="Select a City" />
</div>

<div data-theme="glass">
    <cz-select [options]="cities" [(ngModel)]="value" optionLabel="name" placeholder="Select a City" />
</div>`
    };
}
