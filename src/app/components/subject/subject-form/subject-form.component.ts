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
        this.subjectForm.patchValue({
          $key: id,
          name: !subject.name ? '' : subject.name,
          code: !subject.code ? '' : subject.code,
          classLoad: !subject.classLoad ? '' : subject.classLoad,
          year: !subject.year ? '' : subject.year,
          quarter: !subject.quarter ? '' : subject.quarter,
          credits: !subject.credits ? '' : subject.credits,
          career: !subject.career ? '' : subject.career,
          careerOption: !subject.careerOption ? '' : subject.careerOption
        });

        if (!subject.correlatives) {
          this.subjectForm.patchValue({
            correlatives: { approved: {}, regularized: {} }
          });
        } else {
          this.subjectForm.patchValue({
            correlatives: {
              approved: !subject.correlatives.approved ? {} : subject.correlatives.approved,
              regularized: !subject.correlatives.regularized ? {} : subject.correlatives.regularized
            }
          });
        }
      });
  }

  onSubmit() {
    if (!this.editMode) {
      this.subjectService.addSubject(this.subjectForm.value)
        .then(x => {
          this.toastr.success("Asignatura creada", "Operación exitosa");
          this.goBack();
        }, (r => this.toastr.error(r, "Operación fallida"))
      );
    } else {
      this.subjectService.updateSubject(this.subjectForm.value)
        .then(x => {
          this.toastr.success("Asignatura editada", "Operación exitosa");
          this.goBack();
        })
        .catch(x => this.toastr.error(x, "Operación fallida"));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
