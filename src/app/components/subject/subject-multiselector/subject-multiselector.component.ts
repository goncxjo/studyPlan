import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject';

@Component({
  selector: 'app-subject-multiselector',
  templateUrl: './subject-multiselector.component.html',
  styleUrls: ['./subject-multiselector.component.css']
})
export class SubjectMultiselectorComponent implements OnInit {
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