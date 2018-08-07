import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student/student';

@Component({
  selector: 'app-student-plan',
  templateUrl: './student-plan.component.html',
  styleUrls: ['./student-plan.component.css']
})
export class StudentPlanComponent implements OnInit {

  student: Student = new Student();
  isReady: Boolean = false;

  constructor(
    private route: ActivatedRoute
    , private location: Location
    , private studentService: StudentService
    , private toastr: ToastrService
    , public ngProgress: NgProgress
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

  getUniversityId() {
    return this.student ? this.student['universityId'] || '' : '';
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
