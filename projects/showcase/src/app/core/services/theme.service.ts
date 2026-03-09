import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppTheme = 'base' | 'glass' | 'neo';

export interface ThemeConfig {
    code: AppTheme;
    label: string;
    icon: string;
}

export const APP_THEMES: ThemeConfig[] = [
    { code: 'base', label: 'Codezium Base', icon: '🎨' },
    { code: 'glass', label: 'Glassmorphism', icon: '🧊' },
    { code: 'neo', label: 'Neomorphism', icon: '⚪' }
];

const THEME_STORAGE_KEY = 'cz-theme';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    readonly currentTheme = signal<AppTheme>('base');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
            if (savedTheme && ['base', 'glass', 'neo'].includes(savedTheme)) {
                this.setTheme(savedTheme, false);
            } else {
                // Default theme apply without saving to storage explicitly yet
                this.applyThemeToDocument('base');
            }
        }
    }

    setTheme(theme: AppTheme, saveToStorage = true): void {
        this.currentTheme.set(theme);

        if (isPlatformBrowser(this.platformId)) {
            this.applyThemeToDocument(theme);
            if (saveToStorage) {
                localStorage.setItem(THEME_STORAGE_KEY, theme);
            }
        }
    }

    private applyThemeToDocument(theme: AppTheme): void {
        document.documentElement.setAttribute('data-theme', theme);
    }
}
