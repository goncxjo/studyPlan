import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UniversityService } from '../../../services/university.service';
import { University } from '../../../models/university';

@Component({
  selector: 'app-university-selector',
  templateUrl: './university-selector.component.html',
  styleUrls: ['./university-selector.component.css']
})
export class UniversitySelectorComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() name: string;

  universities: University[];

  constructor(private universityService: UniversityService) { }

  ngOnInit() {
    this.getUniversities();
  }
  
  getUniversities() {
    this.universityService.getUniversities().subscribe(universities => { this.universities = universities });
  }

  reset() {
    this.parent.reset();
  }
}