import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career/career';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject/subject';
import { tap, map } from '../../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-career-plan',
  templateUrl: './career-plan.component.html',
  styleUrls: ['./career-plan.component.css']
})
export class CareerPlanComponent implements OnInit {

  career: Career = new Career();
  subjects: Subject[];
  filterSubjects: Subject[];
  isReady: Boolean = false;
  selectedOption: string;

  constructor(
    private route: ActivatedRoute
    , private location: Location
    , public ngProgress: NgProgress
    , private careerService: CareerService
    , private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.getCareer();
  }

  getCareer() {
    this.startLoading();
    const id = this.route.snapshot.paramMap.get('$key');
    this.careerService.getCareerById(id).pipe(
      tap(c => {
        this.career = c;
        this.career.$key = id;
        this.career['selectedCareerOption'] = '';
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
      const matchesUniversity = s.universityId === this.career['universityId'];
      const matchesCareer = (s.careerId === this.career['$key'] || s.isCrossDisciplinary);
      return matchesUniversity && matchesCareer && isEmptyOrContainsSelectedOption(s, this.career['selectedCareerOption']);

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
