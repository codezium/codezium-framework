import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzTreeSelectComponent, CzTreeSelectOption } from './tree-select.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzTreeSelectComponent', () => {
    let component: CzTreeSelectComponent;
    let fixture: ComponentFixture<CzTreeSelectComponent>;

    const options: CzTreeSelectOption[] = [
        {
            label: 'Documents',
            value: 'docs',
            children: [
                { label: 'Work', value: 'work' },
                { label: 'Personal', value: 'personal' },
            ],
        },
        { label: 'Photos', value: 'photos' },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzTreeSelectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzTreeSelectComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('options', options);
        fixture.componentRef.setInput('placeholder', 'Select a node');
    });

    function trigger(): HTMLElement {
        return fixture.debugElement.query(By.css('.cz-tree-select-trigger')).nativeElement;
    }

    function nodes(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-tree-select-node')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and show the placeholder', () => {
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-tree-select-placeholder').textContent).toContain('Select a node');
    });

    it('should show only root nodes when opened', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        expect(component.isOpen()).toBe(true);
        expect(nodes().length).toBe(2);
        expect(fixture.nativeElement.querySelector('[role="tree"]')).toBeTruthy();
    });

    it('should expand and collapse nodes', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const toggle = fixture.debugElement.query(By.css('.cz-tree-select-toggle')).nativeElement;
        toggle.click();
        fixture.detectChanges();
        expect(nodes().length).toBe(4);
        expect(nodes()[0].getAttribute('aria-expanded')).toBe('true');

        toggle.click();
        fixture.detectChanges();
        expect(nodes().length).toBe(2);
    });

    it('should select a node and notify CVA + output', () => {
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const outputSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onChangeEvent.subscribe(outputSpy);

        fixture.debugElement.query(By.css('.cz-tree-select-toggle')).nativeElement.click();
        fixture.detectChanges();

        const workNode = nodes().find((n) => n.textContent?.includes('Work'));
        expect(workNode).toBeTruthy();
        workNode!.click();
        fixture.detectChanges();

        expect(component.value()).toBe('work');
        expect(changeSpy).toHaveBeenCalledWith('work');
        expect(outputSpy).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
        expect(fixture.nativeElement.querySelector('.cz-tree-select-value').textContent).toContain('Work');
    });

    it('should show the selected label with writeValue', () => {
        component.writeValue('photos');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tree-select-value').textContent).toContain('Photos');
    });

    it('should clear the value when clearable', () => {
        fixture.componentRef.setInput('clearable', true);
        component.writeValue('photos');
        fixture.detectChanges();

        const clear = fixture.debugElement.query(By.css('.cz-tree-select-clear')).nativeElement;
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
        expect(fixture.nativeElement.classList.contains('cz-tree-select--disabled')).toBe(true);
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
