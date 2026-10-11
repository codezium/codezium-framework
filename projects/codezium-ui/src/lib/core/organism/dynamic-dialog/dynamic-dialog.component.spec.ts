import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzDynamicDialogComponent } from './dynamic-dialog.component';
import { CzDynamicDialogService } from './dynamic-dialog.service';
import { Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

@Component({
    selector: 'cz-test-dialog-content',
    template: `<p id="dynamic-content">Data: {{ data() }}</p>`,
})
class TestDialogContentComponent {
    data = input<string>('');
}

describe('CzDynamicDialogComponent', () => {
    let fixture: ComponentFixture<CzDynamicDialogComponent>;
    let service: CzDynamicDialogService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzDynamicDialogComponent],
        }).compileComponents();

        service = TestBed.inject(CzDynamicDialogService);
        service.active.set(null);
        fixture = TestBed.createComponent(CzDynamicDialogComponent);
    });

    afterEach(() => {
        service.active.set(null);
    });

    it('should stay hidden without an active dialog', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();
    });

    it('should render the dialog with the dynamic component and pass data', async () => {
        service.open(TestDialogContentComponent, { header: 'Dynamic', data: 'hello' });

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-dialog-title').textContent).toContain('Dynamic');

        const content = fixture.debugElement.query(By.css('#dynamic-content'));
        expect(content).toBeTruthy();
        expect(content.nativeElement.textContent).toContain('Data: hello');
    });

    it('should close the dialog through the service ref and destroy the component', async () => {
        const ref = service.open(TestDialogContentComponent, { header: 'Dynamic' });

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#dynamic-content')).toBeTruthy();

        ref.close('result');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(service.active()).toBeNull();
        expect(fixture.nativeElement.querySelector('#dynamic-content')).toBeNull();
        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();
    });

    it('should run the onClose callback with the result', async () => {
        const ref = service.open(TestDialogContentComponent);
        const onClose = vi.fn();
        service.onClose(ref.id, onClose);

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        ref.close(42);
        expect(onClose).toHaveBeenCalledWith(42);
    });

    it('should close when the dialog X is clicked', async () => {
        service.open(TestDialogContentComponent, { header: 'Dynamic' });

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-dialog-close')).nativeElement.click();
        fixture.detectChanges();

        expect(service.active()).toBeNull();
    });
});
