import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzMultiSelectComponent } from './multiselect.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
  imports: [CzMultiSelectComponent, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <cz-multiselect
      [options]="options()"
      [formControl]="control"
      optionLabel="name"
      optionValue="code"
      [maxSelectedLabels]="3"
      [filter]="filter()"
      [showClear]="showClear()"
      [selectionLimit]="selectionLimit()"
      [display]="display()"
      [selectedItemsLabel]="selectedItemsLabel()"
      [group]="group()"
      [virtualScroll]="virtualScroll()"
      [virtualScrollItemSize]="virtualScrollItemSize()"
      [lazy]="lazy()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [invalid]="invalid()"
      [selectAll]="selectAll()"
      [inputId]="inputId()"
      [resetFilterOnHide]="resetFilterOnHide()"
      placeholder="Select Cities"
    ></cz-multiselect>
  `,
})
class MultiSelectHostComponent {
  options = signal<any[]>([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ]);
  control = new FormControl<string[] | null>([]);
  filter = signal(false);
  showClear = signal(false);
  selectionLimit = signal<number | undefined>(undefined);
  display = signal<'comma' | 'chip'>('comma');
  selectedItemsLabel = signal('{0} items selected');
  group = signal(false);
  virtualScroll = signal(false);
  virtualScrollItemSize = signal(34);
  lazy = signal(false);
  readonly = signal(false);
  disabled = signal(false);
  invalid = signal(false);
  selectAll = signal<boolean | null>(null);
  inputId = signal('');
  resetFilterOnHide = signal(false);
}

@Component({
  imports: [CzMultiSelectComponent, FormsModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <cz-multiselect [options]="options" optionLabel="name" optionValue="code">
      <ng-template #itemTemplate let-option>
        <span class="custom-item">{{ option.name }}</span>
      </ng-template>
      <ng-template #selectedItemsTemplate let-selected>
        <span class="custom-selected">{{ selected.length }} selected</span>
      </ng-template>
    </cz-multiselect>
  `,
})
class MultiSelectTemplateHostComponent {
  options = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
  ];
}

