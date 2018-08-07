import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit {
  subjectForm: FormGroup;
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute
    , private location: Location
    , private subjectService: SubjectService
    , private toastr: ToastrService
    , public ngProgress: NgProgress
    , private fb: FormBuilder
  ) {
    this.subjectForm = this.fb.group({
      $key: '',
      name: '',
      code: '',
      year: '',
      quarter: '',
      classLoad: '',
      credits: 0,
      correlatives: this.fb.group({
        regularized: [],
        approved: []
      }),
      universityId: '',
      careerId: '',
      careerOptions: [],
      isCrossDisciplinary: false,
    });
  }

  ngOnInit() {
    this.startLoading();
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      this.editMode ? this.fillForm() : this.completeLoading();
    });
  }

  fillForm() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.subjectService.getSubjectById(id).pipe(
      tap(subject => {
        subject.$key = id || '';
        this.subjectForm.patchValue({
          $key: subject.$key || '',
          name: subject.name || '',
          code: subject.code || '',
          year: subject.year || '',
          quarter: subject.quarter || '',
          classLoad: subject.classLoad || '',
          credits: subject.credits || '',
          universityId: subject.universityId || '',
          careerId: subject.careerId || '',
          careerOptions: subject.careerOptions || '',
          isCrossDisciplinary: subject.isCrossDisciplinary,
        });
        this.addCorrelatives(subject);
      })).subscribe(() => this.completeLoading());
  }

  addCorrelatives(subject) {
    if (!subject.correlatives) {
      this.subjectForm.patchValue({
        correlatives: { approved: [], regularized: [] }
      });
    } else {
      this.subjectForm.patchValue({
        correlatives: {
          approved: subject.correlatives.approved || [],
          regularized: subject.correlatives.regularized || [],
        }
      });
    }
  }

  onUniversityChange() {
    this.subjectForm.patchValue({ careerId: '', careerOptions: [] });
  }

  onCareerChange() {
    this.subjectForm.patchValue({ careerOptions: [] });
  }

  onSubmit() {
    this.startLoading();
    if (!this.editMode) {
      this.subjectService.addSubject(this.subjectForm.value)
      .then(() => this.onSuccess())
      .catch((msg) => this.onError(msg));
    } else {
      this.subjectService.updateSubject(this.subjectForm.value)
      .then(() => this.onSuccess())
      .catch((msg) => this.onError(msg));
    }
  }

  onSuccess() {
    this.completeLoading();
    this.toastr.success('Asignatura ' + (this.editMode ? 'actualizada' : 'creada'), 'Operación exitosa');
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
