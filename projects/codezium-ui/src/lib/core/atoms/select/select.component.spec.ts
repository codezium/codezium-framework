import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzSelectComponent } from './select.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
  imports: [CzSelectComponent, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  `,
})
class TestHostComponent {
  options = [
    { name: 'Option 1', val: 1 },
    { name: 'Option 2', val: 2 },
    { name: 'Option 3', val: 3 },
  ];
  control = new FormControl<number | null>(null);
  label = 'Select Option';
  filterable = false;
  placeholder = 'Select one';
  clearable = false;
  optionLabel = 'name';
  optionValue = 'val';
}

@Component({
  imports: [CzSelectComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <cz-select [options]="options" optionLabel="name" optionValue="code">
      <ng-template #selectedItemTemplate let-option>
        @if (option) {
          <span class="custom-selected">{{ option.name }}</span>
        }
      </ng-template>
      <ng-template #itemTemplate let-option>
        <span class="custom-item">{{ option.name }}</span>
      </ng-template>
    </cz-select>
  `,
})
class SelectTemplateHostComponent {
  options = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
  ];
}

describe('CzSelectComponent', () => {
  let component: CzSelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(CzSelectComponent)).componentInstance;
    // Note: no initial detectChanges() here to prevent NG0100 when tests mutate inputs afterwards
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show placeholder when no value is selected', () => {
    fixture.detectChanges();
    const triggerLabel = fixture.debugElement.query(By.css('.cz-select-label')).nativeElement;
    expect(triggerLabel.textContent.trim()).toBe('Select one');
  });

  it('should open dropdown when clicking the trigger', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.cz-select-trigger')).nativeElement;
    trigger.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
    const panel = fixture.debugElement.query(By.css('.cz-select-panel'));
    expect(panel).toBeTruthy();
  });

  it('should select an option and update the form control', async () => {
    fixture.detectChanges();
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
    clearBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.value()).toBeNull();
    expect(hostComponent.control.value).toBeNull();
  });

  it('should open with ArrowDown and close with Escape', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.cz-select-trigger')).nativeElement;

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });

  it('should navigate options with arrows and select the hovered one with Enter', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.cz-select-trigger')).nativeElement;

    trigger.click();
    fixture.detectChanges();

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component.highlightedIndex()).toBe(0);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component.highlightedIndex()).toBe(1);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(component.value()).toBe(2);
    expect(component.isOpen()).toBe(false);
  });

  it('should show the localized error message when invalid and touched', () => {
    hostComponent.control.setValidators([() => ({ required: true })]);
    hostComponent.control.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.cz-input-error-text')).nativeElement;
    expect(error.textContent).toContain('Este campo es requerido.');
  });

  it('should disable through the form control', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    expect(component.actualDisabled()).toBe(true);
    expect(fixture.debugElement.query(By.css('.cz-input-disabled'))).toBeTruthy();
  });

  describe('Label positions', () => {
    let directFixture: ComponentFixture<CzSelectComponent>;
    let directComponent: CzSelectComponent;

    beforeEach(() => {
      directFixture = TestBed.createComponent(CzSelectComponent);
      directComponent = directFixture.componentInstance;
    });

    it('should render the static label for labelPosition none', () => {
      directFixture.componentRef.setInput('label', 'Static');
      directFixture.detectChanges();

      const label = directFixture.nativeElement.querySelector('.cz-input-label-static');
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Static');
    });

    it('should render over/in/float labels and the data attribute', () => {
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

      const wrapper = directFixture.nativeElement.querySelector('.cz-input-wrapper');
      expect(wrapper.getAttribute('data-label-position')).toBe('float');
    });

    it('should apply the overlay z-index to the panel and support none', () => {
      directFixture.componentRef.setInput('zIndex', 500);
      directComponent.toggleDropdown();
      directFixture.detectChanges();

      let panel = directFixture.nativeElement.querySelector('.cz-select-panel') as HTMLElement;
      expect(panel.style.zIndex).toBe('500');

      directFixture.componentRef.setInput('zIndex', 'none');
      directFixture.detectChanges();
      panel = directFixture.nativeElement.querySelector('.cz-select-panel') as HTMLElement;
      expect(panel.style.zIndex).toBe('auto');
    });


  describe('PrimeNG parity features', () => {
    let directFixture: ComponentFixture<CzSelectComponent>;
    let directComponent: CzSelectComponent;

    const cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];

    beforeEach(() => {
      directFixture = TestBed.createComponent(CzSelectComponent);
      directComponent = directFixture.componentInstance;
    });

    it('should select multiple options without closing the panel', () => {
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('optionLabel', 'name');
      directFixture.componentRef.setInput('optionValue', 'code');
      directFixture.componentRef.setInput('multiple', true);
      directFixture.detectChanges();

      directComponent.show();
      directFixture.detectChanges();

      const items = directFixture.nativeElement.querySelectorAll('.cz-select-item');
      items[0].click();
      items[1].click();
      directFixture.detectChanges();

      expect(directComponent.value()).toEqual(['NY', 'RM']);
      expect(directComponent.isOpen()).toBe(true);
    });

    it('should toggle an option off when clicking it again in multiple mode', () => {
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('optionLabel', 'name');
      directFixture.componentRef.setInput('optionValue', 'code');
      directFixture.componentRef.setInput('multiple', true);
      directComponent.writeValue(['NY']);
      directFixture.detectChanges();

      directComponent.show();
      directFixture.detectChanges();

      directFixture.nativeElement.querySelectorAll('.cz-select-item')[0].click();
      directFixture.detectChanges();

      expect(directComponent.value()).toEqual([]);
    });

    it('should render checkmark on selected options when checkmark is enabled', () => {
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('optionLabel', 'name');
      directFixture.componentRef.setInput('optionValue', 'code');
      directFixture.componentRef.setInput('checkmark', true);
      directComponent.writeValue('RM');
      directFixture.detectChanges();

      directComponent.show();
      directFixture.detectChanges();

      const selected = directFixture.nativeElement.querySelector('.cz-select-item-selected .cz-select-check');
      expect(selected).toBeTruthy();
    });

    it('should render grouped options with group labels', () => {
      directFixture.componentRef.setInput('options', [
        { label: 'Germany', items: [{ label: 'Berlin', value: 'Berlin' }, { label: 'Munich', value: 'Munich' }] },
        { label: 'USA', items: [{ label: 'Chicago', value: 'Chicago' }] },
      ]);
      directFixture.componentRef.setInput('group', true);
      directFixture.detectChanges();

      directComponent.show();
      directFixture.detectChanges();

      const groups = directFixture.nativeElement.querySelectorAll('.cz-select-group');
      expect(groups.length).toBe(2);
      expect(groups[0].textContent.trim()).toBe('Germany');
      expect(directFixture.nativeElement.querySelectorAll('.cz-select-item').length).toBe(3);
    });

    it('should not select disabled options', () => {
      directFixture.componentRef.setInput('options', [
        { name: 'A', code: 'A', disabled: true },
        { name: 'B', code: 'B' },
      ]);
      directFixture.componentRef.setInput('optionLabel', 'name');
      directFixture.componentRef.setInput('optionValue', 'code');
      directFixture.detectChanges();

      directComponent.show();
      directFixture.detectChanges();

      const items = directFixture.nativeElement.querySelectorAll('.cz-select-item');
      items[0].click();
      directFixture.detectChanges();
      expect(directComponent.value()).toBeNull();

      items[1].click();
      directFixture.detectChanges();
      expect(directComponent.value()).toBe('B');
    });

    it('should support optionDisabled as a function', () => {
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('optionValue', 'code');
      directFixture.componentRef.setInput('optionDisabled', (item: any) => item.code === 'RM');
      directFixture.detectChanges();

      expect(directComponent.isOptionDisabled(cities[1])).toBe(true);
      expect(directComponent.isOptionDisabled(cities[0])).toBe(false);
    });

    it('should apply filterMatchMode startsWith', () => {
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('optionLabel', 'name');
      directFixture.componentRef.setInput('filter', true);
      directFixture.componentRef.setInput('filterMatchMode', 'startsWith');
      directFixture.detectChanges();

      directComponent.filterValue.set('ro');
      expect(directComponent.filteredOptions().length).toBe(1);
      expect(directComponent.filteredOptions()[0].name).toBe('Rome');
    });

    it('should window options when virtualScroll is enabled', () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({ label: 'Item ' + i, value: i }));
      directFixture.componentRef.setInput('options', items);
      directFixture.componentRef.setInput('optionValue', 'value');
      directFixture.componentRef.setInput('virtualScroll', true);
      directFixture.componentRef.setInput('virtualScrollItemSize', 34);
      directFixture.detectChanges();

      expect(directComponent.visibleOptions().length).toBeLessThan(30);
      expect(directComponent.virtualOffsetAfter()).toBeGreaterThan(0);

      directComponent.panelScrollTop.set(3400);
      directFixture.detectChanges();
      expect(directComponent.virtualStart()).toBeGreaterThan(90);
      expect(directComponent.visibleOptions()[0].value).toBeGreaterThan(90);
    });

    it('should emit onLazyLoad when scrolling in lazy mode', () => {
      const spy = vi.fn();
      directComponent.onLazyLoadEvent.subscribe(spy);
      const items = Array.from({ length: 1000 }, (_, i) => ({ label: 'Item ' + i, value: i }));
      directFixture.componentRef.setInput('options', items);
      directFixture.componentRef.setInput('virtualScroll', true);
      directFixture.componentRef.setInput('lazy', true);
      directFixture.detectChanges();

      directComponent.onPanelScroll({ target: { scrollTop: 340 } } as any);
      expect(spy).toHaveBeenCalled();
      const payload = spy.mock.calls[0][0];
      expect(payload.first).toBeGreaterThanOrEqual(0);
      expect(payload.last).toBeGreaterThan(payload.first);
    });

    it('should emit onShow, onHide, onFilter and onClear outputs', () => {
      const showSpy = vi.fn();
      const hideSpy = vi.fn();
      const filterSpy = vi.fn();
      const clearSpy = vi.fn();
      directComponent.onShowEvent.subscribe(showSpy);
      directComponent.onHideEvent.subscribe(hideSpy);
      directComponent.onFilterEvent.subscribe(filterSpy);
      directComponent.onClearEvent.subscribe(clearSpy);
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('filter', true);
      directFixture.componentRef.setInput('showClear', true);
      directComponent.writeValue('NY');
      directFixture.detectChanges();

      directComponent.show();
      expect(showSpy).toHaveBeenCalledTimes(1);

      directComponent.onFilterInput({ target: { value: 'ro' } } as any);
      expect(filterSpy).toHaveBeenCalledTimes(1);

      directComponent.clear();
      expect(clearSpy).toHaveBeenCalledTimes(1);

      directComponent.hide();
      expect(hideSpy).toHaveBeenCalledTimes(1);
    });

    it('should set custom value when editable input has no matching option', () => {
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('optionLabel', 'name');
      directFixture.componentRef.setInput('editable', true);
      directFixture.detectChanges();

      directComponent.onEditableInput({ target: { value: 'Custom City' } } as any);
      directComponent.onEditableBlur(new Event('blur'));
      directFixture.detectChanges();

      expect(directComponent.value()).toBe('Custom City');
    });

    it('should select the matching option when editable text matches a label', () => {
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('optionLabel', 'name');
      directFixture.componentRef.setInput('optionValue', 'code');
      directFixture.componentRef.setInput('editable', true);
      directFixture.detectChanges();

      directComponent.onEditableInput({ target: { value: 'Rome' } } as any);
      directComponent.onEditableBlur(new Event('blur'));
      directFixture.detectChanges();

      expect(directComponent.value()).toBe('RM');
    });

    it('should expose combobox aria attributes', () => {
      directFixture.componentRef.setInput('options', cities);
      directFixture.componentRef.setInput('optionLabel', 'name');
      directFixture.componentRef.setInput('inputId', 'city-select');
      directFixture.detectChanges();

      const trigger = directFixture.nativeElement.querySelector('.cz-select-trigger');
      expect(trigger.getAttribute('role')).toBe('combobox');
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      directComponent.show();
      directFixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(trigger.getAttribute('aria-controls')).toBe('city-select-panel');

      const panel = directFixture.nativeElement.querySelector('.cz-select-panel');
      expect(panel.getAttribute('role')).toBe('listbox');
      expect(panel.getAttribute('id')).toBe('city-select-panel');

      const option = directFixture.nativeElement.querySelector('.cz-select-item');
      expect(option.getAttribute('role')).toBe('option');
      expect(option.getAttribute('aria-selected')).toBe('false');
    });

    it('should apply the invalid input class', () => {
      directFixture.componentRef.setInput('invalid', true);
      directFixture.detectChanges();
      expect(directFixture.nativeElement.querySelector('.cz-input-has-error')).toBeTruthy();
    });

    it('should render item and selectedItem templates', () => {
      const hostFixture = TestBed.createComponent(SelectTemplateHostComponent);
      hostFixture.detectChanges();

      const select = hostFixture.debugElement.query(By.directive(CzSelectComponent)).componentInstance as CzSelectComponent;
      select.writeValue('NY');
      select.show();
      hostFixture.detectChanges();

      expect(hostFixture.nativeElement.querySelector('.custom-selected').textContent).toContain('New York');
      const items = hostFixture.nativeElement.querySelectorAll('.custom-item');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toContain('New York');
    });
  });

    it('should hide the placeholder while the label occupies the center', () => {
      directFixture.componentRef.setInput('label', 'Country');
      directFixture.componentRef.setInput('labelPosition', 'float');
      directFixture.componentRef.setInput('placeholder', 'Pick one');
      directFixture.detectChanges();

      expect(directComponent.actualPlaceholder()).toBe('');

      directComponent.writeValue(1);
      directFixture.detectChanges();

      expect(directComponent.actualPlaceholder()).toBe('Pick one');
      const container = directFixture.nativeElement.querySelector('.cz-input-container');
      expect(container.classList.contains('cz-float-active')).toBe(true);
    });
  });
});
