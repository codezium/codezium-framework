import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.HomePage),
        title: 'Codezium UI – The Next Generation Angular Framework'
    },
    {
        path: 'test',
        loadComponent: () => import('./pages/test-area/test-area').then(m => m.TestArea),
        title: 'Test Area | Codezium UI'
    }
];
