import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzAnimateOnScrollDirective } from './animate-on-scroll.directive';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    observe = vi.fn();
    disconnect = vi.fn();

    constructor(public callback: IntersectionObserverCallback) {
        MockIntersectionObserver.instances.push(this);
    }
}

@Component({
    imports: [CzAnimateOnScrollDirective],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<div id="animated" czAnimateOnScroll="zoom-in" [aosOnce]="once()">Content</div>`,
})
class TestHostComponent {
    once = signal(true);
}

describe('CzAnimateOnScrollDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        MockIntersectionObserver.instances = [];
        (globalThis as any).IntersectionObserver = MockIntersectionObserver;

        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
    });

    function host(): HTMLElement {
        return fixture.debugElement.query(By.css('#animated')).nativeElement as HTMLElement;
    }

    it('should apply the aos classes and animation name', () => {
        fixture.detectChanges();

        expect(host().classList.contains('cz-aos')).toBe(true);
        expect(host().getAttribute('data-animation')).toBe('zoom-in');
        expect(host().classList.contains('cz-aos--visible')).toBe(false);
    });

    it('should observe the host element', () => {
        fixture.detectChanges();

        const observer = MockIntersectionObserver.instances[0];
        expect(observer).toBeTruthy();
        expect(observer.observe).toHaveBeenCalledWith(host());
    });

    it('should become visible on intersection and disconnect with aosOnce', () => {
        fixture.detectChanges();

        const observer = MockIntersectionObserver.instances[0];
        observer.callback([{ isIntersecting: true } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
        fixture.detectChanges();

        expect(host().classList.contains('cz-aos--visible')).toBe(true);
        expect(observer.disconnect).toHaveBeenCalled();
    });

    it('should hide again when aosOnce is false', () => {
        fixture.componentInstance.once.set(false);
        fixture.detectChanges();

        const observer = MockIntersectionObserver.instances[0];
        observer.callback([{ isIntersecting: true } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
        fixture.detectChanges();
        expect(host().classList.contains('cz-aos--visible')).toBe(true);

        observer.callback([{ isIntersecting: false } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
        fixture.detectChanges();
        expect(host().classList.contains('cz-aos--visible')).toBe(false);
    });
});
