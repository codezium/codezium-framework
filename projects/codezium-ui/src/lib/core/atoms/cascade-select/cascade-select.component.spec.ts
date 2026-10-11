import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzCascadeSelectComponent, CzCascadeSelectOption } from './cascade-select.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzCascadeSelectComponent', () => {
    let component: CzCascadeSelectComponent;
    let fixture: ComponentFixture<CzCascadeSelectComponent>;

    const options: CzCascadeSelectOption[] = [
        {
            label: 'USA',
            value: 'us',
            items: [
                { label: 'New York', value: 'ny' },
                { label: 'Florida', value: 'fl' },
            ],
        },
        {
            label: 'Italy',
            value: 'it',
            items: [{ label: 'Rome', value: 'rome' }],
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzCascadeSelectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzCascadeSelectComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', options);
        fixture.componentRef.setInput('placeholder', 'Select a city');
    });

    function trigger(): HTMLElement {
        return fixture.debugElement.query(By.css('.cz-cascade-select-trigger')).nativeElement;
    }

    function columns(): HTMLElement[][] {
        return fixture.debugElement
            .queryAll(By.css('.cz-cascade-select-column'))
            .map((col) =>
                Array.from(col.queryAll(By.css('.cz-cascade-select-option')).map((el) => el.nativeElement)),
            ) as HTMLElement[][];
    }

    it('should create and show the placeholder', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-cascade-select-placeholder').textContent).toContain('Select a city');
        expect(trigger().getAttribute('aria-haspopup')).toBe('tree');
    });

    it('should open showing the first column', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        expect(component.isOpen()).toBe(true);
        expect(columns().length).toBe(1);
        expect(columns()[0].length).toBe(2);
    });

    it('should drill down into child columns on hover', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        columns()[0][0].dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();

        expect(columns().length).toBe(2);
        expect(columns()[1].length).toBe(2);
        expect(columns()[1][0].textContent).toContain('New York');
    });

    it('should select a leaf option and notify CVA + output', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onChangeEvent.subscribe(outputSpy);

        columns()[0][0].dispatchEvent(new MouseEvent('mouseenter'));
        fixture.detectChanges();
        columns()[1][0].click();
        fixture.detectChanges();

        expect(component.value()).toBe('ny');
        expect(changeSpy).toHaveBeenCalledWith('ny');
        expect(outputSpy).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
        expect(fixture.nativeElement.querySelector('.cz-cascade-select-value').textContent).toContain('USA / New York');
    });

    it('should show the selected path with writeValue', () => {
        component.writeValue('rome');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-cascade-select-value').textContent).toContain('Italy / Rome');
    });

    it('should clear the value when clearable', () => {
        fixture.componentRef.setInput('clearable', true);
        component.writeValue('rome');
        fixture.detectChanges();

        const clear = fixture.debugElement.query(By.css('.cz-cascade-select-clear')).nativeElement;
        clear.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();

        expect(component.value()).toBeNull();
    });

    it('should not open when disabled', () => {
        component.setDisabledState?.(true);
        fixture.detectChanges();

        trigger().click();
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
        expect(fixture.nativeElement.classList.contains('cz-cascade-select--disabled')).toBe(true);
    });

    it('should close with Escape', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();

        expect(component.isOpen()).toBe(false);
    });
});