describe('CzMultiSelectComponent', () => {
  let fixture: ComponentFixture<MultiSelectHostComponent>;
  let host: MultiSelectHostComponent;
  let component: CzMultiSelectComponent;

  const cities = () => [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectHostComponent, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectHostComponent);
    host = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(CzMultiSelectComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show placeholder when no value is selected', () => {
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.cz-multiselect-label')).nativeElement;
    expect(label.textContent.trim()).toBe('Select Cities');
  });

  it('should open the panel on trigger click and render options with checkboxes', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.cz-multiselect-trigger')).nativeElement.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
    const items = fixture.debugElement.queryAll(By.css('.cz-multiselect-item'));
    expect(items.length).toBe(5);
    expect(fixture.debugElement.queryAll(By.css('.cz-multiselect-option-checkbox')).length).toBe(5);
  });

  it('should toggle options on click and keep the panel open', () => {
    fixture.detectChanges();
    component.show();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.cz-multiselect-item'));
    items[0].nativeElement.click();
    items[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.value()).toEqual(['NY', 'RM']);
    expect(host.control.value).toEqual(['NY', 'RM']);
    expect(component.isOpen()).toBe(true);

    items[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.value()).toEqual(['RM']);
  });

  it('should emit onRemove when an option is deselected', () => {
    const spy = vi.fn();
    component.onRemoveEvent.subscribe(spy);
    host.control.setValue(['NY']);
    fixture.detectChanges();

    component.show();
    fixture.detectChanges();
    fixture.debugElement.queryAll(By.css('.cz-multiselect-item'))[0].nativeElement.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].value).toBe('NY');
  });

  it('should select and clear all through the header checkbox', () => {
    fixture.detectChanges();
    component.show();
    fixture.detectChanges();

    const headerCheckbox = fixture.debugElement.query(By.css('.cz-multiselect-toggle-all cz-checkbox input'));
    expect(headerCheckbox).toBeTruthy();

    component.onToggleAll(new Event('change'), true);
    fixture.detectChanges();
    expect(component.value()).toEqual(['NY', 'RM', 'LDN', 'IST', 'PRS']);
    expect(component.allSelected()).toBe(true);

    component.onToggleAll(new Event('change'), false);
    fixture.detectChanges();
    expect(component.value()).toEqual([]);
  });

  it('should report partial selection for the indeterminate header state', () => {
    host.control.setValue(['NY']);
    fixture.detectChanges();

    expect(component.partialSelected()).toBe(true);
    expect(component.allSelected()).toBe(false);

    host.control.setValue(['NY', 'RM', 'LDN', 'IST', 'PRS']);
    fixture.detectChanges();
    expect(component.partialSelected()).toBe(false);
    expect(component.allSelected()).toBe(true);
  });

  it('should delegate select-all to onSelectAllChange when selectAll is bound', () => {
    const spy = vi.fn();
    component.onSelectAllChangeEvent.subscribe(spy);
    host.selectAll.set(false);
    fixture.detectChanges();

    component.onToggleAll(new Event('change'), true);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].checked).toBe(true);
    expect(component.value()).toEqual([]);
  });

  it('should respect selectionLimit', () => {
    host.selectionLimit.set(2);
    fixture.detectChanges();

    component.show();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.cz-multiselect-item'));
    items[0].nativeElement.click();
    items[1].nativeElement.click();
    items[2].nativeElement.click();
    fixture.detectChanges();

    expect(component.value()).toEqual(['NY', 'RM']);
    expect(component.isOptionDisabled(host.options()[2])).toBe(true);
  });

  it('should show the overflow message when maxSelectedLabels is exceeded', () => {
    host.control.setValue(['NY', 'RM', 'LDN', 'IST']);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.cz-multiselect-label')).nativeElement;
    expect(label.textContent.trim()).toBe('4 items selected');
  });

  it('should support a custom selectedItemsLabel pattern', () => {
    host.selectedItemsLabel.set('({0}) selected');
    host.control.setValue(['NY', 'RM', 'LDN', 'IST']);
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.cz-multiselect-label')).nativeElement;
    expect(label.textContent.trim()).toBe('(4) selected');
  });

  it('should display chips and remove them with the chip icon', () => {
    host.display.set('chip');
    host.control.setValue(['NY', 'RM']);
    fixture.detectChanges();

    const chips = fixture.debugElement.queryAll(By.css('.cz-multiselect-chip'));
    expect(chips.length).toBe(2);
    expect(chips[0].nativeElement.textContent).toContain('New York');

    const remove = fixture.debugElement.query(By.css('.cz-multiselect-chip-remove'));
    remove.nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(component.value()).toEqual(['RM']);
  });

  it('should show only the count token when exceeding maxSelectedLabels in chip mode', () => {
    host.display.set('chip');
    host.control.setValue(['NY', 'RM', 'LDN', 'IST']);
    fixture.detectChanges();

    const overflow = fixture.debugElement.query(By.css('.cz-multiselect-chip--overflow'));
    expect(overflow).toBeTruthy();
    expect(overflow.nativeElement.textContent.trim()).toBe('4 items selected');
    expect(fixture.debugElement.queryAll(By.css('.cz-multiselect-chip:not(.cz-multiselect-chip--overflow)')).length).toBe(0);
  });

  it('should clear the value with showClear', () => {
    host.showClear.set(true);
    host.control.setValue(['NY']);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.cz-multiselect-clear')).nativeElement.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    fixture.detectChanges();

    expect(component.value()).toEqual([]);
  });

  it('should filter options', () => {
    host.filter.set(true);
    fixture.detectChanges();
    component.show();
    fixture.detectChanges();

    component.onFilterInput({ target: { value: 'rom' } } as any);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.cz-multiselect-item'));
    expect(items.length).toBe(1);
    expect(items[0].nativeElement.textContent).toContain('Rome');
  });

  it('should render grouped options', () => {
    host.options.set([
      { label: 'Germany', items: [{ label: 'Berlin', value: 'Berlin' }, { label: 'Munich', value: 'Munich' }] },
      { label: 'USA', items: [{ label: 'Chicago', value: 'Chicago' }] },
    ]);
    host.group.set(true);
    fixture.detectChanges();

    component.show();
    fixture.detectChanges();

    const groups = fixture.debugElement.queryAll(By.css('.cz-multiselect-group'));
    expect(groups.length).toBe(2);
    expect(groups[0].nativeElement.textContent.trim()).toBe('Germany');
    expect(fixture.debugElement.queryAll(By.css('.cz-multiselect-item')).length).toBe(3);
  });

  it('should window options with virtualScroll', () => {
    host.options.set(Array.from({ length: 1000 }, (_, i) => ({ label: 'Item ' + i, value: i })));
    host.virtualScroll.set(true);
    host.virtualScrollItemSize.set(34);
    fixture.detectChanges();

    expect(component.visibleOptions().length).toBeLessThan(30);
    component.panelScrollTop.set(3400);
    fixture.detectChanges();
    expect(component.visibleOptions()[0].value).toBeGreaterThan(90);
  });

  it('should emit onLazyLoad when scrolling in lazy mode', () => {
    const spy = vi.fn();
    component.onLazyLoadEvent.subscribe(spy);
    host.options.set(Array.from({ length: 1000 }, (_, i) => ({ label: 'Item ' + i, value: i })));
    host.virtualScroll.set(true);
    host.lazy.set(true);
    fixture.detectChanges();

    component.onPanelScroll({ target: { scrollTop: 340 } } as any);
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].last).toBeGreaterThan(spy.mock.calls[0][0].first);
  });

  it('should not toggle options when readonly or disabled', () => {
    host.readonly.set(true);
    host.control.setValue(['NY']);
    fixture.detectChanges();

    component.show();
    fixture.detectChanges();
    fixture.debugElement.queryAll(By.css('.cz-multiselect-item'))[1].nativeElement.click();
    fixture.detectChanges();
    expect(component.value()).toEqual(['NY']);

    host.readonly.set(false);
    host.disabled.set(true);
    fixture.detectChanges();
    component.toggleOption(host.options()[1]);
    expect(component.value()).toEqual(['NY']);
  });

  it('should integrate with Angular forms', async () => {
    fixture.detectChanges();
    host.control.setValue(['LDN']);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.value()).toEqual(['LDN']);
    expect(fixture.debugElement.query(By.css('.cz-multiselect-label')).nativeElement.textContent).toContain('London');
  });

  it('should navigate with keyboard and toggle the highlighted option with Enter', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.cz-multiselect-trigger')).nativeElement;

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component.highlightedIndex()).toBe(0);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(component.value()).toEqual(['NY']);
  });

  it('should remove the last value with Backspace', () => {
    host.control.setValue(['NY', 'RM']);
    fixture.detectChanges();
    component.show();
    fixture.detectChanges();

    const trigger = fixture.debugElement.query(By.css('.cz-multiselect-trigger')).nativeElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(component.value()).toEqual(['NY']);
  });

  it('should expose aria attributes for combobox and listbox', () => {
    host.inputId.set('ms-cities');
    fixture.detectChanges();
    component.show();
    fixture.detectChanges();

    const trigger = fixture.debugElement.query(By.css('.cz-multiselect-trigger'));
    expect(trigger.nativeElement.getAttribute('role')).toBe('combobox');
    expect(trigger.nativeElement.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.nativeElement.getAttribute('aria-controls')).toBe('ms-cities-panel');

    const panel = fixture.debugElement.query(By.css('.cz-multiselect-panel'));
    expect(panel.nativeElement.getAttribute('role')).toBe('listbox');
    expect(panel.nativeElement.getAttribute('aria-multiselectable')).toBe('true');

    const option = fixture.debugElement.query(By.css('.cz-multiselect-item'));
    expect(option.nativeElement.getAttribute('role')).toBe('option');
    expect(option.nativeElement.getAttribute('aria-selected')).toBe('false');
  });

  it('should render item and selectedItems templates', () => {
    const hostFixture = TestBed.createComponent(MultiSelectTemplateHostComponent);
    hostFixture.detectChanges();

    const ms = hostFixture.debugElement.query(By.directive(CzMultiSelectComponent)).componentInstance as CzMultiSelectComponent;
    ms.writeValue(['NY']);
    ms.show();
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.querySelector('.custom-selected').textContent).toContain('1 selected');
    expect(hostFixture.nativeElement.querySelectorAll('.custom-item').length).toBe(2);
  });

  it('should emit onPanelShow, onPanelHide, onFilter, onClear and onChange', () => {
    const showSpy = vi.fn();
    const hideSpy = vi.fn();
    const filterSpy = vi.fn();
    const clearSpy = vi.fn();
    const changeSpy = vi.fn();
    component.onPanelShowEvent.subscribe(showSpy);
    component.onPanelHideEvent.subscribe(hideSpy);
    component.onFilterEvent.subscribe(filterSpy);
    component.onClearEvent.subscribe(clearSpy);
    component.onChangeEvent.subscribe(changeSpy);
    host.filter.set(true);
    host.showClear.set(true);
    fixture.detectChanges();

    component.show();
    expect(showSpy).toHaveBeenCalledTimes(1);

    component.onFilterInput({ target: { value: 'ro' } } as any);
    expect(filterSpy).toHaveBeenCalledTimes(1);

    component.toggleOption(host.options()[1]);
    expect(changeSpy).toHaveBeenCalledTimes(1);

    component.clear();
    expect(clearSpy).toHaveBeenCalledTimes(1);

    component.hide();
    expect(hideSpy).toHaveBeenCalledTimes(1);
  });

  it('should apply the invalid class from the invalid input', () => {
    host.invalid.set(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.cz-input-has-error'))).toBeTruthy();
  });

  it('should reset the filter on hide when enabled', () => {
    host.filter.set(true);
    host.resetFilterOnHide.set(true);
    fixture.detectChanges();

    component.show();
    component.onFilterInput({ target: { value: 'ro' } } as any);
    expect(component.filterValue()).toBe('ro');

    component.hide();
    expect(component.filterValue()).toBe('');
  });
});
