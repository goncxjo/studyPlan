import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder
} from '../../../../../node_modules/@angular/forms';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Location
} from '@angular/common';

import {
  ToastrService
} from 'ngx-toastr';
import {
  SubjectService
} from '../../../services/subject.service';
import {
  Subject
} from '../../../models/subject';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit {
  subjectForm: FormGroup;
  selectedSubject: Subject = new Subject();
  private editMode = this.route.routeConfig.path.toString().includes('edit');

  constructor(
    private route: ActivatedRoute, private location: Location, private subjectService: SubjectService, private toastr: ToastrService, private fb: FormBuilder
  ) {
    this.subjectForm = this.fb.group({
      $key: [''],
      name: [''],
      code: [''],
      classLoad: [''],
      quarter: [''],
      state: [''],
      correlatives: this.fb.group({
        regularized: [{}],
        approved: [{}]
      }),
    });
  }

  ngOnInit() {
    if(this.editMode) {
      this.getSubject();
    }
  }

  getSubject() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.subjectService.getSubjectById(id)
      .subscribe(subject => {
        this.subjectForm.setValue({
          $key: id,
          name: !subject.name ? '' : subject.name,
          code: !subject.code ? '' : subject.code,
          classLoad: !subject.classLoad ? '' : subject.classLoad,
          state: !subject.state ? '' : subject.state,
          quarter: !subject.quarter ? '' : subject.quarter,
          correlatives: !subject.correlatives ? {} : subject.correlatives
        })
      });
  }

  onSubmit() {
    if (!this.editMode) {
      this.subjectService.addSubject(this.subjectForm.value);
      this.toastr.success("Subject created", "Successfull operation");
    } else {
      this.subjectService.updateSubject(this.subjectForm.value);
      this.toastr.success("Subject edited", "Successfull operation");
    }
    this.goBack();
  }

  goBack(): void {
    this.location.back();
  }
}
