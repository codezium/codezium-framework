import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTextAreaComponent } from './textarea.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [CzTextAreaComponent, ReactiveFormsModule, FormsModule],
  template: `
    <cz-textarea
      [formControl]="control"
      [label]="label"
      [placeholder]="placeholder"
      [autoResize]="autoResize"
    ></cz-textarea>
  `
})
class TestHostComponent {
  control = new FormControl('');
  label = 'Test Label';
  placeholder = 'Test Placeholder';
  autoResize = false;
}

describe('CzTextAreaComponent', () => {
  let component: CzTextAreaComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ReactiveFormsModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(CzTextAreaComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value and notify form control on input', () => {
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
    const initialHeight = textarea.offsetHeight;
    
    textarea.value = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    // The height should change when adding many lines
    expect(textarea.offsetHeight).not.toBe(initialHeight);
  });
});
