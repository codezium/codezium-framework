import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { CzIconComponent, CzRippleDirective } from 'codezium-ui';
import { type NavItem, DOCS_NAV } from './docs-nav.data';

@Component({
    selector: 'cz-docs-nav',
    imports: [RouterLink, RouterLinkActive, CzIconComponent, CzRippleDirective],
    templateUrl: './docs-nav.html',
    styleUrl: './docs-nav.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsNavComponent {
    private readonly router = inject(Router);

    readonly items = input<NavItem[]>(DOCS_NAV);

    /** Track which group labels are expanded */
    readonly expanded = signal<Set<string>>(new Set(['Getting Started']));

    constructor() {
        // Auto-expand the group that contains the active page
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(),
            )
            .subscribe(event => this.expandActiveGroup(event.urlAfterRedirects));
    }

    toggleGroup(label: string): void {
        this.expanded.update(set => {
            const next = new Set(set);
            next.has(label) ? next.delete(label) : next.add(label);
            return next;
        });
    }

    isExpanded(label: string): boolean {
        return this.expanded().has(label);
    }

    private expandActiveGroup(url: string): void {
        const path = url.split(/[?#]/)[0].replace(/\/$/, '');
        const group = this.items().find(item => item.children?.some(child => child.path === path));
        if (!group) return;

        this.expanded.update(set => new Set(set).add(group.label));
    }
}
