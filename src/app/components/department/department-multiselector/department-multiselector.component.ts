import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DepartmentService } from '../../../services/department.service';
import { Department } from '../../../models/department';

@Component({
  selector: 'app-department-multiselector',
  templateUrl: './department-multiselector.component.html',
  styleUrls: ['./department-multiselector.component.css']
})
export class DepartmentMultiselectorComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterName;
  @Input() filterUniversityId;

  departments: Department[];

  constructor(private departmentService: DepartmentService) { }

  ngOnInit() {
  }
  
  getDepartments(name?: string, universityId?: string) {
    this.departmentService.getDepartments(name, universityId).subscribe(departments => { this.departments = departments });
  }

  ngOnChanges(changes: SimpleChange) {
    const filterName = !changes['filterName'] ? '' : changes['filterName'].currentValue ;
    const filterUniversityId = !changes['filterUniversityId'] ? '' : changes['filterUniversityId'].currentValue;

    this.getDepartments(filterName, filterUniversityId);
  }
}