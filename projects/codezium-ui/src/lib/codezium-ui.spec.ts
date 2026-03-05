import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeziumUi } from './codezium-ui';

describe('CodeziumUi', () => {
  let component: CodeziumUi;
  let fixture: ComponentFixture<CodeziumUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeziumUi],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeziumUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
