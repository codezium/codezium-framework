import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzIconComponent } from './icon.component';
import { LucideHome } from '@lucide/angular';

describe('CzIconComponent', () => {
    let component: CzIconComponent;
    let fixture: ComponentFixture<CzIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzIconComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CzIconComponent);
        component = fixture.componentInstance;

        // Proveemos el Input obligatorio (signal)
        fixture.componentRef.setInput('icon', LucideHome);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should compute initial sizes correctly', () => {
        // Por defecto es 24
        expect(component.actualSize()).toBe('24px');

        // Si cambiamos el input size a string
        fixture.componentRef.setInput('size', '1.5rem');
        fixture.detectChanges();

        expect(component.actualSize()).toBe('1.5rem');
    });

    it('should default to inherit color if no color provided', () => {
        expect(component.actualColor()).toBe('currentColor');

        // Con color explícito
        fixture.componentRef.setInput('color', 'red');
        fixture.detectChanges();

        expect(component.actualColor()).toBe('red');
    });

    it('should render the lucide svg element inside the template', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const lucideIcon = compiled.querySelector('svg');
        expect(lucideIcon).toBeTruthy();
    });
});
