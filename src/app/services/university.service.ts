import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HeadquartersService } from './headquarters.service';
import { DepartmentService } from './department.service';

import { University } from '../models/university';
import { Headquarters } from '../models/headquarters';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private route: string = '/universities';

  university: Observable<University>;
  universities: Observable<University[]>;

  constructor(private db: AngularFireDatabase, private headquarterService: HeadquartersService, private departmentService: DepartmentService) {
    this.universities = db.list<University>(this.route)
      .snapshotChanges().pipe(
        map(changes => changes.map(c => {
          const key = c.payload.key;
          let val = c.payload.val();
          val.$key = key;
          return val;
        }))
      );
  }

  getUniversities() {
    return this.universities;
  }

  getUniversityById(id: string) {
    return this.university = this.db.object<University>(this.route + '/' + id.toLowerCase()).valueChanges();
  }

  addUniversity(university: University) {
    let newUniversity = {
      name: university.name,
      headquarters: university.headquarters.map((item: Headquarters) => {
        item.$key = item.$key || this.db.createPushId();
        item.universityId = university.$key;
        return item;
      }),
      departments: university.departments.map((item: Department) => {
        item.$key = item.$key || this.db.createPushId();
        item.universityId = university.$key;
        return item;
      })
    };

    newUniversity.headquarters.forEach(element => {
      this.headquarterService.addHeadquarters(element);
    });
    newUniversity.departments.forEach(element => {
      this.departmentService.addDepartment(element);
    });

    return this.db.list(this.route).set(university.$key, {
      name: newUniversity.name,
      headquarters: newUniversity.headquarters.map((item: Headquarters) => item.$key),
      departments: newUniversity.departments.map((item: Department) => item.$key)
    });
  }

  updateUniversity(university: University) {
    let selectedUniversity = {
      name: university.name,
      headquarters: university.headquarters.map((item: Headquarters) => {
        item.$key = item.$key || this.db.createPushId();
        item.universityId = university.$key;
        return item;
      }),
      departments: university.departments.map((item: Department) => {
        item.$key = item.$key || this.db.createPushId();
        item.universityId = university.$key;
        return item;
      })
    };

    //this.headquarterService.deleteHeadquartersListByUniversityId(university.$key);
    //this.departmentService.deleteDepartmentsByUniversityId(university.$key);

    selectedUniversity.headquarters.forEach(element => {
      this.headquarterService.addHeadquarters(element);
    });
    selectedUniversity.departments.forEach(element => {
      this.departmentService.addDepartment(element);
    });

    return this.db.list(this.route).update(university.$key, {
      name: selectedUniversity.name,
      headquarters: selectedUniversity.headquarters.map((item: Headquarters) => item.$key),
      departments: selectedUniversity.departments.map((item: Department) => item.$key)
    });
  }

  deleteUniversity($key: string) {
    return this.db.list<University>(this.route).remove($key);
  }
}
