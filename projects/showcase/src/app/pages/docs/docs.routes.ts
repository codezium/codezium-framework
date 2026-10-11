import { Routes } from '@angular/router';
import { DocsLayoutPage } from './docs-layout';

export const docsRoutes: Routes = [
    {
        path: '',
        component: DocsLayoutPage,
        children: [
            {
                path: '',
                /* Default redirect to introduction */
                redirectTo: 'introduction',
                pathMatch: 'full',
            },
            {
                path: 'introduction',
                loadComponent: () =>
                    import('./pages/introduction/introduction').then(m => m.IntroductionPage),
                title: 'Introduction | Codezium UI Docs',
            },
            {
                path: 'installation',
                loadComponent: () =>
                    import('./pages/installation/installation').then(m => m.InstallationPage),
                title: 'Installation | Codezium UI Docs',
            },
            {
                path: 'theming',
                children: [
                    {
                        path: '',
                        redirectTo: 'overview',
                        pathMatch: 'full'
                    },
                    {
                        path: 'overview',
                        loadComponent: () => import('./pages/theming/overview/overview').then(m => m.ThemingOverviewPage),
                        title: 'Theming Overview | Codezium UI Docs'
                    },
                    {
                        path: 'base',
                        loadComponent: () => import('./pages/theming/base/base').then(m => m.ThemingBasePage),
                        title: 'Base Theme | Codezium UI Docs'
                    },
                    {
                        path: 'glass',
                        loadComponent: () => import('./pages/theming/glass/glass').then(m => m.ThemingGlassPage),
                        title: 'Glass Theme | Codezium UI Docs'
                    },
                    {
                        path: 'neo',
                        loadComponent: () => import('./pages/theming/neo/neo').then(m => m.ThemingNeoPage),
                        title: 'Neo Theme | Codezium UI Docs'
                    },
                    {
                        path: 'dark-mode',
                        loadComponent: () => import('./pages/theming/dark-mode/dark-mode').then(m => m.ThemingDarkModePage),
                        title: 'Dark Mode | Codezium UI Docs'
                    }
                ]
            },
            {
                path: 'styling',
                children: [
                    {
                        path: '',
                        redirectTo: 'tokens',
                        pathMatch: 'full',
                    },
                    {
                        path: 'tokens',
                        loadComponent: () =>
                            import('./pages/styling/tokens/tokens-doc').then(m => m.TokensDocPage),
                        title: 'Design Tokens | Codezium UI Docs',
                    },
                    {
                        path: 'colors',
                        loadComponent: () =>
                            import('./pages/styling/colors/colors-doc').then(m => m.ColorsDocPage),
                        title: 'Colors | Codezium UI Docs',
                    },
                    {
                        path: 'typography',
                        loadComponent: () =>
                            import('./pages/styling/typography/typography-doc').then(m => m.TypographyDocPage),
                        title: 'Typography | Codezium UI Docs',
                    },
                    {
                        path: 'spacing',
                        loadComponent: () =>
                            import('./pages/styling/spacing/spacing-doc').then(m => m.SpacingDocPage),
                        title: 'Spacing | Codezium UI Docs',
                    },
                    {
                        path: 'layout',
                        loadComponent: () =>
                            import('./pages/styling/layout/layout-doc').then(m => m.LayoutDocPage),
                        title: 'Layout | Codezium UI Docs',
                    },
                    {
                        path: 'responsive',
                        loadComponent: () =>
                            import('./pages/styling/responsive/responsive-doc').then(m => m.ResponsiveDocPage),
                        title: 'Responsive | Codezium UI Docs',
                    },
                    {
                        path: 'effects',
                        loadComponent: () =>
                            import('./pages/styling/effects/effects-doc').then(m => m.EffectsDocPage),
                        title: 'Effects | Codezium UI Docs',
                    },
                ],
            },
            {
                path: 'components/input-text',
                loadComponent: () =>
                    import('./pages/input-text/input-text-doc').then(m => m.InputTextDocPage),
                title: 'InputText | Codezium UI Docs',
            },
            {
                path: 'components/autocomplete',
                loadComponent: () =>
                    import('./pages/autocomplete/autocomplete-doc').then(m => m.AutocompleteDocPage),
                title: 'Autocomplete | Codezium UI Docs',
            },
            {
                path: 'components/password',
                loadComponent: () =>
                    import('./pages/password/password-doc').then(m => m.PasswordDocPage),
                title: 'Password | Codezium UI Docs',
            },
            {
                path: 'components/checkbox',
                loadComponent: () =>
                    import('./pages/checkbox/checkbox-doc').then(m => m.CheckboxDocPage),
                title: 'Checkbox | Codezium UI Docs',
            },
            {
                path: 'components/select',
                loadComponent: () =>
                    import('./pages/select/select-doc').then(m => m.SelectDocPage),
                title: 'Select | Codezium UI Docs',
            },
            {
                path: 'components/multiselect',
                loadComponent: () =>
                    import('./pages/multiselect/multiselect-doc').then(m => m.MultiSelectDocPage),
                title: 'MultiSelect | Codezium UI Docs',
            },
            {
                path: 'components/textarea',
                loadComponent: () =>
                    import('./pages/textarea/textarea-doc').then(m => m.TextareaDocPage),
                title: 'TextArea | Codezium UI Docs',
            },
            {
                path: 'components/radio-button',
                loadComponent: () =>
                    import('./pages/radio-button/radio-button-doc').then(m => m.RadioButtonDocPage),
                title: 'RadioButton | Codezium UI Docs',
            },
            {
                path: 'components/rating',
                loadComponent: () =>
                    import('./pages/rating/rating-doc').then(m => m.RatingDocPage),
                title: 'Rating | Codezium UI Docs',
            },
            {
                path: 'components/select-button',
                loadComponent: () =>
                    import('./pages/select-button/select-button-doc').then(m => m.SelectButtonDocPage),
                title: 'SelectButton | Codezium UI Docs',
            },
            {
                path: 'components/slider',
                loadComponent: () =>
                    import('./pages/slider/slider-doc').then(m => m.SliderDocPage),
                title: 'Slider | Codezium UI Docs',
            },
            {
                path: 'components/icon-field',
                loadComponent: () =>
                    import('./pages/icon-field/icon-field-doc').then(m => m.IconFieldDocPage),
                title: 'IconField | Codezium UI Docs',
            },
            {
                path: 'components/knob',
                loadComponent: () =>
                    import('./pages/knob/knob-doc').then(m => m.KnobDocPage),
                title: 'Knob | Codezium UI Docs',
            },
            {
                path: 'components/toggle-button',
                loadComponent: () =>
                    import('./pages/toggle-button/toggle-button-doc').then(m => m.ToggleButtonDocPage),
                title: 'ToggleButton | Codezium UI Docs',
            },
            {
                path: 'components/button',
                loadComponent: () =>
                    import('./pages/button/button-doc').then(m => m.ButtonDocPage),
                title: 'Button | Codezium UI Docs',
            },
            {
                path: 'components/button-group',
                loadComponent: () =>
                    import('./pages/button-group/button-group-doc').then(m => m.ButtonGroupDocPage),
                title: 'ButtonGroup | Codezium UI Docs',
            },
            {
                path: 'components/badge',
                loadComponent: () =>
                    import('./pages/badge/badge-doc').then(m => m.BadgeDocPage),
                title: 'Badge | Codezium UI Docs',
            },
            {
                path: 'components/tag',
                loadComponent: () =>
                    import('./pages/tag/tag-doc').then(m => m.TagDocPage),
                title: 'Tag | Codezium UI Docs',
            },
            {
                path: 'components/chip',
                loadComponent: () =>
                    import('./pages/chip/chip-doc').then(m => m.ChipDocPage),
                title: 'Chip | Codezium UI Docs',
            },
            {
                path: 'components/avatar',
                loadComponent: () =>
                    import('./pages/avatar/avatar-doc').then(m => m.AvatarDocPage),
                title: 'Avatar | Codezium UI Docs',
            },
            {
                path: 'components/divider',
                loadComponent: () =>
                    import('./pages/divider/divider-doc').then(m => m.DividerDocPage),
                title: 'Divider | Codezium UI Docs',
            },
            {
                path: 'components/skeleton',
                loadComponent: () =>
                    import('./pages/skeleton/skeleton-doc').then(m => m.SkeletonDocPage),
                title: 'Skeleton | Codezium UI Docs',
            },
            {
                path: 'components/progress-bar',
                loadComponent: () =>
                    import('./pages/progress-bar/progress-bar-doc').then(m => m.ProgressBarDocPage),
                title: 'ProgressBar | Codezium UI Docs',
            },
            {
                path: 'components/progress-spinner',
                loadComponent: () =>
                    import('./pages/progress-spinner/progress-spinner-doc').then(m => m.ProgressSpinnerDocPage),
                title: 'ProgressSpinner | Codezium UI Docs',
            },
            {
                path: 'components/toggle-switch',
                loadComponent: () =>
                    import('./pages/toggle-switch/toggle-switch-doc').then(m => m.ToggleSwitchDocPage),
                title: 'ToggleSwitch | Codezium UI Docs',
            },
            {
                path: 'components/listbox',
                loadComponent: () =>
                    import('./pages/listbox/listbox-doc').then(m => m.ListboxDocPage),
                title: 'Listbox | Codezium UI Docs',
            },
            {
                path: 'components/input-group',
                loadComponent: () =>
                    import('./pages/input-group/input-group-doc').then(m => m.InputGroupDocPage),
                title: 'InputGroup | Codezium UI Docs',
            },
            {
                path: 'components/input-otp',
                loadComponent: () =>
                    import('./pages/input-otp/input-otp-doc').then(m => m.InputOtpDocPage),
                title: 'InputOtp | Codezium UI Docs',
            },
            {
                path: 'components/input-tags',
                loadComponent: () =>
                    import('./pages/input-tags/input-tags-doc').then(m => m.InputTagsDocPage),
                title: 'InputTags | Codezium UI Docs',
            },
            {
                path: 'components/label',
                loadComponent: () =>
                    import('./pages/label/label-doc').then(m => m.LabelDocPage),
                title: 'Label | Codezium UI Docs',
            },
            {
                path: 'components/color-picker',
                loadComponent: () =>
                    import('./pages/color-picker/color-picker-doc').then(m => m.ColorPickerDocPage),
                title: 'ColorPicker | Codezium UI Docs',
            },
            {
                path: 'components/date-picker',
                loadComponent: () =>
                    import('./pages/date-picker/date-picker-doc').then(m => m.DatePickerDocPage),
                title: 'DatePicker | Codezium UI Docs',
            },
            {
                path: 'components/cascade-select',
                loadComponent: () =>
                    import('./pages/cascade-select/cascade-select-doc').then(m => m.CascadeSelectDocPage),
                title: 'CascadeSelect | Codezium UI Docs',
            },
            {
                path: 'components/tree-select',
                loadComponent: () =>
                    import('./pages/tree-select/tree-select-doc').then(m => m.TreeSelectDocPage),
                title: 'TreeSelect | Codezium UI Docs',
            },
            {
                path: 'components/card',
                loadComponent: () =>
                    import('./pages/card/card-doc').then(m => m.CardDocPage),
                title: 'Card | Codezium UI Docs',
            },
            {
                path: 'components/panel',
                loadComponent: () =>
                    import('./pages/panel/panel-doc').then(m => m.PanelDocPage),
                title: 'Panel | Codezium UI Docs',
            },
            {
                path: 'components/fieldset',
                loadComponent: () =>
                    import('./pages/fieldset/fieldset-doc').then(m => m.FieldsetDocPage),
                title: 'Fieldset | Codezium UI Docs',
            },
            {
                path: 'components/toolbar',
                loadComponent: () =>
                    import('./pages/toolbar/toolbar-doc').then(m => m.ToolbarDocPage),
                title: 'Toolbar | Codezium UI Docs',
            },
            {
                path: 'components/message',
                loadComponent: () =>
                    import('./pages/message/message-doc').then(m => m.MessageDocPage),
                title: 'Message | Codezium UI Docs',
            },
            {
                path: 'components/toast',
                loadComponent: () =>
                    import('./pages/toast/toast-doc').then(m => m.ToastDocPage),
                title: 'Toast | Codezium UI Docs',
            },
            {
                path: 'components/breadcrumb',
                loadComponent: () =>
                    import('./pages/breadcrumb/breadcrumb-doc').then(m => m.BreadcrumbDocPage),
                title: 'Breadcrumb | Codezium UI Docs',
            },
            {
                path: 'components/paginator',
                loadComponent: () =>
                    import('./pages/paginator/paginator-doc').then(m => m.PaginatorDocPage),
                title: 'Paginator | Codezium UI Docs',
            },
            {
                path: 'components/tabs',
                loadComponent: () =>
                    import('./pages/tabs/tabs-doc').then(m => m.TabsDocPage),
                title: 'Tabs | Codezium UI Docs',
            },
            {
                path: 'components/accordion',
                loadComponent: () =>
                    import('./pages/accordion/accordion-doc').then(m => m.AccordionDocPage),
                title: 'Accordion | Codezium UI Docs',
            },
            {
                path: 'components/float-label',
                loadComponent: () =>
                    import('./pages/float-label/float-label-doc').then(m => m.FloatLabelDocPage),
                title: 'FloatLabel | Codezium UI Docs',
            },
            {
                path: 'components/ifta-label',
                loadComponent: () =>
                    import('./pages/ifta-label/ifta-label-doc').then(m => m.IftaLabelDocPage),
                title: 'IftaLabel | Codezium UI Docs',
            },
            {
                path: 'components/dialog',
                loadComponent: () =>
                    import('./pages/dialog/dialog-doc').then(m => m.DialogDocPage),
                title: 'Dialog | Codezium UI Docs',
            },
            {
                path: 'components/drawer',
                loadComponent: () =>
                    import('./pages/drawer/drawer-doc').then(m => m.DrawerDocPage),
                title: 'Drawer | Codezium UI Docs',
            },
            {
                path: 'components/confirm-dialog',
                loadComponent: () =>
                    import('./pages/confirm-dialog/confirm-dialog-doc').then(m => m.ConfirmDialogDocPage),
                title: 'ConfirmDialog | Codezium UI Docs',
            },
            {
                path: 'components/confirm-popup',
                loadComponent: () =>
                    import('./pages/confirm-popup/confirm-popup-doc').then(m => m.ConfirmPopupDocPage),
                title: 'ConfirmPopup | Codezium UI Docs',
            },
            {
                path: 'components/dynamic-dialog',
                loadComponent: () =>
                    import('./pages/dynamic-dialog/dynamic-dialog-doc').then(m => m.DynamicDialogDocPage),
                title: 'DynamicDialog | Codezium UI Docs',
            },
            {
                path: 'components/popover',
                loadComponent: () =>
                    import('./pages/popover/popover-doc').then(m => m.PopoverDocPage),
                title: 'Popover | Codezium UI Docs',
            },
            {
                path: 'components/block-ui',
                loadComponent: () =>
                    import('./pages/block-ui/block-ui-doc').then(m => m.BlockUiDocPage),
                title: 'BlockUI | Codezium UI Docs',
            },
            {
                path: 'components/table',
                loadComponent: () =>
                    import('./pages/table/table-doc').then(m => m.TableDocPage),
                title: 'Table | Codezium UI Docs',
            },
            {
                path: 'components/tree-table',
                loadComponent: () =>
                    import('./pages/tree-table/tree-table-doc').then(m => m.TreeTableDocPage),
                title: 'TreeTable | Codezium UI Docs',
            },
            {
                path: 'components/tree',
                loadComponent: () =>
                    import('./pages/tree/tree-doc').then(m => m.TreeDocPage),
                title: 'Tree | Codezium UI Docs',
            },
            {
                path: 'components/org-chart',
                loadComponent: () =>
                    import('./pages/org-chart/org-chart-doc').then(m => m.OrgChartDocPage),
                title: 'OrgChart | Codezium UI Docs',
            },
            {
                path: 'components/data-view',
                loadComponent: () =>
                    import('./pages/data-view/data-view-doc').then(m => m.DataViewDocPage),
                title: 'DataView | Codezium UI Docs',
            },
            {
                path: 'components/virtual-scroller',
                loadComponent: () =>
                    import('./pages/virtual-scroller/virtual-scroller-doc').then(m => m.VirtualScrollerDocPage),
                title: 'VirtualScroller | Codezium UI Docs',
            },
            {
                path: 'components/timeline',
                loadComponent: () =>
                    import('./pages/timeline/timeline-doc').then(m => m.TimelineDocPage),
                title: 'Timeline | Codezium UI Docs',
            },
            {
                path: 'components/order-list',
                loadComponent: () =>
                    import('./pages/order-list/order-list-doc').then(m => m.OrderListDocPage),
                title: 'OrderList | Codezium UI Docs',
            },
            {
                path: 'components/pick-list',
                loadComponent: () =>
                    import('./pages/pick-list/pick-list-doc').then(m => m.PickListDocPage),
                title: 'PickList | Codezium UI Docs',
            },
            {
                path: 'components/menu',
                loadComponent: () =>
                    import('./pages/menu/menu-doc').then(m => m.MenuDocPage),
                title: 'Menu | Codezium UI Docs',
            },
            {
                path: 'components/tiered-menu',
                loadComponent: () =>
                    import('./pages/tiered-menu/tiered-menu-doc').then(m => m.TieredMenuDocPage),
                title: 'TieredMenu | Codezium UI Docs',
            },
            {
                path: 'components/menubar',
                loadComponent: () =>
                    import('./pages/menubar/menubar-doc').then(m => m.MenubarDocPage),
                title: 'Menubar | Codezium UI Docs',
            },
            {
                path: 'components/mega-menu',
                loadComponent: () =>
                    import('./pages/mega-menu/mega-menu-doc').then(m => m.MegaMenuDocPage),
                title: 'MegaMenu | Codezium UI Docs',
            },
            {
                path: 'components/context-menu',
                loadComponent: () =>
                    import('./pages/context-menu/context-menu-doc').then(m => m.ContextMenuDocPage),
                title: 'ContextMenu | Codezium UI Docs',
            },
            {
                path: 'components/dock',
                loadComponent: () =>
                    import('./pages/dock/dock-doc').then(m => m.DockDocPage),
                title: 'Dock | Codezium UI Docs',
            },
            {
                path: 'components/sidebar',
                loadComponent: () =>
                    import('./pages/sidebar/sidebar-doc').then(m => m.SidebarDocPage),
                title: 'Sidebar | Codezium UI Docs',
            },
            {
                path: 'components/command-menu',
                loadComponent: () =>
                    import('./pages/command-menu/command-menu-doc').then(m => m.CommandMenuDocPage),
                title: 'CommandMenu | Codezium UI Docs',
            },
            {
                path: 'components/split-button',
                loadComponent: () =>
                    import('./pages/split-button/split-button-doc').then(m => m.SplitButtonDocPage),
                title: 'SplitButton | Codezium UI Docs',
            },
            {
                path: 'components/speed-dial',
                loadComponent: () =>
                    import('./pages/speed-dial/speed-dial-doc').then(m => m.SpeedDialDocPage),
                title: 'SpeedDial | Codezium UI Docs',
            },
            {
                path: 'components/stepper',
                loadComponent: () =>
                    import('./pages/stepper/stepper-doc').then(m => m.StepperDocPage),
                title: 'Stepper | Codezium UI Docs',
            },
            {
                path: 'components/carousel',
                loadComponent: () =>
                    import('./pages/carousel/carousel-doc').then(m => m.CarouselDocPage),
                title: 'Carousel | Codezium UI Docs',
            },
            {
                path: 'components/gallery',
                loadComponent: () =>
                    import('./pages/gallery/gallery-doc').then(m => m.GalleryDocPage),
                title: 'Gallery | Codezium UI Docs',
            },
            {
                path: 'components/compare',
                loadComponent: () =>
                    import('./pages/compare/compare-doc').then(m => m.CompareDocPage),
                title: 'Compare | Codezium UI Docs',
            },
            {
                path: 'components/file-upload',
                loadComponent: () =>
                    import('./pages/file-upload/file-upload-doc').then(m => m.FileUploadDocPage),
                title: 'FileUpload | Codezium UI Docs',
            },
            {
                path: 'components/editor',
                loadComponent: () =>
                    import('./pages/editor/editor-doc').then(m => m.EditorDocPage),
                title: 'Editor | Codezium UI Docs',
            },
            {
                path: 'components/terminal',
                loadComponent: () =>
                    import('./pages/terminal/terminal-doc').then(m => m.TerminalDocPage),
                title: 'Terminal | Codezium UI Docs',
            },
            {
                path: 'components/inplace',
                loadComponent: () =>
                    import('./pages/inplace/inplace-doc').then(m => m.InplaceDocPage),
                title: 'Inplace | Codezium UI Docs',
            },
            {
                path: 'components/meter-group',
                loadComponent: () =>
                    import('./pages/meter-group/meter-group-doc').then(m => m.MeterGroupDocPage),
                title: 'MeterGroup | Codezium UI Docs',
            },
            {
                path: 'components/splitter',
                loadComponent: () =>
                    import('./pages/splitter/splitter-doc').then(m => m.SplitterDocPage),
                title: 'Splitter | Codezium UI Docs',
            },
            {
                path: 'components/scroll-area',
                loadComponent: () =>
                    import('./pages/scroll-area/scroll-area-doc').then(m => m.ScrollAreaDocPage),
                title: 'ScrollArea | Codezium UI Docs',
            },
            {
                path: 'components/scroll-top',
                loadComponent: () =>
                    import('./pages/scroll-top/scroll-top-doc').then(m => m.ScrollTopDocPage),
                title: 'ScrollTop | Codezium UI Docs',
            },
            {
                path: 'directives/key-filter',
                loadComponent: () =>
                    import('./pages/key-filter/key-filter-doc').then(m => m.default),
                title: 'KeyFilter | Codezium UI Docs',
            },
            {
                path: 'directives/input-number',
                loadComponent: () =>
                    import('./pages/input-number/input-number-doc').then(m => m.InputNumberDocPage),
                title: 'InputNumber | Codezium UI Docs',
            },
            {
                path: 'directives/input-mask',
                loadComponent: () =>
                    import('./pages/input-mask/input-mask-doc').then(m => m.InputMaskDocPage),
                title: 'InputMask | Codezium UI Docs',
            },
            {
                path: 'directives/ripple',
                loadComponent: () =>
                    import('./pages/ripple/ripple-doc').then(m => m.RippleDocPage),
                title: 'Ripple | Codezium UI Docs',
            },
            {
                path: 'directives/tooltip',
                loadComponent: () =>
                    import('./pages/tooltip/tooltip-doc').then(m => m.TooltipDocPage),
                title: 'Tooltip | Codezium UI Docs',
            },
            {
                path: 'directives/focus-trap',
                loadComponent: () =>
                    import('./pages/focus-trap/focus-trap-doc').then(m => m.FocusTrapDocPage),
                title: 'FocusTrap | Codezium UI Docs',
            },
            {
                path: 'directives/animate-on-scroll',
                loadComponent: () =>
                    import('./pages/animate-on-scroll/animate-on-scroll-doc').then(m => m.AnimateOnScrollDocPage),
                title: 'AnimateOnScroll | Codezium UI Docs',
            },
            {
                path: 'directives/auto-focus',
                loadComponent: () =>
                    import('./pages/auto-focus/auto-focus-doc').then(m => m.AutoFocusDocPage),
                title: 'AutoFocus | Codezium UI Docs',
            },
            {
                path: 'directives/bind',
                loadComponent: () =>
                    import('./pages/bind/bind-doc').then(m => m.BindDocPage),
                title: 'Bind | Codezium UI Docs',
            },
            {
                path: 'directives/class-names',
                loadComponent: () =>
                    import('./pages/class-names/class-names-doc').then(m => m.ClassNamesDocPage),
                title: 'ClassNames | Codezium UI Docs',
            },
            {
                path: 'directives/fluid',
                loadComponent: () =>
                    import('./pages/fluid/fluid-doc').then(m => m.FluidDocPage),
                title: 'Fluid | Codezium UI Docs',
            },
            {
                path: 'directives/style-class',
                loadComponent: () =>
                    import('./pages/style-class/style-class-doc').then(m => m.StyleClassDocPage),
                title: 'StyleClass | Codezium UI Docs',
            },
            {
                path: 'services',
                children: [
                    {
                        path: '',
                        redirectTo: 'block-ui-service',
                        pathMatch: 'full',
                    },
                    {
                        path: 'block-ui-service',
                        loadComponent: () =>
                            import('./pages/services/block-ui-service/block-ui-service-doc').then(m => m.BlockUIServiceDocPage),
                        title: 'BlockUIService | Codezium UI Docs',
                    },
                    {
                        path: 'confirmation-service',
                        loadComponent: () =>
                            import('./pages/services/confirmation-service/confirmation-service-doc').then(m => m.ConfirmationServiceDocPage),
                        title: 'ConfirmationService | Codezium UI Docs',
                    },
                    {
                        path: 'dialog-service',
                        loadComponent: () =>
                            import('./pages/services/dialog-service/dialog-service-doc').then(m => m.DialogServiceDocPage),
                        title: 'DialogService | Codezium UI Docs',
                    },
                    {
                        path: 'dynamic-dialog-service',
                        loadComponent: () =>
                            import('./pages/services/dynamic-dialog-service/dynamic-dialog-service-doc').then(m => m.DynamicDialogServiceDocPage),
                        title: 'DynamicDialogService | Codezium UI Docs',
                    },
                    {
                        path: 'message-service',
                        loadComponent: () =>
                            import('./pages/services/message-service/message-service-doc').then(m => m.MessageServiceDocPage),
                        title: 'MessageService | Codezium UI Docs',
                    },
                    {
                        path: 'toast-service',
                        loadComponent: () =>
                            import('./pages/services/toast-service/toast-service-doc').then(m => m.ToastServiceDocPage),
                        title: 'ToastService | Codezium UI Docs',
                    },
                ],
            },
        ],
    },
];
