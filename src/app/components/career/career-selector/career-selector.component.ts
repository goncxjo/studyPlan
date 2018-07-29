import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career';

@Component({
  selector: 'app-career-selector',
  templateUrl: './career-selector.component.html',
  styleUrls: ['./career-selector.component.css']
})
export class CareerSelectorComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterUniversityId: string;

  careers: Career[];

  constructor(private careerService: CareerService) { }

  ngOnInit() {
    this.getCareers();
  }
  
  getCareers() {
    this.careerService.getCareers().subscribe(careers => {
      this.careers = careers
      console.log(this.careers);
    });
  }

  reset() {
    this.parent.reset();
  }
}