import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CzCheckboxComponent } from '../../../../../../../codezium-ui/src/public-api';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { CHECKBOX_DOC_I18N } from './checkbox-doc.i18n';

@Component({
    selector: 'cz-checkbox-doc-page',
    imports: [CzCheckboxComponent, AppCodeComponent, ReactiveFormsModule, FormsModule, JsonPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="checkbox">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <!-- ── IMPORT ── -->
            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC USAGE ── -->
            <section>
                <h2 id="basic-usage">{{ t().basicTitle }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-checkbox label="Accept Terms and Conditions" [binary]="true" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── SIZES ── -->
            <section>
                <h2 id="sizes">{{ t().sizesTitle }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md cz-items-center">
                    <cz-checkbox label="Small" size="sm" [binary]="true" />
                    <cz-checkbox label="Medium" size="md" [binary]="true" />
                    <cz-checkbox label="Large" size="lg" [binary]="true" />
                </div>
                <app-code [code]="sizesCode" />
            </section>
            
            <!-- ── POSITIONS ── -->
            <section>
                <h2 id="positions">{{ t().positionTitle }}</h2>
                <p [innerHTML]="t().positionDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md cz-items-center">
                    <cz-checkbox label="Right (Default)" labelPosition="right" [binary]="true" />
                    <cz-checkbox label="Left Position" labelPosition="left" [binary]="true" />
                </div>
                <app-code [code]="positionCode" />
            </section>

            <!-- ── CUSTOM LABEL ── -->
            <section>
                <h2 id="custom-label">{{ t().customLabelTitle }}</h2>
                <p [innerHTML]="t().customLabelDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md cz-items-center">
                    <cz-checkbox [binary]="true">
                        <span>I accept the <a href="javascript:void(0)" class="cz-text-primary" style="font-weight: 500;">Privacy Policy</a></span>
                    </cz-checkbox>
                </div>
                <app-code [code]="customLabelCode" />
            </section>

            <!-- ── DYNAMIC ARRAY ── -->
            <section>
                <h2 id="dynamic">{{ t().dynamicTitle }}</h2>
                <p [innerHTML]="t().dynamicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    @for (category of categories; track category.key) {
                        <cz-checkbox 
                            [value]="category" 
                            [(ngModel)]="selectedCategories">
                            <span class="cz-ml-2 cz-font-medium">{{ category.name }}</span>
                        </cz-checkbox>
                    }
                    <div class="cz-mt-sm cz-text-sm cz-text-muted cz-font-mono">
                        Value: {{ selectedCategories | json }}
                    </div>
                </div>
                <app-code [code]="dynamicCode" />
            </section>
            
            <!-- ── CIRCULAR ── -->
            <section>
                <h2 id="circular">{{ t().circleTitle }}</h2>
                <p [innerHTML]="t().circleDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md cz-items-center">
                    <cz-checkbox label="Circular Checkbox" [circle]="true" color="success" [binary]="true" />
                </div>
                <app-code [code]="circleCode" />
            </section>

            <!-- ── COLORS ── -->
            <section>
                <h2 id="colors">{{ t().colorsTitle }}</h2>
                <p [innerHTML]="t().colorsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md cz-items-center">
                    <cz-checkbox label="Primary" color="primary" [binary]="true" />
                    <cz-checkbox label="Success" color="success" [binary]="true" />
                    <cz-checkbox label="Warning" color="warning" [binary]="true" />
                    <cz-checkbox label="Danger" color="danger" [binary]="true" />
                    <cz-checkbox label="Info" color="info" [binary]="true" />
                    <cz-checkbox label="Dark" color="dark" [binary]="true" />
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── VALIDATION & REACTIVE FORMS ── -->

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().apiTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>{{ t().table.prop }}</th><th>{{ t().table.type }}</th><th>{{ t().table.default }}</th><th>{{ t().table.desc }}</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label text</td></tr>
                            <tr><td><code>labelPosition</code></td><td><code>'left' | 'right'</code></td><td><code>'right'</code></td><td>Position of the label vs the checkbox</td></tr>
                            <tr><td><code>value</code></td><td><code>any</code></td><td><code>null</code></td><td>Value of the checkbox in array mode</td></tr>
                            <tr><td><code>binary</code></td><td><code>boolean</code></td><td><code>false</code></td><td>If true, toggles true/false. If false, toggles presence in an array.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Checkbox size</td></tr>
                            <tr><td><code>color</code></td><td><code>'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark'</code></td><td><code>'primary'</code></td><td>Color variant</td></tr>
                            <tr><td><code>circle</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays the checkbox as a circle</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class CheckboxDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => CHECKBOX_DOC_I18N[this.lang.currentLang() as keyof typeof CHECKBOX_DOC_I18N]);
    readonly CHECKBOX_DOC_I18N = CHECKBOX_DOC_I18N; 

    // Dynamic Example State
    categories: any[] = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];
    selectedCategories: any[] = [this.categories[1]];

    importCode: Code = {
        typescript: "import { CzCheckboxComponent } from 'codezium-ui';"
    };

    basicCode: Code = {
        html: '<cz-checkbox label="Accept Terms and Conditions" [binary]="true" />'
    };

    sizesCode: Code = {
        html: `<cz-checkbox label="Small" size="sm" [binary]="true" />
<cz-checkbox label="Medium" size="md" [binary]="true" />
<cz-checkbox label="Large" size="lg" [binary]="true" />`
    };

    circleCode: Code = {
        html: '<cz-checkbox label="Circular Checkbox" [circle]="true" color="success" [binary]="true" />'
    };

    positionCode: Code = {
        html: `<cz-checkbox label="Right (Default)" labelPosition="right" [binary]="true" />
<cz-checkbox label="Left Position" labelPosition="left" [binary]="true" />`
    };

    customLabelCode: Code = {
        html: `<cz-checkbox [binary]="true">
    <span>I accept the <a href="..." class="cz-text-primary">Policy</a></span>
</cz-checkbox>`
    };

    dynamicCode: Code = {
        html: `@for (category of categories; track category.key) {
    <cz-checkbox 
        [value]="category" 
        [(ngModel)]="selectedCategories">
        <span class="cz-ml-2 cz-font-medium">{{ category.name }}</span>
    </cz-checkbox>
}`,
        typescript: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CzCheckboxComponent } from 'codezium-ui';

@Component({
    selector: 'checkbox-dynamic-demo',
    templateUrl: './checkbox-dynamic-demo.html',
    standalone: true,
    imports: [CzCheckboxComponent, FormsModule, JsonPipe]
})
export class CheckboxDynamicDemo {
    categories: any[] = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];
    
    selectedCategories: any[] = [this.categories[1]];
}`
    };

    colorsCode: Code = {
        html: `<cz-checkbox label="Primary" color="primary" [binary]="true" />
<cz-checkbox label="Success" color="success" [binary]="true" />
<cz-checkbox label="Warning" color="warning" [binary]="true" />
<cz-checkbox label="Danger" color="danger" [binary]="true" />
<cz-checkbox label="Info" color="info" [binary]="true" />
<cz-checkbox label="Dark" color="dark" [binary]="true" />`
    };
}
