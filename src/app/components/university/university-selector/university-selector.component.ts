import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UniversityService } from '../../../services/university.service';
import { UniversityMiniList } from '../../../models/university/university';

@Component({
  selector: 'app-university-selector',
  templateUrl: './university-selector.component.html',
  styleUrls: ['./university-selector.component.css']
})
export class UniversitySelectorComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() disabled: Boolean;
  @Input() model: string;
  @Output() modelChange = new EventEmitter();

  universities: UniversityMiniList[];

  constructor(private universityService: UniversityService) { }

  ngOnInit() {
    this.getUniversities();
  }

  getUniversities() {
    this.universityService.getUniversityMiniList().subscribe(universities => { this.universities = universities; });
  }

  change(newValue) {
    this.model = newValue;
    this.modelChange.emit(newValue);
  }
}
