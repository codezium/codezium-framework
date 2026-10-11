import { type LucideIcon } from '@lucide/angular';
import {
    LucideRocket,
    LucidePalette,
    LucideBrush,
    LucideZap,
    LucideMousePointerClick,
    LucideDatabase,
    LucideBell,
    LucideFolderOpen,
    LucideTextCursorInput,
    LucideImage,
    LucideList,
    LucidePuzzle,
    LucideLayers,
    LucidePanelsTopLeft,
    LucideServer,
} from '@lucide/angular';

export interface NavItem {
    label: string;
    icon?: LucideIcon;   // Lucide icon component
    path?: string;
    badge?: string;
    children?: NavItem[];
}

/**
 * Documentation navigation.
 * Component categories are ordered alphabetically and every category
 * lists its components from A to Z.
 */
export const DOCS_NAV: NavItem[] = [
    {
        label: 'Getting Started',
        icon: LucideRocket,
        children: [
            { label: 'Introduction', path: '/docs/introduction' },
            { label: 'Installation', path: '/docs/installation' },
        ],
    },
    {
        label: 'Theming',
        icon: LucidePalette,
        children: [
            { label: 'Overview', path: '/docs/theming/overview' },
            { label: 'Base Theme', path: '/docs/theming/base' },
            { label: 'Glass Theme', path: '/docs/theming/glass' },
            { label: 'Neo Theme', path: '/docs/theming/neo' },
            { label: 'Dark Mode', path: '/docs/theming/dark-mode' },
        ],
    },
    {
        label: 'Styling',
        icon: LucideBrush,
        children: [
            { label: 'Design Tokens', path: '/docs/styling/tokens' },
            { label: 'Colors', path: '/docs/styling/colors' },
            { label: 'Typography', path: '/docs/styling/typography' },
            { label: 'Spacing', path: '/docs/styling/spacing' },
            { label: 'Layout', path: '/docs/styling/layout' },
            { label: 'Responsive', path: '/docs/styling/responsive' },
            { label: 'Effects', path: '/docs/styling/effects' },
        ],
    },

    /* ── Component categories (A → Z) ── */
    {
        label: 'Button',
        icon: LucideMousePointerClick,
        children: [
            { label: 'Button', path: '/docs/components/button' },
            { label: 'ButtonGroup', path: '/docs/components/button-group' },
            { label: 'SpeedDial', path: '/docs/components/speed-dial' },
            { label: 'SplitButton', path: '/docs/components/split-button' },
        ],
    },
    {
        label: 'Data',
        icon: LucideDatabase,
        children: [
            { label: 'DataView', path: '/docs/components/data-view' },
            { label: 'MeterGroup', path: '/docs/components/meter-group' },
            { label: 'OrderList', path: '/docs/components/order-list' },
            { label: 'OrgChart', path: '/docs/components/org-chart' },
            { label: 'Paginator', path: '/docs/components/paginator' },
            { label: 'PickList', path: '/docs/components/pick-list' },
            { label: 'Table', path: '/docs/components/table' },
            { label: 'Timeline', path: '/docs/components/timeline' },
            { label: 'Tree', path: '/docs/components/tree' },
            { label: 'TreeTable', path: '/docs/components/tree-table' },
            { label: 'VirtualScroller', path: '/docs/components/virtual-scroller' },
        ],
    },
    {
        label: 'Feedback',
        icon: LucideBell,
        children: [
            { label: 'Badge', path: '/docs/components/badge' },
            { label: 'Chip', path: '/docs/components/chip' },
            { label: 'Message', path: '/docs/components/message' },
            { label: 'ProgressBar', path: '/docs/components/progress-bar' },
            { label: 'ProgressSpinner', path: '/docs/components/progress-spinner' },
            { label: 'Skeleton', path: '/docs/components/skeleton' },
            { label: 'Tag', path: '/docs/components/tag' },
            { label: 'Toast', path: '/docs/components/toast' },
        ],
    },
    {
        label: 'File',
        icon: LucideFolderOpen,
        children: [
            { label: 'FileUpload', path: '/docs/components/file-upload' },
        ],
    },
    {
        label: 'Form',
        icon: LucideTextCursorInput,
        children: [
            { label: 'Autocomplete', path: '/docs/components/autocomplete' },
            { label: 'CascadeSelect', path: '/docs/components/cascade-select' },
            { label: 'Checkbox', path: '/docs/components/checkbox' },
            { label: 'ColorPicker', path: '/docs/components/color-picker' },
            { label: 'DatePicker', path: '/docs/components/date-picker' },
            { label: 'FloatLabel', path: '/docs/components/float-label' },
            { label: 'IconField', path: '/docs/components/icon-field' },
            { label: 'IftaLabel', path: '/docs/components/ifta-label' },
            { label: 'InputGroup', path: '/docs/components/input-group' },
            { label: 'InputOtp', path: '/docs/components/input-otp' },
            { label: 'InputTags', path: '/docs/components/input-tags' },
            { label: 'InputText', path: '/docs/components/input-text' },
            { label: 'Knob', path: '/docs/components/knob' },
            { label: 'Label', path: '/docs/components/label' },
            { label: 'Listbox', path: '/docs/components/listbox' },
            { label: 'Password', path: '/docs/components/password' },
            { label: 'RadioButton', path: '/docs/components/radio-button' },
            { label: 'Rating', path: '/docs/components/rating' },
            { label: 'Select', path: '/docs/components/select' },
            { label: 'MultiSelect', path: '/docs/components/multiselect' },
            { label: 'SelectButton', path: '/docs/components/select-button' },
            { label: 'Slider', path: '/docs/components/slider' },
            { label: 'TextArea', path: '/docs/components/textarea' },
            { label: 'ToggleButton', path: '/docs/components/toggle-button' },
            { label: 'ToggleSwitch', path: '/docs/components/toggle-switch' },
            { label: 'TreeSelect', path: '/docs/components/tree-select' },
        ],
    },
    {
        label: 'Media',
        icon: LucideImage,
        children: [
            { label: 'Avatar', path: '/docs/components/avatar' },
            { label: 'Carousel', path: '/docs/components/carousel' },
            { label: 'Compare', path: '/docs/components/compare' },
            { label: 'Gallery', path: '/docs/components/gallery' },
        ],
    },
    {
        label: 'Menu',
        icon: LucideList,
        children: [
            { label: 'Breadcrumb', path: '/docs/components/breadcrumb' },
            { label: 'CommandMenu', path: '/docs/components/command-menu' },
            { label: 'ContextMenu', path: '/docs/components/context-menu' },
            { label: 'Dock', path: '/docs/components/dock' },
            { label: 'MegaMenu', path: '/docs/components/mega-menu' },
            { label: 'Menu', path: '/docs/components/menu' },
            { label: 'Menubar', path: '/docs/components/menubar' },
            { label: 'TieredMenu', path: '/docs/components/tiered-menu' },
        ],
    },
    {
        label: 'Misc',
        icon: LucidePuzzle,
        children: [
            { label: 'Editor', path: '/docs/components/editor' },
            { label: 'ScrollTop', path: '/docs/components/scroll-top' },
            { label: 'Terminal', path: '/docs/components/terminal' },
        ],
    },
    {
        label: 'Overlay',
        icon: LucideLayers,
        children: [
            { label: 'BlockUI', path: '/docs/components/block-ui' },
            { label: 'ConfirmDialog', path: '/docs/components/confirm-dialog' },
            { label: 'ConfirmPopup', path: '/docs/components/confirm-popup' },
            { label: 'Dialog', path: '/docs/components/dialog' },
            { label: 'Drawer', path: '/docs/components/drawer' },
            { label: 'DynamicDialog', path: '/docs/components/dynamic-dialog' },
            { label: 'Popover', path: '/docs/components/popover' },
            { label: 'Sidebar', path: '/docs/components/sidebar' },
        ],
    },
    {
        label: 'Panel',
        icon: LucidePanelsTopLeft,
        children: [
            { label: 'Accordion', path: '/docs/components/accordion' },
            { label: 'Card', path: '/docs/components/card' },
            { label: 'Divider', path: '/docs/components/divider' },
            { label: 'Fieldset', path: '/docs/components/fieldset' },
            { label: 'Inplace', path: '/docs/components/inplace' },
            { label: 'Panel', path: '/docs/components/panel' },
            { label: 'ScrollArea', path: '/docs/components/scroll-area' },
            { label: 'Splitter', path: '/docs/components/splitter' },
            { label: 'Stepper', path: '/docs/components/stepper' },
            { label: 'Tabs', path: '/docs/components/tabs' },
            { label: 'Toolbar', path: '/docs/components/toolbar' },
        ],
    },

    {
        label: 'Directives',
        icon: LucideZap,
        children: [
            { label: 'AnimateOnScroll', path: '/docs/directives/animate-on-scroll' },
            { label: 'AutoFocus', path: '/docs/directives/auto-focus' },
            { label: 'Bind', path: '/docs/directives/bind' },
            { label: 'ClassNames', path: '/docs/directives/class-names' },
            { label: 'Fluid', path: '/docs/directives/fluid' },
            { label: 'FocusTrap', path: '/docs/directives/focus-trap' },
            { label: 'InputMask', path: '/docs/directives/input-mask' },
            { label: 'InputNumber', path: '/docs/directives/input-number' },
            { label: 'KeyFilter', path: '/docs/directives/key-filter' },
            { label: 'Ripple', path: '/docs/directives/ripple' },
            { label: 'StyleClass', path: '/docs/directives/style-class' },
            { label: 'Tooltip', path: '/docs/directives/tooltip' },
        ],
    },
    {
        label: 'Services',
        icon: LucideServer,
        children: [
            { label: 'BlockUIService', path: '/docs/services/block-ui-service' },
            { label: 'ConfirmationService', path: '/docs/services/confirmation-service' },
            { label: 'DialogService', path: '/docs/services/dialog-service' },
            { label: 'DynamicDialogService', path: '/docs/services/dynamic-dialog-service' },
            { label: 'MessageService', path: '/docs/services/message-service' },
            { label: 'ToastService', path: '/docs/services/toast-service' },
        ],
    },
];
