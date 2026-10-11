import { TestBed } from '@angular/core/testing';
import { DocsTocComponent, type TocSection } from './docs-toc';
import { LanguageService } from '../../core/services/language.service';

describe('DocsTocComponent', () => {
    const sections: TocSection[] = [
        { id: 'import', label: 'Import', level: 2 },
        { id: 'api', label: 'API Reference', level: 2 },
        { id: 'detail', label: 'Detail', level: 3 },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocsTocComponent],
        }).compileComponents();

        TestBed.inject(LanguageService).setLanguage('en');
    });

    it('should render one link per section with the translated title', () => {
        const fixture = TestBed.createComponent(DocsTocComponent);
        fixture.componentRef.setInput('sections', sections);
        fixture.detectChanges();

        const links = fixture.nativeElement.querySelectorAll('.docs-toc__link');
        expect(links.length).toBe(3);
        expect(links[0].textContent).toContain('Import');
        expect(fixture.nativeElement.querySelector('.docs-toc__title').textContent).toContain(
            'On this page',
        );
    });

    it('should hide the title and list when there are no sections', () => {
        const fixture = TestBed.createComponent(DocsTocComponent);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.docs-toc__title')).toBeNull();
        expect(fixture.nativeElement.querySelector('.docs-toc__list')).toBeNull();
    });

    it('should mark the active section', () => {
        const fixture = TestBed.createComponent(DocsTocComponent);
        fixture.componentRef.setInput('sections', sections);
        fixture.componentRef.setInput('activeId', 'api');
        fixture.detectChanges();

        const active = fixture.nativeElement.querySelector('.docs-toc__link--active');
        expect(active).toBeTruthy();
        expect(active.textContent).toContain('API Reference');
    });

    it('should translate the title according to the language', () => {
        const fixture = TestBed.createComponent(DocsTocComponent);
        fixture.componentRef.setInput('sections', sections);
        TestBed.inject(LanguageService).setLanguage('es');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.docs-toc__title').textContent).toContain(
            'En esta página',
        );

        TestBed.inject(LanguageService).setLanguage('en');
    });

    it('should scroll to the section element when a link is clicked', () => {
        const fixture = TestBed.createComponent(DocsTocComponent);
        fixture.componentRef.setInput('sections', sections);
        fixture.detectChanges();

        const target = document.createElement('h2');
        target.id = 'import';
        target.scrollIntoView = vi.fn();
        document.body.appendChild(target);

        fixture.nativeElement.querySelector('.docs-toc__link').click();

        expect(target.scrollIntoView).toHaveBeenCalled();
        target.remove();
    });
});
