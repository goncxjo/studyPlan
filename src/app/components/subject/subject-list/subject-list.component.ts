import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  subjects: Subject[];
  searchResult: Subject[] = [];
  filter: Subject = new Subject();
  isReady: Boolean = false;

  constructor(
    private subjectService: SubjectService, 
    private toastr: ToastrService,
    public ngProgress: NgProgress
  ) { }

  ngOnInit() {
    this.startLoading();
    this.getSubjects();
  }

  getSubjects() {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = this.searchResult = subjects;
      this.isReady = true;
      this.completeLoading();
    });
  }

  onDelete($key: string){
    if (confirm('¿Estás seguro?')) {
      this.startLoading();
      this.subjectService.deleteSubject($key).then(onSuccess).catch(onError);
    }

    function onSuccess() {
      this.completeLoading();
      this.toastr.success("Asignatura eliminada", "Operación exitosa");
    }
    
    function onError(msg) {
      this.completeLoading();
      this.toastr.success(msg, "Operación fallida");
    }
  }

  search() {
    this.searchResult = this.subjects.filter(c => 
      c.universityId.includes(this.filter.universityId) &&
      c.careerId.includes(this.filter.careerId) &&
      c.name.toLowerCase().includes(this.filter.name.toLowerCase())
    );
    if(this.filter.year) {
      this.searchResult = this.searchResult.filter(c => c.year == this.filter.year);
    } 
    if(this.filter.quarter) {
      this.searchResult = this.searchResult.filter(c => c.quarter == this.filter.quarter);
    } 
  }
  
  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }
}