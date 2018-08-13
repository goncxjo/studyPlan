import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { StudentService } from '../../../services/student.service';
import { Student } from '../../../models/student/student';
import { tap, map } from 'rxjs/operators';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject/subject';

@Component({
  selector: 'app-student-plan',
  templateUrl: './student-plan.component.html',
  styleUrls: ['./student-plan.component.css']
})
export class StudentPlanComponent implements OnInit {

  student: Student = new Student();
  subjects: Subject[];
  filterSubjects: Subject[] = [] as Subject[];
  isReady: Boolean = false;
  selectedOption: string;

  constructor(
    private route: ActivatedRoute
    , private location: Location
    , private studentService: StudentService
    , public ngProgress: NgProgress
    , private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.getStudent();
  }

  getStudent() {
    this.startLoading();
    const id = this.route.snapshot.paramMap.get('$key');
    this.studentService.getStudentById(id).pipe(
      tap(s => {
        this.student = s;
        this.student.$key = id;
        this.student['selectedCareerOption'] = this.student['careerOptionId'] || '';
      }),
      map(() => {
        this.subjectService.getSubjects().subscribe(subjects => {
          this.subjects = subjects;
          this.filterSubjects = this.getFilteredSubjects();
        });
      })
    ).subscribe(() => this.completeLoading());
  }

  sendFiltersToNetwork() {
    this.ngProgress.start();
    this.filterSubjects = this.getFilteredSubjects();
    this.ngProgress.done();
  }

  getFilteredSubjects() {
    return this.subjects.filter(s => {
      const matchesUniversity = s.universityId === this.student['universityId'];
      const matchesCareer = (s.careerId === this.student['careerId'] || s.isCrossDisciplinary);
      return matchesUniversity && matchesCareer && isEmptyOrContainsSelectedOption(s, this.student['selectedCareerOption']);

      function isEmptyOrContainsSelectedOption(subject, selectedOption) {
        return subject.careerOptions ? subject.careerOptions.find(o => o === selectedOption) : true;
      }
    });
  }

  startLoading() {
    this.isReady = false;
    this.ngProgress.start();
  }

  completeLoading() {
    this.isReady = true;
    this.ngProgress.done();
  }
  goBack(): void {
    this.location.back();
  }
}
