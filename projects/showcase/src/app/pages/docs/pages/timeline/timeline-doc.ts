import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzTimelineComponent, CzTimelineEvent } from 'codezium-ui';
import { LucideRocket } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TIMELINE_DOC_I18N } from './timeline-doc.i18n';

@Component({
    selector: 'cz-timeline-doc-page',
    imports: [CzTimelineComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="timeline">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md">
                    <cz-timeline [value]="events" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="options">{{ t().options }}</h2>
                <p [innerHTML]="t().optionsDesc"></p>
                <div class="cz-mb-md">
                    <cz-timeline [value]="events" align="alternate" />
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
                            <tr><td><code>value</code></td><td><code>CzTimelineEvent[]</code></td><td><code>[]</code></td><td>Events (title, date, content, icon, severity).</td></tr>
                            <tr><td><code>align</code></td><td><code>'left' | 'right' | 'alternate'</code></td><td><code>'left'</code></td><td>Content alignment.</td></tr>
                            <tr><td><code>onEventSelect</code></td><td><code>output&lt;CzTimelineEvent&gt;</code></td><td>-</td><td>Emitted when an event is clicked.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TimelineDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => TIMELINE_DOC_I18N[this.lang.currentLang()] || TIMELINE_DOC_I18N.es);

    readonly events: CzTimelineEvent[] = [
        {
            title: 'Order created',
            date: '2024-01-01',
            content: 'Your order has been registered.',
            severity: 'success',
        },
        {
            title: 'Order shipped',
            date: '2024-01-03',
            content: 'Package handed to the courier.',
            icon: LucideRocket,
            severity: 'info',
        },
        {
            title: 'Out for delivery',
            date: '2024-01-05',
            severity: 'warning',
        },
        {
            title: 'Delivered',
            date: '2024-01-06',
            content: 'Package delivered successfully.',
            severity: 'success',
        },
    ];

    importCode: Code = {
        typescript: `import { CzTimelineComponent, CzTimelineEvent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-timeline [value]="events" />`,
        typescript: `events: CzTimelineEvent[] = [
    { title: 'Order created', date: '2024-01-01', severity: 'success' },
    { title: 'Order shipped', date: '2024-01-03', icon: LucideRocket, severity: 'info' },
];`,
    };

    optionsCode: Code = {
        html: `<cz-timeline [value]="events" align="alternate" />`,
    };
}
