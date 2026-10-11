import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
