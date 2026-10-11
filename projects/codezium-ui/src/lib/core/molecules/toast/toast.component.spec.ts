import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzToastComponent } from './toast.component';
import { CzToastService } from './toast.service';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CzToastService', () => {
    let service: CzToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CzToastService);
    });

    afterEach(() => {
        vi.useRealTimers();
        service.clear();
    });

    it('should add messages with unique ids', () => {
        service.add({ severity: 'info', detail: 'One' });
        service.add({ severity: 'info', detail: 'Two' });

        expect(service.messages().length).toBe(2);
        expect(service.messages()[0].id).not.toBe(service.messages()[1].id);
    });

    it('should provide severity helpers', () => {
        service.success('Saved');
        service.error('Failed');

        expect(service.messages()[0].severity).toBe('success');
        expect(service.messages()[1].severity).toBe('danger');
    });

    it('should remove messages by id', () => {
        const id = service.add({ severity: 'info', detail: 'One', life: 0 });
        service.remove(id);

        expect(service.messages().length).toBe(0);
    });

    it('should auto dismiss after the life time', () => {
        vi.useFakeTimers();

        service.add({ severity: 'info', detail: 'One', life: 1000 });
        expect(service.messages().length).toBe(1);

        vi.advanceTimersByTime(1000);
        expect(service.messages().length).toBe(0);
    });

    it('should keep sticky messages when life is 0', () => {
        vi.useFakeTimers();

        service.add({ severity: 'info', detail: 'Sticky', life: 0 });
        vi.advanceTimersByTime(10000);

        expect(service.messages().length).toBe(1);
    });
});

describe('CzToastComponent', () => {
    let fixture: ComponentFixture<CzToastComponent>;
    let service: CzToastService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzToastComponent],
        }).compileComponents();

        service = TestBed.inject(CzToastService);
        service.clear();
        fixture = TestBed.createComponent(CzToastComponent);
    });

    afterEach(() => {
        service.clear();
    });

    it('should create and render the service messages', () => {
        service.add({ severity: 'success', summary: 'Done', detail: 'Everything ok', life: 0 });
        fixture.detectChanges();

        const item = fixture.nativeElement.querySelector('.cz-toast-item');
        expect(item).toBeTruthy();
        expect(item.textContent).toContain('Done');
        expect(item.textContent).toContain('Everything ok');
        expect(item.getAttribute('data-severity')).toBe('success');
    });

    it('should apply the position attribute', () => {
        fixture.componentRef.setInput('position', 'bottom-left');
        fixture.detectChanges();

        expect(fixture.nativeElement.getAttribute('data-position')).toBe('bottom-left');
    });

    it('should close a message with the close button', () => {
        service.add({ severity: 'info', detail: 'One', life: 0 });
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-toast-close')).nativeElement.click();
        fixture.detectChanges();

        expect(service.messages().length).toBe(0);
        expect(fixture.nativeElement.querySelector('.cz-toast-item')).toBeNull();
    });

    it('should render the correct icon per severity', () => {
        service.add({ severity: 'warning', detail: 'Careful', life: 0 });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-toast-icon')).toBeTruthy();
    });
});
