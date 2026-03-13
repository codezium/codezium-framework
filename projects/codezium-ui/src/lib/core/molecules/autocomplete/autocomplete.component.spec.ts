import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CzAutocompleteComponent } from './autocomplete.component';

@Component({
  standalone: true,
  imports: [CzAutocompleteComponent, ReactiveFormsModule],
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
        (completeMethod)="onComplete($event)">
      </cz-autocomplete>

      <cz-autocomplete
        #testAutocompleteMultiple
        formControlName="multipleItems"
        [suggestions]="suggestions"
        [field]="'name'"
        [multiple]="true"
        [delay]="0"
        [labelPosition]="'float'"
        (completeMethod)="onComplete($event)">
      </cz-autocomplete>
    </form>
  `
})
class TestHostComponent {
  @ViewChild('testAutocompleteSingle') singleComp!: CzAutocompleteComponent;
  @ViewChild('testAutocompleteMultiple') multipleComp!: CzAutocompleteComponent;

  testForm = new FormGroup({
    singleItem: new FormControl(null),
    multipleItems: new FormControl([{ name: 'Brazil', code: 'BR' }])
  });

  suggestions: any[] = [];
  countries = [
    { name: 'Argentina', code: 'AR' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Chile', code: 'CL' }
  ];

  completeEvents: any[] = [];

  onComplete(event: any) {
    this.completeEvents.push(event);
    const query = event.query.toLowerCase();
    this.suggestions = this.countries.filter(c => c.name.toLowerCase().includes(query));
  }
}

describe('CzAutocompleteComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
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
    const inputEl = fixture.debugElement.query(By.css('cz-autocomplete:first-of-type input')).nativeElement;
    expect(inputEl.value).toBe('Argentina');
  });

  it('should display chips for the initial array in multiple mode', () => {
    const chipTokens = fixture.debugElement.queryAll(By.css('.cz-autocomplete-multiple-container .cz-autocomplete-token'));
    expect(chipTokens.length).toBe(1);
    expect(chipTokens[0].nativeElement.textContent).toContain('Brazil');
  });

  it('should emit completeMethod with delay when typing', async () => {
    const inputEl = fixture.debugElement.query(By.css('cz-autocomplete:first-of-type input')).nativeElement;
    inputEl.value = 'Chil';
    inputEl.dispatchEvent(new Event('input'));
    
    // Not fired yet due to 200ms delay
    expect(component.completeEvents.length).toBe(0);

    // Wait for the debounce delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Now it should have fired
    expect(component.completeEvents.length).toBe(1);
    expect(component.completeEvents[0].query).toBe('Chil');
  });

  it('should render dropdown button if dropdown=true', () => {
    const dropdownBtn = fixture.debugElement.query(By.css('cz-autocomplete:first-of-type .cz-autocomplete-dropdown'));
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
      { name: 'Argentina', code: 'AR' }
    ]);

    const chipTokens = fixture.debugElement.queryAll(By.css('.cz-autocomplete-multiple-container .cz-autocomplete-token'));
    expect(chipTokens.length).toBe(2);
  });

  it('should remove a token when clicking the X icon', () => {
    const chipTokensRemove = fixture.debugElement.query(By.css('.cz-autocomplete-multiple-container .cz-autocomplete-token-icon'));
    chipTokensRemove.nativeElement.click();
    fixture.detectChanges();

    expect(component.testForm.get('multipleItems')?.value).toEqual([]);
    const remainingTokens = fixture.debugElement.queryAll(By.css('.cz-autocomplete-multiple-container .cz-autocomplete-token'));
    expect(remainingTokens.length).toBe(0);
  });
});
