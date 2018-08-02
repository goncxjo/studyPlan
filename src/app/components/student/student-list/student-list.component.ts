import { Component, OnInit } from '@angular/core';
import { map, tap, flatMap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { UniversityService } from '../../../services/university.service';
import { CareerService } from '../../../services/career.service';
import { StudentService } from '../../../services/student.service';

import { University } from '../../../models/university';
import { Career, CareerOption } from '../../../models/career';
import { Student } from '../../../models/student';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  students: Student[];
  searchResult: Student[] = [];
  filter: Student = new Student();
  universities: University[];
  careers: Career[];
  careerOptions: CareerOption[];

  constructor(
    private studentService: StudentService,
    private universityService: UniversityService, 
    private careerService: CareerService, 
    private toastr: ToastrService,
    public ngProgress: NgProgress  
  ) { }

  ngOnInit() {
    this.startLoading();
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudents().pipe(
      tap(ss => this.students = this.searchResult = ss),
      flatMap(ss => ss
        .map(s => {
          this.getUniversities();
          this.getCareers();
          this.getCareerOptions();
        }))
    ).subscribe(() => this.completeLoading());
  }

  onDelete($key: string) {
    if (confirm('¿Estás seguro?')) {
      this.startLoading();
      this.studentService.deleteStudent($key).then(onSuccess).catch(onError);
    }

    function onSuccess() {
      this.completeLoading();
      this.toastr.success("Estudiante eliminado", "Operación exitosa");
    }
    
    function onError(msg) {
      this.completeLoading();
      this.toastr.success(msg, "Operación fallida");
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

  getUniversities() {
    this.universityService.getUniversities().subscribe(us => this.universities = us);
  }

  getCareers() {
    this.careerService.getCareers().subscribe(cs => this.careers = cs);
  }

  getCareerOptions() {
    this.careerService.getOptions().subscribe(cs => this.careerOptions = cs);
  }

  getUniversityName(student: Student) {
    const university = this.universities ? this.universities.find(x => x.$key.includes(student.universityId || '')) : [];
    return university ? university['name'] : '';
  }

  getCareerName(student: Student) {
    const career = this.careers ? this.careers.find(x => x.$key.includes(student.careerId || '')) : [];
    return career ? career['name'] : '';
  }

  getCareerOptionName(student: Student) {
    const option = this.careerOptions ? this.careerOptions.find(x => x.$key.includes(student.careerOptionId || '')) : [];
    return option ? option['name'] : '';
  }

  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }
}
