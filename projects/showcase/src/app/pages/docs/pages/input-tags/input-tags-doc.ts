import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CzInputTagsComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { INPUT_TAGS_DOC_I18N } from './input-tags-doc.i18n';

@Component({
    selector: 'cz-input-tags-doc-page',
    imports: [CzInputTagsComponent, AppCodeComponent, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="input-tags">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-col cz-gap-sm cz-mb-md">
                    <cz-input-tags [(ngModel)]="tags" placeholder="Add a tag..." />
                    <span class="cz-text-sm">Value: {{ tags().join(', ') || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <cz-input-tags [(ngModel)]="tags" [max]="3" placeholder="Max 3 tags" />
                    <cz-input-tags [(ngModel)]="tags" separators="," placeholder="Separate with comma" />
                    <cz-input-tags [(ngModel)]="tags" [disabled]="true" />
                    <cz-input-tags [(ngModel)]="tags" [readonly]="true" />
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
                            <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'Add tag...'</code></td><td>Inner input placeholder.</td></tr>
                            <tr><td><code>separators</code></td><td><code>string</code></td><td><code>','</code></td><td>Characters that create a tag.</td></tr>
                            <tr><td><code>max</code></td><td><code>number</code></td><td><code>0</code></td><td>Maximum amount (0 = unlimited).</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>onAdd</code></td><td><code>output&lt;string&gt;</code></td><td>-</td><td>Emitted when a tag is added.</td></tr>
                            <tr><td><code>onRemove</code></td><td><code>output&lt;string&gt;</code></td><td>-</td><td>Emitted when a tag is removed.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class InputTagsDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INPUT_TAGS_DOC_I18N[this.lang.currentLang()] || INPUT_TAGS_DOC_I18N.es);

    readonly tags = signal(['Angular', 'Signals']);

    importCode: Code = {
        typescript: `import { CzInputTagsComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-input-tags [(ngModel)]="tags" placeholder="Add a tag..." />`,
        typescript: `tags = signal(['Angular', 'Signals']);`,
    };

    optionsCode: Code = {
        html: `<cz-input-tags [(ngModel)]="tags" [max]="3" />
<cz-input-tags [(ngModel)]="tags" separators="," />
<cz-input-tags [(ngModel)]="tags" [disabled]="true" />
<cz-input-tags [(ngModel)]="tags" [readonly]="true" />`,
    };
}
