import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '../../../../../node_modules/@angular/forms';

import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject';

@Component({
  selector: 'app-subject-selector',
  templateUrl: './subject-selector.component.html',
  styleUrls: ['./subject-selector.component.css']
})
export class SubjectSelectorComponent implements OnInit {
  @Input() parent: FormGroup;
  @Input() name: string;

  subjects: Subject[];

  constructor(private subjectService: SubjectService) { }

  ngOnInit() {
    this.getSubjects();
  }
  
  getSubjects() {
    this.subjectService.getSubjects().subscribe(subjects => { this.subjects = subjects });
  }
}