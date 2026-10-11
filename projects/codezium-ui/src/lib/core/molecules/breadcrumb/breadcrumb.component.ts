import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';

export interface CzBreadcrumbItem {
    label: string;
    routerLink?: string;
    url?: string;
    icon?: LucideIconInput;
}

@Component({
    selector: 'cz-breadcrumb',
    imports: [CommonModule, RouterLink, LucideDynamicIcon],
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-breadcrumb',
    },
})
export class CzBreadcrumbComponent {
    /** Breadcrumb items (the last one is rendered as the current page) */
    items = input<CzBreadcrumbItem[]>([]);

    /** Optional home item rendered before the list */
    home = input<CzBreadcrumbItem | null>(null);

    /** Separator between items */
    separator = input<string>('/');

    /** Emitted when an item is clicked */
    itemClick = output<CzBreadcrumbItem>();
}
