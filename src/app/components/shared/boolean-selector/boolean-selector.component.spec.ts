import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanSelectorComponent } from './boolean-selector.component';

describe('BooleanSelectorComponent', () => {
  let component: BooleanSelectorComponent;
  let fixture: ComponentFixture<BooleanSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooleanSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleanSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
