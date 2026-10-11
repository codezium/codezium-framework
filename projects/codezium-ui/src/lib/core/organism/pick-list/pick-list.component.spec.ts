import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzAvatarComponent } from '../../atoms/avatar';
import { CzPickListComponent } from './pick-list.component';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CzPickListComponent', () => {
    let component: CzPickListComponent;
    let fixture: ComponentFixture<CzPickListComponent>;

    const source = [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }];
    const initialTarget = [{ name: 'Four' }];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CzPickListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CzPickListComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('source', source);
        fixture.componentRef.setInput('optionLabel', 'name');
    });

    function panels(): HTMLElement[][] {
        return fixture.debugElement
            .queryAll(By.css('.cz-pick-list-panel'))
            .map((panel) =>
                Array.from(panel.queryAll(By.css('.cz-pick-list-item')).map((el) => el.nativeElement)),
            ) as HTMLElement[][];
    }

    function buttons(): HTMLButtonElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-pick-list-btn'))
            .map((el) => el.nativeElement) as HTMLButtonElement[];
    }

    it('should create and render the source with the target from writeValue', () => {
        component.writeValue(initialTarget);
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(panels()[0].length).toBe(3);
        expect(panels()[1].length).toBe(1);
        expect(panels()[1][0].textContent).toContain('Four');
    });

    it('should move the selected item to the target', () => {
        component.writeValue(initialTarget);
        fixture.detectChanges();

        const changeSpy = vi.fn();
        const moveSpy = vi.fn();
        component.registerOnChange(changeSpy);
        component.onMoveToTarget.subscribe(moveSpy);

        panels()[0][1].click();
        fixture.detectChanges();
        buttons()[1].click();
        fixture.detectChanges();

        expect(component.target().length).toBe(2);
        expect(changeSpy).toHaveBeenCalled();
        expect(moveSpy).toHaveBeenCalledWith([{ name: 'Two' }]);
        expect(panels()[0].length).toBe(2);
        expect(panels()[1].map((el) => el.textContent?.trim())).toContain('Two');
    });

    it('should move the selected item back to the source', () => {
        component.writeValue(initialTarget);
        fixture.detectChanges();

        const moveSpy = vi.fn();
        component.onMoveToSource.subscribe(moveSpy);

        panels()[1][0].click();
        fixture.detectChanges();
        buttons()[2].click();
        fixture.detectChanges();

        expect(component.target().length).toBe(0);
        expect(moveSpy).toHaveBeenCalledWith([{ name: 'Four' }]);
        expect(panels()[0].length).toBe(4);
    });

    it('should move all items to the target', () => {
        component.writeValue(initialTarget);
        fixture.detectChanges();

        buttons()[0].click();
        fixture.detectChanges();

        expect(component.availableItems().length).toBe(0);
        expect(component.target().length).toBe(4);
        expect(panels()[0].length).toBe(0);
    });

    it('should move all items back to the source', () => {
        component.writeValue(initialTarget);
        fixture.detectChanges();

        buttons()[3].click();
        fixture.detectChanges();

        expect(component.target().length).toBe(0);
        expect(component.availableItems().length).toBe(4);
    });

    it('should disable the transfer buttons when disabled', () => {
        component.writeValue(initialTarget);
        component.setDisabledState?.(true);
        fixture.detectChanges();

        expect(buttons().every((b) => b.disabled)).toBe(true);
        expect(fixture.nativeElement.classList.contains('cz-pick-list--disabled')).toBe(true);
    });

    it('should render the headers and filter the lists', () => {
        component.writeValue(initialTarget);
        fixture.componentRef.setInput('sourceHeader', 'Available');
        fixture.componentRef.setInput('targetHeader', 'Selected');
        fixture.componentRef.setInput('filterBy', 'name');
        fixture.detectChanges();

        const headers = fixture.nativeElement.querySelectorAll('.cz-pick-list-header');
        expect(headers.length).toBe(2);
        expect(headers[0].textContent).toContain('Available');

        const filterInput = fixture.debugElement.query(By.css('.cz-pick-list-filter-input')).nativeElement as HTMLInputElement;
        filterInput.value = 'tw';
        filterInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.filteredSource().length).toBe(1);
        expect(panels()[0].length).toBe(1);
        expect(panels()[0][0].textContent).toContain('Two');
    });

    it('should reorder within the source list with the side controls', () => {
        component.writeValue(initialTarget);
        fixture.componentRef.setInput('showSourceControls', true);
        fixture.detectChanges();

        const sideButtons = fixture.debugElement.queryAll(By.css('.cz-pick-list-side-controls .cz-pick-list-btn'));
        expect(sideButtons.length).toBe(4);

        panels()[0][0].click();
        fixture.detectChanges();
        sideButtons[3].nativeElement.click();
        fixture.detectChanges();

        expect(component.availableItems()[2].name).toBe('One');
        expect(component.selectedSource()).toBe(2);
    });

    it('should transfer items with drag & drop across lists', () => {
        component.writeValue(initialTarget);
        fixture.componentRef.setInput('dragdrop', true);
        fixture.detectChanges();

        const sourceItem = panels()[0][0];
        const targetItem = panels()[1][0];

        sourceItem.dispatchEvent(new Event('dragstart'));
        targetItem.dispatchEvent(new Event('dragover'));
        targetItem.dispatchEvent(new Event('drop'));
        fixture.detectChanges();

        expect(component.target().map(t => t.name)).toEqual(['One', 'Four']);
        expect(component.availableItems().map(i => i.name)).toEqual(['Two', 'Three']);
        expect(component.dragFrom()).toBeNull();
    });

    it('should render a custom item template with library components', () => {
        const hostFixture = TestBed.createComponent(TemplateHostComponent);
        hostFixture.detectChanges();

        const avatars = hostFixture.nativeElement.querySelectorAll('.custom-item cz-avatar');
        expect(avatars.length).toBe(3);
        expect(hostFixture.nativeElement.querySelector('.custom-item').textContent).toContain('One');
    });
});

@Component({
    imports: [CzPickListComponent, CzAvatarComponent, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-pick-list [source]="source" [formControl]="control" [itemTemplate]="itemTpl"></cz-pick-list>

        <ng-template #itemTpl let-item>
            <span class="custom-item cz-flex cz-items-center cz-gap-sm">
                <cz-avatar [label]="item.name" shape="circle" size="sm" />
                {{ item.name }}
            </span>
        </ng-template>
    `,
})
class TemplateHostComponent {
    readonly control = new FormControl([]);
    readonly source = [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }];
}
