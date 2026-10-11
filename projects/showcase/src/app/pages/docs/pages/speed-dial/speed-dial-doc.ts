import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzMenuItem, CzSpeedDialComponent, CzToastService } from 'codezium-ui';
import {
    LucideExternalLink,
    LucideMail,
    LucidePencil,
    LucideRefreshCw,
    LucideShare2,
    LucideTrash,
    LucideUpload,
    LucideX,
} from '@lucide/angular';
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
                    <cz-speed-dial [items]="items" (onItemSelect)="notify($event)" ariaLabel="Quick actions" />
                    <span class="cz-text-sm">Last action: {{ last()?.label || '-' }}</span>
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="linear">{{ t().linear }}</h2>
                <p [innerHTML]="t().linearDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-items-center cz-mb-md" style="min-height: 12rem;">
                    <cz-speed-dial [items]="items" direction="up" />
                    <cz-speed-dial [items]="items" direction="down" />
                    <cz-speed-dial [items]="items" direction="left" />
                    <cz-speed-dial [items]="items" direction="right" />
                </div>
                <app-code [code]="linearCode" />
            </section>

            <section>
                <h2 id="circle">{{ t().circle }}</h2>
                <p [innerHTML]="t().circleDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-items-center cz-justify-center cz-mb-md">
                    <div class="cz-flex cz-items-center cz-justify-center" style="width: 17rem; height: 17rem;">
                        <cz-speed-dial [items]="manyItems" type="circle" [radius]="100" severity="warning" />
                    </div>
                </div>
                <app-code [code]="circleCode" />
            </section>

            <section>
                <h2 id="semi-circle">{{ t().semi }}</h2>
                <p [innerHTML]="t().semiDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-justify-center cz-mb-md">
                    @for (direction of semiDirections; track direction) {
                        <div style="position: relative; width: 13rem; height: 11rem;">
                            <cz-speed-dial [items]="items" type="semi-circle" [direction]="direction" [radius]="85"
                                severity="success" style="position: absolute; bottom: 0.5rem; left: calc(50% - 1.625rem);" />
                        </div>
                    }
                </div>
                <app-code [code]="semiCode" />
            </section>

            <section>
                <h2 id="quarter-circle">{{ t().quarter }}</h2>
                <p [innerHTML]="t().quarterDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-justify-center cz-mb-md">
                    @for (direction of quarterDirections; track direction) {
                        <div style="position: relative; width: 12rem; height: 12rem; border: 1px dashed var(--docs-border); border-radius: 12px;">
                            <cz-speed-dial [items]="items" type="quarter-circle" [direction]="direction" [radius]="95"
                                severity="info" style="position: absolute; right: 0.75rem; bottom: 0.75rem;" />
                        </div>
                    }
                </div>
                <app-code [code]="quarterCode" />
            </section>

            <section>
                <h2 id="mask">{{ t().mask }}</h2>
                <p [innerHTML]="t().maskDesc"></p>
                <div class="cz-flex cz-gap-xl cz-items-center cz-mb-md" style="min-height: 10rem;">
                    <cz-speed-dial [items]="items" [mask]="true" severity="danger" />
                </div>
                <app-code [code]="maskCode" />
            </section>

            <section>
                <h2 id="delay">{{ t().delay }}</h2>
                <p [innerHTML]="t().delayDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-items-center cz-mb-md" style="min-height: 10rem;">
                    <cz-speed-dial [items]="items" [transitionDelay]="0" severity="secondary" />
                    <cz-speed-dial [items]="items" [transitionDelay]="80" severity="success" />
                    <cz-speed-dial [items]="items" [transitionDelay]="150" severity="info" />
                </div>
                <app-code [code]="delayCode" />
            </section>

            <section>
                <h2 id="tooltips">{{ t().tooltips }}</h2>
                <p [innerHTML]="t().tooltipsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-items-center cz-mb-md" style="min-height: 10rem;">
                    <cz-speed-dial [items]="labeledItems" [showTooltips]="true" severity="warning" />
                </div>
                <app-code [code]="tooltipsCode" />
            </section>

            <section>
                <h2 id="trigger">{{ t().severity }}</h2>
                <p [innerHTML]="t().severityDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-items-center cz-mb-md" style="min-height: 10rem;">
                    <cz-speed-dial [items]="items" severity="primary" />
                    <cz-speed-dial [items]="items" severity="success" />
                    <cz-speed-dial [items]="items" severity="danger" />
                    <cz-speed-dial [items]="items" [icon]="PencilIcon" [hideIcon]="XIcon" />
                    <cz-speed-dial [items]="items" [disabled]="true" />
                </div>
                <app-code [code]="triggerCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>items</code></td><td><code>CzMenuItem[]</code></td><td><code>[]</code></td><td>Actions (icon, label, command, url, routerLink, disabled).</td></tr>
                            <tr><td><code>type</code></td><td><code>'linear' | 'circle' | 'semi-circle' | 'quarter-circle'</code></td><td><code>'linear'</code></td><td>Opening layout of the actions.</td></tr>
                            <tr><td><code>direction</code></td><td><code>'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right'</code></td><td><code>'up'</code></td><td>Direction of the actions.</td></tr>
                            <tr><td><code>radius</code></td><td><code>number</code></td><td><code>80</code></td><td>Radius for the radial layouts.</td></tr>
                            <tr><td><code>visible</code></td><td><code>boolean (model)</code></td><td><code>false</code></td><td>Visibility (two-way).</td></tr>
                            <tr><td><code>transitionDelay</code></td><td><code>number</code></td><td><code>30</code></td><td>Delay step (ms) between each action entrance.</td></tr>
                            <tr><td><code>mask</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a mask behind the actions.</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state of the trigger.</td></tr>
                            <tr><td><code>hideOnClickOutside</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes the actions when clicking outside.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>Plus</code></td><td>Trigger icon.</td></tr>
                            <tr><td><code>hideIcon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Trigger icon shown while open.</td></tr>
                            <tr><td><code>rotateAnimation</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Rotates the icon 45° when open (without hideIcon).</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Severity color of the trigger.</td></tr>
                            <tr><td><code>showTooltips</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows tooltips built from each item label.</td></tr>
                            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>'Actions'</code></td><td>Accessible label of the trigger.</td></tr>
                            <tr><td><code>onVisibleChange</code></td><td><code>output&lt;boolean&gt;</code></td><td><code>—</code></td><td>Emitted when the visibility changes.</td></tr>
                            <tr><td><code>onShow / onHide</code></td><td><code>output&lt;void&gt;</code></td><td><code>—</code></td><td>Emitted when the actions show / hide.</td></tr>
                            <tr><td><code>onClick</code></td><td><code>output&lt;MouseEvent&gt;</code></td><td><code>—</code></td><td>Emitted when the trigger is clicked.</td></tr>
                            <tr><td><code>onItemSelect</code></td><td><code>output&lt;CzMenuItem&gt;</code></td><td><code>—</code></td><td>Emitted when an action is activated.</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index: a number overrides it, <code>'none'</code> keeps it in normal flow, <code>null</code> = theme default (above everything).</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class SpeedDialDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => SPEED_DIAL_DOC_I18N[this.lang.currentLang()] || SPEED_DIAL_DOC_I18N.es);

    readonly last = signal<CzMenuItem | null>(null);

    readonly PencilIcon = LucidePencil;
    readonly XIcon = LucideX;

    readonly semiDirections = ['up', 'down', 'left', 'right'] as const;
    readonly quarterDirections = ['up-left', 'up-right', 'down-left', 'down-right'] as const;

    readonly items: CzMenuItem[] = [
        { label: 'Edit', icon: LucidePencil },
        { label: 'Share', icon: LucideShare2 },
        { label: 'Email', icon: LucideMail },
    ];

    readonly manyItems: CzMenuItem[] = [
        { label: 'Edit', icon: LucidePencil },
        { label: 'Update', icon: LucideRefreshCw },
        { label: 'Delete', icon: LucideTrash },
        { label: 'Upload', icon: LucideUpload },
        { label: 'Share', icon: LucideShare2 },
        { label: 'Email', icon: LucideMail },
        { label: 'External', icon: LucideExternalLink },
        { label: 'Close', icon: LucideX },
    ];

    readonly labeledItems: CzMenuItem[] = [
        { label: 'Add', icon: LucidePencil },
        { label: 'Update', icon: LucideRefreshCw },
        { label: 'Delete', icon: LucideTrash },
        { label: 'Upload', icon: LucideUpload },
    ];

    notify(item: CzMenuItem): void {
        this.last.set(item);
        this.toast.info(item.label ?? 'Action', 'SpeedDial');
    }

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

    linearCode: Code = {
        html: `<cz-speed-dial [items]="items" direction="up" />
<cz-speed-dial [items]="items" direction="down" />
<cz-speed-dial [items]="items" direction="left" />
<cz-speed-dial [items]="items" direction="right" />`,
    };

    circleCode: Code = {
        html: `<cz-speed-dial [items]="items" type="circle" [radius]="100" severity="warning" />`,
    };

    semiCode: Code = {
        html: `<cz-speed-dial [items]="items" type="semi-circle" direction="up" [radius]="85" />
<cz-speed-dial [items]="items" type="semi-circle" direction="down" [radius]="85" />
<cz-speed-dial [items]="items" type="semi-circle" direction="left" [radius]="85" />
<cz-speed-dial [items]="items" type="semi-circle" direction="right" [radius]="85" />`,
    };

    quarterCode: Code = {
        html: `<cz-speed-dial [items]="items" type="quarter-circle" direction="up-left" [radius]="95" />
<cz-speed-dial [items]="items" type="quarter-circle" direction="up-right" [radius]="95" />
<cz-speed-dial [items]="items" type="quarter-circle" direction="down-left" [radius]="95" />
<cz-speed-dial [items]="items" type="quarter-circle" direction="down-right" [radius]="95" />`,
    };

    maskCode: Code = {
        html: `<cz-speed-dial [items]="items" [mask]="true" />`,
    };

    delayCode: Code = {
        html: `<cz-speed-dial [items]="items" [transitionDelay]="0" />
<cz-speed-dial [items]="items" [transitionDelay]="80" />
<cz-speed-dial [items]="items" [transitionDelay]="150" />`,
    };

    tooltipsCode: Code = {
        html: `<cz-speed-dial [items]="items" [showTooltips]="true" />`,
    };

    triggerCode: Code = {
        html: `<cz-speed-dial [items]="items" severity="success" />
<cz-speed-dial [items]="items" [icon]="PencilIcon" [hideIcon]="XIcon" />
<cz-speed-dial [items]="items" [disabled]="true" />`,
    };
}
