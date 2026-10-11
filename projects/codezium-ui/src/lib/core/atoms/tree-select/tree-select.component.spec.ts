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
            fixture.debugElement.queryAll(By.css('.cz-tree-select-row')).map((el) => el.nativeElement),
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

        const toggle = fixture.debugElement.query(By.css('.cz-tree-select-toggler')).nativeElement;
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

        fixture.debugElement.query(By.css('.cz-tree-select-toggler')).nativeElement.click();
        fixture.detectChanges();

        const workNode = nodes().find((n) => n.textContent?.includes('Work'));
        expect(workNode).toBeTruthy();
        workNode!.click();
        fixture.detectChanges();

        expect(component.value()).toBe('work');
        expect(changeSpy).toHaveBeenCalledWith('work');
        expect(outputSpy).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
        expect(fixture.nativeElement.querySelector('.cz-tree-select-label').textContent).toContain('Work');
    });

    it('should show the selected label with writeValue', () => {
        component.writeValue('photos');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.cz-tree-select-label').textContent).toContain('Photos');
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
    it('should support multiple selection with meta key', () => {
        fixture.componentRef.setInput('selectionMode', 'multiple');
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        // Expand Documents to reveal the leaves
        fixture.debugElement.query(By.css('.cz-tree-select-toggler')).nativeElement.click();
        fixture.detectChanges();

        const work = nodes().find((n) => n.textContent?.includes('Work'))!;
        const personal = nodes().find((n) => n.textContent?.includes('Personal'))!;

        work.dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }));
        fixture.detectChanges();
        expect(component.value()).toEqual(['work']);

        personal.dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }));
        fixture.detectChanges();
        expect(component.value()).toEqual(['work', 'personal']);

        personal.dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }));
        fixture.detectChanges();
        expect(component.value()).toEqual(['work']);

        // With metaKeySelection disabled, selection is replaced
        fixture.componentRef.setInput('metaKeySelection', false);
        fixture.detectChanges();
        const photos = nodes().find((n) => n.textContent?.includes('Photos'))!;
        photos.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();
        expect(component.value()).toEqual(['photos']);
        expect(component.isOpen()).toBe(true);
    });

    it('should toggle a full subtree in checkbox mode with partial parent state', () => {
        fixture.componentRef.setInput('selectionMode', 'checkbox');
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        const docs = nodes().find((n) => n.textContent?.includes('Documents'))!;
        docs.click();
        fixture.detectChanges();

        expect(component.value()).toEqual(['work', 'personal']);
        expect(component.isChecked(component['findNode']('work')!)).toBe(true);
        expect(component.isChecked(component['findNode']('docs')!)).toBe(true);

        // Expand Documents to reveal the leaves
        fixture.debugElement.query(By.css('.cz-tree-select-toggler')).nativeElement.click();
        fixture.detectChanges();

        // Uncheck one leaf -> parent becomes partial
        const work = nodes().find((n) => n.textContent?.includes('Work'))!;
        work.click();
        fixture.detectChanges();
        expect(component.value()).toEqual(['personal']);
        expect(component.isPartial(component['findNode']('docs')!)).toBe(true);

        // Re-check via parent -> all selected again
        const docs2 = nodes().find((n) => n.textContent?.includes('Documents'))!;
        docs2.click();
        fixture.detectChanges();
        expect([...component.value()].sort()).toEqual(['personal', 'work']);
    });

    it('should filter nodes keeping ancestors of matches', () => {
        fixture.componentRef.setInput('filter', true);
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        component.onFilterInput({ target: { value: 'work' } } as any);
        fixture.detectChanges();

        const rows = nodes();
        expect(rows.length).toBe(2);
        expect(rows[0].textContent).toContain('Documents');
        expect(rows[1].textContent).toContain('Work');

        component.onFilterInput({ target: { value: 'zzz' } } as any);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-tree-select-empty')).toBeTruthy();
    });

    it('should display selected items as chips in multiple mode', () => {
        fixture.componentRef.setInput('selectionMode', 'checkbox');
        fixture.componentRef.setInput('display', 'chip');
        fixture.detectChanges();
        component.writeValue(['work', 'photos']);
        fixture.detectChanges();

        const chips = fixture.debugElement.queryAll(By.css('.cz-tree-select-chip'));
        expect(chips.length).toBe(2);
        expect(chips[0].nativeElement.textContent).toContain('Work');

        fixture.debugElement.query(By.css('.cz-tree-select-chip-remove')).nativeElement
            .dispatchEvent(new MouseEvent('click', { bubbles: true }));
        fixture.detectChanges();
        expect(component.value()).toEqual(['photos']);
    });

    it('should expose combobox and tree aria attributes', () => {
        fixture.componentRef.setInput('inputId', 'tree-select');
        fixture.componentRef.setInput('selectionMode', 'checkbox');
        fixture.detectChanges();
        trigger().click();
        fixture.detectChanges();

        expect(trigger().getAttribute('role')).toBe('combobox');
        expect(trigger().getAttribute('aria-expanded')).toBe('true');
        expect(trigger().getAttribute('aria-controls')).toBe('tree-select-panel');

        const panel = fixture.nativeElement.querySelector('.cz-tree-select-panel');
        expect(panel.getAttribute('role')).toBe('tree');
        expect(panel.getAttribute('aria-multiselectable')).toBe('true');

        const item = fixture.nativeElement.querySelector('.cz-tree-select-row');
        expect(item.getAttribute('role')).toBe('treeitem');
        expect(item.getAttribute('aria-level')).toBe('1');
        expect(item.getAttribute('aria-checked')).toBe('false');
    });

    it('should emit node expand/collapse, clear and show/hide outputs', () => {
        const expandSpy = vi.fn();
        const collapseSpy = vi.fn();
        const clearSpy = vi.fn();
        const showSpy = vi.fn();
        const hideSpy = vi.fn();
        component.onNodeExpandEvent.subscribe(expandSpy);
        component.onNodeCollapseEvent.subscribe(collapseSpy);
        component.onClearEvent.subscribe(clearSpy);
        component.onShowEvent.subscribe(showSpy);
        component.onHideEvent.subscribe(hideSpy);
        fixture.componentRef.setInput('clearable', true);
        component.writeValue('work');
        fixture.detectChanges();

        component.show();
        expect(showSpy).toHaveBeenCalledTimes(1);

        const docsNode = component['findNode']('docs')!;
        component.toggleExpand(docsNode, new Event('click'));
        expect(expandSpy).toHaveBeenCalledTimes(1);
        component.toggleExpand(docsNode, new Event('click'));
        expect(collapseSpy).toHaveBeenCalledTimes(1);

        fixture.debugElement.query(By.css('.cz-tree-select-clear')).nativeElement
            .dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(clearSpy).toHaveBeenCalledTimes(1);
        expect(component.value()).toBeNull();

        component.hide();
        expect(hideSpy).toHaveBeenCalledTimes(1);
    });

    it('should apply invalid and fluid state classes', () => {
        fixture.componentRef.setInput('invalid', true);
        fixture.componentRef.setInput('fluid', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.cz-input-has-error')).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.cz-input-fluid')).toBeTruthy();
    });

});
