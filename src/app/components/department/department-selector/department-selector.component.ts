import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/university/department';

@Component({
  selector: 'app-department-selector',
  templateUrl: './department-selector.component.html',
  styleUrls: ['./department-selector.component.css']
})
export class DepartmentSelectorComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterUniversityId;

  departments: Department[];
  filterResult: Department[];

  constructor(private departmentService: DepartmentService) { }

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe(departments => { this.departments = departments; });
  }

  ngOnChanges(changes: SimpleChange) {
    const filterUniversityId = !changes['filterUniversityId'] ? '' : changes['filterUniversityId'].currentValue;
    this.filterResult = this.departments ? this.departments.filter(d => d.universityId === filterUniversityId) : [];
  }
}
