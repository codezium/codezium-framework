import { afterNextRender, ChangeDetectionStrategy, Component, inject, output, signal, computed, NgZone } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService, APP_LANGUAGES, type AppLanguage } from '../../core/services/language.service';
import { ThemeService, APP_THEMES, type AppTheme } from '../../core/services/theme.service';

@Component({
    selector: 'cz-docs-header',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './docs-header.html',
    styleUrl: './docs-header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.cz-docs-header--scrolled]': 'scrolled()',
    },
})
export class DocsHeaderComponent {
    private readonly zone = inject(NgZone);
    readonly mobileNavToggled = output<void>();

    // ── Services ───────────────────────────────────
    private readonly languageService = inject(LanguageService);
    private readonly themeService = inject(ThemeService);

    // ── State ──────────────────────────────────────
    readonly mobileMenuOpen = signal(false);
    readonly langOpen = signal(false);
    readonly themeOpen = signal(false);
    readonly searchOpen = signal(false);
    readonly isDark = signal(false);
    readonly scrolled = signal(false);

    readonly locales = APP_LANGUAGES;
    readonly themes = APP_THEMES;
    readonly activeLocale = this.languageService.currentLang;
    readonly activeTheme = this.themeService.currentTheme;

    constructor() {
        afterNextRender(() => {
            // Run outside Angular zone to avoid unnecessary CD cycles
            this.zone.runOutsideAngular(() => {
                const onScroll = () => {
                    const isScrolled = window.scrollY > 8;
                    if (isScrolled !== this.scrolled()) {
                        this.zone.run(() => this.scrolled.set(isScrolled));
                    }
                };
                window.addEventListener('scroll', onScroll, { passive: true });
            });
        });
    }

    readonly currentLang = computed(() => {
        const loc = this.locales.find(l => l.code === this.activeLocale());
        return loc ? `${loc.flag} ${loc.label}` : '';
    });

    readonly currentFlag = computed(() => {
        const loc = this.locales.find(l => l.code === this.activeLocale());
        return loc ? loc.flag : '🇺🇸';
    });

    readonly currentThemeIcon = computed(() => {
        const t = this.themes.find(t => t.code === this.activeTheme());
        return t ? t.icon : '🎨';
    });

    // ── Actions ─────────────────────────────────────
    toggleMobileMenu(): void {
        this.mobileMenuOpen.update(v => !v);
        this.mobileNavToggled.emit();
    }

    toggleLang(): void {
        this.langOpen.update(v => !v);
        if (this.langOpen()) this.themeOpen.set(false);
    }

    closeLang(): void { this.langOpen.set(false); }

    setLocale(code: AppLanguage): void {
        this.languageService.setLanguage(code);
        this.langOpen.set(false);
    }

    toggleTheme(): void {
        this.themeOpen.update(v => !v);
        if (this.themeOpen()) this.langOpen.set(false);
    }

    setTheme(code: AppTheme): void {
        this.themeService.setTheme(code);
        this.themeOpen.set(false);
    }

    toggleDarkMode(): void {
        this.isDark.update(v => !v);
        // Toggle .dark class on root
        document.documentElement.classList.toggle('dark', this.isDark());
    }

    openSearch(): void { this.searchOpen.set(true); }
}
