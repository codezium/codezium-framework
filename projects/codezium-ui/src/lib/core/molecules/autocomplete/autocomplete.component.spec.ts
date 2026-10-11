import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CzAutocompleteComponent } from './autocomplete.component';

@Component({
  imports: [CzAutocompleteComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <form [formGroup]="testForm">
      <cz-autocomplete
        #testAutocompleteSingle
        formControlName="singleItem"
        [suggestions]="suggestions"
        [field]="'name'"
        [delay]="200"
        [dropdown]="true"
        [label]="'Country'"
        (completeMethod)="onComplete($event)"
      >
      </cz-autocomplete>

      <cz-autocomplete
        #testAutocompleteMultiple
        formControlName="multipleItems"
        [suggestions]="suggestions"
        [field]="'name'"
        [multiple]="true"
        [delay]="0"
        [labelPosition]="'float'"
        (completeMethod)="onComplete($event)"
      >
      </cz-autocomplete>
    </form>
  `,
})
class TestHostComponent {
  @ViewChild('testAutocompleteSingle') singleComp!: CzAutocompleteComponent;
  @ViewChild('testAutocompleteMultiple') multipleComp!: CzAutocompleteComponent;

  testForm = new FormGroup({
    singleItem: new FormControl(null),
    multipleItems: new FormControl([{ name: 'Brazil', code: 'BR' }]),
  });

  suggestions: any[] = [];
  countries = [
    { name: 'Argentina', code: 'AR' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Chile', code: 'CL' },
  ];

  completeEvents: any[] = [];

  onComplete(event: any) {
    this.completeEvents.push(event);
    const query = event.query.toLowerCase();
    this.suggestions = this.countries.filter((c) => c.name.toLowerCase().includes(query));
  }
}

@Component({
  imports: [CzAutocompleteComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<cz-autocomplete [formControl]="ctrl" [readonly]="true" label="Readonly" />`,
})
class ReadonlyHostComponent {
  ctrl = new FormControl(null);
}

describe('CzAutocompleteComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ReadonlyHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.singleComp).toBeTruthy();
    expect(component.multipleComp).toBeTruthy();
  });

  it('should format single selection using the field property', () => {
    component.testForm.patchValue({ singleItem: component.countries[0] as any });
    fixture.detectChanges();

    // Check if inner input got the field name 'Argentina' correctly formatted
    const inputEl = fixture.debugElement.query(
      By.css('cz-autocomplete:first-of-type input'),
    ).nativeElement;
    expect(inputEl.value).toBe('Argentina');
  });

  it('should display chips for the initial array in multiple mode', () => {
    const chipTokens = fixture.debugElement.queryAll(
      By.css('.cz-autocomplete-multiple-container .cz-autocomplete-token'),
    );
    expect(chipTokens.length).toBe(1);
    expect(chipTokens[0].nativeElement.textContent).toContain('Brazil');
  });

  it('should emit completeMethod with delay when typing', async () => {
    const inputEl = fixture.debugElement.query(
      By.css('cz-autocomplete:first-of-type input'),
    ).nativeElement;
    inputEl.value = 'Chil';
    inputEl.dispatchEvent(new Event('input'));

    // Not fired yet due to 200ms delay
    expect(component.completeEvents.length).toBe(0);

    // Wait for the debounce delay
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Now it should have fired
    expect(component.completeEvents.length).toBe(1);
    expect(component.completeEvents[0].query).toBe('Chil');
  });

  it('should render dropdown button if dropdown=true', () => {
    const dropdownBtn = fixture.debugElement.query(
      By.css('cz-autocomplete:first-of-type .cz-autocomplete-dropdown'),
    );
    expect(dropdownBtn).toBeTruthy();

    dropdownBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.singleComp.overlayVisible()).toBe(true);
  });

  it('should add a token in multiple mode and clear the input text', () => {
    // Manually trigger item selection internally
    component.multipleComp.selectItem(component.countries[0]);
    fixture.detectChanges();

    expect(component.testForm.get('multipleItems')?.value).toEqual([
      { name: 'Brazil', code: 'BR' },
      { name: 'Argentina', code: 'AR' },
    ]);

    const chipTokens = fixture.debugElement.queryAll(
      By.css('.cz-autocomplete-multiple-container .cz-autocomplete-token'),
    );
    expect(chipTokens.length).toBe(2);
  });

  it('should remove a token when clicking the X icon', () => {
    const chipTokensRemove = fixture.debugElement.query(
      By.css('.cz-autocomplete-multiple-container .cz-autocomplete-token-icon'),
    );
    chipTokensRemove.nativeElement.click();
    fixture.detectChanges();

    expect(component.testForm.get('multipleItems')?.value).toEqual([]);
    const remainingTokens = fixture.debugElement.queryAll(
      By.css('.cz-autocomplete-multiple-container .cz-autocomplete-token'),
    );
    expect(remainingTokens.length).toBe(0);
  });

  it('should close the overlay on Escape', () => {
    const dropdownBtn = fixture.debugElement.query(
      By.css('cz-autocomplete:first-of-type .cz-autocomplete-dropdown'),
    );
    dropdownBtn.nativeElement.click();
    fixture.detectChanges();
    expect(component.singleComp.overlayVisible()).toBe(true);

    const inputEl = fixture.debugElement.query(
      By.css('cz-autocomplete:first-of-type input'),
    ).nativeElement;
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.singleComp.overlayVisible()).toBe(false);
  });

  it('should open the overlay with ArrowDown when dropdown is enabled', () => {
    const inputEl = fixture.debugElement.query(
      By.css('cz-autocomplete:first-of-type input'),
    ).nativeElement;

    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    expect(component.singleComp.overlayVisible()).toBe(true);
  });

  it('should remove the last token with Backspace in multiple mode', () => {
    const multipleDebug = fixture.debugElement.queryAll(By.directive(CzAutocompleteComponent))[1];
    const inputEl = multipleDebug.query(By.css('input')).nativeElement;

    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(component.testForm.get('multipleItems')?.value).toEqual([]);
  });

  it('should respect the readonly input', () => {
    const readonlyFixture = TestBed.createComponent(ReadonlyHostComponent);
    readonlyFixture.detectChanges();

    const inputEl = readonlyFixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.readOnly).toBe(true);
  });

  describe('Label positions', () => {
    let directFixture: ComponentFixture<CzAutocompleteComponent>;
    let directComponent: CzAutocompleteComponent;

    beforeEach(() => {
      directFixture = TestBed.createComponent(CzAutocompleteComponent);
      directComponent = directFixture.componentInstance;
    });

    it('should render the static label for labelPosition none', () => {
      directFixture.componentRef.setInput('label', 'Static');
      directFixture.detectChanges();

      const label = directFixture.nativeElement.querySelector('.cz-autocomplete-label-static');
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Static');
    });

    it('should render over/in/float labels and the data attribute', () => {
      directFixture.componentRef.setInput('label', 'Field');
      directFixture.componentRef.setInput('labelPosition', 'over');
      directFixture.detectChanges();
      expect(directFixture.nativeElement.querySelector('.cz-autocomplete-label-over')).toBeTruthy();

      directFixture.componentRef.setInput('labelPosition', 'in');
      directFixture.detectChanges();
      expect(directFixture.nativeElement.querySelector('.cz-autocomplete-label-inner')).toBeTruthy();

      directFixture.componentRef.setInput('labelPosition', 'float');
      directFixture.detectChanges();
      expect(directFixture.nativeElement.querySelector('.cz-autocomplete-label-inner')).toBeTruthy();

      const wrapper = directFixture.nativeElement.querySelector('.cz-autocomplete-wrapper');
      expect(wrapper.getAttribute('data-label-position')).toBe('float');
    });

    it('should activate the float label when the control has a value', () => {
      directFixture.componentRef.setInput('label', 'Search');
      directFixture.componentRef.setInput('labelPosition', 'float');
      directFixture.detectChanges();

      directComponent.writeValue('angular');
      directFixture.detectChanges();

      const container = directFixture.nativeElement.querySelector('.cz-autocomplete-container');
      expect(container.classList.contains('cz-float-active')).toBe(true);
    });
  });
});

