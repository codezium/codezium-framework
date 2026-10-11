import { type LucideIconInput } from '@lucide/angular';

export type CzInputSize = 'sm' | 'md' | 'lg';
export type CzLabelPosition = 'none' | 'over' | 'in' | 'float';
export type CzInputColor = '' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark';

/** Shared severity palette used by feedback and action components (badge, tag, button, progress, ...) */
export type CzSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'dark';

/** Shared menu item model used by menu, menubar, tiered/mega/context menus, dock and command palette */
export interface CzMenuItem {
    label?: string;
    icon?: LucideIconInput;
    items?: CzMenuItem[];
    command?: (event?: Event) => void;
    routerLink?: string;
    url?: string;
    disabled?: boolean;
    separator?: boolean;
    badge?: string;
    /** Optional group label used by MegaMenu columns */
    group?: string;
}
