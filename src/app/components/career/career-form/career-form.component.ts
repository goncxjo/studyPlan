import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';
import { tap } from 'rxjs/operators'

import { CareerService } from '../../../services/career.service';

@Component({
  selector: 'app-career-form',
  templateUrl: './career-form.component.html',
  styleUrls: ['./career-form.component.css']
})
export class CareerFormComponent implements OnInit {
  careerForm: FormGroup;
  levels: any[];
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute, 
    private location: Location, 
    private careerService: CareerService, 
    private toastr: ToastrService, 
    public ngProgress: NgProgress, 
    private fb: FormBuilder
  ) {
    this.careerForm = this.fb.group({
      $key: '',
      name: '',
      length: '',
      level: '',
      about: '',
      goals: '',
      universityId: '',
      departmentId: '',
      options: this.fb.array([])
    });

  }

  ngOnInit() {
    this.startLoading();
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      this.editMode ? this.fillForm() : this.completeLoading();
    });
  }
  
  get optionsForm() {
    return this.careerForm.get('options') as FormArray;
  }

  addNewOption() {
    const options = this.fb.group({
      name: '',
    });

    this.optionsForm.push(options);
  }

  addOption(options) {
    this.optionsForm.push(options);
  }

  deleteOption(index) {
    this.optionsForm.removeAt(index);
  }

  fillForm() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.careerService.getCareerById(id).pipe(
      tap(career => {
        career.$key = id || '';
        this.careerForm.patchValue({
          $key: career.$key,
          name: career.name || '',
          length: career.length || '',
          level: career.level || '',
          about: career.about || '',
          goals: career.goals || '',
          departmentId: career.departmentId || '',
          universityId: career.universityId || '',
        });
        this.getOptions(career);
      })).subscribe(() => this.completeLoading());
  }

  getOptions(career) {
    if (career.options) {
      this.careerService.getOptions().pipe(
        tap(options => {
          options
            .filter(o => o.careerId == career.$key)
            .forEach(o => {
              const group = this.fb.group({
                $key: o.$key,
                name: o.name,
              });
              this.addOption(group);
            })
        })
      ).subscribe();
    }
  }

  onUniversityChange() {
    this.careerForm.patchValue({ departmentId: '', options: [] });
  }

  onSubmit() {
    this.startLoading();
    if (!this.editMode) {
      this.careerService.addCareer(this.careerForm.value).then(onSuccess).catch(onError);
    } else {
      this.careerService.updateCareer(this.careerForm.value).then(onSuccess).catch(onError);
    }

    function onSuccess() {
      this.completeLoading();
      this.toastr.success("Carrera" + (this.editMode ? "actualizada" : "creada"), "Operación exitosa");
      this.goBack();
    }
    
    function onError(msg) {
      this.completeLoading();
      this.toastr.error(msg, "Operación fallida");
    }
  }

  goBack(): void {
    this.location.back();
  }

  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }
}
