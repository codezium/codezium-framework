import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSelectComponent } from './select.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronDown, Check, X } from 'lucide-angular';
import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [CzSelectComponent, ReactiveFormsModule, FormsModule],
  template: `
    <cz-select
      [options]="options"
      [formControl]="control"
      [label]="label"
      [filterable]="filterable"
      [placeholder]="placeholder"
      [clearable]="clearable"
      [optionLabel]="optionLabel"
      [optionValue]="optionValue"
    ></cz-select>
  `
})
class TestHostComponent {
  options = [
    { name: 'Option 1', val: 1 },
    { name: 'Option 2', val: 2 },
    { name: 'Option 3', val: 3 }
  ];
  control = new FormControl<number | null>(null);
  label = 'Select Option';
  filterable = false;
  placeholder = 'Select one';
  clearable = false;
  optionLabel = 'name';
  optionValue = 'val';
}

describe('CzSelectComponent', () => {
  let component: CzSelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent, 
        ReactiveFormsModule,
        FormsModule,
        LucideAngularModule.pick({ ChevronDown, Check, X })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(CzSelectComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show placeholder when no value is selected', () => {
    const triggerLabel = fixture.debugElement.query(By.css('.cz-select-label')).nativeElement;
    expect(triggerLabel.textContent.trim()).toBe('Select one');
  });

  it('should open dropdown when clicking the trigger', () => {
    const trigger = fixture.debugElement.query(By.css('.cz-select-trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
    const panel = fixture.debugElement.query(By.css('.cz-select-panel'));
    expect(panel).toBeTruthy();
  });

  it('should select an option and update the form control', async () => {
    const trigger = fixture.debugElement.query(By.css('.cz-select-trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.cz-select-item'));
    items[1].nativeElement.click(); // Select "Option 2"
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.value()).toBe(2);
    expect(hostComponent.control.value).toBe(2);
    expect(component.isOpen()).toBe(false);
    
    const label = fixture.debugElement.query(By.css('.cz-select-label')).nativeElement;
    expect(label.textContent.trim()).toBe('Option 2');
  });

  it('should filter options when filtering is enabled', async () => {
    hostComponent.filterable = true;
    fixture.detectChanges();

    const trigger = fixture.debugElement.query(By.css('.cz-select-trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    const filterInput = fixture.debugElement.query(By.css('.cz-select-filter-input')).nativeElement;
    filterInput.value = 'Option 1';
    filterInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    const items = fixture.debugElement.queryAll(By.css('.cz-select-item'));
    expect(items.length).toBe(1);
    expect(items[0].nativeElement.textContent.trim()).toBe('Option 1');
  });

  it('should handle disabled state', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const trigger = fixture.debugElement.query(By.css('.cz-select-trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
    expect(fixture.debugElement.query(By.css('.cz-input-disabled'))).toBeTruthy();
  });

  it('should clear selection when clear button is clicked', async () => {
    hostComponent.clearable = true;
    hostComponent.control.setValue(1);
    fixture.detectChanges();

    const clearBtn = fixture.debugElement.query(By.css('.cz-select-clear')).nativeElement;
    clearBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.value()).toBeNull();
    expect(hostComponent.control.value).toBeNull();
  });
});
