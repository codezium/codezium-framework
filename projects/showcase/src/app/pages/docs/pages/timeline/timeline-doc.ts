import { ChangeDetectionStrategy, Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import {
    CzAvatarComponent,
    CzButtonComponent,
    CzIconComponent,
    CzTimelineComponent,
    CzToastService,
} from 'codezium-ui';
import {
    LucideCheck,
    LucideCheckCircle,
    LucideCreditCard,
    LucideHistory,
    LucideMail,
    LucideRefreshCw,
    LucideShoppingBag,
    LucideShoppingCart,
    LucideStar,
    LucideTruck,
    LucideUserPlus,
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TIMELINE_DOC_I18N } from './timeline-doc.i18n';

interface OrderEvent {
    status: string;
    date: string;
    time: string;
    icon: any;
    color: string;
    user: string;
    description: string;
    details?: string[];
    tracking?: string;
}

interface ActivityEvent {
    user: { name: string; avatar: string };
    action: string;
    target: string;
    repo?: string;
    time: string;
    description?: string;
    details?: string[];
}

@Component({
    selector: 'cz-timeline-doc-page',
    imports: [
        CzTimelineComponent,
        CzAvatarComponent,
        CzButtonComponent,
        CzIconComponent,
        AppCodeComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="timeline">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md" style="max-width: 30rem;">
                    <cz-timeline [value]="events" [contentTemplate]="basicContentTpl() ?? null" />
                </div>
                <app-code [code]="basicCode" />

                <ng-template #basicContent let-event>
                    <div class="cz-text-sm">{{ event.status }}</div>
                </ng-template>
            </section>

            <!-- ── ALIGNMENT ── -->
            <section>
                <h2 id="alignment">{{ t().alignment }}</h2>
                <p [innerHTML]="t().alignmentDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-xl cz-mb-md">
                    <div>
                        <strong class="cz-text-sm">{{ t().alignLeft }}</strong>
                        <cz-timeline [value]="events" [contentTemplate]="alignContentTpl() ?? null" />
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().alignRight }}</strong>
                        <cz-timeline [value]="events" align="right" [contentTemplate]="alignContentTpl() ?? null" />
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().alignAlternate }}</strong>
                        <cz-timeline [value]="events" align="alternate" [contentTemplate]="alignContentTpl() ?? null" />
                    </div>
                </div>
                <app-code [code]="alignmentCode" />

                <ng-template #alignContent let-event>
                    <div class="cz-text-sm">{{ event.status }}</div>
                </ng-template>
            </section>

            <!-- ── OPPOSITE ── -->
            <section>
                <h2 id="opposite">{{ t().opposite }}</h2>
                <p [innerHTML]="t().oppositeDesc"></p>
                <div class="cz-mb-md" style="max-width: 34rem;">
                    <cz-timeline [value]="datedEvents" [oppositeTemplate]="oppositeTpl() ?? null"
                        [contentTemplate]="oppositeContentTpl() ?? null" />
                </div>
                <app-code [code]="oppositeCode" />

                <ng-template #oppositeDate let-event>
                    <div class="cz-text-xs cz-text-muted">{{ event.date }}</div>
                </ng-template>

                <ng-template #oppositeContent let-event>
                    <div class="cz-text-sm">{{ event.status }}</div>
                </ng-template>
            </section>

            <!-- ── HORIZONTAL ── -->
            <section>
                <h2 id="horizontal">{{ t().horizontal }}</h2>
                <p [innerHTML]="t().horizontalDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md">
                    <div>
                        <strong class="cz-text-sm">{{ t().hTop }}</strong>
                        <cz-timeline [value]="years" layout="horizontal" align="top"
                            [contentTemplate]="yearContentTpl() ?? null" />
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().hBottom }}</strong>
                        <cz-timeline [value]="years" layout="horizontal" align="bottom"
                            [contentTemplate]="yearContentTpl() ?? null" />
                    </div>
                    <div>
                        <strong class="cz-text-sm">{{ t().hAlternate }}</strong>
                        <cz-timeline [value]="years" layout="horizontal" align="alternate"
                            [contentTemplate]="yearContentTpl() ?? null" />
                    </div>
                </div>
                <app-code [code]="horizontalCode" />

                <ng-template #yearContent let-year>
                    <div class="cz-text-sm">{{ year }}</div>
                </ng-template>
            </section>

            <!-- ── CUSTOM ── -->
            <section>
                <h2 id="custom">{{ t().custom }}</h2>
                <p [innerHTML]="t().customDesc"></p>
                <div class="cz-mb-md">
                    <cz-timeline [value]="orderEvents" align="alternate" [oppositeTemplate]="orderOppositeTpl() ?? null"
                        [markerTemplate]="orderMarkerTpl() ?? null" [contentTemplate]="orderContentTpl() ?? null" />
                </div>
                <app-code [code]="customCode" />

                <ng-template #orderOpposite let-event>
                    <div class="cz-font-medium">{{ event.date }}</div>
                    <div class="cz-text-sm cz-text-muted">{{ event.time }}</div>
                </ng-template>

                <ng-template #orderMarker let-event>
                    <span class="cz-flex cz-items-center cz-justify-center cz-rounded-full"
                        style="width: 2.5rem; height: 2.5rem; color: #fff; box-shadow: var(--cz-shadow-md);"
                        [style.background]="event.color">
                        <cz-icon [icon]="event.icon" [size]="16" />
                    </span>
                </ng-template>

                <ng-template #orderContent let-event>
                    <div class="cz-p-md cz-rounded-md cz-bg-surface cz-border cz-mb-md" style="text-align: left;">
                        <div class="cz-flex cz-items-center cz-gap-sm cz-mb-sm">
                            <cz-avatar [label]="event.user" shape="circle" size="sm" />
                            <strong>{{ event.status }}</strong>
                        </div>
                        <span class="cz-text-sm cz-text-secondary">{{ event.description }}</span>
                        @if (event.details) {
                            <ul class="cz-mt-sm cz-mb-0 cz-pl-lg cz-text-sm cz-text-muted">
                                @for (detail of event.details; track detail) {
                                    <li>{{ detail }}</li>
                                }
                            </ul>
                        }
                        @if (event.tracking) {
                            <div class="cz-flex cz-items-center cz-justify-between cz-gap-sm cz-mt-md cz-p-sm cz-rounded-md"
                                style="background: var(--cz-theme-surface-hover);">
                                <span class="cz-text-sm">{{ t().tracking }}: {{ event.tracking }}</span>
                                <cz-button [label]="t().track" size="sm" variant="text"
                                    (onClick)="notify('Track', event.tracking)" />
                            </div>
                        }
                    </div>
                </ng-template>
            </section>

            <!-- ── INTERACTIVE ── -->
            <section>
                <h2 id="interactive">{{ t().interactive }}</h2>
                <p [innerHTML]="t().interactiveDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-lg cz-mb-md" style="max-width: 32rem;">
                    <div class="cz-flex cz-items-center cz-justify-between cz-gap-md">
                        <div>
                            <strong>{{ t().interactiveSteps }}</strong>
                            <p class="cz-text-sm cz-text-muted" style="margin: 0;">
                                {{ completedSteps().length }} / {{ steps.length }} — {{ t().interactiveProgress }}
                            </p>
                        </div>
                        <cz-button [label]="t().interactiveReset" size="sm" variant="outlined"
                            [icon]="RefreshIcon" (onClick)="handleReset()" />
                    </div>

                    <div class="cz-w-full cz-rounded-full" style="height: 0.5rem; background: var(--cz-theme-surface-hover);">
                        <div class="cz-rounded-full"
                            style="height: 0.5rem; background: var(--cz-color-primary); transition: width 0.5s ease;"
                            [style.width.%]="progress()"></div>
                    </div>

                    <cz-timeline [value]="steps" [markerTemplate]="stepMarkerTpl() ?? null"
                        [contentTemplate]="stepContentTpl() ?? null" />

                    @if (isComplete()) {
                        <div class="cz-flex cz-flex-col cz-items-center cz-gap-xs cz-p-md cz-rounded-md"
                            style="background: color-mix(in srgb, var(--cz-color-success) 12%, transparent);">
                            <cz-icon [icon]="CheckCircleIcon" [size]="24" />
                            <strong>{{ t().interactiveComplete }}</strong>
                            <span class="cz-text-sm">{{ t().interactiveCompleteDesc }}</span>
                        </div>
                    }
                </div>
                <app-code [code]="interactiveCode" />

                <ng-template #stepMarker let-step>
                    <cz-button [icon]="step.icon" [iconOnly]="true"
                        [severity]="getStepStatus(step.id) === 'completed' ? 'success' : getStepStatus(step.id) === 'current' ? 'primary' : 'secondary'"
                        [variant]="getStepStatus(step.id) === 'pending' ? 'outlined' : 'solid'"
                        [disabled]="getStepStatus(step.id) !== 'current'"
                        [ariaLabel]="step.label" (onClick)="handleComplete(step.id)" />
                </ng-template>

                <ng-template #stepContent let-step>
                    <div class="cz-p-sm cz-rounded-md" [style.background]="stepBackground(step.id)">
                        <p class="cz-font-medium" style="margin: 0;" [style.color]="stepColor(step.id)"
                            [class.cz-line-through]="getStepStatus(step.id) === 'completed'">
                            {{ step.label }}
                        </p>
                        @if (getStepStatus(step.id) === 'current') {
                            <p class="cz-text-xs cz-text-muted" style="margin: 0;">{{ t().interactiveHint }}</p>
                        }
                    </div>
                </ng-template>
            </section>

            <!-- ── ACTIVITY FEED ── -->
            <section>
                <h2 id="activity">{{ t().activity }}</h2>
                <p [innerHTML]="t().activityDesc"></p>
                <div class="cz-mb-md" style="max-width: 36rem;">
                    <div class="cz-flex cz-items-center cz-gap-sm cz-mb-md">
                        <cz-icon [icon]="HistoryIcon" [size]="16" />
                        <strong>{{ t().activityTitle }}</strong>
                    </div>
                    <cz-timeline [value]="activities" [oppositeTemplate]="activityOppositeTpl() ?? null"
                        [markerTemplate]="activityMarkerTpl() ?? null" [contentTemplate]="activityContentTpl() ?? null" />
                </div>
                <app-code [code]="activityCode" />

                <ng-template #activityOpposite let-activity>
                    <span class="cz-text-xs cz-text-muted" style="white-space: nowrap;">{{ activity.time }}</span>
                </ng-template>

                <ng-template #activityMarker let-activity>
                    <cz-avatar [label]="activity.user.avatar" shape="circle" size="sm" />
                </ng-template>

                <ng-template #activityContent let-activity>
                    <div class="cz-pb-md" style="text-align: left;">
                        <div class="cz-flex cz-items-center cz-gap-sm cz-flex-wrap">
                            <strong>{{ activity.user.name }}</strong>
                            <span class="cz-text-secondary">{{ activity.action }}</span>
                            <span class="cz-font-medium" style="color: var(--cz-color-primary);">{{ activity.target }}</span>
                            @if (activity.repo) {
                                <span class="cz-text-secondary">{{ t().to }}</span>
                                <code class="cz-p-xs cz-rounded-sm cz-text-sm"
                                    style="background: var(--cz-theme-surface-hover);">{{ activity.repo }}</code>
                            }
                        </div>
                        @if (activity.description) {
                            <p class="cz-text-sm cz-text-secondary cz-mt-sm" style="margin-bottom: 0;">{{ activity.description }}</p>
                        }
                        @if (activity.details) {
                            <div class="cz-mt-sm cz-p-sm cz-rounded-md"
                                style="background: var(--cz-theme-surface-hover);">
                                <ul class="cz-pl-lg" style="margin: 0;">
                                    @for (detail of activity.details; track detail) {
                                        <li class="cz-text-sm cz-text-muted" style="font-family: var(--cz-font-code);">{{ detail }}</li>
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                </ng-template>
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
                    <li [innerHTML]="t().a11yList2"></li>
                    <li [innerHTML]="t().a11yKeyboard"></li>
                </ul>
            </section>

            <!-- ── API ── -->
            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>value</code></td><td><code>any[]</code></td><td><code>[]</code></td><td>An array of events to display (arbitrary objects).</td></tr>
                            <tr><td><code>layout</code></td><td><code>'vertical' | 'horizontal'</code></td><td><code>'vertical'</code></td><td>Orientation of the timeline.</td></tr>
                            <tr><td><code>align</code></td><td><code>'left' | 'right' | 'alternate' | 'top' | 'bottom'</code></td><td><code>'left'</code></td><td>Position of the line relative to the content. Vertical: <code>left</code>, <code>right</code>, <code>alternate</code>; horizontal: <code>top</code>, <code>bottom</code>, <code>alternate</code>.</td></tr>
                            <tr><td><code>contentTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Content template (<code>$implicit</code> event, <code>index</code>, <code>last</code>). Required to represent arbitrary events.</td></tr>
                            <tr><td><code>oppositeTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Content on the other side of the line (<code>$implicit</code> event, <code>index</code>, <code>last</code>).</td></tr>
                            <tr><td><code>markerTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom marker (<code>$implicit</code> event, <code>index</code>, <code>last</code>).</td></tr>
                            <tr><td><code>onEventSelect</code></td><td><code>output&lt;any&gt;</code></td><td><code>—</code></td><td>Emitted when the content of an event is clicked.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class TimelineDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => TIMELINE_DOC_I18N[this.lang.currentLang()] || TIMELINE_DOC_I18N.es);

    readonly RefreshIcon = LucideRefreshCw;
    readonly CheckCircleIcon = LucideCheckCircle;
    readonly HistoryIcon = LucideHistory;

    readonly events = [{ status: 'Ordered' }, { status: 'Processing' }, { status: 'Shipped' }, { status: 'Delivered' }];
    readonly datedEvents = [
        { status: 'Ordered', date: '15/10/2026 10:30' },
        { status: 'Processing', date: '15/10/2026 14:00' },
        { status: 'Shipped', date: '15/10/2026 16:15' },
        { status: 'Delivered', date: '16/10/2026 10:00' },
    ];
    readonly years = ['2026', '2027', '2028', '2029'];

    readonly orderEvents: OrderEvent[] = [
        {
            status: 'Order Placed', date: 'Oct 15, 2026', time: '10:30 AM', icon: LucideShoppingCart, color: '#3B82F6', user: 'JD',
            description: 'Your order #12345 has been confirmed and is being prepared for processing.',
            details: ['2x Wireless Headphones', '1x Phone Case', '1x USB-C Cable'],
        },
        {
            status: 'Payment Confirmed', date: 'Oct 15, 2026', time: '10:32 AM', icon: LucideCreditCard, color: '#10B981', user: 'SY',
            description: 'Payment of $149.99 was successfully processed via Credit Card ending in 4242.',
        },
        {
            status: 'Shipped', date: 'Oct 16, 2026', time: '02:15 PM', icon: LucideTruck, color: '#F59E0B', user: 'MK',
            description: 'Package has been handed to the carrier and is on its way.',
            tracking: 'TRK-892374651',
        },
        {
            status: 'Delivered', date: 'Oct 18, 2026', time: '11:20 AM', icon: LucideCheckCircle, color: '#84CC16', user: 'JD',
            description: 'Package was delivered and signed for at the front door.',
        },
    ];

    readonly steps = [
        { id: 1, label: 'Account Created', icon: LucideUserPlus },
        { id: 2, label: 'Email Verified', icon: LucideMail },
        { id: 3, label: 'Profile Completed', icon: LucideStar },
        { id: 4, label: 'First Purchase', icon: LucideShoppingBag },
        { id: 5, label: 'Review Posted', icon: LucideCheck },
    ];

    readonly completedSteps = signal<number[]>([1]);
    readonly currentStep = signal(2);

    readonly progress = computed(() => (this.completedSteps().length / this.steps.length) * 100);
    readonly isComplete = computed(() => this.completedSteps().length === this.steps.length);

    readonly activities: ActivityEvent[] = [
        {
            user: { name: 'Sarah Chen', avatar: 'SC' }, action: 'pushed', target: '3 commits', repo: 'main',
            time: '2 minutes ago',
            details: ['fix: resolve memory leak in useEffect', 'feat: add dark mode toggle', 'chore: update dependencies'],
        },
        {
            user: { name: 'Alex Kumar', avatar: 'AK' }, action: 'opened', target: 'pull request #142', repo: 'feature/auth',
            time: '15 minutes ago', description: 'Implement OAuth2 authentication flow',
        },
        {
            user: { name: 'Maya Johnson', avatar: 'MJ' }, action: 'commented on', target: 'issue #89',
            time: '1 hour ago', description: 'I have investigated this bug and found the root cause. Working on a fix now.',
        },
        {
            user: { name: 'David Park', avatar: 'DP' }, action: 'merged', target: 'pull request #138', repo: 'main',
            time: '3 hours ago',
        },
        {
            user: { name: 'Emma Wilson', avatar: 'EW' }, action: 'created', target: 'release v2.4.0',
            time: '5 hours ago', description: 'Performance improvements and bug fixes',
        },
    ];

    /* Templates (viewChild) */
    readonly basicContentTpl = viewChild<TemplateRef<unknown>>('basicContent');
    readonly alignContentTpl = viewChild<TemplateRef<unknown>>('alignContent');
    readonly oppositeTpl = viewChild<TemplateRef<unknown>>('oppositeDate');
    readonly oppositeContentTpl = viewChild<TemplateRef<unknown>>('oppositeContent');
    readonly yearContentTpl = viewChild<TemplateRef<unknown>>('yearContent');
    readonly orderOppositeTpl = viewChild<TemplateRef<unknown>>('orderOpposite');
    readonly orderMarkerTpl = viewChild<TemplateRef<unknown>>('orderMarker');
    readonly orderContentTpl = viewChild<TemplateRef<unknown>>('orderContent');
    readonly stepMarkerTpl = viewChild<TemplateRef<unknown>>('stepMarker');
    readonly stepContentTpl = viewChild<TemplateRef<unknown>>('stepContent');
    readonly activityOppositeTpl = viewChild<TemplateRef<unknown>>('activityOpposite');
    readonly activityMarkerTpl = viewChild<TemplateRef<unknown>>('activityMarker');
    readonly activityContentTpl = viewChild<TemplateRef<unknown>>('activityContent');

    getStepStatus(stepId: number): 'completed' | 'current' | 'pending' {
        if (this.completedSteps().includes(stepId)) return 'completed';
        if (stepId === this.currentStep()) return 'current';
        return 'pending';
    }

    handleComplete(stepId: number): void {
        if (stepId === this.currentStep()) {
            this.completedSteps.set([...this.completedSteps(), stepId]);
            this.currentStep.set(this.currentStep() + 1);
        }
    }

    handleReset(): void {
        this.completedSteps.set([1]);
        this.currentStep.set(2);
    }

    stepBackground(stepId: number): string {
        const status = this.getStepStatus(stepId);
        if (status === 'completed') return 'color-mix(in srgb, var(--cz-color-success) 12%, transparent)';
        if (status === 'current') return 'color-mix(in srgb, var(--cz-color-primary) 12%, transparent)';
        return 'transparent';
    }

    stepColor(stepId: number): string {
        const status = this.getStepStatus(stepId);
        if (status === 'completed') return 'var(--cz-color-success)';
        if (status === 'current') return 'var(--cz-color-primary)';
        return 'var(--cz-color-gray-400)';
    }

    notify(action: string, target: string): void {
        this.toast.success(`${action}: ${target}`);
    }

    importCode: Code = {
        typescript: `import { CzTimelineComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-timeline [value]="events" [contentTemplate]="content" />

<ng-template #content let-event>
    <div class="text-sm">{{ event.status }}</div>
</ng-template>`,
        typescript: `events = [{ status: 'Ordered' }, { status: 'Processing' }, { status: 'Shipped' }, { status: 'Delivered' }];`,
    };

    alignmentCode: Code = {
        html: `<!-- Line on the left (default) -->
<cz-timeline [value]="events" [contentTemplate]="content" />

<!-- Line on the right -->
<cz-timeline [value]="events" align="right" [contentTemplate]="content" />

<!-- Line centered, content alternates sides -->
<cz-timeline [value]="events" align="alternate" [contentTemplate]="content" />`,
    };

    oppositeCode: Code = {
        html: `<cz-timeline [value]="events" [oppositeTemplate]="opposite" [contentTemplate]="content" />

<ng-template #opposite let-event>
    <div class="text-xs text-muted">{{ event.date }}</div>
</ng-template>

<ng-template #content let-event>
    <div class="text-sm">{{ event.status }}</div>
</ng-template>`,
    };

    horizontalCode: Code = {
        html: `<!-- Content above the line -->
<cz-timeline [value]="years" layout="horizontal" align="top" [contentTemplate]="content" />

<!-- Content below the line -->
<cz-timeline [value]="years" layout="horizontal" align="bottom" [contentTemplate]="content" />

<!-- Content alternates above / below -->
<cz-timeline [value]="years" layout="horizontal" align="alternate" [contentTemplate]="content" />`,
    };

    customCode: Code = {
        html: `<cz-timeline
    [value]="events"
    align="alternate"
    [oppositeTemplate]="opposite"
    [markerTemplate]="marker"
    [contentTemplate]="content"
/>

<ng-template #opposite let-event>
    <div class="font-medium">{{ event.date }}</div>
    <div class="text-sm text-muted">{{ event.time }}</div>
</ng-template>

<ng-template #marker let-event>
    <span class="marker" [style.background]="event.color">
        <cz-icon [icon]="event.icon" [size]="16" />
    </span>
</ng-template>

<ng-template #content let-event>
    <div class="event-card">
        <cz-avatar [label]="event.user" shape="circle" size="sm" />
        <strong>{{ event.status }}</strong>
        <span class="text-sm">{{ event.description }}</span>
        <!-- details list, tracking row with actions, ... -->
    </div>
</ng-template>`,
    };

    interactiveCode: Code = {
        html: `<cz-timeline [value]="steps" [markerTemplate]="marker" [contentTemplate]="content" />

<ng-template #marker let-step>
    <cz-button
        [icon]="step.icon"
        iconOnly
        [severity]="status(step) === 'completed' ? 'success' : status(step) === 'current' ? 'primary' : 'secondary'"
        [variant]="status(step) === 'pending' ? 'outlined' : 'solid'"
        [disabled]="status(step) !== 'current'"
        (onClick)="complete(step.id)"
    />
</ng-template>

<ng-template #content let-step>
    <div [style.background]="background(step.id)">
        <p [class.line-through]="status(step.id) === 'completed'">{{ step.label }}</p>
        @if (status(step.id) === 'current') {
            <p class="hint">Click the marker to complete</p>
        }
    </div>
</ng-template>`,
        typescript: `completedSteps = signal<number[]>([1]);
currentStep = signal(2);

complete(stepId: number): void {
    if (stepId === this.currentStep()) {
        this.completedSteps.update(steps => [...steps, stepId]);
        this.currentStep.update(current => current + 1);
    }
}`,
    };

    activityCode: Code = {
        html: `<cz-timeline
    [value]="activities"
    [oppositeTemplate]="opposite"
    [markerTemplate]="marker"
    [contentTemplate]="content"
/>

<ng-template #opposite let-activity>
    <span class="text-xs text-muted">{{ activity.time }}</span>
</ng-template>

<ng-template #marker let-activity>
    <cz-avatar [label]="activity.user.avatar" shape="circle" size="sm" />
</ng-template>

<ng-template #content let-activity>
    <strong>{{ activity.user.name }}</strong>
    <span>{{ activity.action }}</span>
    <span class="text-primary">{{ activity.target }}</span>
    <!-- description, code repo chip, details list, ... -->
</ng-template>`,
    };
}
