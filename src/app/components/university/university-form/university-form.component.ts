import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { UniversityService } from '../../../services/university.service';
import { HeadquartersService } from '../../../services/headquarters.service';

@Component({
  selector: 'app-university-form',
  templateUrl: './university-form.component.html',
  styleUrls: ['./university-form.component.css']
})
export class UniversityFormComponent implements OnInit {
  universityForm: FormGroup;
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute, private location: Location, private universityService: UniversityService, private headquarterService: HeadquartersService, private toastr: ToastrService, private fb: FormBuilder
  ) {
    this.universityForm = this.fb.group({
      $key: '',
      name: '',
      headquarter: '',
      headquarters: this.fb.array([])
    });
  }

  ngOnInit() {
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      if (this.editMode) {
        this.fillForm();
      }
    });
  }

  get headquartersForm() {
    return this.universityForm.get('headquarters') as FormArray;
  }

  addNewHeadquarters() {
    const headquarters = this.fb.group({
      $key: '',
      name: '',
      address: '',
      city: '',
      country: '',
      telephone: ''
    });

    this.headquartersForm.push(headquarters);
  }

  addHeadquarters(headquarters) {
    this.headquartersForm.push(headquarters);
  }

  deleteHeadquarters(index) {
    this.headquartersForm.removeAt(index);
  }

  fillForm() {
    const id = this.route.snapshot.paramMap.get('$key');
    this.universityService.getUniversityById(id)
      .subscribe(university => {
        this.universityForm.patchValue({
          $key: !university ? '' : id,
          name: !university.name ? '' : university.name,
          headquarter: !university.headquarter ? '' : university.headquarter,  
        });
        this.getHeadquarters(university);
      });
  }

  getHeadquarters(university) {
    university.headquarters.forEach(item => {
      this.headquarterService.getHeadquartersById(item)
        .subscribe(headquarters => {
          const group = this.fb.group({
            $key: item,
            name: headquarters.name,
            address: headquarters.address,
            city: headquarters.city,
            country: headquarters.country,
            telephone: headquarters.telephone
          });
          this.addHeadquarters(group);
        });
    })
  }

  onSubmit() {
    if (!this.editMode) {
      this.universityService.addUniversity(this.universityForm.value)
        .then(x => {
          this.toastr.success("Universidad creada", "Operación exitosa");
          this.goBack();
        }).catch(x => this.toastr.error(x, "Operación fallida"));
    } else {
      this.universityService.updateUniversity(this.universityForm.value)
        .then(x => {0
          this.toastr.success("Universidad actualizada", "Operación exitosa");
          this.goBack();
        }).catch(x => this.toastr.error(x, "Operación fallida"));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
