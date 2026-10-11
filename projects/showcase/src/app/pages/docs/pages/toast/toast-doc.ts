import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CzButtonComponent, CzIconComponent, CzToastComponent, CzToastService } from 'codezium-ui';
import { LucideCheck, LucideLoaderCircle } from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { TOAST_DOC_I18N } from './toast-doc.i18n';

@Component({
    selector: 'cz-toast-doc-page',
    imports: [CzToastComponent, CzButtonComponent, CzIconComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="toast">{{ t().title }}</h1>
            <p class="doc-lead" [innerHTML]="t().lead"></p>

            <!-- Page-local toasts (keyed so they don't mix with the app shell toast) -->
            <cz-toast key="toast-basic" />
            <cz-toast key="toast-severity" />
            <cz-toast key="top-left" position="top-left" />
            <cz-toast key="top-center" position="top-center" />
            <cz-toast key="top-right" position="top-right" />
            <cz-toast key="bottom-left" position="bottom-left" />
            <cz-toast key="bottom-center" position="bottom-center" />
            <cz-toast key="bottom-right" position="bottom-right" />
            <cz-toast key="center" position="center" />
            <cz-toast key="toast-life" [life]="10000" />
            <cz-toast key="toast-sticky" />
            <cz-toast key="toast1" position="top-left" />
            <cz-toast key="toast2" position="top-right" />
            <cz-toast key="toast-clear" />
            <cz-toast key="toast-custom" [messageTemplate]="customTpl" />
            <cz-toast key="toast-action" [messageTemplate]="actionTpl" />
            <cz-toast key="toast-expanded" mode="expanded" [stackVisibleLimit]="7" />
            <cz-toast key="toast-promise" />

            <ng-template #customTpl let-message let-closeFn="closeFn">
                <div class="cz-flex cz-flex-col cz-gap-sm cz-w-full">
                    <div>
                        <strong>{{ message.summary }}</strong>
                        <a class="cz-text-sm" style="color: var(--cz-color-primary); text-decoration: underline; cursor: pointer;">{{ t().viewReceipt }}</a>
                    </div>
                    <p class="cz-text-sm cz-text-secondary" style="margin: 0;">
                        {{ message.detail }}
                        <a class="cz-text-sm" style="color: var(--cz-color-primary); text-decoration: underline; cursor: pointer;">{{ t().learnReturns }}</a>
                    </p>
                    <div class="cz-flex cz-items-center cz-gap-sm cz-mt-sm">
                        <cz-button [label]="t().dismiss" size="sm" variant="outlined" (onClick)="closeFn()" />
                        <cz-button [label]="t().trackOrders" size="sm" (onClick)="closeFn()" />
                    </div>
                </div>
            </ng-template>

            <ng-template #actionTpl let-message let-closeFn="closeFn">
                @if (message.severity === 'success') {
                    <cz-icon [icon]="CheckIcon" [size]="18" class="cz-toast-icon" />
                }
                <div class="cz-toast-body">
                    <div class="cz-toast-summary">{{ message.summary }}</div>
                    <div class="cz-toast-detail">{{ message.detail }}</div>
                    @if (message.severity !== 'success') {
                        <div class="cz-mt-sm">
                            <cz-button [label]="t().enableCamera" size="sm" (onClick)="enableCamera(closeFn)" />
                        </div>
                    }
                </div>
            </ng-template>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <!-- ── BASIC ── -->
            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p [innerHTML]="t().basicDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-button [label]="t().createToast" (onClick)="showBasic()" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <!-- ── SEVERITY ── -->
            <section>
                <h2 id="severity">{{ t().severity }}</h2>
                <p [innerHTML]="t().severityDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-sm">
                    <cz-button [label]="t().info" variant="outlined" severity="info" (onClick)="showSeverity('info')" />
                    <cz-button [label]="t().success" variant="outlined" severity="success" (onClick)="showSeverity('success')" />
                    <cz-button [label]="t().warn" variant="outlined" severity="warning" (onClick)="showSeverity('warning')" />
                    <cz-button [label]="t().error" variant="outlined" severity="danger" (onClick)="showSeverity('danger')" />
                    <cz-button [label]="t().secondary" variant="outlined" severity="secondary" (onClick)="showSeverity('secondary')" />
                    <cz-button [label]="t().dark" variant="outlined" severity="dark" (onClick)="showSeverity('dark')" />
                </div>
                <app-code [code]="severityCode" />
            </section>

            <!-- ── POSITION ── -->
            <section>
                <h2 id="position">{{ t().position }}</h2>
                <p [innerHTML]="t().positionDesc"></p>
                <div class="cz-mb-md cz-flex cz-flex-wrap cz-justify-center cz-gap-sm">
                    <cz-button [label]="t().topLeft" variant="outlined" (onClick)="createToast('top-left')" />
                    <cz-button [label]="t().topCenter" variant="outlined" (onClick)="createToast('top-center')" />
                    <cz-button [label]="t().topRight" variant="outlined" (onClick)="createToast('top-right')" />
                    <cz-button [label]="t().bottomLeft" variant="outlined" (onClick)="createToast('bottom-left')" />
                    <cz-button [label]="t().bottomCenter" variant="outlined" (onClick)="createToast('bottom-center')" />
                    <cz-button [label]="t().bottomRight" variant="outlined" (onClick)="createToast('bottom-right')" />
                    <cz-button [label]="t().center" variant="outlined" (onClick)="createToast('center')" />
                </div>
                <app-code [code]="positionCode" />
            </section>

            <!-- ── LIFE ── -->
            <section>
                <h2 id="life">{{ t().life }}</h2>
                <p [innerHTML]="t().lifeDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center cz-gap-sm">
                    <cz-button [label]="t().showLife" (onClick)="showLife()" />
                    <cz-button [label]="t().showLifeLong" variant="outlined" (onClick)="showLifeLong()" />
                </div>
                <app-code [code]="lifeCode" />
            </section>

            <!-- ── STICKY ── -->
            <section>
                <h2 id="sticky">{{ t().sticky }}</h2>
                <p [innerHTML]="t().stickyDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center cz-gap-sm">
                    <cz-button [label]="t().createToast" (onClick)="showSticky()" />
                    <cz-button [label]="t().dismiss" variant="outlined" severity="secondary" (onClick)="dismiss('toast-sticky')" />
                </div>
                <app-code [code]="stickyCode" />
            </section>

            <!-- ── TARGET ── -->
            <section>
                <h2 id="target">{{ t().target }}</h2>
                <p [innerHTML]="t().targetDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center cz-gap-sm">
                    <cz-button [label]="t().showSuccess" (onClick)="showToast1()" />
                    <cz-button [label]="t().showWarning" severity="warning" (onClick)="showToast2()" />
                </div>
                <app-code [code]="targetCode" />
            </section>

            <!-- ── CLEAR ── -->
            <section>
                <h2 id="clear">{{ t().clear }}</h2>
                <p [innerHTML]="t().clearDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center cz-gap-sm">
                    <cz-button [label]="t().show" (onClick)="showClear()" />
                    <cz-button [label]="t().clear" variant="outlined" severity="secondary" (onClick)="dismiss('toast-clear')" />
                </div>
                <app-code [code]="clearCode" />
            </section>

            <!-- ── CUSTOM ── -->
            <section>
                <h2 id="custom">{{ t().custom }}</h2>
                <p [innerHTML]="t().customDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-button [label]="t().customToast" variant="outlined" (onClick)="showCustom()" />
                </div>
                <app-code [code]="customCode" />
            </section>

            <!-- ── ACTION ── -->
            <section>
                <h2 id="action">{{ t().action }}</h2>
                <p [innerHTML]="t().actionDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-button [label]="t().createAction" variant="outlined" (onClick)="showAction()" />
                </div>
                <app-code [code]="actionCode" />
            </section>

            <!-- ── EXPANDED MODE ── -->
            <section>
                <h2 id="expanded">{{ t().expanded }}</h2>
                <p [innerHTML]="t().expandedDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-button [label]="t().createToast" variant="outlined" (onClick)="showExpanded()" />
                </div>
                <app-code [code]="expandedCode" />
            </section>

            <!-- ── PROMISE ── -->
            <section>
                <h2 id="promise">{{ t().promise }}</h2>
                <p [innerHTML]="t().promiseDesc"></p>
                <div class="cz-mb-md cz-flex cz-justify-center">
                    <cz-button [label]="t().runPromise" variant="outlined" (onClick)="runPromise()" />
                </div>
                <app-code [code]="promiseCode" />
            </section>

            <!-- ── ACCESSIBILITY ── -->
            <section>
                <h2 id="accessibility">{{ t().accessibility }}</h2>
                <p [innerHTML]="t().accessibilityDesc"></p>
                <ul>
                    <li [innerHTML]="t().a11yList"></li>
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
                            <tr><td><code>key</code></td><td><code>string | null</code></td><td><code>null</code></td><td>Key of the messages targeted to this toast.</td></tr>
                            <tr><td><code>position</code></td><td><code>'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center'</code></td><td><code>'top-right'</code></td><td>Position of the toast in the viewport.</td></tr>
                            <tr><td><code>life</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Default auto dismiss time in ms (message <code>life</code> wins, default 3000).</td></tr>
                            <tr><td><code>mode</code></td><td><code>'stacked' | 'expanded'</code></td><td><code>'stacked'</code></td><td><code>stacked</code> collapses toasts into a stack that expands on hover; <code>expanded</code> always renders every toast expanded.</td></tr>
                            <tr><td><code>stackGap</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Gap between stacked toast items in pixels.</td></tr>
                            <tr><td><code>stackVisibleLimit</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Maximum number of visible toasts in the stack.</td></tr>
                            <tr><td><code>preventOpenDuplicates</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Does not display a new message while an equal one is already open.</td></tr>
                            <tr><td><code>preventDuplicates</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Displays a message with the same content only once.</td></tr>
                            <tr><td><code>messageTemplate</code></td><td><code>TemplateRef | null</code></td><td><code>null</code></td><td>Custom message template (<code>$implicit</code> message, <code>closeFn</code>).</td></tr>
                            <tr><td><code>zIndex</code></td><td><code>number | 'none' | null</code></td><td><code>null</code></td><td>Overlay z-index.</td></tr>
                            <tr><td><code>onClose</code></td><td><code>output&lt;CzToastMessage&gt;</code></td><td><code>—</code></td><td>Emitted when a message is closed.</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3>Message interface</h3>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>primary | secondary | success | info | warning | danger | dark</code> (default <code>info</code>).</td></tr>
                            <tr><td><code>summary / detail</code></td><td><code>string</code></td><td>Title and content of the message.</td></tr>
                            <tr><td><code>life</code></td><td><code>number</code></td><td>Auto dismiss time in ms (0 = sticky).</td></tr>
                            <tr><td><code>sticky</code></td><td><code>boolean</code></td><td>Stays until dismissed manually.</td></tr>
                            <tr><td><code>key</code></td><td><code>string</code></td><td>Targets a toast component with the same key.</td></tr>
                            <tr><td><code>icon / iconSpin</code></td><td><code>LucideIconInput / boolean</code></td><td>Custom icon overriding the severity icon (optionally spinning).</td></tr>
                            <tr><td><code>styleClass</code></td><td><code>string</code></td><td>Extra class applied to the toast item.</td></tr>
                            <tr><td><code>data</code></td><td><code>Record&lt;string, any&gt;</code></td><td>Arbitrary data for custom templates.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ToastDocPage {
    private readonly lang = inject(LanguageService);
    private readonly toast = inject(CzToastService);
    readonly t = computed(() => TOAST_DOC_I18N[this.lang.currentLang()] || TOAST_DOC_I18N.es);

    readonly CheckIcon = LucideCheck;

    showBasic(): void {
        this.toast.add({
            key: 'toast-basic',
            summary: this.t().basicSummary,
            detail: this.t().basicDetail,
        });
    }

    showSeverity(severity: 'info' | 'success' | 'warning' | 'danger' | 'secondary' | 'dark'): void {
        this.toast.add({
            key: 'toast-severity',
            severity,
            summary: this.t().severitySummary,
            detail: this.t().severityDetail,
        });
    }

    createToast(key: string): void {
        this.toast.add({
            key,
            summary: this.t().basicSummary,
            detail: this.t().basicDetail,
        });
    }

    showLife(): void {
        this.toast.add({ key: 'toast-life', severity: 'info', summary: this.t().lifeSummary, detail: this.t().lifeDetail });
    }

    showLifeLong(): void {
        this.toast.add({
            key: 'toast-life',
            severity: 'info',
            summary: this.t().lifeSummary,
            detail: this.t().lifeLongDetail,
            life: 20000,
        });
    }

    showSticky(): void {
        this.toast.add({
            key: 'toast-sticky',
            severity: 'info',
            summary: this.t().stickySummary,
            detail: this.t().stickyDetail,
            sticky: true,
        });
    }

    showToast1(): void {
        this.toast.clear();
        this.toast.add({ key: 'toast1', severity: 'success', summary: this.t().success, detail: 'key: toast1' });
    }

    showToast2(): void {
        this.toast.clear();
        this.toast.add({ key: 'toast2', severity: 'warning', summary: this.t().warn, detail: 'key: toast2' });
    }

    showClear(): void {
        this.toast.add({ key: 'toast-clear', severity: 'success', summary: this.t().clearSummary, detail: this.t().clearDetail });
    }

    dismiss(key: string): void {
        this.toast.clear(key);
    }

    showCustom(): void {
        this.toast.add({
            key: 'toast-custom',
            summary: this.t().customSummary,
            detail: this.t().customDetail,
            life: 6000,
        });
    }

    showAction(): void {
        this.toast.add({
            key: 'toast-action',
            summary: this.t().actionSummary,
            detail: this.t().actionDetail,
            sticky: true,
        });
    }

    enableCamera(closeFn: (event?: Event) => void): void {
        closeFn();
        this.toast.add({
            key: 'toast-action',
            severity: 'success',
            summary: this.t().cameraGranted,
            detail: this.t().cameraDetail,
        });
    }

    showExpanded(): void {
        this.toast.add({
            key: 'toast-expanded',
            summary: this.t().basicSummary,
            detail: this.t().basicDetail,
        });
    }

    runPromise(): void {
        this.toast.add({
            key: 'toast-promise',
            severity: 'secondary',
            summary: this.t().waitSummary,
            detail: this.t().waitDetail,
            icon: LucideLoaderCircle,
            iconSpin: true,
            sticky: true,
        });

        setTimeout(() => {
            this.toast.clear('toast-promise');

            setTimeout(() => {
                const failed = Math.random() < 0.5;
                this.toast.add({
                    key: 'toast-promise',
                    severity: failed ? 'danger' : 'success',
                    summary: failed ? this.t().errorSummary : this.t().successSummary,
                    detail: failed ? this.t().errorDetail : this.t().successDetail,
                    life: 3000,
                });
            }, 300);
        }, 2000);
    }

    importCode: Code = {
        typescript: `import { CzToastComponent, CzToastService } from 'codezium-ui';

// add <cz-toast /> once in your shell
private toast = inject(CzToastService);`,
    };

    basicCode: Code = {
        html: `<cz-toast />
<cz-button label="Create toast" (onClick)="show()" />`,
        typescript: `show(): void {
    this.toast.add({ summary: 'Successfully completed', detail: 'The task was completed successfully.' });
}`,
    };

    severityCode: Code = {
        html: `<cz-toast />`,
        typescript: `this.toast.add({ severity: 'info', summary: 'Heads up', detail: 'Something to check.' });
this.toast.add({ severity: 'success', summary: 'Saved', detail: 'Your changes have been saved.' });
this.toast.add({ severity: 'warning', summary: 'Check this', detail: 'Some fields need attention.' });
this.toast.add({ severity: 'danger', summary: 'Something went wrong', detail: 'Please try again.' });
this.toast.add({ severity: 'secondary', summary: 'FYI', detail: 'Secondary toast message.' });
this.toast.add({ severity: 'dark', summary: 'High contrast', detail: 'Dark toast message.' });`,
    };

    positionCode: Code = {
        html: `<cz-toast position="top-left" key="top-left" />
<cz-toast position="top-center" key="top-center" />
<cz-toast position="top-right" key="top-right" />
<cz-toast position="bottom-left" key="bottom-left" />
<cz-toast position="bottom-center" key="bottom-center" />
<cz-toast position="bottom-right" key="bottom-right" />
<cz-toast position="center" key="center" />`,
        typescript: `createToast(key: string): void {
    this.toast.add({ key, summary: 'Successfully completed', detail: 'The task was completed.' });
}`,
    };

    lifeCode: Code = {
        html: `<cz-toast [life]="10000" />`,
        typescript: `// Default for this toast: 10s; a message can override it
this.toast.add({ severity: 'info', summary: 'Life', detail: 'I show for 20s', life: 20000 });`,
    };

    stickyCode: Code = {
        html: `<cz-toast />`,
        typescript: `this.toast.add({ severity: 'info', summary: 'Sticky', detail: 'Stays until dismissed.', sticky: true });

// dismiss programmatically
this.toast.clear();`,
    };

    targetCode: Code = {
        html: `<cz-toast key="toast1" position="top-left" />
<cz-toast key="toast2" position="top-right" />`,
        typescript: `showToast1(): void {
    this.toast.clear();
    this.toast.add({ key: 'toast1', severity: 'success', summary: 'Success', detail: 'key: toast1' });
}`,
    };

    clearCode: Code = {
        html: `<cz-toast key="myKey" />`,
        typescript: `// removes all messages
this.toast.clear();

// removes only the messages of a toast with the same key
this.toast.clear('myKey');`,
    };

    customCode: Code = {
        html: `<cz-toast key="custom" [messageTemplate]="message" />

<ng-template #message let-message let-closeFn="closeFn">
    <strong>{{ message.summary }}</strong>
    <p>{{ message.detail }}</p>
    <cz-button label="Dismiss" size="sm" (onClick)="closeFn()" />
    <cz-button label="Track orders" size="sm" (onClick)="closeFn()" />
</ng-template>`,
        typescript: `this.toast.add({ key: 'custom', summary: 'Purchase complete', detail: 'Your order is being processed.', life: 6000 });`,
    };

    actionCode: Code = {
        html: `<cz-toast key="action" [messageTemplate]="message" />

<ng-template #message let-message let-closeFn="closeFn">
    @if (message.severity === 'success') {
        <cz-icon [icon]="CheckIcon" [size]="18" class="cz-toast-icon" />
    }
    <div class="cz-toast-body">
        <div class="cz-toast-summary">{{ message.summary }}</div>
        <div class="cz-toast-detail">{{ message.detail }}</div>
        @if (message.severity !== 'success') {
            <cz-button label="Enable camera" size="sm" (onClick)="enableCamera(closeFn)" />
        }
    </div>
</ng-template>`,
        typescript: `enableCamera(closeFn: (event?: Event) => void): void {
    closeFn();
    this.toast.add({ key: 'action', severity: 'success', summary: 'Camera access granted' });
}`,
    };

    expandedCode: Code = {
        html: `<cz-toast key="expanded" mode="expanded" [stackVisibleLimit]="7" />`,
        typescript: `// default mode="stacked" collapses toasts into a stack that expands on hover;
// expanded always renders every toast expanded`,
    };

    promiseCode: Code = {
        html: `<cz-toast key="promise" />`,
        typescript: `runPromise(): void {
    this.toast.add({
        key: 'promise',
        severity: 'secondary',
        summary: 'Please wait...',
        detail: 'Your request is being processed.',
        icon: LucideLoaderCircle,
        iconSpin: true,
        sticky: true,
    });

    this.fakeApiCall()
        .then(result => {
            this.toast.clear('promise');
            setTimeout(() => this.toast.add({ key: 'promise', severity: 'success', summary: 'Success!', life: 3000 }), 300);
        })
        .catch(error => {
            this.toast.clear('promise');
            setTimeout(() => this.toast.add({ key: 'promise', severity: 'danger', summary: 'Something went wrong', life: 3000 }), 300);
        });
}`,
    };
}
