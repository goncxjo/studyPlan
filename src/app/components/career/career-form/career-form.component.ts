import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from '../../../services/career.service';

@Component({
  selector: 'app-career-form',
  templateUrl: './career-form.component.html',
  styleUrls: ['./career-form.component.css']
})
export class CareerFormComponent implements OnInit {
  careerForm: FormGroup;
  levels: any[];
  private editMode: boolean;

  constructor(
    private route: ActivatedRoute, private location: Location, private careerService: CareerService, private toastr: ToastrService, private fb: FormBuilder
  ) {
    this.careerForm = this.fb.group({
      $key: '',
      name: '',
      length: '',
      level: '',
      about: '',
      goals: '',
      universityId: '',
      departments: [],
      options: this.fb.array([])
    });

  }

  ngOnInit() {
    this.levels = this.careerService.getLevels();
    this.route.data.subscribe(d => {
      this.editMode = d['editMode'];
      if (this.editMode) {
        this.fillForm();
      }
    });
  }

  getCareer() {
    // const id = this.route.snapshot.paramMap.get('$key');
    // this.careerService.getCareerById(id)
    //   .subscribe(career => {
    //     this.careerForm.patchValue({
    //       $key: id,
    //       name: !career.name ? '' : career.name,
    //       code: !career.code ? '' : career.code,
    //       classLoad: !career.classLoad ? '' : career.classLoad,
    //       year: !career.year ? '' : career.year,
    //       quarter: !career.quarter ? '' : career.quarter,
    //       credits: !career.credits ? '' : career.credits,
    //       career: !career.career ? '' : career.career,
    //       careerOption: !career.careerOption ? '' : career.careerOption
    //     });

    //     if (!career.correlatives) {
    //       this.careerForm.patchValue({
    //         correlatives: { approved: {}, regularized: {} }
    //       });
    //     } else {
    //       this.careerForm.patchValue({
    //         correlatives: {
    //           approved: !career.correlatives.approved ? {} : career.correlatives.approved,
    //           regularized: !career.correlatives.regularized ? {} : career.correlatives.regularized
    //         }
    //       });
    //     }
    //   });
  }

  get optionsForm() {
    return this.careerForm.get('options') as FormArray;
  }

  addNewOption() {
    const options = this.fb.group({
      code: '',
      name: '',
    });

    this.optionsForm.push(options);
  }

  addOption(options) {
    this.optionsForm.push(options);
  }

  deleteOption(index) {
    this.optionsForm.removeAt(index);
  }

  fillForm() {
    // const id = this.route.snapshot.paramMap.get('$key');
    // this.careerService.getUniversityById(id)
    //   .subscribe(university => {
    //     this.careerForm.patchValue({
    //       $key: !university ? '' : id,
    //       name: !university.name ? '' : university.name,
    //       headquarter: !university.headquarter ? '' : university.headquarter,  
    //     });
    //     this.getOptions(university);
    //   });
  }

  getOptions(university) {
    // university.options.forEach(item => {
    //   this.headquarterService.getOptionsById(item)
    //     .subscribe(options => {
    //       const group = this.fb.group({
    //         $key: item,
    //         name: options.name,
    //         address: options.address,
    //         city: options.city,
    //         country: options.country,
    //         telephone: options.telephone
    //       });
    //       this.addOptions(group);
    //     });
    // })
  }

  onUniversityChange() {
    this.careerForm.patchValue({ departments: [] });
  }

  onSubmit() {
    if (!this.editMode) {
      this.careerService.addCareer(this.careerForm.value)
        .then(x => {
          this.toastr.success("Carrera creada", "Operación exitosa");
          this.goBack();
        }, (r => this.toastr.error(r, "Operación fallida")));
    } else {
      this.careerService.updateCareer(this.careerForm.value)
        .then(x => {
          this.toastr.success("Carrera editada", "Operación exitosa");
          this.goBack();
        })
        .catch(x => this.toastr.error(x, "Operación fallida"));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
