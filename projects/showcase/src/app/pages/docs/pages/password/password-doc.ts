import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CzPasswordComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { PASSWORD_DOC_I18N } from './password-doc.i18n';

@Component({
    selector: 'cz-password-doc-page',
    standalone: true,
    imports: [CzPasswordComponent, AppCodeComponent, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="password">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <!-- ── IMPORT ── -->
            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC USAGE ── -->
            <section>
                <h2 id="basic-usage">{{ t().basicTitle }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-mb-md">
                    <cz-password 
                        label="Password" 
                        placeholder="Enter your password">
                    </cz-password>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── TOGGLE MASK ── -->
            <section>
                <h2 id="toggle-mask">{{ t().toggleTitle }}</h2>
                <p>{{ t().toggleDesc }}</p>
                <div class="cz-mb-md">
                    <cz-password 
                        label="Password" 
                        [toggleMask]="true"
                        placeholder="Click eye to reveal">
                    </cz-password>
                </div>
                <app-code [code]="toggleCode" />
            </section>

            <!-- ── FEEDBACK (STRENGTH METER) ── -->
            <section>
                <h2 id="feedback">{{ t().feedbackTitle }}</h2>
                <p>{{ t().feedbackDesc }}</p>
                <div class="cz-mb-md">
                    <cz-password 
                        label="Secure Password" 
                        [feedback]="true"
                        [toggleMask]="true"
                        placeholder="Typer to see strength">
                    </cz-password>
                </div>
                <app-code [code]="feedbackCode" />
            </section>

            <!-- ── LABELS ── -->
            <section>
                <h2 id="labels">{{ t().labelsTitle }}</h2>
                <p [innerHTML]="t().labelsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md cz-items-end">
                    <cz-password label="No Position" labelPosition="none" placeholder="Type here"></cz-password>
                    <cz-password label="Over Label" labelPosition="over" placeholder="Type here"></cz-password>
                    <cz-password label="Inner Label" labelPosition="in" placeholder="Type here"></cz-password>
                    <cz-password label="Floating Label" labelPosition="float" placeholder="Type here"></cz-password>
                </div>
                <app-code [code]="labelsCode" />
            </section>

            <!-- ── THEMES ── -->
             <section>
                <h2 id="themes">{{ t().themesTitle }}</h2>
                <p [innerHTML]="t().themesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <div class="cz-p-md cz-border cz-rounded-lg" style="background: var(--cz-theme-surface);">
                        <small class="cz-text-muted">Base</small>
                        <cz-password label="Base" [feedback]="true"></cz-password>
                    </div>
                </div>
            </section>

            <!-- ── COLORS ── -->
            <section>
                <h2 id="colors">{{ t().colorsTitle }}</h2>
                <p [innerHTML]="t().colorsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-password color="primary" label="Primary" placeholder="Primary color"></cz-password>
                    <cz-password color="secondary" label="Secondary" placeholder="Secondary color"></cz-password>
                    <cz-password color="dark" label="Dark" placeholder="Dark color"></cz-password>
                    <cz-password color="success" label="Success" placeholder="Success color"></cz-password>
                    <cz-password color="danger" label="Danger" placeholder="Danger color"></cz-password>
                    <cz-password color="warning" label="Warning" placeholder="Warning color"></cz-password>
                    <cz-password color="info" label="Info" placeholder="Info color"></cz-password>
                </div>
                <app-code [code]="colorsCode" />
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().apiTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>{{ t().table.prop }}</th><th>{{ t().table.type }}</th><th>{{ t().table.default }}</th><th>{{ t().table.desc }}</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>toggleMask</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to show an icon to display the password as plain text.</td></tr>
                            <tr><td><code>feedback</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether to show the strength indicator.</td></tr>
                            <tr><td><code>weakLabel</code></td><td><code>string</code></td><td><code>'Weak'</code></td><td>Text for weak strength level.</td></tr>
                            <tr><td><code>mediumLabel</code></td><td><code>string</code></td><td><code>'Medium'</code></td><td>Text for medium strength level.</td></tr>
                            <tr><td><code>strongLabel</code></td><td><code>string</code></td><td><code>'Strong'</code></td><td>Text for strong strength level.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
})
export class PasswordDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => PASSWORD_DOC_I18N[this.lang.currentLang() as keyof typeof PASSWORD_DOC_I18N]);

    importCode: Code = {
        typescript: `import { CzPasswordComponent } from 'codezium-ui';`
    };

    basicCode: Code = {
        html: `<cz-password 
    [formControl]="passwordControl" 
    label="Password" 
    placeholder="Enter your password">
</cz-password>`,
        typescript: `import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CzPasswordComponent } from 'codezium-ui';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, CzPasswordComponent],
    template: '...'
})
export class MyComponent {
    passwordControl = new FormControl('');
}`
    };

    toggleCode: Code = {
        html: `<cz-password label="Password" [toggleMask]="true" placeholder="Click eye to reveal"></cz-password>`
    };

    feedbackCode: Code = {
        html: `<cz-password 
    [formControl]="passwordControl" 
    label="Secure Password" 
    [feedback]="true" 
    [toggleMask]="true">
</cz-password>`,
        typescript: `import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CzPasswordComponent } from 'codezium-ui';

@Component({
    standalone: true,
    imports: [ReactiveFormsModule, CzPasswordComponent],
    template: '...'
})
export class MyComponent {
    // Component will automatically show strength labels 
    // and validation messages based on these validators
    passwordControl = new FormControl('', [
        Validators.required, 
        Validators.minLength(8)
    ]);
}`
    };

    labelsCode: Code = {
        html: `<cz-password label="No Position" labelPosition="none"></cz-password>
<cz-password label="Over Label" labelPosition="over"></cz-password>
<cz-password label="Inner Label" labelPosition="in"></cz-password>
<cz-password label="Floating Label" labelPosition="float"></cz-password>`
    };
    colorsCode: Code = {
        html: `<cz-password color="primary" label="Primary"></cz-password>
<cz-password color="secondary" label="Secondary"></cz-password>
<cz-password color="dark" label="Dark"></cz-password>
<cz-password color="success" label="Success"></cz-password>
<cz-password color="danger" label="Danger"></cz-password>
<cz-password color="warning" label="Warning"></cz-password>
<cz-password color="info" label="Info"></cz-password>`
    };
}
