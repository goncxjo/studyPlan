import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPlanComponent } from './student-plan.component';

describe('StudentPlanComponent', () => {
  let component: StudentPlanComponent;
  let fixture: ComponentFixture<StudentPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
