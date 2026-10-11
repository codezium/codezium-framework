import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    beforeEach(() => {
        TestBed.resetTestingModule();
        localStorage.clear();
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
    });

    afterEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
    });

    it('should default to dark mode when no preference is saved', () => {
        TestBed.inject(ThemeService);

        expect(document.documentElement.classList.contains('dark')).toBe(true);
        // The theme is scoped to the docs content area, never applied to <html>
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });

    it('should keep the selected theme in the service only (scoped at content level)', () => {
        const service = TestBed.inject(ThemeService);

        service.setTheme('glass');
        expect(service.currentTheme()).toBe('glass');
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();
        expect(localStorage.getItem('cz-theme')).toBe('glass');
    });

    it('should respect a saved light preference', () => {
        localStorage.setItem('cz-docs-dark', 'false');
        TestBed.inject(ThemeService);

        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should persist dark mode toggles', () => {
        const service = TestBed.inject(ThemeService);

        service.toggleDarkMode();
        expect(service.isDark()).toBe(false);
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('cz-docs-dark')).toBe('false');

        service.toggleDarkMode();
        expect(service.isDark()).toBe(true);
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('cz-docs-dark')).toBe('true');
    });
});
