import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    computed,
    effect,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { LucideHome } from '@lucide/angular';
import {
    CzBreadcrumbComponent,
    CzRippleDirective,
    type CzBreadcrumbItem,
} from 'codezium-ui';
import { DocsHeaderComponent } from '../../layout/docs-header/docs-header';
import { DocsFooterComponent } from '../../layout/docs-footer/docs-footer';
import { DocsNavComponent } from '../../layout/docs-nav/docs-nav';
import { DocsTocComponent, type TocSection } from '../../layout/docs-toc/docs-toc';
import { DocsPrefsComponent } from '../../layout/docs-prefs/docs-prefs';
import { DOCS_NAV } from '../../layout/docs-nav/docs-nav.data';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';

interface ObservedSection {
    section: TocSection;
    element: HTMLElement;
}

@Component({
    selector: 'cz-docs-layout',
    imports: [
        RouterOutlet,
        DocsHeaderComponent,
        DocsFooterComponent,
        DocsNavComponent,
        DocsTocComponent,
        DocsPrefsComponent,
        CzBreadcrumbComponent,
        CzRippleDirective,
    ],
    templateUrl: './docs-layout.html',
    styleUrl: './docs-layout.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayoutPage {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly lang = inject(LanguageService);
    private readonly themeService = inject(ThemeService);
    private readonly mainContent = viewChild<ElementRef<HTMLElement>>('mainContent');

    /**
     * The selected theme is applied to the docs content only, so the showcase
     * shell (header, nav, toc, footer, landing) always keeps the corporate look.
     */
    readonly theme = this.themeService.currentTheme;
    readonly isDark = this.themeService.isDark;

    /** Table of contents built from the headings of the current page */
    readonly tocSections = signal<TocSection[]>([]);
    readonly tocActiveId = signal<string>('');

    /** Mobile left-sidebar visibility */
    readonly sidebarOpen = signal(false);

    /** Current navigation URL (used to build the breadcrumb) */
    private readonly currentUrl = signal<string>(this.router.url);

    readonly breadcrumbHome: CzBreadcrumbItem = { label: 'Home', routerLink: '/', icon: LucideHome };

    /** Breadcrumb derived from the docs navigation tree */
    readonly breadcrumbItems = computed<CzBreadcrumbItem[]>(() => {
        const path = this.currentUrl().split(/[?#]/)[0].replace(/\/$/, '');
        if (!path.startsWith('/docs')) return [];

        for (const group of DOCS_NAV) {
            if (!group.children?.length) continue;
            for (const child of group.children) {
                if (child.path === path) {
                    return [{ label: group.label }, { label: child.label }];
                }
            }
        }
        return [];
    });

    private observer: IntersectionObserver | null = null;

    constructor() {
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(event => {
                this.currentUrl.set(event.urlAfterRedirects);
                this.scheduleBuild();
            });

        // Rebuild the TOC labels when the language changes
        effect(() => {
            this.lang.currentLang();
            this.scheduleBuild();
        });

        this.destroyRef.onDestroy(() => this.observer?.disconnect());
    }

    toggleSidebar(): void {
        this.sidebarOpen.update(v => !v);
    }

    /** Waits for the routed page (and its i18n text) to be rendered */
    private scheduleBuild(): void {
        setTimeout(() => this.buildTocWithRetry(0));
    }

    /** Retries on animation frames while the routed page has not rendered headings yet */
    private buildTocWithRetry(attempt: number): void {
        const host = this.mainContent()?.nativeElement;
        if (!host) return;
        const hasHeadings = host.querySelectorAll('h2, h3').length > 0;
        if (!hasHeadings && attempt < 5) {
            requestAnimationFrame(() => this.buildTocWithRetry(attempt + 1));
            return;
        }
        this.buildToc();
    }

    private buildToc(): void {
        const host = this.mainContent()?.nativeElement;
        if (!host) return;

        const headings = Array.from(host.querySelectorAll<HTMLElement>('h2, h3'));
        const usedIds = new Set<string>();
        const observed: ObservedSection[] = [];

        for (const heading of headings) {
            const baseId = heading.id || this.slugify(heading.textContent ?? 'section');
            let id = baseId;
            let counter = 2;
            while (usedIds.has(id)) {
                id = `${baseId}-${counter++}`;
            }
            if (heading.id !== id) {
                heading.id = id;
            }
            usedIds.add(id);

            observed.push({
                section: {
                    id,
                    label: (heading.textContent ?? '').trim(),
                    level: heading.tagName === 'H3' ? 3 : 2,
                },
                element: heading,
            });
        }

        this.tocSections.set(observed.map(o => o.section));
        this.observeSections(host, observed);

        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (fragment) {
            observed.find(o => o.section.id === fragment)?.element.scrollIntoView({ block: 'start' });
        }
    }

    private observeSections(host: HTMLElement, observed: ObservedSection[]): void {
        this.observer?.disconnect();

        if (!observed.length) {
            this.tocActiveId.set('');
            return;
        }

        this.observer = new IntersectionObserver(
            entries => {
                const intersecting = entries.filter(entry => entry.isIntersecting);
                if (!intersecting.length) return;

                const ids = new Set(intersecting.map(entry => (entry.target as HTMLElement).id));
                const first = observed.find(o => ids.has(o.section.id));
                if (first) {
                    this.tocActiveId.set(first.section.id);
                }
            },
            {
                root: host,
                rootMargin: '0px 0px -70% 0px',
                threshold: 0,
            },
        );

        for (const { element } of observed) {
            this.observer.observe(element);
        }
    }

    private slugify(text: string): string {
        const slug = text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return slug || 'section';
    }
}
