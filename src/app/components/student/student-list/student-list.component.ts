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
  searchResult: Student[] = [];
  filter: Student = new Student();

  constructor(private studentService: StudentService, private universityService: UniversityService, private careerService: CareerService, private toastr: ToastrService) {}

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudents().pipe(
      tap(ss => this.students = this.searchResult = ss),
      flatMap(ss => ss
        .map(s => {
          this.getUniversities(s);
          this.getCareers(s);
          this.getCareerOptions(s);
        }))
    ).subscribe();
  }

  getUniversities(student) {
    this.universityService.getUniversities().pipe(
        map(us =>
          us.map(u => {
            return {
              $key: u.$key,
              name: u.name
            }
          })))
      .subscribe(us => {
        student.university = us.find(x => x.$key == student.universityId)
      });
  }
  getCareers(student) {
    this.careerService.getCareers().pipe(
        map(cs =>
          cs.map(c => {
            return {
              $key: c.$key,
              name: c.name
            }
          })))
      .subscribe(cs => {
        student.career = cs.find(x => x.$key == student.careerId)
      });
  }
  getCareerOptions(student) {
    this.careerService.getOptions().pipe(
        map(cs =>
          cs.map(c => {
            return {
              $key: c.$key,
              name: c.name
            }
          })))
      .subscribe(cs => {
        student.careerOption = cs.find(x => x.$key == student.careerOptionId)
      });
  }

  onDelete($key: string) {
    if (confirm('¿Estás seguro?')) {
      this.studentService.deleteStudent($key)
        .then(x => this.toastr.success("Estudiante eliminado", "Operación exitosa"))
        .catch(x => this.toastr.success(x, "Operación fallida"));
    }
  }

  search() {
    this.searchResult = this.students.filter(c =>
      c.universityId.includes(this.filter.universityId) &&
      c.careerId.includes(this.filter.careerId) &&
      c.careerOptionId.includes(this.filter.careerOptionId) &&
      c.name.toLowerCase().includes(this.filter.name.toLowerCase())
    );
  }
}