describe('CzCascadeSelectComponent — PrimeNG parity', () => {
    let fixture: ComponentFixture<CzCascadeSelectComponent>;
    let component: CzCascadeSelectComponent;

    const countries = [
        {
            name: 'Australia',
            code: 'AU',
            states: [
                { name: 'New South Wales', cities: [{ cname: 'Sydney', code: 'A-SY' }, { cname: 'Newcastle', code: 'A-NE' }] },
                { name: 'Queensland', cities: [{ cname: 'Brisbane', code: 'A-BR' }] },
            ],
        },
        {
            name: 'Canada',
            code: 'CA',
            states: [{ name: 'Quebec', cities: [{ cname: 'Montreal', code: 'C-MO' }] }],
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzCascadeSelectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzCascadeSelectComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', countries);
        fixture.componentRef.setInput('optionLabel', 'cname');
        fixture.componentRef.setInput('optionGroupLabel', 'name');
        fixture.componentRef.setInput('optionGroupChildren', ['states', 'cities']);
        fixture.componentRef.setInput('optionValue', 'code');
    });

    function trigger(): HTMLElement {
        return fixture.nativeElement.querySelector('.cz-cascade-select-trigger') as HTMLElement;
    }

    it('should render the nested key hierarchy with group and leaf labels', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        expect(component.columns().length).toBe(1);
        expect(fixture.nativeElement.querySelectorAll('.cz-cascade-select-column').length).toBe(1);

        const firstOption = fixture.nativeElement.querySelector('.cz-cascade-select-option') as HTMLElement;
        expect(firstOption.textContent).toContain('Australia');
        expect(firstOption.getAttribute('role')).toBe('treeitem');
        expect(firstOption.getAttribute('aria-level')).toBe('1');
        expect(firstOption.getAttribute('aria-setsize')).toBe('2');

        component.hoverOption(countries[0], 0);
        fixture.detectChanges();

        expect(component.columns().length).toBe(2);
        expect(component.getLabel(countries[0], 0)).toBe('Australia');

        component.hoverOption(countries[0].states[0], 1);
        fixture.detectChanges();

        expect(component.columns().length).toBe(3);
        expect(component.getLabel(countries[0].states[0].cities[0], 2)).toBe('Sydney');
    });

    it('should select a leaf and build the selected label path', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const spy = vi.fn();
        component.onChangeEvent.subscribe(spy);

        component.selectOption(countries[0], new Event('click'), 0);
        component.selectOption(countries[0].states[0], new Event('click'), 1);
        component.selectOption(countries[0].states[0].cities[0], new Event('click'), 2);
        fixture.detectChanges();

        expect(component.value()).toBe('A-SY');
        expect(component.selectedLabel()).toBe('Australia / New South Wales / Sydney');
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'A-SY' }));
        expect(component.isOpen()).toBe(false);
    });

    it('should clear the value with showClear', () => {
        fixture.componentRef.setInput('showClear', true);
        component.writeValue('A-SY');
        fixture.detectChanges();

        const clearSpy = vi.fn();
        component.onClear.subscribe(clearSpy);

        const clearIcon = fixture.nativeElement.querySelector('.cz-cascade-select-clear') as SVGElement;
        expect(clearIcon).toBeTruthy();

        clearIcon.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(component.value()).toBeNull();
        expect(clearSpy).toHaveBeenCalled();
    });

    it('should support the filled variant, fluid and invalid states', () => {
        fixture.componentRef.setInput('variant', 'filled');
        fixture.componentRef.setInput('fluid', true);
        fixture.componentRef.setInput('invalid', true);
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('cz-cascade-select--filled')).toBe(true);
        expect(host.classList.contains('cz-cascade-select--fluid')).toBe(true);
        expect(host.classList.contains('cz-cascade-select--invalid')).toBe(true);
    });

    it('should show the loading state', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.componentRef.setInput('options', []);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-cascade-select-loading')).toBeTruthy();

        trigger().click();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-cascade-select-loading-state')).toBeTruthy();
    });

    it('should navigate with the keyboard across columns', () => {
        fixture.detectChanges();

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        expect(component.isOpen()).toBe(true);

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        fixture.detectChanges();
        expect(component.activeIndex()).toBe(1);

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
        fixture.detectChanges();
        expect(component.activeIndex()).toBe(0);

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        fixture.detectChanges();
        expect(component.activeLevel()).toBe(1);
        expect(component.columns().length).toBe(3);

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        fixture.detectChanges();
        expect(component.activeLevel()).toBe(0);

        trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();
        expect(component.isOpen()).toBe(false);
    });

    it('should render the option, header and footer templates', () => {
        const hostFixture = TestBed.createComponent(TemplatesHostComponent);
        hostFixture.detectChanges();

        const hostTrigger = hostFixture.nativeElement.querySelector('.cz-cascade-select-trigger') as HTMLElement;
        hostTrigger.click();
        hostFixture.detectChanges();

        expect(hostFixture.nativeElement.querySelector('.custom-cs-header')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-cs-footer')).toBeTruthy();
        expect(hostFixture.nativeElement.querySelector('.custom-cs-option')).toBeTruthy();
    });
});

@Component({
    imports: [CzCascadeSelectComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-cascade-select [options]="countries" optionLabel="cname" optionGroupLabel="name"
            [optionGroupChildren]="['states', 'cities']" optionValue="code">
            <ng-template #optionTemplate let-option>
                <span class="custom-cs-option">{{ option.cname || option.name }}</span>
            </ng-template>
            <ng-template #headerTemplate>
                <span class="custom-cs-header">Header</span>
            </ng-template>
            <ng-template #footerTemplate>
                <span class="custom-cs-footer">Footer</span>
            </ng-template>
        </cz-cascade-select>
    `,
})
class TemplatesHostComponent {
    readonly countries = [
        { name: 'Australia', states: [{ name: 'NSW', cities: [{ cname: 'Sydney', code: 'A-SY' }] }] },
    ];
}
