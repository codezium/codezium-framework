import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzInputTextComponent } from './input-text.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { CzValidationLocale } from '../../i18n';

@Component({
  imports: [CommonModule, CzInputTextComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <cz-input-text [formControl]="control" label="Email" labelPosition="float" [showErrors]="false">
      @if (control.invalid && control.touched) {
        <span czError class="custom-error">Custom Error!</span>
      }
    </cz-input-text>
  `,
})
class TestHostComponent {
  control = new FormControl('', [Validators.required, Validators.email]);
}

@Component({
  imports: [CzInputTextComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<cz-input-text [formControl]="control" [locale]="locale" label="Email" />`,
})
class AutoErrorHostComponent {
  control = new FormControl('', [Validators.required]);
  locale: CzValidationLocale = 'es';
}

describe('CzInputTextComponent & Reactive Forms', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, AutoErrorHostComponent],
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

  describe('Automatic validation & i18n', () => {
    it('should render the automatic localized error message (es)', () => {
      const errorFixture = TestBed.createComponent(AutoErrorHostComponent);
      errorFixture.componentInstance.control.markAsTouched();
      errorFixture.detectChanges();

      const errorText = errorFixture.debugElement.query(By.css('.cz-input-error-text')).nativeElement;
      expect(errorText.textContent).toContain('Este campo es requerido.');
    });

    it('should render the automatic error message in english', () => {
      const errorFixture = TestBed.createComponent(AutoErrorHostComponent);
      errorFixture.componentInstance.locale = 'en';
      errorFixture.componentInstance.control.markAsTouched();
      errorFixture.detectChanges();

      const errorText = errorFixture.debugElement.query(By.css('.cz-input-error-text')).nativeElement;
      expect(errorText.textContent).toContain('This field is required.');
    });

    it('should not show the error before the control is touched', () => {
      const errorFixture = TestBed.createComponent(AutoErrorHostComponent);
      errorFixture.detectChanges();

      expect(errorFixture.debugElement.query(By.css('.cz-input-error-text'))).toBeNull();
    });

    it('should disable the input from the form control', () => {
      const errorFixture = TestBed.createComponent(AutoErrorHostComponent);
      errorFixture.componentInstance.control.disable();
      errorFixture.detectChanges();

      const inputEl = errorFixture.debugElement.query(By.css('input')).nativeElement;
      expect(inputEl.disabled).toBe(true);
      expect(errorFixture.debugElement.query(By.css('.cz-input-disabled'))).toBeTruthy();
    });
  });

  describe('Label positions, sizes & states', () => {
    let directFixture: ComponentFixture<CzInputTextComponent>;
    let directComponent: CzInputTextComponent;

    beforeEach(() => {
      directFixture = TestBed.createComponent(CzInputTextComponent);
      directComponent = directFixture.componentInstance;
    });

    it('should render the static label for labelPosition none', () => {
      directFixture.componentRef.setInput('label', 'Static');
      directFixture.detectChanges();

      const label = directFixture.nativeElement.querySelector('.cz-input-label-static');
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Static');
    });

    it('should render over/in/float labels', () => {
      directFixture.componentRef.setInput('label', 'Field');
      directFixture.componentRef.setInput('labelPosition', 'over');
      directFixture.detectChanges();
      expect(directFixture.nativeElement.querySelector('.cz-input-label-over')).toBeTruthy();

      directFixture.componentRef.setInput('labelPosition', 'in');
      directFixture.detectChanges();
      expect(directFixture.nativeElement.querySelector('.cz-input-label-inner')).toBeTruthy();

      directFixture.componentRef.setInput('labelPosition', 'float');
      directFixture.detectChanges();
      expect(directFixture.nativeElement.querySelector('.cz-input-label-inner')).toBeTruthy();
    });

    it('should apply size attribute', () => {
      directFixture.componentRef.setInput('size', 'lg');
      directFixture.detectChanges();

      const wrapper = directFixture.nativeElement.querySelector('.cz-input-wrapper');
      expect(wrapper.getAttribute('data-size')).toBe('lg');
    });

    it('should apply filled and fluid classes', () => {
      directFixture.componentRef.setInput('filled', true);
      directFixture.componentRef.setInput('fluid', true);
      directFixture.detectChanges();

      const wrapper = directFixture.nativeElement.querySelector('.cz-input-wrapper');
      expect(wrapper.classList.contains('cz-input-filled')).toBe(true);
      expect(wrapper.classList.contains('cz-input-fluid')).toBe(true);
    });

    it('should hide the placeholder until the float label moves up', () => {
      directFixture.componentRef.setInput('label', 'Email');
      directFixture.componentRef.setInput('labelPosition', 'float');
      directFixture.componentRef.setInput('placeholder', 'Type here');
      directFixture.detectChanges();

      expect(directComponent.actualPlaceholder()).toBe('');

      directComponent.onFocus();
      directFixture.detectChanges();
      expect(directComponent.actualPlaceholder()).toBe('Type here');
      expect(directComponent.isFocused()).toBe(true);
    });
  });
});
