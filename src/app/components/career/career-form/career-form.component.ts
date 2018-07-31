import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CareerService } from '../../../services/career.service';
import { tap } from 'rxjs/operators'

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
      departmentId: '',
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

  }

  get optionsForm() {
    return this.careerForm.get('options') as FormArray;
  }

  addNewOption() {
    const options = this.fb.group({
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
    const id = this.route.snapshot.paramMap.get('$key');
    this.careerService.getCareerById(id)
      .subscribe(career => {
        career.$key = id || '';
        this.careerForm.patchValue({
          $key: career.$key,
          name: career.name || '',
          length: career.length || '',
          level: career.level || '',
          about: career.about || '',
          goals: career.goals || '',
          departmentId: career.departmentId || '',
          universityId: career.universityId || '',
        });
        this.getOptions(career);
      });
  }

  getOptions(career) {
    if (career.options) {
      this.careerService.getOptions().pipe(
        tap(options => {
          options
            .filter(o => o.careerId == career.$key)
            .forEach(o => {
              const group = this.fb.group({
                $key: o.$key,
                name: o.name,
              });
              this.addOption(group);
            })
        })
      ).subscribe();
    }
  }

  onUniversityChange() {
    this.careerForm.patchValue({ departmentId: '', options: [] });
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
