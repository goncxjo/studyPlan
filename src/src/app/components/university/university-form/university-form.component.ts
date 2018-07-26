import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { UniversityService } from '../../../services/university.service';
import { University } from '../../../models/university';

@Component({
  selector: 'app-university-form',
  templateUrl: './university-form.component.html',
  styleUrls: ['./university-form.component.css']
})
export class UniversityFormComponent implements OnInit {
  universityForm: FormGroup;
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute, private location: Location, private universityService: UniversityService, private toastr: ToastrService, private fb: FormBuilder
  ) {
    this.universityForm = this.fb.group({
      $key: [''],
      name: [''],
      headquarter: ['']
    });
  }

  ngOnInit() {
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      if (this.editMode) {
        this.getUniversity();
      }
    });
  }

  getUniversity() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.universityService.getUniversityById(id)
      .subscribe(university => {
        this.universityForm.setValue({
          $key: university.length == 0 ? '' : id,
          name: !university.name ? '' : university.name,
          headquarter: !university.headquarter ? '' : university.headquarter,
        })
      });
  }

  onSubmit() {
    if (!this.editMode) {
      this.universityService.addUniversity(this.universityForm.value)
      .then(x => {
          this.toastr.success("Universidad creada", "Operación exitosa");
          this.goBack();
        }
      ).catch(x => this.toastr.error(x, "Operación fallida"));
    } else {
            this.universityService.updateUniversity(this.universityForm.value)
      .then(x => {
          this.toastr.success("Universidad actualizada", "Operación exitosa");
          this.goBack();
        }
      ).catch(x => this.toastr.error(x, "Operación fallida"));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
