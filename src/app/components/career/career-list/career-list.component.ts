import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { NgProgress } from 'ngx-progressbar';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career';

@Component({
  selector: 'app-career-list',
  templateUrl: './career-list.component.html',
  styleUrls: ['./career-list.component.css']
})
export class CareerListComponent implements OnInit {

  careers: Career[];
  levels: any[];
  searchResult: Career[] = [];
  filter: Career = new Career();

  constructor(
    private careerService: CareerService, 
    private toastr: ToastrService,
    public ngProgress: NgProgress 
  ) { }

  ngOnInit() {
    this.startLoading();
    this.getCareers();
  }

  getCareers() {
    this.careerService.getCareers().pipe(
      tap(items => {
        this.levels = this.careerService.getLevels();
        const careers = items.map(career => {
          career.level = {
            $key: career.level,
            name: this.levels.find(l => l.key === career.level).value || ''
          };
          return career;
        });

        this.careers = careers;
        this.searchResult = careers;
      })
    ).subscribe(() => this.completeLoading());
  }

  onDelete($key: string) {
    if (confirm('¿Estás seguro?')) {
      this.startLoading();
      this.careerService.deleteCareer($key).then(onSuccess).catch(onError);
    }

    function onSuccess() {
      this.completeLoading();
      this.toastr.success('Carrera eliminada', 'Operación exitosa');
    }
    function onError(msg) {
      this.completeLoading();
      this.toastr.success(msg, 'Operación fallida');
    }
  }

  search() {
    this.searchResult = this.careers.filter(c => 
      c.universityId.includes(this.filter.universityId || '') &&
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
