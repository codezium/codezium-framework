import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CzVirtualScrollerComponent } from './virtual-scroller.component';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('CzVirtualScrollerComponent', () => {
    let component: CzVirtualScrollerComponent;
    let fixture: ComponentFixture<CzVirtualScrollerComponent>;

    const items = Array.from({ length: 100 }, (_, i) => ({ name: `Item ${i}` }));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzVirtualScrollerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzVirtualScrollerComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('items', items);
        fixture.componentRef.setInput('itemSize', 40);
        fixture.componentRef.setInput('height', 200);
        fixture.componentRef.setInput('field', 'name');
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    function viewport(): HTMLElement {
        return fixture.debugElement.query(By.css('.cz-virtual-scroller-viewport')).nativeElement as HTMLElement;
    }

    function scrollTo(scrollTop: number, scrollLeft = 0): void {
        const element = viewport();
        element.scrollTop = scrollTop;
        element.scrollLeft = scrollLeft;
        element.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
    }

    it('should create and only render the visible window plus tolerated items', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        // height 200 / itemSize 40 = 5 visible + 2 tolerated on both sides = 9
        expect(component.displayItems().length).toBe(9);
        expect(component.displayItems()[0].index).toBe(0);
        expect(fixture.nativeElement.querySelectorAll('.cz-virtual-scroller-item').length).toBe(9);
    });

    it('should size the spacers with the hidden rows', () => {
        fixture.detectChanges();

        expect(component.totalHeight()).toBe(4000);
        expect(component.spacerAfter()).toBe(3640);

        const spacer = fixture.debugElement.query(By.css('.cz-virtual-scroller-spacer')).nativeElement as HTMLElement;
        expect(spacer.style.height).toBe('3640px');
    });

    it('should update the window on scroll', () => {
        fixture.detectChanges();

        scrollTo(400);

        expect(component.first()).toBe(8);
        expect(component.displayItems()[0].index).toBe(8);
        expect(component.spacerBefore()).toBe(320);

        const firstItem = fixture.debugElement.query(By.css('.cz-virtual-scroller-item')).nativeElement;
        expect(firstItem.textContent).toContain('Item 8');
    });

    it('should clamp the window at the end of the list', () => {
        fixture.detectChanges();

        scrollTo(4000);

        expect(component.last()).toBe(100);
        expect(component.displayItems().length).toBeLessThanOrEqual(9);
    });

    it('should display plain values when no field is set', () => {
        fixture.componentRef.setInput('items', ['alpha', 'beta']);
        fixture.componentRef.setInput('field', '');
        fixture.detectChanges();

        expect(component.display('alpha')).toBe('alpha');
        expect(fixture.nativeElement.querySelector('.cz-virtual-scroller-item').textContent).toContain('alpha');
    });

    it('should scroll horizontally with the horizontal orientation', () => {
        fixture.componentRef.setInput('items', Array.from({ length: 50 }, (_, i) => `Col ${i}`));
        fixture.componentRef.setInput('orientation', 'horizontal');
        fixture.componentRef.setInput('itemSize', 60);
        fixture.componentRef.setInput('scrollWidth', '300px');
        fixture.componentRef.setInput('field', '');
        fixture.detectChanges();

        expect(component.itemWidth()).toBe(60);
        expect(component.visibleCount()).toBe(5);
        expect(component.displayItems().length).toBe(9);

        const viewportEl = viewport();
        expect(viewportEl.classList.contains('cz-virtual-scroller-viewport--horizontal')).toBe(true);

        scrollTo(0, 600);

        expect(component.first()).toBe(8);
        expect(component.spacerBefore()).toBe(480);

        const spacer = fixture.debugElement.query(By.css('.cz-virtual-scroller-spacer')).nativeElement as HTMLElement;
        expect(spacer.style.width).toBe('480px');
    });

    it('should window grid rows with the both orientation', () => {
        fixture.componentRef.setInput('items', Array.from({ length: 60 }, (_, i) => `Cell ${i}`));
        fixture.componentRef.setInput('orientation', 'both');
        fixture.componentRef.setInput('itemSize', [50, 40]);
        fixture.componentRef.setInput('columns', 3);
        fixture.componentRef.setInput('scrollHeight', '100px');
        fixture.componentRef.setInput('field', '');
        fixture.detectChanges();

        expect(component.gridColumns()).toBe(3);
        expect(component.visibleCount()).toBe(6);
        expect(component.displayItems().length).toBe(10);
        expect(component.totalHeight()).toBe(1000);

        scrollTo(500);

        expect(component.first()).toBe(24);
        expect(component.spacerBefore()).toBe(400);
    });

    it('should emit onLazyLoad while scrolling in lazy mode', async () => {
        fixture.componentRef.setInput('items', Array.from({ length: 100 }));
        fixture.componentRef.setInput('lazy', true);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const spy = vi.fn();
        component.onLazyLoad.subscribe(spy);

        scrollTo(800);

        expect(spy).toHaveBeenCalledWith({ first: 18, last: 27 });
        expect(component.displayItems()[0].loading).toBe(true);
    });

    it('should show the loader overlay with showLoader and lazy loading', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-virtual-scroller-loader')).toBeNull();

        fixture.componentRef.setInput('showLoader', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-virtual-scroller-loader')).toBeTruthy();

        fixture.componentRef.setInput('showLoader', false);
        fixture.componentRef.setInput('lazy', true);
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-virtual-scroller-loader')).toBeTruthy();
    });

    it('should scroll to a specific index programmatically', () => {
        fixture.detectChanges();

        component.scrollToIndex(50);
        fixture.detectChanges();

        expect(viewport().scrollTop).toBe(2000);
        expect(component.scrollTop()).toBe(2000);
        expect(component.first()).toBe(48);
    });

    it('should delay the window update with the delay property', () => {
        vi.useFakeTimers();

        fixture.componentRef.setInput('delay', 150);
        fixture.detectChanges();

        scrollTo(800);
        expect(component.first()).toBe(0);

        vi.advanceTimersByTime(150);
        fixture.detectChanges();

        expect(component.first()).toBe(18);
    });

    it('should render all items without spacers when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(component.displayItems().length).toBe(100);
        expect(fixture.nativeElement.querySelectorAll('.cz-virtual-scroller-spacer').length).toBe(0);
    });

    it('should render the item template with its context', () => {
        const hostFixture = TestBed.createComponent(ItemTemplateHostComponent);
        hostFixture.detectChanges();

        const rendered = hostFixture.nativeElement.querySelectorAll('.custom-scroller-item');
        expect(rendered.length).toBe(9);
        expect(rendered[0].textContent).toContain('Item 0 #0');
        expect(hostFixture.nativeElement.textContent).not.toContain('[object Object]');
    });

    it('should render the loader and loader icon templates', () => {
        const hostFixture = TestBed.createComponent(LoaderTemplateHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-scroller-loader')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelectorAll('.custom-loader-row').length).toBe(5);
    });
});

