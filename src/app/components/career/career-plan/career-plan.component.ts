import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career';

@Component({
  selector: 'app-career-plan',
  templateUrl: './career-plan.component.html',
  styleUrls: ['./career-plan.component.css']
})
export class CareerPlanComponent implements OnInit {

  filter: Career = new Career();
  isReady: Boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private location: Location, 
    public ngProgress: NgProgress, 
    private careerService: CareerService
  ) {}

  ngOnInit() {
    this.startLoading();
    this.getCareer();
  }
  
  getCareer() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.careerService.getCareerById(id).subscribe(c => {
      this.filter = c;
      this.filter.$key = id;
      this.isReady = true;
      this.completeLoading();
    });
  }

  getCareerId() {
    return this.filter ? this.filter['$key'] : '';
  }

  getCareerOptionId() {
    return this.filter ? this.filter.options ? this.filter.options : '' : '';
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
