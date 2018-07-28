import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentMultiselectorComponent } from './department-multiselector.component';

describe('DepartmentMultiselectorComponent', () => {
  let component: DepartmentMultiselectorComponent;
  let fixture: ComponentFixture<DepartmentMultiselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentMultiselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentMultiselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
