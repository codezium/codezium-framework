import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    inject,
    input,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

let nextTabId = 0;

@Component({
    selector: 'cz-tab',
    imports: [CommonModule],
    template: `
        @if (isActive()) {
            <div
                class="cz-tab-panel"
                role="tabpanel"
                [id]="panelId"
                [attr.aria-labelledby]="tabId"
            >
                <ng-content />
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CzTabComponent {
    /** Header label of the tab */
    header = input<string>('');

    /** Disabled state */
    disabled = input<boolean>(false);

    readonly tabId = `cz-tab-${nextTabId++}`;
    readonly panelId = `${this.tabId}-panel`;

    private readonly tabsRef = inject(CzTabsComponent, { optional: true });

    isActive = computed(() => {
        if (!this.tabsRef) return true;
        return this.tabsRef.activeIndex() === this.tabsRef.tabs().indexOf(this);
    });
}

@Component({
    selector: 'cz-tabs',
    imports: [CommonModule],
    templateUrl: './tabs.component.html',
    styleUrl: './tabs.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-tabs',
    },
})
export class CzTabsComponent implements AfterContentInit {
    /** Initial active index */
    activeTab = input<number>(0);

    /** Internal active index */
    activeIndex = signal<number>(0);

    /** Projected tabs */
    tabs = contentChildren(CzTabComponent);

    ngAfterContentInit(): void {
        this.activeIndex.set(this.activeTab());
    }

    select(index: number): void {
        const tab = this.tabs()[index];
        if (!tab || tab.disabled()) return;
        this.activeIndex.set(index);
    }
}
