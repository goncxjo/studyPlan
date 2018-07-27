import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectMultiselectorComponent } from './subject-multiselector.component';

describe('SubjectMultiselectorComponent', () => {
  let component: SubjectMultiselectorComponent;
  let fixture: ComponentFixture<SubjectMultiselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectMultiselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectMultiselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
