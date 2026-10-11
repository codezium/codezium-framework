import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CzFileUploadComponent } from './file-upload.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

function makeFile(name: string, size = 1024, type = 'text/plain'): File {
    return new File([new Array(size).fill('a').join('')], name, { type });
}

describe('CzFileUploadComponent', () => {
    let component: CzFileUploadComponent;
    let fixture: ComponentFixture<CzFileUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzFileUploadComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzFileUploadComponent);
        component = fixture.componentInstance;
    });

    function drop(files: File[]): void {
        component.onDrop({
            preventDefault: vi.fn(),
            dataTransfer: { files },
        } as unknown as DragEvent);
        fixture.detectChanges();
    }

    it('should create in advanced mode with the header, dropzone and hidden input', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-file-upload-header')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-file-upload-dropzone')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeTruthy();
    });

    it('should render only the choose button in basic mode', () => {
        fixture.componentRef.setInput('mode', 'basic');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-file-upload-basic-button')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-file-upload-dropzone')).toBeNull();
        expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeTruthy();
    });

    it('should open the file dialog with choose()', () => {
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
        const spy = vi.spyOn(input, 'click');

        component.choose();

        expect(spy).toHaveBeenCalled();
    });

    it('should accept a single file and emit onSelect with currentFiles', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSelect.subscribe(spy);

        const file = makeFile('doc.txt');
        const other = makeFile('other.txt');
        drop([file, other]);

        expect(component.files().length).toBe(1);
        expect(component.files()[0].name).toBe('doc.txt');
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ files: [file, other], currentFiles: [file] }));
    });

    it('should accept multiple files when multiple is true', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        drop([makeFile('a.txt'), makeFile('b.txt')]);

        expect(component.files().length).toBe(2);
    });

    it('should validate the maximum file size with messages', () => {
        fixture.componentRef.setInput('maxFileSize', 2048);
        fixture.detectChanges();

        drop([makeFile('small.txt', 1024), makeFile('big.txt', 4096)]);

        expect(component.files().length).toBe(1);
        expect(component.messages().length).toBe(1);
        expect(component.messages()[0].detail).toContain('big.txt');
        expect(fixture.nativeElement.querySelector('.cz-file-upload-messages')).toBeTruthy();
    });

    it('should validate the accepted file types', () => {
        fixture.componentRef.setInput('accept', 'image/*');
        fixture.detectChanges();

        drop([makeFile('notes.txt'), makeFile('photo.png', 1024, 'image/png')]);

        expect(component.files().length).toBe(1);
        expect(component.files()[0].name).toBe('photo.png');
        expect(component.messages().length).toBe(1);
        expect(component.messages()[0].detail).toContain('notes.txt');
    });

    it('should validate the file limit', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.componentRef.setInput('fileLimit', 2);
        fixture.detectChanges();

        drop([makeFile('a.txt'), makeFile('b.txt'), makeFile('c.txt')]);

        expect(component.files().length).toBe(2);
        expect(component.messages().length).toBe(1);
        expect(component.messages()[0].detail).toContain('2');
    });

    it('should auto upload in custom upload mode after selection', () => {
        fixture.componentRef.setInput('customUpload', true);
        fixture.componentRef.setInput('auto', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.uploadHandler.subscribe(spy);

        const file = makeFile('a.txt');
        drop([file]);

        expect(spy).toHaveBeenCalledWith({ files: [file] });
    });

    it('should emit uploadHandler on upload() in custom upload mode', () => {
        fixture.componentRef.setInput('customUpload', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.uploadHandler.subscribe(spy);

        drop([makeFile('a.txt')]);
        component.upload();

        expect(spy).toHaveBeenCalledWith({ files: [expect.any(File)] });
    });

    it('should move pending files to uploaded with markUploaded', () => {
        fixture.componentRef.setInput('customUpload', true);
        fixture.detectChanges();

        drop([makeFile('a.txt')]);
        component.markUploaded();
        fixture.detectChanges();

        expect(component.files().length).toBe(0);
        expect(component.uploadedFiles().length).toBe(1);
        expect(fixture.nativeElement.querySelector('.cz-file-upload-list--uploaded')).toBeTruthy();
    });

    it('should remove pending and uploaded files', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        const removeSpy = vi.fn();
        component.onRemove.subscribe(removeSpy);

        drop([makeFile('a.txt'), makeFile('b.txt')]);
        component.remove(new Event('click'), 0);

        expect(component.files().length).toBe(1);
        expect(removeSpy).toHaveBeenCalledWith({ file: expect.any(File), index: 0 });

        component.markUploaded();
        fixture.detectChanges();

        const uploadedSpy = vi.fn();
        component.onRemoveUploadedFile.subscribe(uploadedSpy);

        component.removeUploadedFile(0);

        expect(component.uploadedFiles().length).toBe(0);
        expect(uploadedSpy).toHaveBeenCalledWith({ file: expect.any(File), index: 0 });
    });

    it('should clear pending files and emit onClear', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onClear.subscribe(spy);

        drop([makeFile('a.txt')]);
        component.clear();
        fixture.detectChanges();

        expect(component.files().length).toBe(0);
        expect(spy).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('.cz-file-upload-empty')).toBeTruthy();
    });

    it('should format sizes', () => {
        expect(component.formatSize(0)).toBe('0 B');
        expect(component.formatSize(2048)).toBe('2 KB');
        expect(component.formatSize(1024 * 1024 * 3)).toBe('3 MB');
    });

    it('should invoke removeCallback from a file template context', () => {
        const hostFixture = TestBed.createComponent(FileTemplateCallbackHostComponent);
        hostFixture.detectChanges();

        const host = hostFixture.componentInstance.fileUpload;
        host.onDrop({
            preventDefault: vi.fn(),
            dataTransfer: { files: [makeFile('a.txt'), makeFile('b.txt')] },
        } as unknown as DragEvent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelectorAll('.ctx-remove').length).toBe(2);

        (hostFixture.nativeElement.querySelector('.ctx-remove') as HTMLElement).click();
        hostFixture.detectChanges();

        expect(host.files().length).toBe(1);
        expect(hostFixture.nativeElement.querySelectorAll('.ctx-remove').length).toBe(1);
    });

    it('should render custom empty and file templates', () => {
        const hostFixture = TestBed.createComponent(TemplatesHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-empty')).toBeTruthy();

        const componentInstance = hostFixture.componentInstance.fileUpload;
        componentInstance.onDrop({
            preventDefault: vi.fn(),
            dataTransfer: { files: [makeFile('a.txt')] },
        } as unknown as DragEvent);
        hostFixture.detectChanges();

        const rows = hostFixture.nativeElement.querySelectorAll('.custom-file-row');
        expect(rows.length).toBe(1);
        expect(rows[0].textContent).toContain('a.txt');
    });
});

