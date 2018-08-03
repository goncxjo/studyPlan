import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';
import { UniversityService } from '../../../services/university.service';
import { University } from '../../../models/university';

@Component({
  selector: 'app-university-list',
  templateUrl: './university-list.component.html',
  styleUrls: ['./university-list.component.css']
})
export class UniversityListComponent implements OnInit {

  universities: University[];
  searchResult: University[] = [];
  filter: University = new University();
  isReady: Boolean = false;

  constructor(
    private universityService: UniversityService, 
    private toastr: ToastrService, 
    public ngProgress: NgProgress
  ) { }

  ngOnInit() {
    this.startLoading();
    this.getUniversities();
  }

  getUniversities() {
    this.universityService.getUniversities().subscribe(universities => {
      this.universities = this.searchResult = universities;
      this.isReady = true;
      this.completeLoading();
    });
  }

  onDelete($key: string) {
    if (confirm('¿Estás seguro?')) {
      this.startLoading();
      this.universityService.deleteUniversity($key).then(onSuccess).catch(onError);
    }

    function onSuccess() {
      this.completeLoading();
      this.toastr.success('Universidad eliminada', 'Operación exitosa');
    }
    
    function onError(msg) {
      this.completeLoading();
      this.toastr.success(msg, 'Operación fallida');
    }
  }

  search() {
    this.searchResult = this.universities.filter(u => u.$key.includes(this.filter.$key || '') && u.name.includes(this.filter.name || ''));
  }

  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }
}