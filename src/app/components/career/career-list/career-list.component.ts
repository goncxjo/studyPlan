import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { CareerService } from '../../../services/career.service';
import { Career } from '../../../models/career';

@Component({
  selector: 'app-career-list',
  templateUrl: './career-list.component.html',
  styleUrls: ['./career-list.component.css']
})
export class CareerListComponent implements OnInit {

  careers: Career[];

  constructor(private careerService: CareerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getCareers();
  }

  getCareers() {
    this.careerService.getCareers().subscribe(items => {
      const careers = items.map(career => {
        career.level = this.careerService.getLevelValue(career.level);
        return career;
      })
      this.careers = careers;
    });
  }

  onDelete($key: string){
    if (confirm('¿Estás seguro?')) {
      this.careerService.deleteCareer($key)
      .then(x => this.toastr.success("Carrera eliminada", "Operación exitosa"))
      .catch(x => this.toastr.success(x, "Operación fallida"));
    }
  }
}