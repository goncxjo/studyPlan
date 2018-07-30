import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute, private location: Location, private studentService: StudentService, private toastr: ToastrService, private fb: FormBuilder
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
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      if (this.editMode) {
        this.fillForm();
      }
    });
  }

  fillForm() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.studentService.getStudentById(id)
      .subscribe(student => {
        student.$key = id || '';
        this.studentForm.patchValue({
          $key: student.$key || '',
          studentId: student.studentId || '',
          name: student.name || '',
          age: student.age || '',
          universityId: student.universityId || '',
          careerId: student.careerId || '',
          careerOptionId: student.careerOptionId || '',
        });
      });
  }

  onSubmit() {
    if (!this.editMode) {
      this.studentService.addStudent(this.studentForm.value)
        .then(x => {
          this.toastr.success("Estudiante creado", "Operación exitosa");
          this.goBack();
        }, (r => this.toastr.error(r, "Operación fallida"))
        );
    } else {
      this.studentService.updateStudent(this.studentForm.value)
        .then(x => {
          this.toastr.success("Estudiante editado", "Operación exitosa");
          this.goBack();
        })
        .catch(x => this.toastr.error(x, "Operación fallida"));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
