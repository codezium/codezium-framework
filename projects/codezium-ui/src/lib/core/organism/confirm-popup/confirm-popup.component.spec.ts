import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzConfirmPopupComponent } from './confirm-popup.component';
import { CzConfirmationService } from '../confirmation';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CzConfirmPopupComponent', () => {
    let fixture: ComponentFixture<CzConfirmPopupComponent>;
    let service: CzConfirmationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzConfirmPopupComponent],
        }).compileComponents();

        service = TestBed.inject(CzConfirmationService);
        service.clear();
        fixture = TestBed.createComponent(CzConfirmPopupComponent);
    });

    afterEach(() => {
        service.clear();
    });

    it('should stay hidden without an active popup confirmation', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-confirm-popup')).toBeNull();
    });

    it('should render the popup at the event coordinates', () => {
        const event = new MouseEvent('click', { clientX: 120, clientY: 240 });
        service.confirmPopup({ message: 'Delete item?' }, event);
        fixture.detectChanges();

        const popup = fixture.nativeElement.querySelector('.cz-confirm-popup') as HTMLElement;
        expect(popup).toBeTruthy();
        expect(popup.style.left).toBe('120px');
        expect(popup.style.top).toBe('240px');
        expect(popup.textContent).toContain('Delete item?');
    });

    it('should run accept/reject callbacks', () => {
        const accept = vi.fn();
        const reject = vi.fn();

        service.confirmPopup({ message: 'Sure?', accept });
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.cz-button-native'));
        buttons[1].nativeElement.click();
        fixture.detectChanges();
        expect(accept).toHaveBeenCalled();
        expect(service.active()).toBeNull();

        service.confirmPopup({ message: 'Sure?', reject });
        fixture.detectChanges();
        const buttons2 = fixture.debugElement.queryAll(By.css('.cz-button-native'));
        buttons2[0].nativeElement.click();
        fixture.detectChanges();
        expect(reject).toHaveBeenCalled();
    });

    it('should reject on Escape', () => {
        const reject = vi.fn();
        service.confirmPopup({ message: 'Sure?', reject });
        fixture.detectChanges();

        fixture.componentInstance.onEscape();
        fixture.detectChanges();

        expect(reject).toHaveBeenCalled();
        expect(service.active()).toBeNull();
    });

    it('should not render when the confirmation targets the dialog renderer', () => {
        service.confirm({ message: 'Continue?' });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-confirm-popup')).toBeNull();
    });
});
