import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzPasswordComponent } from './password.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';

@Component({
  standalone: true,
  imports: [CommonModule, CzPasswordComponent, ReactiveFormsModule],
  template: `
    <cz-password 
      [formControl]="control" 
      label="Password" 
      [feedback]="feedback()" 
      [toggleMask]="toggleMask()">
    </cz-password>
  `
})
class TestHostComponent {
  control = new FormControl('', [Validators.required, Validators.minLength(8)]);
  feedback = signal(true);
  toggleMask = signal(true);
}

describe('CzPasswordComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let component: CzPasswordComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, LucideAngularModule.pick({ Eye, EyeOff })]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(CzPasswordComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Masking Toggle', () => {
    it('should show password as masked by default', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('password');
    });

    it('should toggle password visibility when clicking the mask button', () => {
      const toggleBtn = fixture.debugElement.query(By.css('.cz-password-toggle'));
      const input = fixture.debugElement.query(By.css('input')).nativeElement;

      toggleBtn.nativeElement.click();
      fixture.detectChanges();
      expect(input.type).toBe('text');

      toggleBtn.nativeElement.click();
      fixture.detectChanges();
      expect(input.type).toBe('password');
    });

    it('should NOT show toggle button if toggleMask is false', () => {
      hostComponent.toggleMask.set(false);
      fixture.detectChanges();
      const toggleBtn = fixture.debugElement.query(By.css('.cz-password-toggle'));
      expect(toggleBtn).toBeNull();
    });
  });

  describe('Strength Meter (Feedback)', () => {
    it('should show strength meter only when focused and feedback is true', () => {
      const input = fixture.debugElement.query(By.css('input'));
      
      // Not focused, should not be visible
      expect(fixture.debugElement.query(By.css('.cz-password-panel'))).toBeNull();

      // Focusing
      input.nativeElement.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      
      // Panel should exist but might be hidden if no value
      const panel = fixture.debugElement.query(By.css('.cz-password-panel'));
      expect(panel).toBeTruthy();
    });

    it('should calculate strength score correctly', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = '123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // Very weak
      expect(component.strengthScore()).toBeLessThan(40);
      expect(component.strengthClass()).toBe('cz-strength-weak');

      input.value = 'Ab12345678!';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // Strong
      expect(component.strengthScore()).toBeGreaterThanOrEqual(80);
      expect(component.strengthClass()).toBe('cz-strength-strong');
    });
  });

  describe('Form Integration', () => {
    it('should update form control value when input changes', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.value = 'new-password';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(hostComponent.control.value).toBe('new-password');
    });

    it('should reflect form control status (invalid)', () => {
      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      
      // Mark as touched to trigger error display
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(hostComponent.control.invalid).toBe(true);
      const wrapper = fixture.debugElement.query(By.css('.cz-input-has-error'));
      expect(wrapper).toBeTruthy();
      
      const errorMsg = fixture.debugElement.query(By.css('.cz-input-error-text'));
      expect(errorMsg).toBeTruthy();
    });

    it('should handle disabled state from form control', () => {
      hostComponent.control.disable();
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBe(true);
      
      const wrapper = fixture.debugElement.query(By.css('.cz-input-disabled'));
      expect(wrapper).toBeTruthy();
    });
  });
});
