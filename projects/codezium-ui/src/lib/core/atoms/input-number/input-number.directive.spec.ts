import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CzInputNumberDirective } from './input-number.directive';

@Component({
  template: `
    <input 
      czInputNumber 
      [formControl]="ctrl" 
      [mode]="mode" 
      [locale]="locale" 
      [currency]="currency"
      [min]="min"
      [max]="max"
      [minFractionDigits]="minFraction"
      [maxFractionDigits]="maxFraction"
      [prefix]="prefix"
      [suffix]="suffix"
    />
  `,
  imports: [CzInputNumberDirective, ReactiveFormsModule],
  standalone: true
})
class TestHostComponent {
  ctrl = new FormControl<number | null>(null);
  mode: 'decimal' | 'currency' = 'decimal';
  locale = 'en-US';
  currency = 'USD';
  min?: number;
  max?: number;
  minFraction = 2;
  maxFraction = 2;
  prefix = '';
  suffix = '';
}

describe('CzInputNumberDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CzInputNumberDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement.query(By.directive(CzInputNumberDirective));
    inputEl = debugEl.nativeElement;
    // Removing the initial detectChanges() here to prevent NG0100 downstream when changing inputs
  });

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Formatting (Model -> View)', () => {
    it('should format numbers with grouping decimals', () => {
      fixture.detectChanges();
      component.ctrl.setValue(1234.56);
      fixture.detectChanges();
      
      expect(inputEl.value).toBe('1,234.56');
    });

    it('should respect min and max fraction digits', () => {
      component.minFraction = 0;
      component.maxFraction = 0;
      fixture.detectChanges();

      component.ctrl.setValue(1234);
      fixture.detectChanges();
      
      expect(inputEl.value).toBe('1,234');
    });

    it('should format currency correctly (USD)', () => {
      component.mode = 'currency';
      fixture.detectChanges();

      component.ctrl.setValue(1234.56);
      fixture.detectChanges();
      
      // Note: Intl formatting adds non-breaking spaces or specific characters sometimes, 
      // replace them for strict comparisons or use includes.
      expect(inputEl.value.replace(/\\s/g, '').replace(/\\u00A0/g, '')).toContain('$1,234.56');
    });

    it('should format currency correctly (EUR in Germany)', () => {
      component.mode = 'currency';
      component.locale = 'de-DE';
      component.currency = 'EUR';
      fixture.detectChanges();

      component.ctrl.setValue(1234.56);
      fixture.detectChanges();
      
      expect(inputEl.value.replace(/\\s/g, '').replace(/\\u00A0/g, '')).toContain('1.234,56');
    });

    it('should append custom prefix and suffix in decimal mode', () => {
      component.prefix = 'Wt. ';
      component.suffix = ' kg';
      fixture.detectChanges();

      component.ctrl.setValue(15.5);
      fixture.detectChanges();

      expect(inputEl.value).toBe('Wt. 15.50 kg');
    });
  });

  describe('Parsing (View -> Model)', () => {
    it('should strip visual formatting and parse into a strict number', () => {
      fixture.detectChanges();
      // Simulate user typing '$1,234.56'
      inputEl.value = '$1,234.56';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.ctrl.value).toBe(1234.56);
    });

    it('should allow negative numbers', () => {
      fixture.detectChanges();
      inputEl.value = '-42.5';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.ctrl.value).toBe(-42.5);
    });

    it('should become null if totally empty/invalid', () => {
      fixture.detectChanges();
      inputEl.value = 'abc';
      inputEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.ctrl.value).toBeNull();
    });
  });

  describe('Boundaries (Min/Max)', () => {
    it('should cap out at the maximum value ON BLUR', async () => {
      component.max = 100;
      fixture.detectChanges();

      // User types 150
      inputEl.value = '150';
      inputEl.dispatchEvent(new Event('input'));
      
      // Value is temporarily 150 while typing
      expect(component.ctrl.value).toBe(150);

      // User leaves the input
      inputEl.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      fixture.detectChanges();

      // Form Control corrects to 100
      expect(component.ctrl.value).toBe(100);
      // View corrects to 100.00 max fraction digits limits
      expect(inputEl.value).toBe('100.00');
    });

    it('should bottom out at the minimum value ON BLUR', async () => {
      component.min = 10;
      fixture.detectChanges();

      // User types 5
      inputEl.value = '5';
      inputEl.dispatchEvent(new Event('input'));
      
      expect(component.ctrl.value).toBe(5);

      // User leaves the input
      inputEl.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.ctrl.value).toBe(10);
      expect(inputEl.value).toBe('10.00');
    });
  });
});
