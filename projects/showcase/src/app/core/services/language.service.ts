import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppLanguage = 'en' | 'es' | 'pt' | 'fr' | 'de';

export const APP_LANGUAGES: { code: AppLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const STORAGE_KEY = 'cz-docs-lang';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private platformId = inject(PLATFORM_ID);
    readonly isBrowser = isPlatformBrowser(this.platformId);

    readonly currentLang = signal<AppLanguage>(this.getInitialLang());

    constructor() {
        // Automatically save to localStorage whenever currentLang changes
        effect(() => {
            const lang = this.currentLang();
            if (this.isBrowser) {
                localStorage.setItem(STORAGE_KEY, lang);
                document.documentElement.lang = lang; // update HTML lang attribute
            }
        });
    }

    setLanguage(lang: AppLanguage): void {
        this.currentLang.set(lang);
    }

    private getInitialLang(): AppLanguage {
        if (!this.isBrowser) return 'en';

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && ['en', 'es', 'pt', 'fr', 'de'].includes(stored)) {
            return stored as AppLanguage;
        }
        return 'en';
    }
}
