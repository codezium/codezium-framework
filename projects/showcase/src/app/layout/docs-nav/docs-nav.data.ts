import { type LucideIconData } from 'lucide-angular';
import {
    Rocket,
    Palette,
    Box,
    Zap,
} from 'lucide-angular';

export interface NavItem {
    label: string;
    icon?: LucideIconData;   // now a real Lucide icon object, not a string
    path?: string;
    badge?: string;
    children?: NavItem[];
}

export const DOCS_NAV: NavItem[] = [
    {
        label: 'Getting Started',
        icon: Rocket,
        children: [
            { label: 'Introduction', path: '/docs/introduction' },
            { label: 'Installation', path: '/docs/installation' },
            //{ label: 'Theming', path: '/docs/theming' },
        ],
    },
    {
        label: 'Theming',
        icon: Palette,
        children: [
            { label: 'Overview', path: '/docs/theming/overview' },
            { label: 'Base Theme', path: '/docs/theming/base' },
            { label: 'Glass Theme', path: '/docs/theming/glass' },
            { label: 'Neo Theme', path: '/docs/theming/neo' },
            { label: 'Dark Mode', path: '/docs/theming/dark-mode' },
        ],
    },
    {
        label: 'Components',
        icon: Box,
        children: [
            { label: 'InputText', path: '/docs/components/input-text' },
            { label: 'Password', path: '/docs/components/password' },
            { label: 'Autocomplete', path: '/docs/components/autocomplete' },
            { label: 'Checkbox', path: '/docs/components/checkbox' },
            { label: 'Button', path: '/docs/components/button', badge: 'SOON' },
            { label: 'Select', path: '/docs/components/select' },
            { label: 'TextArea', path: '/docs/components/textarea' },
            { label: 'RadioButton', path: '/docs/components/radio-button' },
            { label: 'Rating', path: '/docs/components/rating' },
        ],
    },
    {
        label: 'Directives',
        icon: Zap,
        children: [
            { label: 'InputNumber', path: '/docs/directives/input-number' },
            { label: 'KeyFilter', path: '/docs/directives/key-filter' },
        ],
    },
];
