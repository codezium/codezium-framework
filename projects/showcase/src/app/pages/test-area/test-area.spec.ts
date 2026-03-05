import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestArea } from './test-area';

describe('TestArea', () => {
  let component: TestArea;
  let fixture: ComponentFixture<TestArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestArea],
    }).compileComponents();

    fixture = TestBed.createComponent(TestArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
