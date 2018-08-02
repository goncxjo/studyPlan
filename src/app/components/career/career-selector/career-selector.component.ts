import { Component, Input, OnInit, SimpleChange, EventEmitter, Output } from '@angular/core';
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
  @Input() model: string;
  @Output() modelChange = new EventEmitter();

  careers: Career[];
  filterResult: Career[];

  constructor(private careerService: CareerService) { }

  ngOnInit() {
    this.change('');
    this.getCareers();
  }
  
  getCareers() {
    this.careerService.getCareers().subscribe(careers => {
      this.careers = this.filterResult = careers;
    });
  }

  change(newValue) {
    this.model = newValue;
    this.modelChange.emit(newValue);
  }

  ngOnChanges(changes: SimpleChange) {
    if(changes['filterUniversityId'] && !changes['filterUniversityId'].isFirstChange()) {
      const filterUniversityId = changes['filterUniversityId'].currentValue || '';
      this.filterResult = this.careers.filter(c => c.universityId == filterUniversityId);
      this.change('');
    }
  }
}