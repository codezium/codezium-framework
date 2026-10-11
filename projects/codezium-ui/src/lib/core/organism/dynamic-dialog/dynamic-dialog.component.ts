import {
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    computed,
    effect,
    inject,
    OnDestroy,
    viewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CzDialogComponent } from '../dialog';
import { CzDynamicDialogService } from './dynamic-dialog.service';

@Component({
    selector: 'cz-dynamic-dialog',
    imports: [CommonModule, CzDialogComponent],
    templateUrl: './dynamic-dialog.component.html',
    styleUrl: './dynamic-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-dynamic-dialog-host',
    },
})
export class CzDynamicDialogComponent implements OnDestroy {
    private readonly service = inject(CzDynamicDialogService);
    private readonly hostVcr = viewChild('host', { read: ViewContainerRef });

    readonly active = this.service.active;
    readonly visible = computed(() => !!this.active());

    private currentRef: ComponentRef<unknown> | null = null;

    constructor() {
        effect(() => {
            const vcr = this.hostVcr();
            const active = this.active();

            this.currentRef?.destroy();
            this.currentRef = null;
            vcr?.clear();

            if (!vcr || !active) return;

            const ref = vcr.createComponent(active.component);
            if (active.config.data !== undefined) {
                try {
                    ref.setInput('data', active.config.data);
                } catch {
                    // Component does not declare a `data` input: ignore
                }
            }
            try {
                ref.setInput('ref', {
                    id: active.id,
                    close: (result?: unknown) => this.service.close(active.id, result),
                });
            } catch {
                // Component does not declare a `ref` input: ignore
            }
            this.currentRef = ref;
        });
    }

    close(): void {
        const active = this.active();
        if (active) {
            this.service.close(active.id);
        }
    }

    ngOnDestroy(): void {
        this.currentRef?.destroy();
    }
}
