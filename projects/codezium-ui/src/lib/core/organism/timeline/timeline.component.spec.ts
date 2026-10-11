import { ChangeDetectionStrategy, Component } from '@angular/core';
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

    it('should render arbitrary objects with the content template', () => {
        const hostFixture = TestBed.createComponent(ContentTemplateHostComponent);
        hostFixture.detectChanges();

        const rendered = Array.from(
            hostFixture.nativeElement.querySelectorAll('.custom-timeline-content'),
        ) as HTMLElement[];

        expect(rendered.length).toBe(3);
        expect(rendered[0].textContent).toContain('Ordered');
        expect(rendered[2].textContent).toContain('Delivered');
        expect(hostFixture.nativeElement.textContent).not.toContain('[object Object]');
    });

    it('should render the opposite and marker templates', () => {
        const hostFixture = TestBed.createComponent(OppositeMarkerHostComponent);
        hostFixture.detectChanges();

        const opposites = hostFixture.nativeElement.querySelectorAll('.custom-timeline-opposite');
        expect(opposites.length).toBe(2);
        expect(opposites[0].textContent).toContain('15/10/2026');

        const marker = hostFixture.nativeElement.querySelector('.cz-timeline-marker--template');
        expect(marker).toBeTruthy();
        expect(marker.textContent).toContain('★');
    });

    it('should support the horizontal layout with top and bottom alignment', () => {
        fixture.componentRef.setInput('value', ['2026', '2027', '2028']);
        fixture.componentRef.setInput('layout', 'horizontal');
        fixture.componentRef.setInput('align', 'top');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-layout')).toBe('horizontal');
        expect(host.getAttribute('data-align')).toBe('top');
        expect(items().length).toBe(3);
        expect(items()[0].textContent).toContain('2026');

        const before = fixture.nativeElement.querySelectorAll('.cz-timeline-connector--before');
        const after = fixture.nativeElement.querySelectorAll('.cz-timeline-connector--after');
        expect(before.length).toBe(2);
        expect(after.length).toBe(2);
    });

    it('should render plain values without a content template', () => {
        fixture.componentRef.setInput('value', ['2026', '2027']);
        fixture.detectChanges();

        expect(items()[0].textContent).toContain('2026');
        expect(fixture.nativeElement.querySelector('.cz-timeline-card')).toBeNull();
    });
});

@Component({
    imports: [CzTimelineComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-timeline [value]="events" [contentTemplate]="contentTpl"></cz-timeline>

        <ng-template #contentTpl let-event>
            <div class="custom-timeline-content">{{ event.status }}</div>
        </ng-template>
    `,
})
class ContentTemplateHostComponent {
    readonly events = [{ status: 'Ordered' }, { status: 'Processing' }, { status: 'Delivered' }];
}

@Component({
    imports: [CzTimelineComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-timeline [value]="events" [oppositeTemplate]="oppositeTpl" [markerTemplate]="markerTpl"></cz-timeline>

        <ng-template #oppositeTpl let-event>
            <span class="custom-timeline-opposite">{{ event.date }}</span>
        </ng-template>

        <ng-template #markerTpl>
            <span>★</span>
        </ng-template>
    `,
})
class OppositeMarkerHostComponent {
    readonly events = [
        { status: 'Ordered', date: '15/10/2026' },
        { status: 'Delivered', date: '16/10/2026' },
    ];
}
