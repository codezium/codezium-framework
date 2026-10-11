import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzGalleryComponent, CzGalleryImage } from './gallery.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzGalleryComponent', () => {
    let component: CzGalleryComponent;
    let fixture: ComponentFixture<CzGalleryComponent>;

    const images: CzGalleryImage[] = [
        { src: 'a.png', alt: 'A' },
        { src: 'b.png', alt: 'B', thumbnail: 'b-thumb.png' },
        { src: 'c.png' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzGalleryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzGalleryComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('images', images);
    });

    it('should create and render the thumbnails', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        const thumbs = fixture.debugElement.queryAll(By.css('.cz-gallery-thumb'));
        expect(thumbs.length).toBe(3);
        expect(thumbs[1].nativeElement.querySelector('img').getAttribute('src')).toBe('b-thumb.png');
    });

    it('should open the fullscreen preview on thumbnail click', () => {
        fixture.detectChanges();

        fixture.debugElement.queryAll(By.css('.cz-gallery-thumb'))[1].nativeElement.click();
        fixture.detectChanges();

        expect(component.fullscreen()).toBe(true);
        expect(component.activeIndex()).toBe(1);

        const preview = fixture.debugElement.query(By.css('.cz-gallery-preview img')).nativeElement;
        expect(preview.getAttribute('src')).toBe('b.png');
    });

    it('should navigate with arrows and wrap around', () => {
        fixture.detectChanges();

        component.open(0);
        fixture.detectChanges();

        component.prev();
        expect(component.activeIndex()).toBe(2);

        component.next();
        expect(component.activeIndex()).toBe(0);
    });

    it('should show the counter', () => {
        component.open(1);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-gallery-counter').textContent).toContain('2 / 3');
    });

    it('should close with Escape and handle arrow keys only in fullscreen', () => {
        fixture.detectChanges();

        component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        expect(component.activeIndex()).toBe(0);

        component.open(0);
        fixture.detectChanges();

        component.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        expect(component.activeIndex()).toBe(1);

        component.onKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(component.fullscreen()).toBe(false);
    });

    it('should close with the close button', () => {
        component.open(0);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.cz-gallery-close')).nativeElement.click();
        fixture.detectChanges();

        expect(component.fullscreen()).toBe(false);
    });
});
