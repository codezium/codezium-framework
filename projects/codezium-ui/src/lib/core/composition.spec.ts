import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { CzInputTextComponent } from './atoms/input-text';
import { CzSelectComponent } from './atoms/select';
import { CzToggleSwitchComponent } from './atoms/toggle-switch';
import { CzDatePickerComponent } from './atoms/date-picker';
import { CzDialogComponent } from './organism/dialog';
import { CzStepComponent, CzStepperComponent } from './organism/stepper';
import { CzToastService } from './molecules/toast';
import { CzConfirmationService } from './organism/confirmation';

@Component({
    imports: [
        ReactiveFormsModule,
        CzInputTextComponent,
        CzSelectComponent,
        CzToggleSwitchComponent,
        CzDatePickerComponent,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <form [formGroup]="form">
            <cz-input-text formControlName="name" label="Name" labelPosition="float" />
            <cz-select formControlName="country" [options]="countries" optionLabel="label" optionValue="value" />
            <cz-toggle-switch formControlName="newsletter" label="Newsletter" />
            <cz-date-picker formControlName="birthday" />
        </form>
    `,
})
class MultiControlFormHost {
    countries = [
        { label: 'Spain', value: 'es' },
        { label: 'France', value: 'fr' },
    ];

    form = new FormGroup({
        name: new FormControl('Mike', [Validators.required]),
        country: new FormControl('es'),
        newsletter: new FormControl(true),
        birthday: new FormControl<Date | null>(new Date(2024, 0, 15)),
    });
}

@Component({
    imports: [ReactiveFormsModule, CzDialogComponent, CzInputTextComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-dialog [visible]="true" header="Edit profile">
            <cz-input-text [formControl]="control" label="Email" labelPosition="float" />
        </cz-dialog>
    `,
})
class DialogFormHost {
    control = new FormControl('', [Validators.required]);
}

@Component({
    imports: [ReactiveFormsModule, CzStepperComponent, CzStepComponent, CzInputTextComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `
        <cz-stepper>
            <cz-step label="Account">
                <cz-input-text [formControl]="account" label="Account name" />
            </cz-step>
            <cz-step label="Profile">
                <cz-input-text [formControl]="profile" label="Profile name" />
            </cz-step>
        </cz-stepper>
    `,
})
class StepperFormsHost {
    account = new FormControl('account-value');
    profile = new FormControl('profile-value');
}

describe('Cross-component composition', () => {
    describe('Multiple CVA controls in one form', () => {
        let fixture: ComponentFixture<MultiControlFormHost>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [MultiControlFormHost],
            }).compileComponents();

            fixture = TestBed.createComponent(MultiControlFormHost);
            fixture.detectChanges();
        });

        it('should render the form values into every control', () => {
            const input = fixture.debugElement.query(By.css('cz-input-text input')).nativeElement as HTMLInputElement;
            expect(input.value).toBe('Mike');

            const selectLabel = fixture.debugElement.query(By.css('.cz-select-label')).nativeElement;
            expect(selectLabel.textContent.trim()).toBe('Spain');

            const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
            expect(track.getAttribute('aria-checked')).toBe('true');

            expect(fixture.debugElement.query(By.css('.cz-date-picker-value'))).toBeTruthy();
        });

        it('should propagate model changes to the controls', () => {
            fixture.componentInstance.form.setValue({
                name: 'Ana',
                country: 'fr',
                newsletter: false,
                birthday: new Date(2023, 11, 31),
            });
            fixture.detectChanges();

            const input = fixture.debugElement.query(By.css('cz-input-text input')).nativeElement as HTMLInputElement;
            expect(input.value).toBe('Ana');

            const selectLabel = fixture.debugElement.query(By.css('.cz-select-label')).nativeElement;
            expect(selectLabel.textContent.trim()).toBe('France');

            const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
            expect(track.getAttribute('aria-checked')).toBe('false');
        });

        it('should propagate user interactions back to the form', () => {
            const input = fixture.debugElement.query(By.css('cz-input-text input')).nativeElement as HTMLInputElement;
            input.value = 'From user';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(fixture.componentInstance.form.controls.name.value).toBe('From user');

            const track = fixture.debugElement.query(By.css('.cz-toggle-switch-track')).nativeElement;
            track.click();
            fixture.detectChanges();

            expect(fixture.componentInstance.form.controls.newsletter.value).toBe(false);
        });
    });

    describe('Dialog containing a validated form', () => {
        it('should render the validation message inside the dialog', () => {
            const fixture = TestBed.createComponent(DialogFormHost);
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('.cz-dialog')).toBeTruthy();

            fixture.componentInstance.control.markAsTouched();
            fixture.detectChanges();

            const error = fixture.debugElement.query(By.css('.cz-dialog .cz-input-error-text'));
            expect(error).toBeTruthy();
            expect(error.nativeElement.textContent).toContain('Este campo es requerido.');
        });
    });

    describe('Stepper with per-step forms', () => {
        let fixture: ComponentFixture<StepperFormsHost>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [StepperFormsHost],
            }).compileComponents();

            fixture = TestBed.createComponent(StepperFormsHost);
            fixture.detectChanges();
        });

        it('should switch step content and keep the form values', () => {
            const stepper = fixture.debugElement.query(By.directive(CzStepperComponent)).componentInstance as CzStepperComponent;

            const firstInput = fixture.debugElement.query(By.css('.cz-step-content input')).nativeElement as HTMLInputElement;
            expect(firstInput.value).toBe('account-value');

            stepper.next();
            fixture.detectChanges();

            const inputs = fixture.debugElement.queryAll(By.css('.cz-step-content input'));
            expect(inputs.length).toBe(1);
            expect((inputs[0].nativeElement as HTMLInputElement).value).toBe('profile-value');

            stepper.prev();
            fixture.detectChanges();

            expect(fixture.componentInstance.account.value).toBe('account-value');
        });
    });

    describe('Service integration', () => {
        it('should push a toast from a confirmation accept callback', () => {
            TestBed.configureTestingModule({});
            const toast = TestBed.inject(CzToastService);
            const confirmation = TestBed.inject(CzConfirmationService);

            toast.clear();
            confirmation.clear();

            const accept = vi.fn(() => toast.success('Customer deleted'));
            confirmation.confirm({ message: 'Delete?', accept });

            expect(confirmation.active()).not.toBeNull();

            confirmation.accept();

            expect(accept).toHaveBeenCalled();
            expect(confirmation.active()).toBeNull();
            expect(toast.messages().length).toBe(1);
            expect(toast.messages()[0].severity).toBe('success');

            toast.clear();
        });
    });
});