describe('CzAutocompleteComponent — PrimeNG parity', () => {
  let fixture: ComponentFixture<CzAutocompleteComponent>;
  let component: CzAutocompleteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CzAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CzAutocompleteComponent);
    component = fixture.componentInstance;
  });

  it('should render the clear icon and reset the value', () => {
    fixture.componentRef.setInput('showClear', true);
    fixture.componentRef.setInput('field', 'name');
    component.writeValue({ name: 'Brazil' });
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('.cz-autocomplete-clear') as HTMLElement;
    expect(clearButton).toBeTruthy();

    const spy = vi.fn();
    component.onClear.subscribe(spy);

    clearButton.click();
    fixture.detectChanges();

    expect(component.value()).toBeNull();
    expect(spy).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('.cz-autocomplete-clear')).toBeNull();
  });

  it('should render grouped suggestions', () => {
    fixture.componentRef.setInput('group', true);
    fixture.componentRef.setInput('optionGroupLabel', 'label');
    fixture.componentRef.setInput('optionGroupChildren', 'items');
    fixture.componentRef.setInput('optionLabel', 'label');
    fixture.componentRef.setInput('suggestions', [
      { label: 'Frontend', items: [{ label: 'Angular' }, { label: 'React' }] },
      { label: 'Backend', items: [{ label: 'Node' }] },
    ]);
    component.showOverlay();
    fixture.detectChanges();

    const groups = fixture.nativeElement.querySelectorAll('.cz-autocomplete-group');
    expect(groups.length).toBe(2);
    expect(groups[0].textContent).toContain('Frontend');
    expect(fixture.nativeElement.querySelectorAll('.cz-autocomplete-item').length).toBe(3);
    expect(component.flatOptions().length).toBe(3);
  });

  it('should support optionLabel as a function', () => {
    fixture.componentRef.setInput('optionLabel', (item: any) => `${item.name}!`);
    component.writeValue({ name: 'Brazil' });
    fixture.detectChanges();

    expect(component.inputValue()).toBe('Brazil!');
  });

  it('should apply the invalid state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('.cz-autocomplete-wrapper');
    expect(wrapper.classList.contains('cz-autocomplete-has-error')).toBe(true);
  });

  it('should emit onFocus and onBlur', () => {
    fixture.detectChanges();

    const focusSpy = vi.fn();
    const blurSpy = vi.fn();
    component.onFocusEvent.subscribe(focusSpy);
    component.onBlurEvent.subscribe(blurSpy);

    component.onFocus(new Event('focus'));
    component.onBlur(new Event('blur'));

    expect(focusSpy).toHaveBeenCalled();
    expect(blurSpy).toHaveBeenCalled();
  });

  it('should respect minQueryLength', () => {
    fixture.componentRef.setInput('minQueryLength', 3);
    fixture.detectChanges();

    expect(component.effectiveMinQueryLength()).toBe(3);
  });

  it('should select the focused option when selectOnFocus is enabled', () => {
    fixture.componentRef.setInput('selectOnFocus', true);
    fixture.componentRef.setInput('optionLabel', 'label');
    fixture.componentRef.setInput('suggestions', [{ label: 'Angular' }, { label: 'React' }]);
    component.showOverlay();
    fixture.detectChanges();

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    expect(component.value()).toEqual({ label: 'React' });
    expect(component.overlayVisible()).toBe(true);
  });

  it('should ignore hover focus when focusOnHover is disabled', () => {
    fixture.componentRef.setInput('focusOnHover', false);
    fixture.detectChanges();

    component.onOptionHover({ label: 'Angular' });
    expect(component.highlightOption).toBeNull();

    fixture.componentRef.setInput('focusOnHover', true);
    fixture.detectChanges();

    component.onOptionHover({ label: 'Angular' });
    expect(component.highlightOption).toEqual({ label: 'Angular' });
  });

  it('should allow duplicates in multiple mode when unique is disabled', () => {
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('unique', false);
    fixture.componentRef.setInput('optionLabel', 'label');
    fixture.detectChanges();

    component.selectItem({ label: 'Angular' });
    component.selectItem({ label: 'Angular' });

    expect(component.value().length).toBe(2);
  });

  it('should window suggestions with virtual scroll', () => {
    const many = Array.from({ length: 200 }, (_, i) => ({ label: `Item ${i}` }));
    fixture.componentRef.setInput('optionLabel', 'label');
    fixture.componentRef.setInput('suggestions', many);
    fixture.componentRef.setInput('virtualScroll', true);
    fixture.componentRef.setInput('virtualScrollItemSize', 30);
    fixture.componentRef.setInput('scrollHeight', '150px');
    component.showOverlay();
    fixture.detectChanges();

    expect(component.visibleSuggestions().length).toBeLessThan(200);
    expect(fixture.nativeElement.querySelector('.cz-autocomplete-spacer')).toBeTruthy();

    const list = fixture.nativeElement.querySelector('.cz-autocomplete-items') as HTMLElement;
    list.scrollTop = 900;
    list.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(component.virtualStart()).toBeGreaterThan(0);
    expect(component.visibleSuggestions()[0].label).not.toBe('Item 0');
  });

  it('should render header, footer and empty templates', () => {
    const hostFixture = TestBed.createComponent(TemplatesHostComponent);
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.querySelector('.custom-ac-header')).toBeTruthy();
    expect(hostFixture.nativeElement.querySelector('.custom-ac-footer')).toBeTruthy();
    expect(hostFixture.nativeElement.querySelector('.custom-ac-empty')).toBeTruthy();
  });
});

@Component({
  imports: [CzAutocompleteComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <cz-autocomplete [suggestions]="[]">
      <ng-template #headerTemplate>
        <span class="custom-ac-header">Header</span>
      </ng-template>

      <ng-template #footerTemplate>
        <span class="custom-ac-footer">Footer</span>
      </ng-template>

      <ng-template #emptyTemplate>
        <span class="custom-ac-empty">Nothing</span>
      </ng-template>
    </cz-autocomplete>
  `,
})
class TemplatesHostComponent {}
