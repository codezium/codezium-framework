import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzFileUploadComponent } from './file-upload.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

function makeFile(name: string, size = 1024): File {
    return new File([new Array(size).fill('a').join('')], name, { type: 'text/plain' });
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

    it('should create with the dropzone and hidden input', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-file-upload-dropzone')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('input[type="file"]')).toBeTruthy();
    });

    it('should accept a single file and emit onSelect', () => {
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSelect.subscribe(spy);

        const file = makeFile('doc.txt');
        drop([file, makeFile('other.txt')]);

        expect(component.files().length).toBe(1);
        expect(component.files()[0].name).toBe('doc.txt');
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ files: [file] }));
    });

    it('should accept multiple files when multiple is true', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        drop([makeFile('a.txt'), makeFile('b.txt')]);

        expect(component.files().length).toBe(2);
    });

    it('should filter files above maxFileSize', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.componentRef.setInput('maxFileSize', 2048);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSelect.subscribe(spy);

        drop([makeFile('small.txt', 1024), makeFile('big.txt', 5000)]);

        expect(component.files().length).toBe(1);
        expect(component.files()[0].name).toBe('small.txt');
    });

    it('should remove files and emit onRemove', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        drop([makeFile('a.txt'), makeFile('b.txt')]);

        const spy = vi.fn();
        component.onRemove.subscribe(spy);

        const removeButtons = fixture.debugElement.queryAll(By.css('.cz-file-upload-remove'));
        removeButtons[0].nativeElement.click();
        fixture.detectChanges();

        expect(component.files().length).toBe(1);
        expect(component.files()[0].name).toBe('b.txt');
        expect(spy).toHaveBeenCalled();
    });

    it('should ignore drops when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        drop([makeFile('a.txt')]);

        expect(component.files().length).toBe(0);
        expect(fixture.nativeElement.classList.contains('cz-file-upload--disabled')).toBe(true);
    });

    it('should format sizes', () => {
        fixture.detectChanges();

        expect(component.sizeLabel(makeFile('a', 1024))).toBe('1.0 KB');
        expect(component.sizeLabel(makeFile('b', 2 * 1024 * 1024))).toBe('2.00 MB');
    });
});
