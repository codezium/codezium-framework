import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CzPopoverComponent, CzRippleDirective } from 'codezium-ui';
import { LanguageService, APP_LANGUAGES, type AppLanguage } from '../../core/services/language.service';
import { ThemeService, APP_THEMES, type AppTheme } from '../../core/services/theme.service';

@Component({
    selector: 'cz-docs-prefs',
    imports: [CzPopoverComponent, CzRippleDirective],
    templateUrl: './docs-prefs.html',
    styleUrl: './docs-prefs.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsPrefsComponent {
    private readonly languageService = inject(LanguageService);
    private readonly themeService = inject(ThemeService);

    readonly langOpen = signal(false);
    readonly themeOpen = signal(false);

    readonly locales = APP_LANGUAGES;
    readonly themes = APP_THEMES;
    readonly activeLocale = this.languageService.currentLang;
    readonly activeTheme = this.themeService.currentTheme;

    readonly currentFlag = computed(
        () => this.locales.find(l => l.code === this.activeLocale())?.flag ?? '🇺🇸',
    );

    readonly currentThemeIcon = computed(
        () => this.themes.find(t => t.code === this.activeTheme())?.icon ?? '🎨',
    );

    constructor() {
        // Only one picker open at a time
        effect(() => {
            if (this.themeOpen()) this.langOpen.set(false);
        });
        effect(() => {
            if (this.langOpen()) this.themeOpen.set(false);
        });
    }

    setLocale(code: AppLanguage): void {
        this.languageService.setLanguage(code);
        this.langOpen.set(false);
    }

    setTheme(code: AppTheme): void {
        this.themeService.setTheme(code);
        this.themeOpen.set(false);
    }
}
