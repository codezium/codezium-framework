import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CzOrderListComponent } from './order-list.component';
import { CzAvatarComponent } from '../../atoms/avatar';
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

    function buttons(): HTMLButtonElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-order-list-btn'))
            .map(el => el.nativeElement as HTMLButtonElement);
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

        buttons()[1].click();
        fixture.detectChanges();

        expect(component.items()[0].name).toBe('Two');
        expect(component.selectedIndex()).toBe(0);
        expect(changeSpy).toHaveBeenCalled();
        expect(reorderSpy).toHaveBeenCalledWith(component.items());
    });

    it('should move the selected item down, to top and to bottom', () => {
        component.writeValue(items);
        fixture.detectChanges();

        listItems()[0].click();
        fixture.detectChanges();

        buttons()[2].click();
        fixture.detectChanges();
        expect(component.items()[1].name).toBe('One');
        expect(component.selectedIndex()).toBe(1);

        buttons()[0].click();
        fixture.detectChanges();
        expect(component.items()[0].name).toBe('One');
        expect(component.selectedIndex()).toBe(0);

        buttons()[3].click();
        fixture.detectChanges();
        expect(component.items()[2].name).toBe('One');
        expect(component.selectedIndex()).toBe(2);
    });

    it('should disable move buttons at the edges', () => {
        component.writeValue(items);
        fixture.detectChanges();

        expect(buttons()[0].disabled).toBe(true);
        expect(buttons()[1].disabled).toBe(true);
        expect(buttons()[2].disabled).toBe(true);
        expect(buttons()[3].disabled).toBe(true);

        listItems()[0].click();
        fixture.detectChanges();
        expect(buttons()[0].disabled).toBe(true);
        expect(buttons()[1].disabled).toBe(true);
        expect(buttons()[2].disabled).toBe(false);
        expect(buttons()[3].disabled).toBe(false);

        listItems()[2].click();
        fixture.detectChanges();
        expect(buttons()[0].disabled).toBe(false);
        expect(buttons()[1].disabled).toBe(false);
        expect(buttons()[2].disabled).toBe(true);
        expect(buttons()[3].disabled).toBe(true);
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

    it('should filter items and reset the selection', () => {
        component.writeValue(items);
        fixture.componentRef.setInput('filterBy', 'name');
        fixture.detectChanges();

        listItems()[1].click();
        fixture.detectChanges();

        const filterInput = fixture.debugElement.query(By.css('.cz-order-list-filter-input')).nativeElement as HTMLInputElement;
        filterInput.value = 'tw';
        filterInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.filteredItems().length).toBe(1);
        expect(listItems()[0].textContent).toContain('Two');
        expect(component.selectedIndex()).toBe(-1);
    });

    it('should reorder with drag & drop', () => {
        component.writeValue(items);
        fixture.componentRef.setInput('dragdrop', true);
        fixture.detectChanges();

        const first = listItems()[0];
        const third = listItems()[2];

        first.dispatchEvent(new Event('dragstart'));
        third.dispatchEvent(new Event('dragover'));
        third.dispatchEvent(new Event('drop'));
        fixture.detectChanges();

        expect(component.items()[0].name).toBe('Three');
        expect(component.items()[2].name).toBe('One');
        expect(component.dragIndex()).toBeNull();
    });

    it('should apply controls position, striped rows and scroll height', () => {
        component.writeValue(items);
        fixture.componentRef.setInput('controlsPosition', 'left');
        fixture.componentRef.setInput('stripedRows', true);
        fixture.componentRef.setInput('scrollHeight', '12rem');
        fixture.detectChanges();

        const container = fixture.nativeElement.querySelector('.cz-order-list-container') as HTMLElement;
        expect(container.getAttribute('data-controls-position')).toBe('left');
        expect(fixture.nativeElement.classList.contains('cz-order-list--striped')).toBe(true);

        const list = fixture.nativeElement.querySelector('.cz-order-list-items') as HTMLElement;
        expect(list.style.maxHeight).toBe('12rem');
    });

    it('should render a custom item template', () => {
        const hostFixture = TestBed.createComponent(TemplateHostComponent);
        hostFixture.detectChanges();

        const custom = hostFixture.nativeElement.querySelectorAll('.custom-item');
        expect(custom.length).toBe(3);
        expect(custom[0].textContent).toContain('One');

        // Library components (cz-avatar) can be composed inside the template
        const avatars = hostFixture.nativeElement.querySelectorAll('.custom-item cz-avatar');
        expect(avatars.length).toBe(3);
        expect(avatars[0].querySelector('.cz-avatar-label')?.textContent).toContain('One');
    });
});

@Component({
    imports: [CzOrderListComponent, CzAvatarComponent, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-order-list [formControl]="control" [itemTemplate]="itemTpl" [optionLabel]="'name'"></cz-order-list>

        <ng-template #itemTpl let-item>
            <span class="custom-item cz-flex cz-items-center cz-gap-sm">
                <cz-avatar [label]="item.name" shape="circle" size="sm" />
                {{ item.name }}
            </span>
        </ng-template>
    `,
})
class TemplateHostComponent {
    readonly control = new FormControl([{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]);
}
