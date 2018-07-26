import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit {
  subjectForm: FormGroup;
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute, private location: Location, private subjectService: SubjectService, private toastr: ToastrService, private fb: FormBuilder
  ) {
    this.subjectForm = this.fb.group({
      $key: [''],
      name: [''],
      code: [''],
      year: [''],
      quarter: [''],
      classLoad: [''],
      credits: [''],
      correlatives: this.fb.group({
        regularized: [{}],
        approved: [{}]
      }),
      career: [''],
      careerOption: [''],
    });
  }

  ngOnInit() {
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      if (this.editMode) {
        this.getSubject();
      }
    });
  }

  getSubject() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.subjectService.getSubjectById(id)
      .subscribe(subject => {
        this.subjectForm.controls['$key'].setValue(id);
        this.subjectForm.controls['name'].setValue(!subject.name ? '' : subject.name);
        this.subjectForm.controls['code'].setValue(!subject.code ? '' : subject.code);
        this.subjectForm.controls['classLoad'].setValue(!subject.classLoad ? '' : subject.classLoad);
        this.subjectForm.controls['year'].setValue(!subject.year ? '' : subject.year);
        this.subjectForm.controls['quarter'].setValue(!subject.quarter ? '' : subject.quarter);
        this.subjectForm.controls['credits'].setValue(!subject.credits ? '' : subject.credits);
        this.subjectForm.controls['career'].setValue(!subject.career ? '' : subject.career);
        this.subjectForm.controls['careerOption'].setValue(!subject.careerOption ? '' : subject.careerOption);

        if (!subject.correlatives) {
          this.subjectForm.controls['correlatives'].setValue({ approved: {}, regularized: {} })
        } else {
          this.subjectForm.controls['correlatives'].setValue({
            approved: !subject.correlatives.approved ? {} : subject.correlatives.approved,
            regularized: !subject.correlatives.regularized ? {} : subject.correlatives.regularized
          })
        }
      });
  }

  onSubmit() {
    if (!this.editMode) {
      this.subjectService.addSubject(this.subjectForm.value)
        .then(x => {
          this.toastr.success("Asignatura creada", "Operación exitosa");
          this.goBack();
        }
        ).catch(x => this.toastr.error(x, "Operación fallida"));
    } else {
      this.subjectService.updateSubject(this.subjectForm.value)
        .then(x => {
          this.toastr.success("Asignatura editada", "Operación exitosa");
          this.goBack();
        }
        ).catch(x => this.toastr.error(x, "Operación fallida"));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
