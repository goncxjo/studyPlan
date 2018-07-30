import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { StudentService } from '../../../services/student.service';
import { UniversityService } from '../../../services/university.service';
import { CareerService } from '../../../services/career.service';
import { Student } from '../../../models/student';
import { map, tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students: Student[];

  constructor(private studentService: StudentService, private universityService: UniversityService, private careerService: CareerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudents().pipe(
      tap(ss => this.students = ss),
      flatMap(ss => ss
        .map(s => {
          this.universityService.getUniversityById(s.universityId).pipe(map(u => u.name)).subscribe(n => s.universityId = n);
          this.careerService.getCareerById(s.careerId).pipe(map(c => c.name)).subscribe(n => s.careerId = n);
          this.careerService.getCareerById(s.careerOptionId).pipe(map(c => c.name)).subscribe(n => s.careerOptionId = n);
        } ))
    ).subscribe();
  }

  onDelete($key: string){
    if (confirm('¿Estás seguro?')) {
      this.studentService.deleteStudent($key)
      .then(x => this.toastr.success("Estudiante eliminado", "Operación exitosa"))
      .catch(x => this.toastr.success(x, "Operación fallida"));
    }
  }
}