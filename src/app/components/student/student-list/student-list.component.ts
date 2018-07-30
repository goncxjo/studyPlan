import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students: Student[];

  constructor(private studentService: StudentService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudents().subscribe(students => { this.students = students });
  }

  onDelete($key: string){
    if (confirm('¿Estás seguro?')) {
      this.studentService.deleteStudent($key)
      .then(x => this.toastr.success("Estudiante eliminado", "Operación exitosa"))
      .catch(x => this.toastr.success(x, "Operación fallida"));
    }
  }

  showPlan($key: string) {

  }
}