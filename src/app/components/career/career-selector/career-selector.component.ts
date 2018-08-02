import { Component, Input, OnInit, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career';

@Component({
  selector: 'app-career-selector',
  templateUrl: './career-selector.component.html',
  styleUrls: ['./career-selector.component.css']
})
export class CareerSelectorComponent {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterUniversityId: string;
  @Input() model: string;
  @Output() modelChange = new EventEmitter();

  careers: Career[];
  filterResult: Career[];

  constructor(private careerService: CareerService) {
    this.filterResult = [];
    this.getCareers();
  }
  
  getCareers() {
    this.careerService.getCareers().subscribe(careers => {
      this.careers = careers;
    });
  }

  change(newValue) {
    this.model = newValue;
    this.modelChange.emit(newValue);
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['filterUniversityId']) {
      const filterUniversityId = changes['filterUniversityId'].currentValue || '';
      this.filterResult = this.careers ? this.careers.filter(c => c.universityId === filterUniversityId) : [];
      this.change('');
    }
  }
}
