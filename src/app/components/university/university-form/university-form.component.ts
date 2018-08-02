import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

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
    private route: ActivatedRoute, 
    private location: Location, 
    private universityService: UniversityService, 
    private headquarterService: HeadquartersService, 
    private departmentService: DepartmentService, 
    private toastr: ToastrService, 
    public ngProgress: NgProgress, 
    private fb: FormBuilder
  ) {
    this.universityForm = this.fb.group({
      $key: '',
      name: '',
      headquarters: this.fb.array([]),
      departments: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.startLoading();
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      this.editMode ? this.fillForm() : this.completeLoading();
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
    ).subscribe(() => this.completeLoading());
  }

  getHeadquarters(university) {
    if (university.headquarters) {
      this.headquarterService.getAllHeadquarters().pipe(
        tap(headquartersList => {
          headquartersList
            .filter(h => h.universityId === university.$key)
            .forEach(h => {
              const group = this.fb.group({
                $key: h.$key,
                name: h.name,
                address: h.address,
                city: h.city,
                country: h.country,
                telephone: h.telephone
              });
              this.addHeadquarters(group);
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
            .filter(d => d.universityId === university.$key)
            .forEach(d => {
              const group = this.fb.group({
                $key: d.$key,
                name: d.name,
              });
              this.addDepartment(group);
            });
        })
      ).subscribe();
    }
  }

  onSubmit() {
    this.startLoading();
    if (!this.editMode) {
      this.universityService.addUniversity(this.universityForm.value)
      .then(() => this.onSuccess())
      .catch((msg) => this.onError(msg));
    } else {
      this.universityService.updateUniversity(this.universityForm.value)
      .then(() => this.onSuccess())
      .catch((msg) => this.onError(msg));
    }
  }

  onSuccess() {
    this.completeLoading();
    this.toastr.success('Universidad' + (this.editMode ? 'actualizada' : 'creada'), 'Operación exitosa');
    this.goBack();
  }
  
  onError(msg) {
    this.completeLoading();
    this.toastr.error(msg, 'Operación fallida');
  }

  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }

  goBack(): void {
    this.location.back();
  }
}
