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
        ],
    },
];
