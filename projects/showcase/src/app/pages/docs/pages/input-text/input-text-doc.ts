import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzInputTextComponent } from '../../../../../../../codezium-ui/src/public-api';
import { LanguageService } from '../../../../core/services/language.service';
import { INPUT_TEXT_DOC_I18N } from './input-text-doc.i18n';

@Component({
    selector: 'cz-input-text-doc-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="input-text">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <!-- ── IMPORT ── -->
            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <pre><code>{{ t().importCode }}</code></pre>
            </section>
            <h2 id="basic-usage">Basic Usage</h2>
            <pre><code>&lt;cz-input-text label="Username" /&gt;</code></pre>

            <h2 id="api">API</h2>
            <div class="doc-table-wrapper">
                <table class="doc-table">
                    <thead>
                        <tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Label text</td></tr>
                        <tr><td><code>labelPosition</code></td><td><code>'none' | 'over' | 'in' | 'float'</code></td><td><code>'none'</code></td><td>Label placement</td></tr>
                        <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Input size</td></tr>
                        <tr><td><code>color</code></td><td><code>'primary' | 'success' | 'warning' | 'danger' | 'info' | 'dark'</code></td><td><code>''</code></td><td>Color variant</td></tr>
                        <tr><td><code>filled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Filled background style</td></tr>
                        <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Full width</td></tr>
                        <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    styles: [`
        .doc-page { max-width: 720px; }
        h1 { font-size: 2rem; font-weight: 700; margin: 0 0 12px; }
        h2 { font-size: 1.25rem; font-weight: 600; margin: 32px 0 8px; }
        .doc-lead { font-size: 1.05rem; color: var(--cz-theme-text-secondary); margin-bottom: 32px; }
        pre {
            background: var(--cz-theme-surface, #f3f4f6);
            border: 1px solid var(--cz-theme-border-color, #e5e7eb);
            border-radius: 8px; padding: 16px; overflow-x: auto;
            font-size: 0.875rem; margin: 8px 0 16px;
        }
        code { font-family: 'Fira Code', monospace; }
    `],
})
export class InputTextDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => INPUT_TEXT_DOC_I18N[this.lang.currentLang() as keyof typeof INPUT_TEXT_DOC_I18N]);
}
