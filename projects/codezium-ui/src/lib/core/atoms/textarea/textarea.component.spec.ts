import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTextAreaComponent } from './textarea.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CzValidationLocale } from '../../i18n';

@Component({
  imports: [CzTextAreaComponent, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <cz-textarea
      [formControl]="control"
      [label]="label"
      [placeholder]="placeholder"
      [autoResize]="autoResize"
      [locale]="locale"
    ></cz-textarea>
  `,
})
class TestHostComponent {
  control = new FormControl('');
  label = 'Test Label';
  placeholder = 'Test Placeholder';
  autoResize = false;
  locale: CzValidationLocale = 'es';
}

describe('CzTextAreaComponent', () => {
  let component: CzTextAreaComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(CzTextAreaComponent)).componentInstance;
    // Note: no initial detectChanges() here to prevent NG0100 when tests mutate inputs afterwards
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update value and notify form control on input', () => {
    fixture.detectChanges();
    const textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
    textarea.value = 'Hello World';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('Hello World');
    expect(hostComponent.control.value).toBe('Hello World');
  });

  it('should update textarea value from form control', () => {
    hostComponent.control.setValue('Initial Value');
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
    expect(textarea.value).toBe('Initial Value');
  });

  it('should show validation error when invalid and touched', () => {
    hostComponent.control.setValidators([() => ({ required: true })]);
    hostComponent.control.markAsTouched();
    hostComponent.control.updateValueAndValidity();
    fixture.detectChanges();

    expect(component.isInvalid).toBe(true);
    const errorText = fixture.debugElement.query(By.css('.cz-input-error-text'));
    expect(errorText).toBeTruthy();
  });

  it('should resize when autoResize is true and value changes', async () => {
    hostComponent.autoResize = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;

    // jsdom has no layout: mock scrollHeight so resize() can be asserted
    Object.defineProperty(textarea, 'scrollHeight', { value: 120, configurable: true });

    textarea.value = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    // resize() sets height = `${scrollHeight}px`
    expect(textarea.style.height).toBe('120px');
  });

  it('should apply rows and size inputs', () => {
    const directFixture = TestBed.createComponent(CzTextAreaComponent);
    directFixture.componentRef.setInput('rows', 6);
    directFixture.componentRef.setInput('size', 'lg');
    directFixture.detectChanges();

    const textarea = directFixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('rows')).toBe('6');

    const wrapper = directFixture.nativeElement.querySelector('.cz-input-wrapper');
    expect(wrapper.getAttribute('data-size')).toBe('lg');
  });

  it('should disable the textarea through the form control', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
    expect(textarea.disabled).toBe(true);
    expect(fixture.debugElement.query(By.css('.cz-input-disabled'))).toBeTruthy();
  });

  it('should show the localized error message in spanish', () => {
    hostComponent.control.setValidators([() => ({ required: true })]);
    hostComponent.control.markAsTouched();
    fixture.detectChanges();

    const errorText = fixture.debugElement.query(By.css('.cz-input-error-text')).nativeElement;
    expect(errorText.textContent).toContain('Este campo es requerido.');
  });

  it('should show the localized error message in english', () => {
    hostComponent.locale = 'en';
    hostComponent.control.setValidators([() => ({ required: true })]);
    hostComponent.control.markAsTouched();
    fixture.detectChanges();

    const errorText = fixture.debugElement.query(By.css('.cz-input-error-text')).nativeElement;
    expect(errorText.textContent).toContain('This field is required.');
  });
});
