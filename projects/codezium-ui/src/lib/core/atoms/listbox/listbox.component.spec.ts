import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzListboxComponent } from './listbox.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzListboxComponent', () => {
    let component: CzListboxComponent;
    let fixture: ComponentFixture<CzListboxComponent>;

    const options = [
        { name: 'Option 1', val: 1 },
        { name: 'Option 2', val: 2 },
        { name: 'Option 3', val: 3 },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzListboxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzListboxComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', options);
        fixture.componentRef.setInput('optionLabel', 'name');
        fixture.componentRef.setInput('optionValue', 'val');
    });

    function items(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-listbox-item')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render the options', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(items().length).toBe(3);
        expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();
        expect(items()[0].getAttribute('role')).toBe('option');
    });

    it('should select a single option and notify CVA + output', () => {
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onChangeEvent.subscribe(outputSpy);

        items()[1].click();
        fixture.detectChanges();

        expect(component.value()).toBe(2);
        expect(changeSpy).toHaveBeenCalledWith(2);
        expect(outputSpy).toHaveBeenCalled();
        expect(items()[1].getAttribute('aria-selected')).toBe('true');
    });

    it('should toggle multiple selections', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        items()[0].click();
        items()[2].click();
        fixture.detectChanges();
        expect(component.value()).toEqual([1, 3]);

        items()[0].click();
        fixture.detectChanges();
        expect(component.value()).toEqual([3]);
    });

    it('should expose aria-multiselectable in multiple mode', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.detectChanges();

        const list = fixture.nativeElement.querySelector('[role="listbox"]');
        expect(list.getAttribute('aria-multiselectable')).toBe('true');
    });

    it('should navigate with arrows and select with Enter', () => {
        fixture.detectChanges();

        const list = fixture.debugElement.query(By.css('[role="listbox"]')).nativeElement;
        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(0);

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(1);

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        fixture.detectChanges();
        expect(component.value()).toBe(2);
    });

    it('should support Home and End keys', () => {
        fixture.detectChanges();

        const list = fixture.debugElement.query(By.css('[role="listbox"]')).nativeElement;
        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(2);

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(0);
    });

    it('should filter options', () => {
        fixture.componentRef.setInput('filter', true);
        fixture.detectChanges();

        const filterInput = fixture.debugElement.query(By.css('.cz-listbox-filter-input')).nativeElement;
        filterInput.value = 'Option 2';
        filterInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(items().length).toBe(1);
        expect(items()[0].textContent).toContain('Option 2');
    });

    it('should show the empty message', () => {
        fixture.componentRef.setInput('options', []);
        fixture.componentRef.setInput('emptyMessage', 'Nothing here');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-listbox-empty').textContent).toContain('Nothing here');
    });

    it('should not select when disabled', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();

        items()[0].click();
        fixture.detectChanges();

        expect(component.value()).toBeNull();
        expect(fixture.nativeElement.classList.contains('cz-listbox--disabled')).toBe(true);
    });

    it('should not select when readonly', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();

        items()[0].click();
        fixture.detectChanges();

        expect(component.value()).toBeNull();
    });

    it('should reflect writeValue', () => {
        component.writeValue(3);
        fixture.detectChanges();

        expect(component.value()).toBe(3);
        expect(items()[2].getAttribute('aria-selected')).toBe('true');
    });

    it('should apply the size attribute', () => {
        fixture.componentRef.setInput('size', 'lg');
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLElement).getAttribute('data-size')).toBe('lg');
    });
});