@Component({
    imports: [CzVirtualScrollerComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-virtual-scroller [items]="items" [itemSize]="40" [height]="200" [itemTemplate]="itemTpl"></cz-virtual-scroller>

        <ng-template #itemTpl let-item let-index="index">
            <span class="custom-scroller-item">{{ item.name }} #{{ index }}</span>
        </ng-template>
    `,
})
class ItemTemplateHostComponent {
    readonly items = Array.from({ length: 100 }, (_, i) => ({ name: `Item ${i}` }));
}

@Component({
    imports: [CzVirtualScrollerComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-virtual-scroller [items]="items()" [itemSize]="40" [height]="200" [showLoader]="true"
            [loaderTemplate]="loaderTpl" [loaderIconTemplate]="iconTpl"></cz-virtual-scroller>

        <ng-template #loaderTpl let-placeholders>
            <div class="custom-scroller-loader">
                @for (row of placeholders; track $index) {
                    <div class="custom-loader-row" style="height: 1rem;"></div>
                }
            </div>
        </ng-template>

        <ng-template #iconTpl>
            <span class="custom-loader-icon">…</span>
        </ng-template>
    `,
})
class LoaderTemplateHostComponent {
    readonly items = signal(Array.from({ length: 100 }, (_, i) => ({ name: `Item ${i}` })));
}
