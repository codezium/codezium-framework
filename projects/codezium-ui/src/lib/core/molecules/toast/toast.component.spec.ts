import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CzToastComponent } from './toast.component';
import { CzToastService } from './toast.service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CzToastService', () => {
    let service: CzToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CzToastService);
    });

    afterEach(() => {
        service.clear();
    });

    it('should add messages with unique ids', () => {
        service.add({ severity: 'info', detail: 'One' });
        service.add({ severity: 'info', detail: 'Two' });

        expect(service.messages().length).toBe(2);
        expect(service.messages()[0].id).not.toBe(service.messages()[1].id);
    });

    it('should add multiple messages with addAll', () => {
        service.addAll([
            { severity: 'success', detail: 'One' },
            { severity: 'info', detail: 'Two' },
        ]);

        expect(service.messages().length).toBe(2);
    });

    it('should provide severity helpers', () => {
        service.success('Saved');
        service.error('Failed');

        expect(service.messages()[0].severity).toBe('success');
        expect(service.messages()[1].severity).toBe('danger');
    });

    it('should remove messages by id', () => {
        const id = service.add({ severity: 'info', detail: 'One' });
        service.remove(id);

        expect(service.messages().length).toBe(0);
    });

    it('should clear all messages or only a key', () => {
        service.add({ severity: 'info', detail: 'One', key: 'toast1' });
        service.add({ severity: 'info', detail: 'Two', key: 'toast2' });

        service.clear('toast1');
        expect(service.messages().length).toBe(1);
        expect(service.messages()[0].key).toBe('toast2');

        service.clear();
        expect(service.messages().length).toBe(0);
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
        vi.useRealTimers();
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

    it('should apply the position attribute including center', () => {
        fixture.componentRef.setInput('position', 'bottom-left');
        fixture.detectChanges();

        expect(fixture.nativeElement.getAttribute('data-position')).toBe('bottom-left');

        fixture.componentRef.setInput('position', 'center');
        fixture.detectChanges();

        expect(fixture.nativeElement.getAttribute('data-position')).toBe('center');
    });

    it('should close a message with the close button and emit onClose', () => {
        service.add({ severity: 'info', detail: 'One', life: 0 });
        fixture.detectChanges();

        const spy = vi.fn();
        fixture.componentInstance.onClose.subscribe(spy);

        fixture.debugElement.query(By.css('.cz-toast-close')).nativeElement.click();
        fixture.detectChanges();

        expect(service.messages().length).toBe(0);
        expect(fixture.nativeElement.querySelector('.cz-toast-item')).toBeNull();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: 'One' }));
    });

    it('should render the correct icon per severity', () => {
        service.add({ severity: 'warning', detail: 'Careful', life: 0 });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-toast-icon')).toBeTruthy();
    });

    it('should only render messages targeting its key', () => {
        fixture.componentRef.setInput('key', 'toast1');
        service.add({ severity: 'success', detail: 'For toast1', key: 'toast1', life: 0 });
        service.add({ severity: 'warning', detail: 'For toast2', key: 'toast2', life: 0 });
        service.add({ severity: 'info', detail: 'No key', life: 0 });
        fixture.detectChanges();

        const items = fixture.nativeElement.querySelectorAll('.cz-toast-item');
        expect(items.length).toBe(1);
        expect(items[0].textContent).toContain('For toast1');
    });

    it('should auto dismiss after the life time using the component life default', () => {
        vi.useFakeTimers();

        service.add({ severity: 'info', detail: 'One' });
        fixture.detectChanges();

        vi.advanceTimersByTime(3000);
        fixture.detectChanges();

        expect(service.messages().length).toBe(0);
    });

    it('should let the message life override the component life', () => {
        vi.useFakeTimers();

        fixture.componentRef.setInput('life', 10000);
        fixture.detectChanges();

        service.add({ severity: 'info', detail: 'Default life' });
        service.add({ severity: 'info', detail: 'Long life', life: 20000 });
        fixture.detectChanges();

        vi.advanceTimersByTime(10000);
        fixture.detectChanges();

        expect(service.messages().length).toBe(1);
        expect(service.messages()[0].detail).toBe('Long life');
    });

    it('should keep sticky messages', () => {
        vi.useFakeTimers();

        service.add({ severity: 'info', detail: 'Sticky flag', sticky: true });
        service.add({ severity: 'info', detail: 'Sticky life', life: 0 });
        fixture.detectChanges();

        vi.advanceTimersByTime(60000);
        fixture.detectChanges();

        expect(service.messages().length).toBe(2);
    });

    it('should pause the timers while hovering the stack', () => {
        vi.useFakeTimers();

        service.add({ severity: 'info', detail: 'One', life: 1000 });
        fixture.detectChanges();

        const stack = fixture.nativeElement.querySelector('.cz-toast-stack') as HTMLElement;
        stack.dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        vi.advanceTimersByTime(5000);
        fixture.detectChanges();
        expect(service.messages().length).toBe(1);

        stack.dispatchEvent(new MouseEvent('mouseleave'));
        fixture.detectChanges();

        vi.advanceTimersByTime(1000);
        fixture.detectChanges();
        expect(service.messages().length).toBe(0);
    });

    it('should apply stacked and expanded modes', () => {
        service.add({ severity: 'info', detail: 'One', life: 0 });
        service.add({ severity: 'info', detail: 'Two', life: 0 });
        fixture.detectChanges();

        const stack = fixture.nativeElement.querySelector('.cz-toast-stack');
        expect(stack.classList.contains('cz-toast-stack--stacked')).toBe(true);
        expect(fixture.nativeElement.querySelectorAll('.cz-toast-item--stacked').length).toBe(2);

        const offsets = fixture.nativeElement.querySelectorAll('.cz-toast-item--stacked');
        expect(offsets[0].style.getPropertyValue('--cz-toast-stack-offset')).toBe('1');
        expect(offsets[1].style.getPropertyValue('--cz-toast-stack-offset')).toBe('0');

        fixture.componentRef.setInput('mode', 'expanded');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-toast-stack--expanded')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-toast-item--stacked')).toBeNull();
    });

    it('should hide stack items beyond stackVisibleLimit', () => {
        service.add({ severity: 'info', detail: 'One', life: 0 });
        service.add({ severity: 'info', detail: 'Two', life: 0 });
        service.add({ severity: 'info', detail: 'Three', life: 0 });
        fixture.componentRef.setInput('stackVisibleLimit', 2);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('.cz-toast-item--stack-hidden').length).toBe(1);
    });

    it('should prevent open duplicates when enabled', () => {
        fixture.componentRef.setInput('preventOpenDuplicates', true);
        service.add({ severity: 'success', summary: 'Saved', detail: 'OK', life: 0 });
        service.add({ severity: 'success', summary: 'Saved', detail: 'OK', life: 0 });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('.cz-toast-item').length).toBe(1);
    });

    it('should display duplicates only once when preventDuplicates is enabled', () => {
        fixture.componentRef.setInput('preventDuplicates', true);
        const id = service.add({ severity: 'success', summary: 'Saved', detail: 'OK', life: 0 });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.cz-toast-item').length).toBe(1);

        service.remove(id);
        fixture.detectChanges();

        service.add({ severity: 'success', summary: 'Saved', detail: 'OK', life: 0 });
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('.cz-toast-item').length).toBe(0);
    });

    it('should render the custom message template with closeFn', () => {
        const hostFixture = TestBed.createComponent(MessageTemplateHostComponent);
        hostFixture.detectChanges();

        service.add({ severity: 'success', summary: 'Custom', detail: 'Body', life: 0 });
        hostFixture.detectChanges();

        const custom = hostFixture.nativeElement.querySelector('.custom-toast-message');
        expect(custom).toBeTruthy();
        expect(custom.textContent).toContain('Custom');

        (hostFixture.nativeElement.querySelector('.custom-toast-close') as HTMLElement).click();
        hostFixture.detectChanges();

        expect(service.messages().length).toBe(0);
    });
});

@Component({
    imports: [CzToastComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-toast [messageTemplate]="msgTpl"></cz-toast>

        <ng-template #msgTpl let-message let-closeFn="closeFn">
            <div class="custom-toast-message">
                <strong>{{ message.summary }}</strong>
                <span>{{ message.detail }}</span>
                <button type="button" class="custom-toast-close" (click)="closeFn()">Dismiss</button>
            </div>
        </ng-template>
    `,
})
class MessageTemplateHostComponent {
    @ViewChild('msgTpl', { static: true }) msgTpl!: TemplateRef<unknown>;
}
