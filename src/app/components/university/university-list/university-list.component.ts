import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private universityService: UniversityService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getUniversities();
  }

  getUniversities() {
    this.universityService.getUniversities().subscribe(universities => {
      this.universities = universities;
      this.searchResult = universities;
    });
  }

  onDelete($key: string) {
    if (confirm('¿Estás seguro?')) {
      this.universityService.deleteUniversity($key)
        .then(x => this.toastr.success("Universidad eliminada", "Operación exitosa"))
        .catch(x => this.toastr.success(x, "Operación fallida"));;
    }
  }

  search() {
    this.searchResult = this.universities.filter(u => u.$key.includes(this.filter.$key || '') && u.name.includes(this.filter.name || ''));
  }
}