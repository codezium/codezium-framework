import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzButtonGroupComponent } from './button-group.component';
import { CzButtonComponent } from '../button';
import { LucideCheck, LucideTrash } from '@lucide/angular';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzButtonGroupComponent, CzButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <cz-button-group>
            <cz-button label="Save" [icon]="CheckIcon" />
            <cz-button label="Delete" [icon]="TrashIcon" severity="danger" />
        </cz-button-group>
    `,
})
class TestHostComponent {
    readonly CheckIcon = LucideCheck;
    readonly TrashIcon = LucideTrash;
}

describe('CzButtonGroupComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should render the group host with the cz-button-group class', () => {
        const group = fixture.nativeElement.querySelector('cz-button-group') as HTMLElement;
        expect(group).toBeTruthy();
        expect(group.classList.contains('cz-button-group')).toBe(true);
    });

    it('should render every projected button inside the group', () => {
        const buttons = fixture.nativeElement.querySelectorAll('cz-button-group .cz-button');
        expect(buttons.length).toBe(2);
        expect(fixture.nativeElement.querySelectorAll('cz-button-group .cz-button-native').length).toBe(2);
    });
});
