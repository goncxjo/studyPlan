import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { map, tap, flatMap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { StudentService } from '../../../services/student.service';

import { University } from '../../../models/university';
import { Career, CareerOption } from '../../../models/career';
import { Student } from '../../../models/student';

@Component({
  selector: 'app-student-plan',
  templateUrl: './student-plan.component.html',
  styleUrls: ['./student-plan.component.css']
})
export class StudentPlanComponent implements OnInit {

  student: Student = new Student();
  universities: University[];
  careers: Career[];
  careerOptions: CareerOption[];
  isReady: Boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private location: Location, 
    private studentService: StudentService,
    private toastr: ToastrService,
    public ngProgress: NgProgress  
  ) {}

  ngOnInit() {
    this.startLoading();
    this.getStudent();
  }
  
  getStudent() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.studentService.getStudentById(id).subscribe(s => {
      this.student = s;
      this.student.$key = id;
      this.isReady = true;
      this.completeLoading();
    });
  }

  getCareerId() {
    return this.student ? this.student['careerId'] || '' : '';
  }
  
  getCareerOptionId() {
    return this.student ? this.student['careerOptionId'] || '' : '';
  }
  
  startLoading() {
    this.ngProgress.start();
  }
  
  completeLoading() {
    this.ngProgress.done();
  }

  goBack(): void {
    this.location.back();
  }

}
