import { Component, Input, SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubjectService } from '../../../services/subject.service';
import { SubjectMiniList } from '../../../models/subject/subject';

@Component({
  selector: 'app-subject-multiselector',
  templateUrl: './subject-multiselector.component.html',
  styleUrls: ['./subject-multiselector.component.css']
})
export class SubjectMultiselectorComponent {
  @Input() parent: FormGroup;
  @Input() name: string;
  @Input() filterUniversityId: string;
  @Input() filterCareerId: string;
  @Input() filterIsCrossDisciplinary: boolean;

  subjects: SubjectMiniList[];
  filterResult: SubjectMiniList[];

  constructor(private subjectService: SubjectService) {
    this.getSubjects();
  }

  getSubjects() {
    this.subjectService.getSubjectMiniList().subscribe(subjects => { this.subjects = subjects; });
  }

  ngOnChanges(changes: SimpleChange) {
    let filterUniversityId = this.filterUniversityId || '_';
    let filterCareerId = this.filterCareerId || '_';

    if (changes['filterUniversityId']) {
      filterUniversityId = changes['filterUniversityId'].currentValue || filterUniversityId;
    }
    if (changes['filterCareerId']) {
      filterCareerId = changes['filterCareerId'].currentValue || filterUniversityId;
    }

    if (this.filterIsCrossDisciplinary) {
      this.filterResult = this.subjects ? this.subjects.filter(s => {
        return s.universityId === filterUniversityId && s.isCrossDisciplinary === true;
      }) : [];
    } else {
      this.filterResult = this.subjects ? this.subjects.filter(s => s.careerId === filterCareerId) : [];
    }
  }
}