@Component({
    imports: [CzFileUploadComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-file-upload [emptyTemplate]="emptyTpl" [fileTemplate]="fileTpl"></cz-file-upload>

        <ng-template #emptyTpl>
            <span class="custom-empty">No files</span>
        </ng-template>

        <ng-template #fileTpl let-file let-index="index">
            <li class="custom-file-row">{{ index }} — {{ file.name }}</li>
        </ng-template>
    `,
})
class TemplatesHostComponent {
    @ViewChild(CzFileUploadComponent) fileUpload!: CzFileUploadComponent;
    @ViewChild('emptyTpl', { static: true }) emptyTpl!: TemplateRef<unknown>;
    @ViewChild('fileTpl', { static: true }) fileTpl!: TemplateRef<unknown>;
}


@Component({
    imports: [CzFileUploadComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-file-upload [multiple]="true" [fileTemplate]="fileTpl"></cz-file-upload>

        <ng-template #fileTpl let-file let-index="index" let-removeCallback="removeCallback">
            <li class="ctx-row">
                <span>{{ file.name }}</span>
                <button type="button" class="ctx-remove" (click)="removeCallback($event, index)">x</button>
            </li>
        </ng-template>
    `,
})
class FileTemplateCallbackHostComponent {
    @ViewChild(CzFileUploadComponent) fileUpload!: CzFileUploadComponent;
    @ViewChild('fileTpl', { static: true }) fileTpl!: TemplateRef<unknown>;
}
