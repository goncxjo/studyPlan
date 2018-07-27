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

  career: Career[];

  constructor(private careerService: CareerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getCareers();
  }

  getCareers() {
    this.careerService.getCareers().subscribe(career => {
      this.career = career;
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