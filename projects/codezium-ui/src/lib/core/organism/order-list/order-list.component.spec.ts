import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzOrderListComponent } from './order-list.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzOrderListComponent', () => {
    let component: CzOrderListComponent;
    let fixture: ComponentFixture<CzOrderListComponent>;

    const items = [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzOrderListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzOrderListComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('optionLabel', 'name');
    });

    function listItems(): HTMLElement[] {
        return Array.from(
            fixture.debugElement.queryAll(By.css('.cz-order-list-item')).map((el) => el.nativeElement),
        ) as HTMLElement[];
    }

    it('should create and render the items from writeValue', () => {
        component.writeValue(items);
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(listItems().length).toBe(3);
        expect(listItems()[0].textContent).toContain('One');
    });

    it('should select an item and expose aria-selected', () => {
        component.writeValue(items);
        fixture.detectChanges();

        listItems()[1].click();
        fixture.detectChanges();

        expect(component.selectedIndex()).toBe(1);
        expect(listItems()[1].getAttribute('aria-selected')).toBe('true');
    });

    it('should move the selected item up and emit changes', () => {
        component.writeValue(items);
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const reorderSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onReorder.subscribe(reorderSpy);

        listItems()[1].click();
        fixture.detectChanges();

        const upBtn = fixture.debugElement.queryAll(By.css('.cz-order-list-btn'))[0].nativeElement;
        upBtn.click();
        fixture.detectChanges();

        expect(component.items()[0].name).toBe('Two');
        expect(component.selectedIndex()).toBe(0);
        expect(changeSpy).toHaveBeenCalled();
        expect(reorderSpy).toHaveBeenCalledWith(component.items());
    });

    it('should move the selected item down', () => {
        component.writeValue(items);
        fixture.detectChanges();

        listItems()[0].click();
        fixture.detectChanges();

        const downBtn = fixture.debugElement.queryAll(By.css('.cz-order-list-btn'))[1].nativeElement;
        downBtn.click();
        fixture.detectChanges();

        expect(component.items()[1].name).toBe('One');
        expect(component.selectedIndex()).toBe(1);
    });

    it('should disable move buttons at the edges', () => {
        component.writeValue(items);
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.cz-order-list-btn'));
        expect(buttons[0].nativeElement.disabled).toBe(true);
        expect(buttons[1].nativeElement.disabled).toBe(true);

        listItems()[0].click();
        fixture.detectChanges();
        expect(buttons[0].nativeElement.disabled).toBe(true);
        expect(buttons[1].nativeElement.disabled).toBe(false);

        listItems()[2].click();
        fixture.detectChanges();
        expect(buttons[0].nativeElement.disabled).toBe(false);
        expect(buttons[1].nativeElement.disabled).toBe(true);
    });

    it('should not reorder when disabled', () => {
        component.writeValue(items);
        component.setDisabledState?.(true);
        fixture.detectChanges();

        listItems()[1].click();
        component.moveUp();
        fixture.detectChanges();

        expect(component.items()[0].name).toBe('One');
        expect(fixture.nativeElement.classList.contains('cz-order-list--disabled')).toBe(true);
    });
});
