import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CareerService } from '../../../services/career.service';
import { CareerOption } from '../../../models/career';

@Component({
  selector: 'app-career-option-multiselector',
  templateUrl: './career-option-multiselector.component.html',
  styleUrls: ['./career-option-multiselector.component.css']
})
export class CareerOptionMultiselectorComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterCareerId: string;

  options: CareerOption[];

  constructor(private careerService: CareerService) { }

  ngOnInit() {
    this.getOptions();
  }
  
  getOptions(name?: string, universityId?: string) {
    this.careerService.getOptionsByCareerId(universityId).subscribe(options => { this.options = options });
  }

  ngOnChanges(changes: SimpleChange) {
    const filterCareerId = !changes['filterUniversityId'] ? '' : changes['filterUniversityId'].currentValue;

    this.getOptions(filterCareerId);
  }
}