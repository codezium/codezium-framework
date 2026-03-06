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
        ],
    },
];
