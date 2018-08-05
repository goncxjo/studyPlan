import { Component, Input, OnInit, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CareerService } from '../../../services/career.service';
import { CareerOption } from '../../../models/career';

@Component({
  selector: 'app-career-option-selector',
  templateUrl: './career-option-selector.component.html',
  styleUrls: ['./career-option-selector.component.css']
})
export class CareerOptionSelectorComponent {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterCareerId: string;
  @Input() disabled: Boolean;
  @Input() model: string;
  @Output() modelChange = new EventEmitter();
  
  options: CareerOption[];
  filterResult: CareerOption[];

  constructor(private careerService: CareerService) {
    this.getOptions();
  }
  
  getOptions() {
    this.careerService.getOptions().subscribe(options => {
      this.options = options;
      this.filterByCareerId(this.filterCareerId);
      });
  }

  change(newValue) {
    if (!this.disabled) {
      this.model = newValue;
      this.modelChange.emit(newValue);
    }
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['filterCareerId'] && !changes['filterCareerId'].isFirstChange()) {
      this.filterByCareerId(changes['filterCareerId'].currentValue);
    }
  }

  filterByCareerId(careerId: string) {
    const filterCareerId = careerId || '';
    this.filterResult = this.options ? this.options.filter(o => o.careerId === filterCareerId) : [];
    this.change('');
  }
}
