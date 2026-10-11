import { type LucideIconInput } from '@lucide/angular';

export type CzInputSize = 'sm' | 'md' | 'lg';
export type CzLabelPosition = 'none' | 'over' | 'in' | 'float';
export type CzInputColor = '' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark';

/**
 * Overlay stacking control.
 * - `null` (default): the overlay uses the theme token and stays above everything.
 * - `number`: custom z-index.
 * - `'none'`: no z-index, the overlay is not forced above other content.
 */
export type CzOverlayZIndex = number | 'none' | null;

/** Resolves a CzOverlayZIndex into an inline z-index value (null = let CSS decide) */
export function czOverlayZIndex(value: CzOverlayZIndex, offset = 0): string | number | null {
    if (value === null || value === undefined) return null;
    if (value === 'none') return 'auto';
    return value + offset;
}

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
    /** Link target used with `url` (e.g. `_blank`) */
    target?: string;
    disabled?: boolean;
    separator?: boolean;
    badge?: string;
    /** Optional group label used by MegaMenu columns */
    group?: string;
}
