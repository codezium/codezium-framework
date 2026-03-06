import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

export interface TocSection {
    id: string;
    label: string;
    level: 1 | 2 | 3;
}

@Component({
    selector: 'cz-docs-toc',
    imports: [],
    templateUrl: './docs-toc.html',
    styleUrl: './docs-toc.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsTocComponent {
    readonly sections = input<TocSection[]>([]);
    readonly activeId = signal<string>('');

    scrollTo(id: string): void {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.activeId.set(id);
        }
    }
}
