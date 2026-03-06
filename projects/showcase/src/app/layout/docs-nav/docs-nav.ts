import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CzIconComponent } from 'codezium-ui';
import { type NavItem, DOCS_NAV } from './docs-nav.data';

@Component({
    selector: 'cz-docs-nav',
    imports: [RouterLink, RouterLinkActive, CzIconComponent],
    templateUrl: './docs-nav.html',
    styleUrl: './docs-nav.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsNavComponent {
    readonly items = input<NavItem[]>(DOCS_NAV);

    /** Track which group labels are expanded */
    readonly expanded = signal<Set<string>>(new Set(['Getting Started']));

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
}
