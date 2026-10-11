import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzAvatarComponent } from './avatar.component';
import { LucideUser } from '@lucide/angular';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CzAvatarComponent', () => {
    let component: CzAvatarComponent;
    let fixture: ComponentFixture<CzAvatarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzAvatarComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzAvatarComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render the label (initials)', () => {
        fixture.componentRef.setInput('label', 'MT');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-avatar-label').textContent).toContain('MT');
    });

    it('should render an icon when no image or label is provided', () => {
        fixture.componentRef.setInput('icon', LucideUser);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-avatar-icon')).toBeTruthy();
    });

    it('should render the image with precedence', () => {
        fixture.componentRef.setInput('label', 'MT');
        fixture.componentRef.setInput('icon', LucideUser);
        fixture.componentRef.setInput('image', 'https://example.com/a.png');
        fixture.detectChanges();

        const img = fixture.nativeElement.querySelector('.cz-avatar-image') as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.getAttribute('alt')).toBe('MT');
        expect(fixture.nativeElement.querySelector('.cz-avatar-label')).toBeNull();
        expect(fixture.nativeElement.querySelector('.cz-avatar-icon')).toBeNull();
    });

    it('should apply size attribute and square shape class', () => {
        fixture.componentRef.setInput('size', 'xl');
        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-size')).toBe('xl');
        expect(host.classList.contains('cz-avatar--square')).toBe(true);
    });

    it('should resolve the icon size from the avatar size', () => {
        fixture.componentRef.setInput('size', 'sm');
        fixture.detectChanges();
        expect(component.resolvedIconSize()).toBe(16);

        fixture.componentRef.setInput('size', 'xl');
        fixture.detectChanges();
        expect(component.resolvedIconSize()).toBe(40);

        fixture.componentRef.setInput('iconSize', 22);
        fixture.detectChanges();
        expect(component.resolvedIconSize()).toBe(22);
    });

    it('should expose role img and an accessible label', () => {
        fixture.componentRef.setInput('label', 'MT');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('role')).toBe('img');
        expect(host.getAttribute('aria-label')).toBe('MT');
    });
});
