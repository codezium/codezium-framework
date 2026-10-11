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
const DARK_STORAGE_KEY = 'cz-docs-dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    readonly currentTheme = signal<AppTheme>('base');

    /** Dark mode — Midnight is the default corporate appearance */
    readonly isDark = signal<boolean>(true);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
            if (savedTheme && ['base', 'glass', 'neo'].includes(savedTheme)) {
                this.currentTheme.set(savedTheme);
            }

            const savedDark = localStorage.getItem(DARK_STORAGE_KEY);
            this.setDarkMode(savedDark === null ? true : savedDark === 'true', false);
        }
    }

    setTheme(theme: AppTheme, saveToStorage = true): void {
        this.currentTheme.set(theme);

        if (isPlatformBrowser(this.platformId) && saveToStorage) {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
    }

    setDarkMode(isDark: boolean, saveToStorage = true): void {
        this.isDark.set(isDark);

        if (isPlatformBrowser(this.platformId)) {
            document.documentElement.classList.toggle('dark', isDark);
            if (saveToStorage) {
                localStorage.setItem(DARK_STORAGE_KEY, String(isDark));
            }
        }
    }

    toggleDarkMode(): void {
        this.setDarkMode(!this.isDark());
    }
}
