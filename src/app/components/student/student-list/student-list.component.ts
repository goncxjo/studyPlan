import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { StudentService } from '../../../services/student.service';
import { StudentList } from '../../../models/student/student';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students: StudentList[];
  searchResult: StudentList[] = [];
  filter: StudentList = new StudentList();

  isReady: Boolean = false;

  constructor(
    private studentService: StudentService
    , private toastr: ToastrService
    , public ngProgress: NgProgress
  ) { }

  ngOnInit() {
    this.startLoading();
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudentList().subscribe(students => {
      this.students = this.searchResult = students;
      this.isReady = true;
      this.completeLoading();
    });
  }

  onDelete($key: string) {
    if (confirm('¿Estás seguro?')) {
      this.startLoading();
      this.studentService.deleteStudent($key)
      .then(() => this.onSuccess())
      .catch((msg) => this.onError(msg));
    }
  }

  onSuccess() {
    this.completeLoading();
    this.toastr.success('Alumno eliminado', 'Operación exitosa');
  }

  onError(msg) {
    this.completeLoading();
    this.toastr.error(msg, 'Operación fallida');
  }

  search() {
    this.searchResult = this.students.filter(c =>
      c.universityId.includes(this.filter.universityId) &&
      c.careerId.includes(this.filter.careerId) &&
      c.careerOptionId.includes(this.filter.careerOptionId) &&
      c.name.toLowerCase().includes(this.filter.name.toLowerCase())
    );
  }

  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }
}
