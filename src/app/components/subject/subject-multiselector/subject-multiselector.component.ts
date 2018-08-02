import { Component, Input, SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject';

@Component({
  selector: 'app-subject-multiselector',
  templateUrl: './subject-multiselector.component.html',
  styleUrls: ['./subject-multiselector.component.css']
})
export class SubjectMultiselectorComponent {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterCareerId: string;

  subjects: Subject[];
  filterResult: Subject[];

  constructor(private subjectService: SubjectService) {
    this.getSubjects();
  }
  
  getSubjects() {
    this.subjectService.getSubjects().subscribe(subjects => { this.subjects = subjects; });
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['filterCareerId']) {
      const filterCareerId = changes['filterCareerId'].currentValue || '';
      this.filterResult = this.subjects ? this.subjects.filter(s => s.careerId === filterCareerId) : [];
    }
  }
}
