import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { UniversityService } from '../../../services/university.service';
import { HeadquartersService } from '../../../services/headquarters.service';
import { DepartmentService } from '../../../services/department.service';
import { tap } from 'rxjs/operators'

@Component({
  selector: 'app-university-form',
  templateUrl: './university-form.component.html',
  styleUrls: ['./university-form.component.css']
})
export class UniversityFormComponent implements OnInit {
  universityForm: FormGroup;
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute, private location: Location, private universityService: UniversityService, private headquarterService: HeadquartersService, private departmentService: DepartmentService, private toastr: ToastrService, private fb: FormBuilder
  ) {
    this.universityForm = this.fb.group({
      $key: '',
      name: '',
      headquarters: this.fb.array([]),
      departments: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      if (this.editMode) {
        this.fillForm();
      }
    });
  }

  get headquartersForm() {
    return this.universityForm.get('headquarters') as FormArray;
  }

  addNewHeadquarters() {
    const headquarters = this.fb.group({
      $key: '',
      name: '',
      address: '',
      city: '',
      country: '',
      telephone: ''
    });

    this.headquartersForm.push(headquarters);
  }

  addHeadquarters(headquarters) {
    this.headquartersForm.push(headquarters);
  }

  deleteHeadquarters(index) {
    this.headquartersForm.removeAt(index);
  }

  get departmentsForm() {
    return this.universityForm.get('departments') as FormArray;
  }

  addNewDepartment() {
    const department = this.fb.group({
      $key: '',
      name: '',
    });

    this.departmentsForm.push(department);
  }

  addDepartment(department) {
    this.departmentsForm.push(department);
  }

  deleteDepartment(index) {
    this.departmentsForm.removeAt(index);
  }


  fillForm() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.universityService.getUniversityById(id).pipe(
      tap(university => {
        university['$key'] = id;
        this.universityForm.patchValue({
          $key: university['$key'] || '',
          name: university['name'] || '',
        });
        this.getHeadquarters(university);
        this.getDepartments(university);
      })
    ).subscribe();
  }

  getHeadquarters(university) {
    if (university.headquarters) {
      this.headquarterService.getAllHeadquarters().pipe(
        tap(headquartersList => {
          headquartersList
            .filter(h => h.universityId == university.$key)
            .forEach(h => {
              const group = this.fb.group({
                $key: h.$key,
                name: h.name,
                address: h.address,
                city: h.city,
                country: h.country,
                telephone: h.telephone
              });
              this.addHeadquarters(group)
            });
        })
      ).subscribe();
    }
  }

  getDepartments(university) {
    if (university.departments) {
      this.departmentService.getDepartments().pipe(
        tap(departments => {
          departments
            .filter(d => d.universityId == university.$key)
            .forEach(d => {
              const group = this.fb.group({
                $key: d.$key,
                name: d.name,
              });
              this.addDepartment(group)
            });
        })
      ).subscribe()
    }
  }

  onSubmit() {
    if (!this.editMode) {
      this.universityService.addUniversity(this.universityForm.value)
        .then(x => {
          this.toastr.success("Universidad creada", "Operación exitosa");
          this.goBack();
        }).catch(x => this.toastr.error(x, "Operación fallida"));
    } else {
      this.universityService.updateUniversity(this.universityForm.value)
        .then(x => {
          this.toastr.success("Universidad actualizada", "Operación exitosa");
          this.goBack();
        }).catch(x => this.toastr.error(x, "Operación fallida"));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
