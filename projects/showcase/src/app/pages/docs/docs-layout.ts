import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocsHeaderComponent } from '../../layout/docs-header/docs-header';
import { DocsFooterComponent } from '../../layout/docs-footer/docs-footer';
import { DocsNavComponent } from '../../layout/docs-nav/docs-nav';
import { DocsTocComponent, type TocSection } from '../../layout/docs-toc/docs-toc';

@Component({
    selector: 'cz-docs-layout',
    imports: [
        RouterOutlet,
        DocsHeaderComponent,
        DocsFooterComponent,
        DocsNavComponent,
        DocsTocComponent,
    ],
    templateUrl: './docs-layout.html',
    styleUrl: './docs-layout.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsLayoutPage {
    /** Controlled by child pages via a shared service (to be implemented later) */
    readonly tocSections = signal<TocSection[]>([]);

    /** Mobile left-sidebar visibility */
    readonly sidebarOpen = signal(false);

    toggleSidebar(): void {
        this.sidebarOpen.update(v => !v);
    }
}
