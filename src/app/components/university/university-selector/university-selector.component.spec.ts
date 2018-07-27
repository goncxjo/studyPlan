import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitySelectorComponent } from './university-selector.component';

describe('UniversitySelectorComponent', () => {
  let component: UniversitySelectorComponent;
  let fixture: ComponentFixture<UniversitySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversitySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
