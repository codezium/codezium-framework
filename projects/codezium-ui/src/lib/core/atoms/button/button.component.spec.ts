import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzButtonComponent } from './button.component';
import { LucideCheck, LucideChevronRight } from '@lucide/angular';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
    imports: [CzButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-button variant="outlined" ariaLabel="Star action">
            <svg data-test-custom-icon width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"></svg>
            Star
        </cz-button>
    `,
})
class ProjectedContentHostComponent {}

describe('CzButtonComponent', () => {
    let component: CzButtonComponent;
    let fixture: ComponentFixture<CzButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzButtonComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should have default values', () => {
        fixture.detectChanges();
        expect(component.label()).toBe('');
        expect(component.severity()).toBe('primary');
        expect(component.variant()).toBe('solid');
        expect(component.size()).toBe('md');
        expect(component.type()).toBe('button');
        expect(component.actualDisabled()).toBe(false);
    });

    it('should render the label', () => {
        fixture.componentRef.setInput('label', 'Save');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-button-label').textContent).toContain('Save');
    });

    it('should emit onClick when clicked', () => {
        fixture.componentRef.setInput('label', 'Save');
        fixture.detectChanges();

        const spy = vi.fn();
        component.onClick.subscribe(spy);

        const button = fixture.debugElement.query(By.css('.cz-button-native')).nativeElement;
        button.click();

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not emit and should be disabled when disabled', () => {
        fixture.componentRef.setInput('label', 'Save');
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onClick.subscribe(spy);

        const button = fixture.debugElement.query(By.css('.cz-button-native')).nativeElement;
        expect(button.disabled).toBe(true);
        button.click();

        expect(spy).not.toHaveBeenCalled();
        expect(fixture.nativeElement.classList.contains('cz-button--disabled')).toBe(true);
    });

    it('should show a spinner and block clicks while loading', () => {
        fixture.componentRef.setInput('label', 'Save');
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onClick.subscribe(spy);

        expect(fixture.nativeElement.querySelector('.cz-button-spinner')).toBeTruthy();
        expect(fixture.debugElement.query(By.css('.cz-button-label'))).toBeTruthy();

        const button = fixture.debugElement.query(By.css('.cz-button-native')).nativeElement;
        button.click();

        expect(spy).not.toHaveBeenCalled();
        expect(fixture.nativeElement.classList.contains('cz-button--loading')).toBe(true);
    });

    it('should apply severity, variant and size as data attributes', () => {
        fixture.componentRef.setInput('severity', 'danger');
        fixture.componentRef.setInput('variant', 'outlined');
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.getAttribute('data-severity')).toBe('danger');
        expect(host.getAttribute('data-variant')).toBe('outlined');
        expect(host.getAttribute('data-size')).toBe('lg');
    });

    it('should render an icon on the left by default', () => {
        fixture.componentRef.setInput('label', 'Next');
        fixture.componentRef.setInput('icon', LucideCheck);
        fixture.detectChanges();

        const icon = fixture.nativeElement.querySelector('.cz-button-icon');
        expect(icon).toBeTruthy();

        const children = Array.from(
            fixture.debugElement.query(By.css('.cz-button-native')).nativeElement.children,
        ) as HTMLElement[];
        expect(children[0].classList.contains('cz-button-icon')).toBe(true);
    });

    it('should render an icon on the right when iconPos is right', () => {
        fixture.componentRef.setInput('label', 'Next');
        fixture.componentRef.setInput('icon', LucideChevronRight);
        fixture.componentRef.setInput('iconPos', 'right');
        fixture.detectChanges();

        const children = Array.from(
            fixture.debugElement.query(By.css('.cz-button-native')).nativeElement.children,
        ) as HTMLElement[];
        expect(children[children.length - 1].classList.contains('cz-button-icon')).toBe(true);
    });

    it('should apply rounded, raised and fluid modifiers', () => {
        fixture.componentRef.setInput('rounded', true);
        fixture.componentRef.setInput('raised', true);
        fixture.componentRef.setInput('fluid', true);
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('cz-button--rounded')).toBe(true);
        expect(host.classList.contains('cz-button--raised')).toBe(true);
        expect(host.classList.contains('cz-button--fluid')).toBe(true);
    });

    it('should apply the icon-only modifier when there is no label', () => {
        fixture.componentRef.setInput('icon', LucideCheck);
        fixture.detectChanges();

        expect(fixture.nativeElement.classList.contains('cz-button--icon-only')).toBe(true);
    });

    it('should forward the native type and aria-label', () => {
        fixture.componentRef.setInput('type', 'submit');
        fixture.componentRef.setInput('ariaLabel', 'Submit form');
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('.cz-button-native')).nativeElement as HTMLButtonElement;
        expect(button.getAttribute('type')).toBe('submit');
        expect(button.getAttribute('aria-label')).toBe('Submit form');
    });

    it('should apply the icon position attribute and render top/bottom icons', () => {
        fixture.componentRef.setInput('label', 'Search');
        fixture.componentRef.setInput('icon', LucideCheck);
        fixture.componentRef.setInput('iconPos', 'top');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('data-icon-pos')).toBe('top');
        expect(fixture.nativeElement.querySelector('.cz-button-icon')).toBeTruthy();
    });

    it('should render a badge inside the button', () => {
        fixture.componentRef.setInput('label', 'Emails');
        fixture.componentRef.setInput('badge', 2);
        fixture.componentRef.setInput('badgeSeverity', 'info');
        fixture.detectChanges();

        const badge = fixture.nativeElement.querySelector('.cz-button-badge');
        expect(badge).toBeTruthy();
        expect(badge.textContent).toContain('2');
    });

    it('should render the custom loading icon while loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.componentRef.setInput('loadingIcon', LucideCheck);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-button-icon--spin')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-button-spinner')).toBeNull();
    });

    it('should apply the styleClass to the native button', () => {
        fixture.componentRef.setInput('styleClass', 'my-button');
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('.cz-button-native')).nativeElement as HTMLButtonElement;
        expect(button.classList.contains('my-button')).toBe(true);
    });

    it('should emit onFocus and onBlur', () => {
        fixture.detectChanges();

        const focusSpy = vi.fn();
        const blurSpy = vi.fn();
        component.onFocus.subscribe(focusSpy);
        component.onBlur.subscribe(blurSpy);

        const button = fixture.debugElement.query(By.css('.cz-button-native')).nativeElement as HTMLButtonElement;
        button.dispatchEvent(new Event('focus'));
        button.dispatchEvent(new Event('blur'));

        expect(focusSpy).toHaveBeenCalled();
        expect(blurSpy).toHaveBeenCalled();
    });

    it('should support the link and plain variants', () => {
        fixture.componentRef.setInput('variant', 'link');
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).getAttribute('data-variant')).toBe('link');

        fixture.componentRef.setInput('variant', 'plain');
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).getAttribute('data-variant')).toBe('plain');
    });

    it('should render any projected icon or content and keep the normal padding', () => {
        const hostFixture = TestBed.createComponent(ProjectedContentHostComponent);
        hostFixture.detectChanges();

        const button = hostFixture.nativeElement.querySelector('.cz-button-native') as HTMLElement;
        expect(button.querySelector('svg[data-test-custom-icon]')).toBeTruthy();
        expect(button.textContent).toContain('Star');

        const host = hostFixture.nativeElement.querySelector('cz-button') as HTMLElement;
        expect(host.classList.contains('cz-button--icon-only')).toBe(false);
    });
});
