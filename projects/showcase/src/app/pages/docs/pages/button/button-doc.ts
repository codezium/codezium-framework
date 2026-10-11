import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CzButtonComponent } from 'codezium-ui';
import {
    LucideBell,
    LucideCheck,
    LucideChevronRight,
    LucideDownload,
    LucideLoaderCircle,
    LucideSearch,
    LucideStar,
    LucideTrash,
} from '@lucide/angular';
import { AppCodeComponent, Code } from '../../../../shared/code-block/code-block.component';
import { LanguageService } from '../../../../core/services/language.service';
import { BUTTON_DOC_I18N } from './button-doc.i18n';

@Component({
    selector: 'cz-button-doc-page',
    imports: [CzButtonComponent, AppCodeComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="doc-page">
            <h1 id="button">{{ t().title }}</h1>
            <p class="doc-lead">{{ t().lead }}</p>

            <section>
                <h2 id="import">{{ t().importTitle }}</h2>
                <app-code [code]="importCode" />
            </section>

            <section>
                <h2 id="basic">{{ t().basic }}</h2>
                <p>{{ t().basicDesc }}</p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Save" />
                </div>
                <app-code [code]="basicCode" />
            </section>

            <section>
                <h2 id="severities">{{ t().severities }}</h2>
                <p [innerHTML]="t().severitiesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Primary" severity="primary" />
                    <cz-button label="Secondary" severity="secondary" />
                    <cz-button label="Success" severity="success" />
                    <cz-button label="Info" severity="info" />
                    <cz-button label="Warning" severity="warning" />
                    <cz-button label="Danger" severity="danger" />
                    <cz-button label="Dark" severity="dark" />
                </div>
                <app-code [code]="severitiesCode" />
            </section>

            <section>
                <h2 id="variants">{{ t().variants }}</h2>
                <p [innerHTML]="t().variantsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Solid" />
                    <cz-button label="Outlined" variant="outlined" />
                    <cz-button label="Text" variant="text" />
                    <cz-button label="Link" variant="link" />
                    <cz-button label="Plain" variant="plain" />
                </div>
                <app-code [code]="variantsCode" />
            </section>

            <section>
                <h2 id="sizes">{{ t().sizes }}</h2>
                <p [innerHTML]="t().sizesDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Small" size="sm" />
                    <cz-button label="Medium" size="md" />
                    <cz-button label="Large" size="lg" />
                </div>
                <app-code [code]="sizesCode" />
            </section>

            <section>
                <h2 id="icons">{{ t().icons }}</h2>
                <p [innerHTML]="t().iconsDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Download" [icon]="DownloadIcon" />
                    <cz-button label="Next" [icon]="ChevronRightIcon" iconPos="right" variant="outlined" />
                    <cz-button label="Top" [icon]="StarIcon" iconPos="top" severity="success" />
                    <cz-button label="Bottom" [icon]="StarIcon" iconPos="bottom" severity="info" />
                </div>
                <app-code [code]="iconsCode" />
            </section>

            <section>
                <h2 id="icon-only">{{ t().iconOnly }}</h2>
                <p [innerHTML]="t().iconOnlyDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button [icon]="CheckIcon" ariaLabel="Confirm" />
                    <cz-button [icon]="SearchIcon" ariaLabel="Search" severity="secondary" variant="outlined" />
                    <cz-button [icon]="StarIcon" ariaLabel="Favorite" severity="warning" [rounded]="true" />
                    <cz-button [icon]="TrashIcon" ariaLabel="Delete" severity="danger" [rounded]="true" variant="text" />
                    <cz-button [icon]="BellIcon" ariaLabel="Notifications" [iconOnly]="true" [raised]="true" />
                </div>
                <app-code [code]="iconOnlyCode" />
            </section>

            <section>
                <h2 id="badge">{{ t().badge }}</h2>
                <p [innerHTML]="t().badgeDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Emails" [badge]="2" badgeSeverity="info" />
                    <cz-button label="Inbox" variant="outlined" [badge]="'99+'" badgeSeverity="danger" />
                    <cz-button label="Messages" severity="secondary" [badge]="5" badgeSeverity="success" />
                    <cz-button [icon]="BellIcon" ariaLabel="Notifications" [badge]="3" badgeSeverity="warning" />
                </div>
                <app-code [code]="badgeCode" />
            </section>

            <section>
                <h2 id="loading">{{ t().loading }}</h2>
                <p [innerHTML]="t().loadingDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button label="Save changes" [loading]="loading()" [disabled]="loading()"
                        (onClick)="load()" />
                    <cz-button label="With custom icon" severity="success" [loading]="loading()" [disabled]="loading()"
                        [loadingIcon]="LoaderIcon" (onClick)="load()" />
                    <cz-button [icon]="CheckIcon" ariaLabel="Confirm" [loading]="loading()" (onClick)="load()" />
                </div>
                <app-code [code]="loadingCode" />
            </section>

            <section>
                <h2 id="states">{{ t().states }}</h2>
                <p [innerHTML]="t().statesDesc"></p>
                <div class="cz-flex cz-flex-col cz-gap-md cz-mb-md">
                    <div class="cz-flex cz-flex-wrap cz-gap-md">
                        <cz-button label="Disabled" [disabled]="true" />
                        <cz-button label="Raised" [raised]="true" severity="success" />
                        <cz-button label="Raised text" [raised]="true" variant="text" severity="info" />
                        <cz-button label="Rounded" [rounded]="true" severity="dark" />
                    </div>
                    <cz-button label="Fluid Button" [fluid]="true" />
                </div>
                <app-code [code]="statesCode" />
            </section>

            <section>
                <h2 id="content">{{ t().content }}</h2>
                <p [innerHTML]="t().contentDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-mb-md">
                    <cz-button variant="outlined">
                        <strong>Custom</strong>&nbsp;content
                    </cz-button>
                    <cz-button severity="info">
                        <span aria-hidden="true">★</span> Projected
                    </cz-button>
                </div>
                <app-code [code]="contentCode" />
            </section>

            <section>
                <h2 id="any-icon">{{ t().anyIcon }}</h2>
                <p [innerHTML]="t().anyIconDesc"></p>
                <div class="cz-flex cz-flex-wrap cz-gap-md cz-items-center cz-mb-md">
                    <cz-button label="Lucide icon" [icon]="StarIcon" />
                    <cz-button variant="outlined" ariaLabel="Star action">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7L12 17.5 5.8 21.2l1.6-7L2 9.5l7.1-.6z" />
                        </svg>
                        Custom SVG
                    </cz-button>
                    <cz-button severity="info">
                        <span aria-hidden="true">🚀</span> Emoji
                    </cz-button>
                </div>
                <app-code [code]="anyIconCode" />
            </section>

            <section>
                <h2 id="api">{{ t().api }}</h2>
                <div class="doc-table-wrapper">
                    <table class="doc-table">
                        <thead>
                            <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>label</code></td><td><code>string</code></td><td><code>''</code></td><td>Text of the button.</td></tr>
                            <tr><td><code>icon</code></td><td><code>LucideIconInput</code></td><td><code>null</code></td><td>Optional Lucide icon.</td></tr>
                            <tr><td><code>iconPos</code></td><td><code>'left' | 'right' | 'top' | 'bottom'</code></td><td><code>'left'</code></td><td>Icon position.</td></tr>
                            <tr><td><code>severity</code></td><td><code>CzSeverity</code></td><td><code>'primary'</code></td><td>Semantic color.</td></tr>
                            <tr><td><code>variant</code></td><td><code>'solid' | 'outlined' | 'text' | 'link' | 'plain'</code></td><td><code>'solid'</code></td><td>Visual variant.</td></tr>
                            <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size.</td></tr>
                            <tr><td><code>raised</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Adds elevation.</td></tr>
                            <tr><td><code>rounded</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Pill shape.</td></tr>
                            <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a spinner and blocks clicks.</td></tr>
                            <tr><td><code>loadingIcon</code></td><td><code>LucideIconInput | null</code></td><td><code>null</code></td><td>Custom icon shown while loading.</td></tr>
                            <tr><td><code>badge</code></td><td><code>string | number | null</code></td><td><code>null</code></td><td>Badge value displayed inside the button.</td></tr>
                            <tr><td><code>badgeSeverity</code></td><td><code>CzSeverity</code></td><td><code>'secondary'</code></td><td>Severity of the badge.</td></tr>
                            <tr><td><code>iconOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Forces the square icon-only styling (inferred without label/badge).</td></tr>
                            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state.</td></tr>
                            <tr><td><code>fluid</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Full width.</td></tr>
                            <tr><td><code>type</code></td><td><code>'button' | 'submit' | 'reset'</code></td><td><code>'button'</code></td><td>Native button type.</td></tr>
                            <tr><td><code>styleClass</code></td><td><code>string</code></td><td><code>''</code></td><td>Custom class for the native button.</td></tr>
                            <tr><td><code>tabindex</code></td><td><code>number | null</code></td><td><code>null</code></td><td>Native tabindex.</td></tr>
                            <tr><td><code>autofocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Focuses the button on load.</td></tr>
                            <tr><td><code>ariaLabel</code></td><td><code>string</code></td><td><code>''</code></td><td>Accessible label (required for icon-only buttons).</td></tr>
                            <tr><td><code>onClick</code></td><td><code>output&lt;MouseEvent&gt;</code></td><td><code>—</code></td><td>Emitted on click (blocked while disabled/loading).</td></tr>
                            <tr><td><code>onFocus / onBlur</code></td><td><code>output&lt;FocusEvent&gt;</code></td><td><code>—</code></td><td>Emitted on focus / blur.</td></tr>
                            <tr><td>default slot</td><td><code>ng-content</code></td><td><code>—</code></td><td>Custom content projected inside the button.</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `,
})
export class ButtonDocPage {
    private readonly lang = inject(LanguageService);
    readonly t = computed(() => BUTTON_DOC_I18N[this.lang.currentLang()] || BUTTON_DOC_I18N.es);

    readonly DownloadIcon = LucideDownload;
    readonly ChevronRightIcon = LucideChevronRight;
    readonly CheckIcon = LucideCheck;
    readonly TrashIcon = LucideTrash;
    readonly StarIcon = LucideStar;
    readonly SearchIcon = LucideSearch;
    readonly BellIcon = LucideBell;
    readonly LoaderIcon = LucideLoaderCircle;

    readonly loading = signal(false);

    load(): void {
        if (this.loading()) return;
        this.loading.set(true);
        setTimeout(() => this.loading.set(false), 2000);
    }

    anyIconCode: Code = {
        html: `<!-- Any Lucide icon through the input -->
<cz-button label="Lucide icon" [icon]="StarIcon" />

<!-- Any other icon or content through projection -->
<cz-button variant="outlined" ariaLabel="Star action">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7L12 17.5 5.8 21.2l1.6-7L2 9.5l7.1-.6z" />
    </svg>
    Custom SVG
</cz-button>

<cz-button severity="info"><span aria-hidden="true">🚀</span> Emoji</cz-button>`,
    };

    importCode: Code = {
        typescript: `import { CzButtonComponent } from 'codezium-ui';`,
    };

    basicCode: Code = {
        html: `<cz-button label="Save" (onClick)="save()" />`,
    };

    severitiesCode: Code = {
        html: `<cz-button label="Primary" severity="primary" />
<cz-button label="Secondary" severity="secondary" />
<cz-button label="Success" severity="success" />
<cz-button label="Info" severity="info" />
<cz-button label="Warning" severity="warning" />
<cz-button label="Danger" severity="danger" />
<cz-button label="Dark" severity="dark" />`,
    };

    variantsCode: Code = {
        html: `<cz-button label="Solid" />
<cz-button label="Outlined" variant="outlined" />
<cz-button label="Text" variant="text" />
<cz-button label="Link" variant="link" />
<cz-button label="Plain" variant="plain" />`,
    };

    sizesCode: Code = {
        html: `<cz-button label="Small" size="sm" />
<cz-button label="Medium" size="md" />
<cz-button label="Large" size="lg" />`,
    };

    iconsCode: Code = {
        html: `<cz-button label="Download" [icon]="DownloadIcon" />
<cz-button label="Next" [icon]="ChevronRightIcon" iconPos="right" variant="outlined" />
<cz-button label="Top" [icon]="StarIcon" iconPos="top" severity="success" />
<cz-button label="Bottom" [icon]="StarIcon" iconPos="bottom" severity="info" />`,
        typescript: `import { LucideChevronRight, LucideDownload, LucideStar } from '@lucide/angular';`,
    };

    iconOnlyCode: Code = {
        html: `<cz-button [icon]="CheckIcon" ariaLabel="Confirm" />
<cz-button [icon]="SearchIcon" ariaLabel="Search" severity="secondary" variant="outlined" />
<cz-button [icon]="StarIcon" ariaLabel="Favorite" severity="warning" [rounded]="true" />
<cz-button [icon]="BellIcon" ariaLabel="Notifications" [iconOnly]="true" [raised]="true" />`,
        typescript: `import { LucideBell, LucideCheck, LucideSearch, LucideStar } from '@lucide/angular';`,
    };

    badgeCode: Code = {
        html: `<cz-button label="Emails" [badge]="2" badgeSeverity="info" />
<cz-button label="Inbox" variant="outlined" [badge]="'99+'" badgeSeverity="danger" />
<cz-button [icon]="BellIcon" ariaLabel="Notifications" [badge]="3" badgeSeverity="warning" />`,
    };

    loadingCode: Code = {
        html: `<cz-button label="Save changes" [loading]="loading()" (onClick)="load()" />
<cz-button label="With custom icon" [loading]="loading()" [loadingIcon]="LoaderIcon" (onClick)="load()" />`,
        typescript: `readonly loading = signal(false);

load(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 2000);
}`,
    };

    statesCode: Code = {
        html: `<cz-button label="Disabled" [disabled]="true" />
<cz-button label="Raised" [raised]="true" severity="success" />
<cz-button label="Raised text" [raised]="true" variant="text" severity="info" />
<cz-button label="Fluid Button" [fluid]="true" />`,
    };

    contentCode: Code = {
        html: `<cz-button variant="outlined">
    <strong>Custom</strong>&nbsp;content
</cz-button>`,
    };
}
