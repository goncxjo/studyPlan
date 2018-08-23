import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { CareerService } from '../../../services/career.service';
import { CareerList } from '../../../models/career/career';

@Component({
  selector: 'app-career-list',
  templateUrl: './career-list.component.html',
  styleUrls: ['./career-list.component.css']
})
export class CareerListComponent implements OnInit {

  careers: CareerList[];
  searchResult: CareerList[] = [];
  filter: CareerList = new CareerList();
  isReady: Boolean = false;
  levels: any[];

  constructor(
    private careerService: CareerService
    , private toastr: ToastrService
    , public ngProgress: NgProgress
  ) { }

  ngOnInit() {
    this.startLoading();
    this.getCareers();
    this.levels = this.careerService.getLevels();
  }

  getCareers() {
    this.careerService.getCareerList().subscribe(careers => {
      this.careers = this.searchResult = careers;
      this.isReady = true;
      this.completeLoading();
    });
  }

  onDelete($key: string) {
    if (confirm('¿Estás seguro?')) {
      this.startLoading();
      this.careerService.deleteCareer($key)
      .then(() => this.onSuccess())
      .catch((msg) => this.onError(msg));
    }
  }

  onSuccess() {
    this.completeLoading();
    this.toastr.success('Carrera eliminada', 'Operación exitosa');
  }

  onError(msg) {
    this.completeLoading();
    this.toastr.error(msg, 'Operación fallida');
  }

  search() {
    this.searchResult = this.careers.filter(c =>
      c.university.includes(this.filter.university || '') &&
      c.$key.includes(this.filter.name || '') &&
      c.level.$key.includes(this.filter.level || '')
    );
  }

  startLoading() {
    this.ngProgress.start();
  }

  completeLoading() {
    this.ngProgress.done();
  }
}
