import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { StudentService } from '../../../services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute,
    private location: Location, 
    private studentService: StudentService, 
    private toastr: ToastrService, 
    public ngProgress: NgProgress, 
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      $key: '',
      studentId: '',
      name: '',
      age: '',
      universityId: '',
      careerId: '',
      careerOptionId: '',
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
    this.studentService.getStudentById(id).pipe(
      tap(student => {
        student.$key = id || '';
        this.studentForm.patchValue({
          $key: student.$key || '',
          studentId: student.studentId || '',
          name: student.name || '',
          age: student.age || '',
          universityId: student.universityId || '',
          careerId: student.careerId || '',
          careerOptionId: student.careerOptionId || '',
        })
      })).subscribe(() => this.completeLoading());
  }

  onSubmit() {
    this.startLoading();
    if (!this.editMode) {
      this.studentService.addStudent(this.studentForm.value).then(onSuccess).catch(onError);
    } else {
      this.studentService.updateStudent(this.studentForm.value).then(onSuccess).catch(onError);
    }

    function onSuccess() {
      this.completeLoading();
      this.toastr.success("Estudiante" + (this.editMode ? "actualizado" : "creado"), "Operación exitosa");
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
