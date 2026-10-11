import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzBlockUiComponent, CzBlockUIService, CzButtonComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../../core/services/language.service';
import { BLOCK_UI_SERVICE_DOC_I18N } from './block-ui-service-doc.i18n';

@Component({
    selector: 'cz-block-ui-service-doc-page',
    imports: [CzBlockUiComponent, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="block-ui-service">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="usage">{{ t().usageTitle }}</h2>
                <p [innerHTML]="t().usageDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Block for 2 seconds" severity="primary" (onClick)="blockForAWhile()" />
                    <cz-button label="Block" severity="warning" (onClick)="block()" />
                    <cz-button label="Unblock" severity="success" (onClick)="unblock()" />
                    <cz-button label="Reset" severity="danger" (onClick)="reset()" />
                </div>

                <!-- Live host: the panel is blocked while the service counter > 0 -->
                <cz-block-ui [fromService]="true" message="Processing…" class="cz-block-ui-demo cz-mb-md">
                    <div class="cz-p-lg cz-border cz-rounded-lg">
                        <strong>Protected panel</strong>
                        <p class="cz-text-sm cz-mb-none">
                            This content is covered while the service is blocking.
                        </p>
                    </div>
                </cz-block-ui>

                <app-code [code]="usageCode" />
            </section>

            <section>
                <h2 id="counter">{{ t().counterTitle }}</h2>
                <p [innerHTML]="t().counterDesc"></p>
                <app-code [code]="counterCode" />
            </section>

            <section>
                <h2 id="methods">{{ t().methodsTitle }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Method</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>block()</code></td><td><code>() → void</code></td><td>Increments the block counter.</td></tr>
                            <tr><td><code>unblock()</code></td><td><code>() → void</code></td><td>Decrements the block counter (never below zero).</td></tr>
                            <tr><td><code>reset()</code></td><td><code>() → void</code></td><td>Releases every active block.</td></tr>
                            <tr><td><code>blocked</code></td><td><code>Signal&lt;boolean&gt;</code></td><td>True while at least one operation is blocking.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 id="host">{{ t().noteTitle }}</h2>
                <p [innerHTML]="t().noteDesc"></p>
                <app-code [code]="hostCode" />
            </section>
        </div>
    `,
    styles: `
        .cz-block-ui-demo {
            position: relative;
            display: block;
        }
    `,
})
export class BlockUIServiceDocPage {
    private readonly lang = inject(LanguageService);
    private readonly blockUi = inject(CzBlockUIService);
    readonly t = computed(() => BLOCK_UI_SERVICE_DOC_I18N[this.lang.currentLang()] || BLOCK_UI_SERVICE_DOC_I18N.en);

    blockForAWhile(): void {
        this.blockUi.block();
        setTimeout(() => this.blockUi.unblock(), 2000);
    }

    block(): void {
        this.blockUi.block();
    }

    unblock(): void {
        this.blockUi.unblock();
    }

    reset(): void {
        this.blockUi.reset();
    }

    importCode: Code = {
        typescript: `import { CzBlockUIService } from 'codezium-ui';`,
    };

    usageCode: Code = {
        typescript: `private readonly blockUi = inject(CzBlockUIService);

this.blockUi.block();
this.http.get('/api/report').subscribe(() => this.blockUi.unblock());`,
    };

    counterCode: Code = {
        typescript: `// Two parallel requests block independently
this.blockUi.block(); // counter = 1 → blocked
this.blockUi.block(); // counter = 2 → blocked

this.blockUi.unblock(); // counter = 1 → still blocked
this.blockUi.unblock(); // counter = 0 → released`,
    };

    hostCode: Code = {
        html: `<!-- Wrap the area to protect -->
<cz-block-ui [fromService]="true" message="Processing…">
    <div class="protected-content">…</div>
</cz-block-ui>`,
    };
}
