import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CzRippleDirective } from 'codezium-ui';
import { LanguageService } from '../../core/services/language.service';

export interface TocSection {
    id: string;
    label: string;
    level: 1 | 2 | 3;
}

const TOC_TITLES: Record<string, string> = {
    en: 'On this page',
    es: 'En esta página',
    pt: 'Nesta página',
    fr: 'Sur cette page',
    de: 'Auf dieser Seite',
};

@Component({
    selector: 'cz-docs-toc',
    imports: [CzRippleDirective],
    templateUrl: './docs-toc.html',
    styleUrl: './docs-toc.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTocComponent {
    private readonly lang = inject(LanguageService);

    readonly sections = input<TocSection[]>([]);
    readonly activeId = input<string>('');

    readonly title = computed(() => TOC_TITLES[this.lang.currentLang()] ?? TOC_TITLES['en']);

    scrollTo(id: string): void {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
