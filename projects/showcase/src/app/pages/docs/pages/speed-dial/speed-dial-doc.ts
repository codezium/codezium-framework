import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMenuItem, CzSpeedDialComponent } from 'codezium-ui';
import { LucideMail, LucidePencil, LucideShare2 } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SPEED_DIAL_DOC_I18N } from './speed-dial-doc.i18n';

@Component({
    selector: 'cz-speed-dial-doc-page',
    imports: [CzSpeedDialComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="speed-dial">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-gap-xl cz-items-center cz-mb-md" style="min-height: 10rem;">
                    <cz-speed-dial [items]="items" (onItemSelect)="last.set($event)" ariaLabel="Quick actions" />
                    <span class="cz-text-sm">Last action: {{ last()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-items-center cz-mb-md" style="min-height: 10rem;">
                    <cz-speed-dial [items]="items" direction="up" />
                    <cz-speed-dial [items]="items" direction="down" />
                    <cz-speed-dial [items]="items" direction="left" />
                    <cz-speed-dial [items]="items" direction="right" />
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
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Actions (icon, label, command).</td></tr>
                            <tr><td><code>direction</code></td><td><code>'up' | 'down' | 'left' | 'right'</code></td><td><code>'up'</code></td><td>Where the actions open.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>Plus</code></td><td>Trigger icon.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td>-</td><td>Emitted when an action is activated.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class SpeedDialDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => SPEED_DIAL_DOC_I18N[this.lang.currentLang()] || SPEED_DIAL_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly items: CzMenuItem[] = [
        { label: 'Edit', icon: LucidePencil },
        { label: 'Share', icon: LucideShare2 },
        { label: 'Email', icon: LucideMail },
    ];

    importCode: Code = {
        typescript: `import { CzSpeedDialComponent, CzMenuItem } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-speed-dial [items]="items" (onItemSelect)="onSelect($event)" ariaLabel="Quick actions" />`,
        typescript: `items: CzMenuItem[] = [
    { label: 'Edit', icon: LucidePencil, command: () => this.edit() },
    { label: 'Share', icon: LucideShare2, command: () => this.share() },
];`,
    };

    optionsCode: Code = {
        html: `<cz-speed-dial [items]="items" direction="up" />
<cz-speed-dial [items]="items" direction="down" />
<cz-speed-dial [items]="items" direction="left" />
<cz-speed-dial [items]="items" direction="right" />`,
    };
}
