import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, output, signal, NgZone } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CzCommandMenuComponent, CzRippleDirective, CzTooltipDirective, type CzMenuItem } from 'codezium-ui';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { DocsPrefsComponent } from '../docs-prefs/docs-prefs';
import { DOCS_NAV } from '../docs-nav/docs-nav.data';

const SEARCH_I18N: Record<string, { placeholder: string; empty: string }> = {
    en: { placeholder: 'Search documentation…', empty: 'No results found' },
    es: { placeholder: 'Buscar en la documentación…', empty: 'Sin resultados' },
    pt: { placeholder: 'Pesquisar na documentação…', empty: 'Nenhum resultado' },
    fr: { placeholder: 'Rechercher dans la documentation…', empty: 'Aucun résultat' },
    de: { placeholder: 'Dokumentation durchsuchen…', empty: 'Keine Ergebnisse' },
};

@Component({
    selector: 'cz-docs-header',
    imports: [RouterLink, RouterLinkActive, DocsPrefsComponent, CzCommandMenuComponent, CzRippleDirective, CzTooltipDirective],
    templateUrl: './docs-header.html',
    styleUrl: './docs-header.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.cz-docs-header--scrolled]': 'scrolled()',
        '(document:keydown)': 'onGlobalKeydown($event)',
    },
})
export class DocsHeaderComponent {
    private readonly zone = inject(NgZone);
    private readonly router = inject(Router);
    readonly mobileNavToggled = output<void>();

    // ── Services ───────────────────────────────────
    private readonly themeService = inject(ThemeService);
    private readonly languageService = inject(LanguageService);

    // ── State ──────────────────────────────────────
    readonly mobileMenuOpen = signal(false);
    readonly searchOpen = signal(false);
    readonly scrolled = signal(false);
    readonly isDark = this.themeService.isDark;

    /** Flat command list built from the docs navigation tree */
    readonly searchItems: CzMenuItem[] = this.buildSearchItems();

    readonly searchPlaceholder = computed(
        () => SEARCH_I18N[this.languageService.currentLang()]?.placeholder ?? SEARCH_I18N['en'].placeholder,
    );

    readonly searchEmpty = computed(
        () => SEARCH_I18N[this.languageService.currentLang()]?.empty ?? SEARCH_I18N['en'].empty,
    );

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

    // ── Actions ─────────────────────────────────────
    toggleMobileMenu(): void {
        this.mobileMenuOpen.update(v => !v);
        this.mobileNavToggled.emit();
    }

    toggleDarkMode(): void {
        this.themeService.toggleDarkMode();
    }

    openSearch(): void { this.searchOpen.set(true); }

    /** Ctrl/Cmd + K opens the documentation search */
    onGlobalKeydown(event: KeyboardEvent): void {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            this.openSearch();
        }
    }

    private buildSearchItems(): CzMenuItem[] {
        const items: CzMenuItem[] = [];

        for (const group of DOCS_NAV) {
            if (group.children?.length) {
                for (const child of group.children) {
                    if (!child.path) continue;
                    items.push({
                        label: child.label,
                        badge: group.label,
                        command: () => this.router.navigateByUrl(child.path!),
                    });
                }
            } else if (group.path) {
                items.push({
                    label: group.label,
                    badge: 'Docs',
                    command: () => this.router.navigateByUrl(group.path!),
                });
            }
        }

        return items;
    }
}
