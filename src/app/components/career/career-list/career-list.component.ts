import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career';
import { tap, map } from 'rxjs/operators';

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

  constructor(private careerService: CareerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getCareers();
  }

  getCareers() {
    this.careerService.getCareers().pipe(
      tap(items => {
        this.levels = this.careerService.getLevels();
        const careers = items.map(career => {
          career.level = {
            $key: career.level,
            name: this.levels.find(l => l.key == career.level).value || ''
          }
          return career;
        })

        this.careers = careers;
        this.searchResult = careers;
      })
    ).subscribe();
  }

  onDelete($key: string){
    if (confirm('¿Estás seguro?')) {
      this.careerService.deleteCareer($key)
      .then(x => this.toastr.success("Carrera eliminada", "Operación exitosa"))
      .catch(x => this.toastr.success(x, "Operación fallida"));
    }
  }

  search() {
    this.searchResult = this.careers.filter(c => 
      c.universityId.includes(this.filter.universityId || '') &&
      c.$key.includes(this.filter.name || '') &&
      c.level.$key.includes(this.filter.level || '')
    );
  }
}