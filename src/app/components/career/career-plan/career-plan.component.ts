import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career/career';
import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student/student';

@Component({
  selector: 'app-career-plan',
  templateUrl: './career-plan.component.html',
  styleUrls: ['./career-plan.component.css']
})
export class CareerPlanComponent implements OnInit {

  private careerView: boolean;
  career: Career = new Career();
  student: Student = new Student();
  isReady: Boolean = false;
  selectedOption: string;

  constructor(
    private route: ActivatedRoute
    , private location: Location
    , public ngProgress: NgProgress
    , private careerService: CareerService
    , private studentService: StudentService
  ) {}

  ngOnInit() {
    this.startLoading();
    this.route.data.subscribe(d => {
      this.careerView = d['careerView'];
      this.careerView ? this.getCareer() : this.getStudent();
    });
    this.getSubjects();
  }

  getCareer() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.careerService.getCareerById(id).subscribe(c => {
      this.career = c;
      this.career.$key = id;
      this.career['selectedCareerOption'] = this.career['options'] ? this.career.options[0] : '';
      this.selectedOption = this.career['selectedCareerOption'];
      this.isReady = true;
      this.completeLoading();
    });
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

  getSubjects() {
    
  }

  sendFiltersToNetwork() {
    this.selectedOption = this.career['selectedCareerOption'] || this.selectedOption;
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
