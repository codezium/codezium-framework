import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    CzIconFieldComponent,
    CzInputIconComponent,
    CzInputTextComponent,
    CzPasswordComponent,
    CzSelectComponent,
    CzTextAreaComponent
} from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { ICON_FIELD_DOC_I18N } from './icon-field-doc.i18n';
import { FormsModule } from '@angular/forms';
import { 
    Search, 
    User, 
    Lock, 
    Check, 
    Info, 
    MapPin, 
    MessageSquare 
} from 'lucide-angular';

@Component({
    selector: 'app-icon-field-doc',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CzIconFieldComponent,
        CzInputIconComponent,
        CzInputTextComponent,
        CzPasswordComponent,
        CzSelectComponent,
        CzTextAreaComponent,
        AppCodeComponent
    ],
    template: `
        <div class="cz-docs-container">
            <header class="cz-docs-header">
                <h1 class="cz-h1">{{ t().title }}</h1>
                <p class="cz-lead">{{ t().description }}</p>
            </header>

            <section class="cz-docs-section">
                <h2 class="cz-h2">{{ t().import }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section class="cz-docs-section">
                <h2 class="cz-h2">{{ t().usage }}</h2>
                <p class="cz-mb-md">{{ t().usageDescription }}</p>
                
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <cz-icon-field iconPosition="left">
                        <cz-input-icon [icon]="SearchIcon" />
                        <cz-input-text label="Search" labelPosition="float" />
                    </cz-icon-field>

                    <cz-icon-field iconPosition="right">
                        <cz-input-icon [icon]="UserIcon" />
                        <cz-input-text label="Username" labelPosition="over" placeholder="Enter username" />
                    </cz-icon-field>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section class="cz-docs-section">
                <h2 class="cz-h2">{{ t().dynamic }}</h2>
                <p class="cz-mb-md">{{ t().dynamicDescription }}</p>
                
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <div class="cz-flex cz-gap-sm cz-mb-sm">
                        <button class="cz-btn cz-btn--primary" (click)="currentIcon.set(UserIcon)">User</button>
                        <button class="cz-btn cz-btn--secondary" (click)="currentIcon.set(LockIcon)">Lock</button>
                        <button class="cz-btn cz-btn--success" (click)="currentIcon.set(CheckIcon)">Check</button>
                        <button class="cz-btn cz-btn--info" (click)="currentIcon.set(InfoIcon)">Info</button>
                    </div>

                    <cz-icon-field iconPosition="left">
                        <cz-input-icon [icon]="currentIcon()" />
                        <cz-input-text label="Animated Icon" />
                    </cz-icon-field>
                </div>
                <app-code [code]="dynamicCode" />
            </section>

            <section class="cz-docs-section">
                <h2 class="cz-h2">{{ t().colors }}</h2>
                <p class="cz-mb-md">{{ t().colorsDescription }}</p>
                
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <div class="cz-flex cz-flex-wrap cz-gap-lg">
                        <cz-icon-field iconPosition="left">
                            <cz-input-icon [icon]="SearchIcon" color="primary" />
                            <cz-input-text label="Primary" />
                        </cz-icon-field>

                        <cz-icon-field iconPosition="left">
                            <cz-input-icon [icon]="CheckIcon" color="success" />
                            <cz-input-text label="Success" />
                        </cz-icon-field>

                        <cz-icon-field iconPosition="left">
                            <cz-input-icon [icon]="InfoIcon" color="info" />
                            <cz-input-text label="Info" />
                        </cz-icon-field>

                        <cz-icon-field iconPosition="left">
                            <cz-input-icon [icon]="LockIcon" color="#e11d48" />
                            <cz-input-text label="Hex Color (#e11d48)" />
                        </cz-icon-field>
                    </div>
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <section class="cz-docs-section">
                <h2 class="cz-h2">{{ t().sizes }}</h2>
                <p class="cz-mb-md">{{ t().sizesDescription }}</p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <cz-icon-field size="sm" iconPosition="left">
                        <cz-input-icon [icon]="SearchIcon" />
                        <cz-input-text size="sm" label="Small Field" />
                    </cz-icon-field>

                    <cz-icon-field size="md" iconPosition="left">
                        <cz-input-icon [icon]="SearchIcon" />
                        <cz-input-text size="md" label="Medium Field" />
                    </cz-icon-field>

                    <cz-icon-field size="lg" iconPosition="left">
                        <cz-input-icon [icon]="SearchIcon" />
                        <cz-input-text size="lg" label="Large Field" />
                    </cz-icon-field>
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <section class="cz-docs-section">
                <h2 class="cz-h2">{{ t().fluid }}</h2>
                <p class="cz-mb-md">{{ t().fluidDescription }}</p>
                <div class="cz-flex cz-mb-md">
                    <cz-icon-field [fluid]="true">
                        <cz-input-icon [icon]="SearchIcon" />
                        <cz-input-text [fluid]="true" label="Fluid Field" />
                    </cz-icon-field>
                </div>
                <app-code [code]="fluidCode" />
            </section>

            <section class="cz-docs-section">
                <h2 class="cz-h2">{{ t().components }}</h2>
                <p class="cz-mb-md">{{ t().componentsDescription }}</p>
                
                <div class="cz-flex cz-flex-col cz-gap-xl cz-mb-md">
                    <!-- Password -->
                    <div class="cz-flex cz-flex-col cz-gap-sm">
                        <h3 class="cz-h3">Password</h3>
                        <cz-icon-field iconPosition="left">
                            <cz-input-icon [icon]="LockIcon" />
                            <cz-password label="Password" [toggleMask]="true" />
                        </cz-icon-field>
                    </div>

                    <!-- Select -->
                    <div class="cz-flex cz-flex-col cz-gap-sm">
                        <h3 class="cz-h3">Select</h3>
                        <cz-icon-field iconPosition="left">
                            <cz-input-icon [icon]="MapPinIcon" />
                            <cz-select [options]="cities" optionLabel="label" optionValue="value" label="City" placeholder="Select a city" />
                        </cz-icon-field>
                    </div>

                    <!-- TextArea -->
                    <div class="cz-flex cz-flex-col cz-gap-sm">
                        <h3 class="cz-h3">TextArea</h3>
                        <cz-icon-field iconPosition="left">
                            <cz-input-icon [icon]="MessageSquareIcon" />
                            <cz-textarea label="Comments" [rows]="2" />
                        </cz-icon-field>
                    </div>
                </div>
                <app-code [code]="componentsCode" />
            </section>

            <!-- API Reference -->
            <section class="cz-docs-section">
                <h2 id="api" class="cz-h2 cz-mb-md">{{ t().properties }}</h2>
                
                <h3 class="cz-h3 cz-mb-sm">CzIconField</h3>
                <div class="doc-table-wrapper cz-card cz-overflow-hidden cz-mb-xl">
                    <table class="doc-table">
                        <thead>
                            <tr>
                                <th>{{ t().propName }}</th>
                                <th>{{ t().propType }}</th>
                                <th>{{ t().propDefault }}</th>
                                <th>{{ t().propDescription }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>iconPosition</code></td>
                                <td><code>'left' | 'right'</code></td>
                                <td><code>'left'</code></td>
                                <td>Position of the icon relative to the input.</td>
                            </tr>
                            <tr>
                                <td><code>size</code></td>
                                <td><code>'sm' | 'md' | 'lg'</code></td>
                                <td><code>'md'</code></td>
                                <td>Size of the field and its internal spacing.</td>
                            </tr>
                            <tr>
                                <td><code>fluid</code></td>
                                <td><code>boolean</code></td>
                                <td><code>false</code></td>
                                <td>Whether the component should span the full width of its container.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="cz-h3 cz-mb-sm">CzInputIcon</h3>
                <div class="doc-table-wrapper cz-card cz-overflow-hidden">
                    <table class="doc-table">
                        <thead>
                            <tr>
                                <th>{{ t().propName }}</th>
                                <th>{{ t().propType }}</th>
                                <th>{{ t().propDefault }}</th>
                                <th>{{ t().propDescription }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>icon</code></td>
                                <td><code>string | LucideIconData</code></td>
                                <td><code>-</code></td>
                                <td><strong>Required.</strong> The icon to display.</td>
                            </tr>
                            <tr>
                                <td><code>size</code></td>
                                <td><code>number</code></td>
                                <td><code>18</code></td>
                                <td>Size of the icon in pixels.</td>
                            </tr>
                            <tr>
                                <td><code>color</code></td>
                                <td><code>string</code></td>
                                <td><code>undefined</code></td>
                                <td>Semantic color name or a valid CSS color value.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class IconFieldDocPage {
    private readonly langService = inject(LanguageService);
    readonly t = computed(() => ICON_FIELD_DOC_I18N[this.langService.currentLang()] || ICON_FIELD_DOC_I18N.es);

    readonly SearchIcon = Search;
    readonly UserIcon = User;
    readonly LockIcon = Lock;
    readonly CheckIcon = Check;
    readonly InfoIcon = Info;
    readonly MapPinIcon = MapPin;
    readonly MessageSquareIcon = MessageSquare;

    currentIcon = signal<any>(User);

    cities = [
        { label: 'New York', value: 'NY' },
        { label: 'Rome', value: 'RM' },
        { label: 'London', value: 'LDN' },
        { label: 'Istanbul', value: 'IST' },
        { label: 'Paris', value: 'PRS' }
    ];

    importCode: Code = {
        typescript: `import { CzIconFieldComponent, CzInputIconComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `
<cz-icon-field iconPosition="left">
    <cz-input-icon [icon]="SearchIcon" />
    <cz-input-text label="Search" />
</cz-icon-field>

<cz-icon-field iconPosition="right">
    <cz-input-icon [icon]="UserIcon" />
    <cz-input-text label="Username" />
</cz-icon-field>`,
        typescript: `
import { Search, User } from 'lucide-angular';

@Component({ ... })
export class MyComponent {
    SearchIcon = Search;
    UserIcon = User;
}`
    };

    dynamicCode: Code = {
        html: `
<cz-icon-field iconPosition="left">
    <cz-input-icon [icon]="currentIcon" />
    <cz-input-text label="Animated Icon" />
</cz-icon-field>`,
        typescript: `
import { User, Lock, Check, Info } from 'lucide-angular';

@Component({ ... })
export class MyComponent {
    currentIcon = User;

    changeIcon(type: string) {
        if (type === 'user') this.currentIcon = User;
        if (type === 'lock') this.currentIcon = Lock;
        // ...
    }
}`
    };

    componentsCode: Code = {
        html: `
<!-- Password -->
<cz-icon-field iconPosition="left">
    <cz-input-icon [icon]="LockIcon" />
    <cz-password label="Password" />
</cz-icon-field>

<!-- Select -->
<cz-icon-field iconPosition="left">
    <cz-input-icon [icon]="MapPinIcon" />
    <cz-select [options]="cities" optionLabel="label" optionValue="value" label="City" />
</cz-icon-field>

<!-- TextArea -->
<cz-icon-field iconPosition="left">
    <cz-input-icon [icon]="MessageSquareIcon" />
    <cz-textarea label="Comments" />
</cz-icon-field>`,
        typescript: `
import { Lock, MapPin, MessageSquare } from 'lucide-angular';

@Component({ ... })
export class MyComponent {
    LockIcon = Lock;
    MapPinIcon = MapPin;
    MessageSquareIcon = MessageSquare;
}`
    };

    colorsCode: Code = {
        html: `
<cz-icon-field>
    <cz-input-icon [icon]="SearchIcon" color="primary" />
    <cz-input-text label="Primary" />
</cz-icon-field>

<cz-icon-field>
    <cz-input-icon [icon]="CheckIcon" color="success" />
    <cz-input-text label="Success" />
</cz-icon-field>

<cz-icon-field>
    <cz-input-icon [icon]="LockIcon" color="#e11d48" />
    <cz-input-text label="Hex Color" />
</cz-icon-field>`,
        typescript: `
import { Search, Check, Lock } from 'lucide-angular';

@Component({ ... })
export class MyComponent {
    SearchIcon = Search;
    CheckIcon = Check;
    LockIcon = Lock;
}`
    };

    sizesCode: Code = {
        html: `
<cz-icon-field size="sm">
    <cz-input-icon [icon]="SearchIcon" />
    <cz-input-text size="sm" label="Small" />
</cz-icon-field>

<cz-icon-field size="md">
    <cz-input-icon [icon]="SearchIcon" />
    <cz-input-text size="md" label="Medium" />
</cz-icon-field>

<cz-icon-field size="lg">
    <cz-input-icon [icon]="SearchIcon" />
    <cz-input-text size="lg" label="Large" />
</cz-icon-field>`,
        typescript: `
import { Search } from 'lucide-angular';

@Component({ ... })
export class MyComponent {
    SearchIcon = Search;
}`
    };

    fluidCode: Code = {
        html: `
<cz-icon-field [fluid]="true">
    <cz-input-icon [icon]="SearchIcon" />
    <cz-input-text [fluid]="true" label="Fluid Field" />
</cz-icon-field>`,
        typescript: `
import { Search } from 'lucide-angular';

@Component({ ... })
export class MyComponent {
    SearchIcon = Search;
}`
    };
}
