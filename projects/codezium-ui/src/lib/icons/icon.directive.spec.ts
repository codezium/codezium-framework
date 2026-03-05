import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzIconDirective } from './icon.directive';
import { Home } from 'lucide-angular';
import { By } from '@angular/platform-browser';

@Component({
    standalone: true,
    imports: [CzIconDirective],
    template: `
    <button id="btn-left" [czIcon]="HomeIcon">Aceptar</button>
    <button id="btn-right" [czIcon]="HomeIcon" czIconPosition="right" czIconSize="30">Cancelar</button>
  `
})
class TestHostComponent {
    HomeIcon = Home;
}

describe('CzIconDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges(); // Ejecuta ngOnInit y ngOnChanges
    });

    it('should inject cz-icon to the left by default', () => {
        const btnLeft = fixture.debugElement.query(By.css('#btn-left')).nativeElement as HTMLElement;

        // Verificamos que se inyectó el componente cz-icon
        const iconWrapper = btnLeft.querySelector('cz-icon');
        expect(iconWrapper).toBeTruthy();

        // Verificamos que se inyectó el span gap
        const spanGap = btnLeft.querySelector('span');
        expect(spanGap).toBeTruthy();

        // Comprobamos el orden: cz-icon -> span gap -> text
        const firstChild = btnLeft.firstChild as HTMLElement;
        expect(firstChild.tagName.toLowerCase()).toBe('cz-icon');
    });

    it('should inject cz-icon to the right when requested', () => {
        const btnRight = fixture.debugElement.query(By.css('#btn-right')).nativeElement as HTMLElement;

        const iconWrapper = btnRight.querySelector('cz-icon');
        expect(iconWrapper).toBeTruthy();

        // En 'right', el icono debe ser el último hijo
        const lastChild = btnRight.lastChild as HTMLElement;
        // Si el texto cuenta como nodo de texto, el querySelectorAll lo confirma mejor
        const children = Array.from(btnRight.children);
        expect(children[children.length - 1].tagName.toLowerCase()).toBe('cz-icon');
    });
});
