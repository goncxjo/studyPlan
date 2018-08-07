import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { SubjectService } from '../../../services/subject.service';
import { SubjectList } from '../../../models/subject/subject';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  subjects: SubjectList[];
  searchResult: SubjectList[] = [];
  filter: SubjectList = new SubjectList();
  isReady: Boolean = false;

  constructor(
    private subjectService: SubjectService
    , private toastr: ToastrService
    , public ngProgress: NgProgress
  ) { }

  ngOnInit() {
    this.startLoading();
    this.getSubjects();
  }

  getSubjects() {
    this.subjectService.getSubjectList().subscribe(subjects => {
      this.subjects = this.searchResult = subjects;
      this.isReady = true;
      this.completeLoading();
    });
  }

  onDelete($key: string) {
    if (confirm('¿Estás seguro?')) {
      this.startLoading();
      this.subjectService.deleteSubject($key)
      .then(() => this.onSuccess())
      .catch((msg) => this.onError(msg));
    }
  }

  onSuccess() {
    this.completeLoading();
    this.toastr.success('Asugnatura eliminada', 'Operación exitosa');
  }

  onError(msg) {
    this.completeLoading();
    this.toastr.error(msg, 'Operación fallida');
  }

  search() {
    this.searchResult = this.subjects.filter(s =>
      s.universityId.includes(this.filter.universityId) &&
      (s.careerId.includes(this.filter.careerId) || s.isCrossDisciplinary) &&
      s.name.toLowerCase().includes(this.filter.name.toLowerCase())
    );
    if (this.filter.year) {
      this.searchResult = this.searchResult.filter(s => s.year === this.filter.year);
    }
    if (this.filter.quarter) {
      this.searchResult = this.searchResult.filter(s => s.quarter === this.filter.quarter);
    }
  }

  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }
}
