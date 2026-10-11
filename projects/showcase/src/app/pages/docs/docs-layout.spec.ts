import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DocsLayoutPage } from './docs-layout';

describe('DocsLayoutPage — TOC', () => {
    let fixture: ComponentFixture<DocsLayoutPage>;
    let component: DocsLayoutPage;

    beforeAll(() => {
        if (typeof globalThis.requestAnimationFrame !== 'function') {
            (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) =>
                setTimeout(cb, 16) as unknown as number;
        }
        (globalThis as any).IntersectionObserver = class {
            observe(): void {}
            unobserve(): void {}
            disconnect(): void {}
        };
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocsLayoutPage],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(DocsLayoutPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function main(): HTMLElement {
        return fixture.nativeElement.querySelector('#main-content') as HTMLElement;
    }

    function build(): void {
        (component as any).buildToc();
    }

    it('should build sections from h2/h3 headings with labels and levels', () => {
        main().innerHTML = `
            <h2 id="import">Import</h2>
            <h2 id="api">API Reference</h2>
            <h3 id="detail">Detail</h3>
        `;
        build();

        const sections = component.tocSections();
        expect(sections.map(s => s.id)).toEqual(['import', 'api', 'detail']);
        expect(sections.map(s => s.label)).toEqual(['Import', 'API Reference', 'Detail']);
        expect(sections.map(s => s.level)).toEqual([2, 2, 3]);
    });

    it('should generate slug ids for headings without id', () => {
        main().innerHTML = `<h2>Getting Started!</h2>`;
        build();

        const sections = component.tocSections();
        expect(sections[0].id).toBe('getting-started');
        expect(main().querySelector('h2')?.id).toBe('getting-started');
    });

    it('should deduplicate duplicate ids', () => {
        main().innerHTML = `<h2 id="same">One</h2><h2 id="same">Two</h2>`;
        build();

        expect(component.tocSections().map(s => s.id)).toEqual(['same', 'same-2']);
    });

    it('should clear sections when the page has no headings', () => {
        main().innerHTML = '';
        build();

        expect(component.tocSections().length).toBe(0);
        expect(component.tocActiveId()).toBe('');
    });
});
