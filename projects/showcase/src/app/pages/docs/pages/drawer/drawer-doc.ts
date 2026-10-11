import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent, CzDrawerComponent } from 'codezium-ui';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { DRAWER_DOC_I18N } from './drawer-doc.i18n';

@Component({
    selector: 'cz-drawer-doc-page',
    imports: [CzDrawerComponent, CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="drawer">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Open drawer" (onClick)="visible.set(true)" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Left" severity="secondary" (onClick)="open('left')" />
                    <cz-button label="Top" severity="info" (onClick)="open('top')" />
                    <cz-button label="Bottom (large)" severity="warning" (onClick)="open('bottom', '60vh')" />
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
                            <tr><td><code>visible</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Visibility (two-way).</td></tr>
                            <tr><td><code>header</code></td><td><code>string</code></td><td><code>''</code></td><td>Drawer title.</td></tr>
                            <tr><td><code>position</code></td><td><code>'left' | 'right' | 'top' | 'bottom'</code></td><td><code>'right'</code></td><td>Screen edge.</td></tr>
                            <tr><td><code>size</code></td><td><code>string</code></td><td><code>'22rem'</code></td><td>Size along its axis.</td></tr>
                            <tr><td><code>dismissableMask</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes on mask click.</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>

        <cz-drawer [visible]="visible()" header="Settings" (onHide)="visible.set(false)">
            <p>Drawer content goes here.</p>
        </cz-drawer>

        <cz-drawer [visible]="positioned()" [position]="position()" [size]="size()" header="Positioned" (onHide)="positioned.set(false)">
            <p>Position: {{ position() }} / {{ size() }}</p>
        </cz-drawer>
    `,
})
export class DrawerDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => DRAWER_DOC_I18N[this.lang.currentLang()] || DRAWER_DOC_I18N.es);

    readonly visible = signal(false);
    readonly positioned = signal(false);
    readonly position = signal<'left' | 'top' | 'bottom'>('left');
    readonly size = signal('22rem');

    open(position: 'left' | 'top' | 'bottom', size = '22rem'): void {
        this.position.set(position);
        this.size.set(size);
        this.positioned.set(true);
    }

    importCode: Code = {
        typescript: `import { CzDrawerComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-drawer [visible]="visible()" header="Settings" (onHide)="visible.set(false)">
    <p>Drawer content goes here.</p>
</cz-drawer>`,
        typescript: `visible = signal(false);`,
    };

    optionsCode: Code = {
        html: `<cz-drawer [visible]="visible()" position="left" size="18rem" header="Left drawer" />`,
    };
}
