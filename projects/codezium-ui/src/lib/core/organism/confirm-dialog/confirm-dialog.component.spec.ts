import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzConfirmDialogComponent } from './confirm-dialog.component';
import { CzConfirmationService } from '../confirmation';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CzConfirmDialogComponent', () => {
    let fixture: ComponentFixture<CzConfirmDialogComponent>;
    let service: CzConfirmationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzConfirmDialogComponent],
        }).compileComponents();

        service = TestBed.inject(CzConfirmationService);
        service.clear();
        fixture = TestBed.createComponent(CzConfirmDialogComponent);
    });

    afterEach(() => {
        service.clear();
    });

    it('should stay hidden without an active confirmation', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();
    });

    it('should render the confirmation when opened', () => {
        service.confirm({ header: 'Delete', message: 'Are you sure?', acceptLabel: 'Yes', rejectLabel: 'No' });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('Are you sure?');
        expect(fixture.nativeElement.textContent).toContain('Yes');
        expect(fixture.nativeElement.textContent).toContain('No');
    });

    it('should run the accept callback and clear the state', () => {
        const accept = vi.fn();
        service.confirm({ message: 'Continue?', accept });
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.cz-button-native'));
        buttons[1].nativeElement.click();
        fixture.detectChanges();

        expect(accept).toHaveBeenCalled();
        expect(service.active()).toBeNull();
        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();
    });

    it('should run the reject callback with the reject button', () => {
        const reject = vi.fn();
        service.confirm({ message: 'Continue?', reject });
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.cz-button-native'));
        buttons[0].nativeElement.click();
        fixture.detectChanges();

        expect(reject).toHaveBeenCalled();
        expect(service.active()).toBeNull();
    });

    it('should treat closing with the X as a reject', () => {
        const reject = vi.fn();
        service.confirm({ message: 'Continue?', reject });
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-dialog-close')).nativeElement.click();
        fixture.detectChanges();

        expect(reject).toHaveBeenCalled();
        expect(service.active()).toBeNull();
    });

    it('should not render when the confirmation targets the popup renderer', () => {
        service.confirmPopup({ message: 'Continue?' });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeNull();
    });
});
