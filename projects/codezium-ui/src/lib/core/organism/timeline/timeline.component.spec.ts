import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTimelineComponent, CzTimelineEvent } from './timeline.component';
import { LucideRocket } from '@lucide/angular';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzTimelineComponent', () => {
    let component: CzTimelineComponent;
    let fixture: ComponentFixture<CzTimelineComponent>;

    const events: CzTimelineEvent[] = [
        { title: 'Ordered', date: '2024-01-01', content: 'Order created', severity: 'success' },
        { title: 'Shipped', date: '2024-01-02', icon: LucideRocket },
        { title: 'Delivered' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzTimelineComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzTimelineComponent);
        component = fixture.componentInstance;
    });

    function items(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-timeline-item')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render the events', () => {
        fixture.componentRef.setInput('value', events);
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(items().length).toBe(3);
        expect(items()[0].textContent).toContain('Ordered');
        expect(items()[0].textContent).toContain('Order created');
        expect(items()[0].textContent).toContain('2024-01-01');
    });

    it('should apply severity on the marker', () => {
        fixture.componentRef.setInput('value', events);
        fixture.detectChanges();

        const markers = fixture.debugElement.queryAll(By.css('.cz-timeline-marker'));
        expect(markers[0].nativeElement.getAttribute('data-severity')).toBe('success');
        expect(markers[1].nativeElement.getAttribute('data-severity')).toBe('primary');
    });

    it('should render an icon when provided', () => {
        fixture.componentRef.setInput('value', events);
        fixture.detectChanges();

        const markers = fixture.debugElement.queryAll(By.css('.cz-timeline-marker'));
        expect(markers[1].nativeElement.querySelector('svg')).toBeTruthy();
        expect(markers[0].nativeElement.querySelector('svg')).toBeNull();
    });

    it('should apply the align attribute', () => {
        fixture.componentRef.setInput('value', events);
        fixture.componentRef.setInput('align', 'alternate');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('data-align')).toBe('alternate');
        expect(items()[1].classList.contains('cz-timeline-item--odd')).toBe(true);
    });

    it('should emit onEventSelect when the content is clicked', () => {
        fixture.componentRef.setInput('value', events);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onEventSelect.subscribe(spy);

        fixture.debugElement.queryAll(By.css('.cz-timeline-content'))[1].nativeElement.click();

        expect(spy).toHaveBeenCalledWith(events[1]);
    });

    it('should render an empty list without events', () => {
        fixture.detectChanges();

        expect(items().length).toBe(0);
    });
});
