import { Component, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CareerService } from '../../../services/career.service';
import { CareerOptionMiniList } from '../../../models/career/option';

@Component({
  selector: 'app-career-option-multiselector',
  templateUrl: './career-option-multiselector.component.html',
  styleUrls: ['./career-option-multiselector.component.css']
})
export class CareerOptionMultiselectorComponent {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterCareerId: string;
  @Input() disabled: Boolean;
  @Input() model: string;
  @Output() modelChange = new EventEmitter();

  options: CareerOptionMiniList[];
  filterResult: CareerOptionMiniList[];

  constructor(private careerService: CareerService) {
    this.filterResult = [];
    this.getOptions();
  }

  getOptions() {
    this.careerService.getOptionMiniList().subscribe(options => {
       this.options = options;
      });
  }

  change(newValue) {
    if (!this.disabled) {
      this.model = newValue;
      this.modelChange.emit(newValue);
    }
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['filterCareerId']) {
      const filterCareerId = changes['filterCareerId'].currentValue || '';
      this.filterResult = this.options ? this.options.filter(o => o.careerId === filterCareerId) : [];
      this.change('');
    }
  }
}
