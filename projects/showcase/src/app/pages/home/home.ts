import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
    CzCheckboxComponent,
    CzInputTextComponent,
    CzPopoverComponent,
    CzRippleDirective,
    CzTextAreaComponent,
} from 'codezium-ui';
import { HOME_TRANSLATIONS, HOME_LOCALES, type HomeLocale } from './home.i18n';

@Component({
    selector: 'cz-home-page',
    imports: [
        ReactiveFormsModule,
        CzInputTextComponent,
        CzTextAreaComponent,
        CzCheckboxComponent,
        CzPopoverComponent,
        CzRippleDirective,
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
    // ──────────────────────────────────────────────
    // CONSTANTS
    // ──────────────────────────────────────────────
    readonly locales = HOME_LOCALES;
    readonly githubUrl = 'https://github.com/codezium/codezium-framework';

    // ──────────────────────────────────────────────
    // FORM PREVIEW — real library components
    // ──────────────────────────────────────────────
    readonly previewName = new FormControl('John Doe');
    readonly previewMessage = new FormControl('');
    readonly previewPrivacy = new FormControl(true);

    // ──────────────────────────────────────────────
    // SIGNALS — STATE
    // ──────────────────────────────────────────────
    /** Current year for the footer copyright. */
    readonly currentYear = signal(new Date().getFullYear());

    /** Active locale code. Changes trigger a full translation swap. */
    readonly activeLocale = signal<HomeLocale>('en');

    /** Whether the mobile nav menu is visible. */
    readonly mobileMenuOpen = signal(false);

    /** Whether the language dropdown is open. */
    readonly langDropdownOpen = signal(false);

    // ──────────────────────────────────────────────
    // SIGNALS — DERIVED / COMPUTED
    // ──────────────────────────────────────────────
    /** Reactive translation object — recalculates whenever activeLocale changes. */
    readonly t = computed(() => HOME_TRANSLATIONS[this.activeLocale()]);

    /** Derived: label + flag for the current locale. */
    readonly currentLangDisplay = computed(() => {
        const locale = this.locales.find(l => l.code === this.activeLocale());
        return locale ? `${locale.flag} ${locale.label}` : '';
    });

    // ──────────────────────────────────────────────
    // ACTIONS
    // ──────────────────────────────────────────────
    setLocale(code: HomeLocale): void {
        this.activeLocale.set(code);
        this.langDropdownOpen.set(false);
    }

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update(v => !v);
    }
}
