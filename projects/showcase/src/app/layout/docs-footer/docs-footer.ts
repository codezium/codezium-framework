import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'cz-docs-footer',
    imports: [RouterLink],
    templateUrl: './docs-footer.html',
    styleUrl: './docs-footer.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsFooterComponent {
    readonly currentYear = signal(new Date().getFullYear());
}
