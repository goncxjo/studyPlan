import { Component, OnInit } from '@angular/core';
import { NgForm } from '../../../../../node_modules/@angular/forms';
import { ToastrService, Toast } from 'ngx-toastr';

import { UniversityService } from '../../../services/university.service';
import { University } from '../../../models/university';

@Component({
  selector: 'app-university-form',
  templateUrl: './university-form.component.html',
  styleUrls: ['./university-form.component.css']
})
export class UniversityFormComponent implements OnInit {

  constructor(private universityService: UniversityService, private toastr: ToastrService) { }

  ngOnInit() {
    this.universityService.getUniversities();
    this.resetForm();
  }

  onSubmit(universityForm: NgForm) {
    this.universityService.insertUniversity(universityForm.value);
    this.toastr.success("University created");
    this.resetForm(universityForm);
  }

  resetForm(universityForm?: NgForm) {
    if(universityForm != null) {
      universityForm.reset();
      this.universityService.selectedUniversity = new University();
    }
  }

}
