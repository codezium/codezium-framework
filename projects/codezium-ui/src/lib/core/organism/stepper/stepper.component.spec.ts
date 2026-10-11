import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CzStepComponent, CzStepperComponent } from './stepper.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
    imports: [CzStepperComponent, CzStepComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-stepper [linear]="linear">
            <cz-step label="Account">Account content</cz-step>
            <cz-step label="Profile">Profile content</cz-step>
            <cz-step label="Extras">Extras content</cz-step>
            <cz-step label="Locked" [disabled]="true">Locked content</cz-step>
        </cz-stepper>
    `,
})
class TestHostComponent {
    linear = false;
}

describe('CzStepperComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        // Note: no initial detectChanges() here to prevent NG0100 when tests mutate inputs afterwards
    });

    function stepper(): CzStepperComponent {
        return fixture.debugElement.query(By.directive(CzStepperComponent)).componentInstance;
    }

    function indicators(): HTMLButtonElement[] {
        return fixture.debugElement
            .queryAll(By.css('.cz-stepper-indicator'))
            .map((el) => el.nativeElement as HTMLButtonElement);
    }

    it('should render the steps and activate the first one', () => {
        fixture.detectChanges();

        expect(indicators().length).toBe(4);
        expect(stepper().activeIndex()).toBe(0);
        expect(fixture.nativeElement.querySelector('.cz-step-content').textContent).toContain('Account content');
    });

    it('should render only the active step content', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelectorAll('.cz-step-content').length).toBe(1);
    });

    it('should navigate with the next and prev buttons', () => {
        fixture.detectChanges();

        const buttons = fixture.debugElement.queryAll(By.css('.cz-button-native'));

        buttons[1].nativeElement.click();
        fixture.detectChanges();

        expect(stepper().activeIndex()).toBe(1);
        expect(fixture.nativeElement.querySelector('.cz-step-content').textContent).toContain('Profile content');

        buttons[0].nativeElement.click();
        fixture.detectChanges();
        expect(stepper().activeIndex()).toBe(0);
    });

    it('should mark completed steps with a check icon', () => {
        fixture.detectChanges();

        stepper().goTo(1);
        fixture.detectChanges();

        const firstIndicator = indicators()[0];
        expect(firstIndicator.querySelector('svg')).toBeTruthy();
        expect(firstIndicator.closest('.cz-stepper-step')?.classList.contains('cz-stepper-step--completed')).toBe(true);
    });

    it('should block jumping forward when linear', () => {
        fixture.componentInstance.linear = true;
        fixture.detectChanges();

        stepper().goTo(2);
        expect(stepper().activeIndex()).toBe(0);

        stepper().goTo(1);
        expect(stepper().activeIndex()).toBe(1);
    });

    it('should allow jumping forward when not linear', () => {
        fixture.detectChanges();

        stepper().goTo(2);
        expect(stepper().activeIndex()).toBe(2);
    });

    it('should not navigate to disabled steps', () => {
        fixture.detectChanges();

        stepper().goTo(3);
        expect(stepper().activeIndex()).toBe(0);
        expect(indicators()[3].disabled).toBe(true);
    });

    it('should disable next when the following step is disabled', () => {
        fixture.detectChanges();

        stepper().goTo(2);
        fixture.detectChanges();

        expect(stepper().canNext()).toBe(false);

        const buttons = fixture.debugElement.queryAll(By.css('.cz-button-native'));
        expect((buttons[1].nativeElement as HTMLButtonElement).disabled).toBe(true);
    });

    it('should navigate by clicking the step indicator', () => {
        fixture.detectChanges();

        indicators()[1].click();
        fixture.detectChanges();

        expect(stepper().activeIndex()).toBe(1);
    });
});
