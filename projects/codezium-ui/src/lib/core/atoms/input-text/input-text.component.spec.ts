import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzInputTextComponent } from './input-text.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

@Component({
    standalone: true,
    imports: [CommonModule, CzInputTextComponent, ReactiveFormsModule],
    template: `
      <cz-input-text [formControl]="control" label="Email" labelPosition="float" [showErrors]="false">
        <span czError class="custom-error" *ngIf="control.invalid && control.touched">Custom Error!</span>
      </cz-input-text>
    `
})
class TestHostComponent {
    control = new FormControl('', [Validators.required, Validators.email]);
}

describe('CzInputTextComponent & Reactive Forms', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create valid integration', () => {
        expect(hostComponent).toBeTruthy();
    });

    it('should reflect form invalid touched state with error messages', () => {
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        // Al principio no ha sido tocado, no debe mostrar error textual.
        expect(fixture.debugElement.query(By.css('.cz-input-error-text'))).toBeNull();

        // Tocamos y desenfocamos para ensuciarlo sin valor
        inputEl.dispatchEvent(new Event('focus'));
        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        // Ahora control tiene invalid && touched true
        expect(hostComponent.control.invalid).toBe(true);
        expect(hostComponent.control.touched).toBe(true);

        // Como showErrors=false, el interno no debería aparecer (suponiendo que su clase base no compila por `disabled`)
        const autoErrorText = fixture.debugElement.query(By.css('.cz-input-error-text'));
        expect(autoErrorText).toBeNull();

        // Pero el custon sí debería aparecer
        const customErrorText = fixture.debugElement.query(By.css('.custom-error')).nativeElement;
        expect(customErrorText.textContent).toContain('Custom Error!');
    });

    it('should update reactive form value when typing', () => {
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        inputEl.value = 'hola@codezium.com';
        inputEl.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(hostComponent.control.value).toBe('hola@codezium.com');
    });
});