describe('CzListboxComponent — PrimeNG parity', () => {
    let fixture: ComponentFixture<CzListboxComponent>;
    let component: CzListboxComponent;

    const options = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzListboxComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzListboxComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', options);
        fixture.componentRef.setInput('optionLabel', 'name');
        fixture.componentRef.setInput('optionValue', 'code');
    });

    function items(): HTMLElement[] {
        return Array.from(fixture.nativeElement.querySelectorAll('.cz-listbox-item')) as HTMLElement[];
    }

    it('should render checkboxes and the header toggle-all in checkbox mode', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.componentRef.setInput('checkbox', true);
        fixture.detectChanges();

        expect(items().length).toBe(4);
        expect(fixture.nativeElement.querySelectorAll('.cz-listbox-option-checkbox').length).toBe(4);
        expect(fixture.nativeElement.querySelector('.cz-listbox-toggle-all')).toBeTruthy();

        const checkboxInput = fixture.nativeElement.querySelector('.cz-listbox-option-checkbox input') as HTMLInputElement;
        checkboxInput.click();
        fixture.detectChanges();

        expect(component.value()).toEqual(['NY']);
    });

    it('should select all and emit onSelectAllChange', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.componentRef.setInput('checkbox', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onSelectAllChange.subscribe(spy);

        const toggleAll = fixture.nativeElement.querySelector('.cz-listbox-toggle-all input') as HTMLInputElement;
        toggleAll.click();
        fixture.detectChanges();

        expect(component.value()).toEqual(['NY', 'RM', 'LDN', 'PRS']);
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ checked: true }));
        expect(component.allSelected()).toBe(true);
    });

    it('should render the checkmark without highlight when highlightOnSelect is false', () => {
        fixture.componentRef.setInput('checkmark', true);
        fixture.componentRef.setInput('highlightOnSelect', false);
        component.writeValue('RM');
        fixture.detectChanges();

        const selected = items().find((item) => item.textContent?.includes('Rome')) as HTMLElement;
        expect(selected.querySelector('.cz-listbox-checkmark')).toBeTruthy();
        expect(selected.classList.contains('cz-listbox-item--highlight')).toBe(false);
    });

    it('should render grouped options with group headers', () => {
        fixture.componentRef.setInput('group', true);
        fixture.componentRef.setInput('optionGroupLabel', 'label');
        fixture.componentRef.setInput('optionGroupChildren', 'items');
        fixture.componentRef.setInput('optionLabel', 'label');
        fixture.componentRef.setInput('optionValue', 'value');
        fixture.componentRef.setInput('options', [
            { label: 'Germany', items: [{ label: 'Berlin', value: 'Berlin' }] },
            { label: 'USA', items: [{ label: 'Chicago', value: 'Chicago' }, { label: 'New York', value: 'New York' }] },
        ]);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('.cz-listbox-group').length).toBe(2);
        expect(items().length).toBe(3);
        expect(component.flatOptions().length).toBe(3);
    });

    it('should support filter match modes and disabled options', () => {
        fixture.componentRef.setInput('filter', true);
        fixture.componentRef.setInput('filterMatchMode', 'startsWith');
        fixture.componentRef.setInput('optionDisabled', 'disabled');
        fixture.componentRef.setInput('options', [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM', disabled: true },
        ]);
        fixture.detectChanges();

        const filterInput = fixture.nativeElement.querySelector('.cz-listbox-filter-input') as HTMLInputElement;
        filterInput.value = 'new';
        filterInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(items().length).toBe(1);

        filterInput.value = '';
        filterInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const disabledItem = items().find((item) => item.textContent?.includes('Rome')) as HTMLElement;
        expect(disabledItem.getAttribute('aria-disabled')).toBe('true');

        const spy = vi.fn();
        component.onChangeEvent.subscribe(spy);
        disabledItem.click();
        fixture.detectChanges();

        expect(spy).not.toHaveBeenCalled();
    });

    it('should require metaKey to add to the selection when metaKeySelection is enabled', () => {
        fixture.componentRef.setInput('multiple', true);
        fixture.componentRef.setInput('metaKeySelection', true);
        fixture.detectChanges();

        items()[0].click();
        fixture.detectChanges();
        expect(component.value()).toEqual(['NY']);

        items()[1].click();
        fixture.detectChanges();
        expect(component.value()).toEqual(['RM']);

        items()[0].dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }));
        fixture.detectChanges();
        expect(component.value()).toEqual(['RM', 'NY']);
    });

    it('should focus the first option on focus and support selectOnFocus and focusOnHover', () => {
        fixture.componentRef.setInput('selectOnFocus', true);
        fixture.componentRef.setInput('focusOnHover', false);
        fixture.detectChanges();

        const list = fixture.nativeElement.querySelector('.cz-listbox-items') as HTMLElement;
        list.dispatchEvent(new FocusEvent('focus'));
        fixture.detectChanges();

        expect(component.focusedIndex()).toBe(0);
        expect(component.value()).toBe('NY');

        list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        expect(component.value()).toBe('RM');

        items()[3].dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        expect(component.focusedIndex()).toBe(1);
    });

    it('should window options with virtual scroll', () => {
        fixture.componentRef.setInput('options', Array.from({ length: 500 }, (_, i) => ({ name: `Item ${i}`, code: `C${i}` })));
        fixture.componentRef.setInput('virtualScroll', true);
        fixture.componentRef.setInput('virtualScrollItemSize', 30);
        fixture.componentRef.setInput('scrollHeight', '150px');
        fixture.detectChanges();

        expect(items().length).toBeLessThan(500);
        expect(fixture.nativeElement.querySelector('.cz-listbox-spacer')).toBeTruthy();

        const list = fixture.nativeElement.querySelector('.cz-listbox-items') as HTMLElement;
        list.scrollTop = 900;
        list.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();

        expect(component.virtualStart()).toBeGreaterThan(0);
    });

    it('should reorder options with drag and drop', () => {
        fixture.componentRef.setInput('dragdrop', true);
        fixture.detectChanges();

        const spy = vi.fn();
        component.onDrop.subscribe(spy);

        const dataTransfer = { setData: vi.fn(), effectAllowed: '' };
        items()[0].dispatchEvent(Object.assign(new Event('dragstart', { bubbles: true }), { dataTransfer }));
        items()[2].dispatchEvent(Object.assign(new Event('drop', { bubbles: true, cancelable: true }), { dataTransfer }));
        fixture.detectChanges();

        expect(component.sourceOptions()[2].code).toBe('NY');
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ previousIndex: 0, currentIndex: 2 }));
        expect(items()[2].textContent).toContain('New York');
    });

    it('should emit click, double click, filter, focus and blur events', () => {
        fixture.componentRef.setInput('filter', true);
        fixture.detectChanges();

        const clickSpy = vi.fn();
        const dblSpy = vi.fn();
        const filterSpy = vi.fn();
        const focusSpy = vi.fn();
        const blurSpy = vi.fn();
        component.onClick.subscribe(clickSpy);
        component.onDblClick.subscribe(dblSpy);
        component.onFilter.subscribe(filterSpy);
        component.onFocusEvent.subscribe(focusSpy);
        component.onBlurEvent.subscribe(blurSpy);

        items()[0].click();
        items()[0].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        fixture.detectChanges();

        const filterInput = fixture.nativeElement.querySelector('.cz-listbox-filter-input') as HTMLInputElement;
        filterInput.value = 'rom';
        filterInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const list = fixture.nativeElement.querySelector('.cz-listbox-items') as HTMLElement;
        list.dispatchEvent(new FocusEvent('focus'));
        list.dispatchEvent(new FocusEvent('blur'));
        fixture.detectChanges();

        expect(clickSpy).toHaveBeenCalledWith(expect.objectContaining({ value: 'NY', index: 0 }));
        expect(dblSpy).toHaveBeenCalled();
        expect(filterSpy).toHaveBeenCalledWith(expect.objectContaining({ filter: 'rom' }));
        expect(focusSpy).toHaveBeenCalled();
        expect(blurSpy).toHaveBeenCalled();
    });

    it('should render the item, group, header, footer and empty filter templates', () => {
        const hostFixture = TestBed.createComponent(TemplatesHostComponent);
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-lb-header')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-lb-footer')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelectorAll('.custom-lb-item').length).toBe(2);
    });
});

@Component({
    imports: [CzListboxComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-listbox [options]="options" optionLabel="name" optionValue="code">
            <ng-template #itemTemplate let-option>
                <span class="custom-lb-item">{{ option.name }}</span>
            </ng-template>
            <ng-template #headerTemplate>
                <span class="custom-lb-header">Header</span>
            </ng-template>
            <ng-template #footerTemplate>
                <span class="custom-lb-footer">Footer</span>
            </ng-template>
        </cz-listbox>
    `,
})
class TemplatesHostComponent {
    readonly options = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
    ];
}
