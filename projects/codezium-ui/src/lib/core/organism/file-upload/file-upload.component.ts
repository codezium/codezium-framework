import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LucideDynamicIcon,
    LucideFile,
    LucideTrash2,
    LucideUpload,
} from '@lucide/angular';

export interface CzFileUploadSelectEvent {
    files: File[];
    originalEvent: Event;
}

@Component({
    selector: 'cz-file-upload',
    imports: [CommonModule, LucideDynamicIcon],
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'cz-file-upload',
        '[class.cz-file-upload--disabled]': 'disabled()',
    },
})
export class CzFileUploadComponent {
    /** Allows multiple files */
    multiple = input<boolean>(false);

    /** Accepted mime types / extensions (native accept attribute) */
    accept = input<string>('');

    /** Max size per file in bytes (0 = unlimited) */
    maxFileSize = input<number>(0);

    /** Disabled state */
    disabled = input<boolean>(false);

    /** Drop zone label */
    dragLabel = input<string>('Drag and drop files here');

    /** Choose button label */
    chooseLabel = input<string>('Choose');

    /** Emitted when files are selected (input or drop) */
    onSelect = output<CzFileUploadSelectEvent>();

    /** Emitted when a file is removed */
    onRemove = output<File>();

    /** Selected files */
    files = signal<File[]>([]);

    /** Drag state */
    isDragging = signal<boolean>(false);

    readonly UploadIcon = LucideUpload;
    readonly FileIcon = LucideFile;
    readonly TrashIcon = LucideTrash2;

    onFileInput(event: Event): void {
        const inputEl = event.target as HTMLInputElement;
        const selected = inputEl.files ? Array.from(inputEl.files) : [];
        this.addFiles(selected, event);
        inputEl.value = '';
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragging.set(false);
        if (this.disabled()) return;

        const dropped = event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : [];
        this.addFiles(dropped, event);
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        if (!this.disabled()) {
            this.isDragging.set(true);
        }
    }

    onDragLeave(): void {
        this.isDragging.set(false);
    }

    remove(file: File, event?: Event): void {
        event?.stopPropagation();
        this.files.update((files) => files.filter((f) => f !== file));
        this.onRemove.emit(file);
    }

    sizeLabel(file: File): string {
        const kb = file.size / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(2)} MB`;
    }

    private addFiles(selected: File[], originalEvent: Event): void {
        if (this.disabled() || selected.length === 0) return;

        const max = this.maxFileSize();
        let files = max > 0 ? selected.filter((f) => f.size <= max) : selected;

        if (!this.multiple()) {
            files = files.slice(0, 1);
            this.files.set(files);
        } else {
            this.files.update((current) => [...current, ...files]);
        }

        if (files.length > 0) {
            this.onSelect.emit({ files, originalEvent });
        }
    }
}
