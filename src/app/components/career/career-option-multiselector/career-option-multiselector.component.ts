import { Component, Input, OnInit, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CareerService } from '../../../services/career.service';
import { CareerOption } from '../../../models/career';

@Component({
  selector: 'app-career-option-multiselector',
  templateUrl: './career-option-multiselector.component.html',
  styleUrls: ['./career-option-multiselector.component.css']
})
export class CareerOptionMultiselectorComponent {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterCareerId: string;
  @Input() model: string;
  @Output() modelChange = new EventEmitter();
  
  options: CareerOption[];
  filterResult: CareerOption[];

  constructor(private careerService: CareerService) {
    this.filterResult = [];
    this.getOptions();
  }

  getOptions() {
    this.careerService.getOptions().subscribe(options => {
       this.options = options;
      });
  }

  change(newValue) {
    this.model = newValue;
    this.modelChange.emit(newValue);
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['filterCareerId']) {
      const filterCareerId = changes['filterCareerId'].currentValue || '';
      this.filterResult = this.options ? this.options.filter(o => o.careerId === filterCareerId) : [];
      this.change('');
    }
  }
}
