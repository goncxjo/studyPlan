import { Component, Input, OnInit, SimpleChange, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career/career';

@Component({
  selector: 'app-career-selector',
  templateUrl: './career-selector.component.html',
  styleUrls: ['./career-selector.component.css']
})
export class CareerSelectorComponent {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterUniversityId: string;
  @Input() disabled: Boolean;
  @Input() model: string;
  @Output() modelChange = new EventEmitter();

  careers: Career[];
  filterResult: Career[];

  constructor(private careerService: CareerService) {
    this.getCareers();
  }

  getCareers() {
    this.careerService.getCareerMiniList().subscribe(careers => {
      this.careers = careers;
      this.filterByUniversityId(this.filterUniversityId);
    });
  }

  change(newValue) {
    if (!this.disabled) {
      this.model = newValue;
      this.modelChange.emit(newValue);
    }
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['filterUniversityId'] && !changes['filterUniversityId'].isFirstChange()) {
      this.filterByUniversityId(changes['filterUniversityId'].currentValue);
    }
  }

  filterByUniversityId(universityId: string) {
    const filterUniversityId = universityId || '';
    this.filterResult = this.careers ? this.careers.filter(c => c.universityId === filterUniversityId) : [];
  }
}
