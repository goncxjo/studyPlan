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
    private route: ActivatedRoute, 
    private location: Location, 
    private subjectService: SubjectService, 
    private toastr: ToastrService, 
    public ngProgress: NgProgress, 
    private fb: FormBuilder
  ) {
    this.subjectForm = this.fb.group({
      $key: '',
      name: '',
      code: '',
      year: '',
      quarter: '',
      classLoad: '',
      credits: '',
      correlatives: this.fb.group({
        regularized: [],
        approved: []
      }),
      universityId: '',
      careerId: '',
      careerOptions: [],
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
        })
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

  onSubmit() {
    this.startLoading();
    if (!this.editMode) {
      this.subjectService.addSubject(this.subjectForm.value).then(onSuccess).catch(onError);
    } else {
      this.subjectService.updateSubject(this.subjectForm.value).then(onSuccess).catch(onError)
    }

    function onSuccess() {
      this.completeLoading();
      this.toastr.success("Asignatura" + (this.editMode ? "actualizada" : "creada"), "Operación exitosa");
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
