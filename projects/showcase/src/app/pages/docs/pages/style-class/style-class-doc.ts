import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzStyleClassDirective } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { STYLE_CLASS_DOC_I18N } from './style-class-doc.i18n';

@Component({
    selector: 'cz-style-class-doc-page',
    imports: [CzStyleClassDirective, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="style-class">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-button [label]="active() ? 'Deactivate' : 'Activate'" (onClick)="toggle()" />
                    <div
                        class="cz-p-lg cz-border cz-rounded-lg"
                        [czStyleClass]="'cz-bg-primary-50'"
                        [styleClassActive]="active()"
                        styleClassEnter="cz-style-class-enter"
                        styleClassLeave="cz-style-class-leave"
                    >
                        State: {{ active() ? 'active' : 'inactive' }}
                    </div>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <div
                        class="cz-p-lg cz-border cz-rounded-lg"
                        [czStyleClass]="'cz-bg-success-50'"
                        [styleClassActive]="active()"
                        [styleClassEnter]="'cz-style-class-enter'"
                        [styleClassLeave]="'cz-style-class-leave'"
                        [styleClassDuration]="300"
                    >
                        Custom duration (300ms)
                    </div>
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
                            <tr><td><code>czStyleClass</code></td><td><code>string</code></td><td><code>''</code></td><td>Class toggled while active.</td></tr>
                            <tr><td><code>styleClassActive</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Active state.</td></tr>
                            <tr><td><code>styleClassEnter</code> / <code>styleClassLeave</code></td><td><code>string</code></td><td><code>''</code></td><td>Animation classes.</td></tr>
                            <tr><td><code>styleClassDuration</code></td><td><code>number</code></td><td><code>400</code></td><td>Animation duration in ms.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class StyleClassDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => STYLE_CLASS_DOC_I18N[this.lang.currentLang()] || STYLE_CLASS_DOC_I18N.es);

    readonly active = signal(true);

    toggle(): void {
        this.active.update((v) => !v);
    }

    importCode: Code = {
        typescript: `import { CzStyleClassDirective } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<div
    [czStyleClass]="'cz-bg-primary-50'"
    [styleClassActive]="active()"
    styleClassEnter="cz-style-class-enter"
    styleClassLeave="cz-style-class-leave"
>
    State: {{ active() ? 'active' : 'inactive' }}
</div>`,
        typescript: `active = signal(true);`,
    };

    optionsCode: Code = {
        html: `<div
    [czStyleClass]="'cz-bg-success-50'"
    [styleClassActive]="active()"
    [styleClassDuration]="300"
>
    Custom duration (300ms)
</div>`,
    };
}
