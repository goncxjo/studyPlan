import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HeadquartersService } from './headquarters.service';
import { DepartmentService } from './department.service';

import { University, UniversityForm, UniversityList, UniversityMiniList } from '../models/university/university';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private route = '/universities';

  university: Observable<University>;
  universities: Observable<University[]>;
  universityList: Observable<UniversityList[]>;
  universityMiniList: Observable<UniversityMiniList[]>;

  constructor(
    private db: AngularFireDatabase
    , private headquarterService: HeadquartersService
    , private departmentService: DepartmentService
  ) {
    this.universities = db.list<University>(this.route)
    .snapshotChanges().pipe(
      map(us => us.map(u => {
        const key = u.payload.key;
        const val = u.payload.val();
        val.$key = key;
        return val;
      }))
    );

    this.universityList = db.list<UniversityList>(this.route)
    .snapshotChanges().pipe(
      map(us => us.map(u => {
        const key = u.payload.key;
        const val = u.payload.val();
        val.$key = key;
        return val;
      }))
    );

    this.universityMiniList = db.list<UniversityMiniList>(this.route)
    .snapshotChanges().pipe(
      map(us => us.map(u => {
        const key = u.payload.key;
        const val = u.payload.val();
        val.$key = key;
        return val;
      }))
    );
  }

  getUniversities() {
    return this.universities;
  }

  getUniversityList() {
    return this.universityList;
  }

  getUniversityMiniList() {
    return this.universityMiniList;
  }

  getUniversityById(id: string) {
    return this.university = this.db.object<University>(this.route + '/' + id.toLowerCase()).valueChanges();
  }

  addUniversity(university: UniversityForm) {
    const newUniversity = {
      name: university.name,
      headquarters: this.adjustProperty(university.headquarters, university.$key),
      departments: this.adjustProperty(university.departments, university.$key)
    };

    newUniversity.headquarters.forEach(element => {
      this.headquarterService.addHeadquarters(element);
    });
    newUniversity.departments.forEach(element => {
      this.departmentService.addDepartment(element);
    });

    return this.db.list(this.route).set(university.$key, {
      name: newUniversity.name,
      headquarters: newUniversity.headquarters.map(item => item.$key),
      departments: newUniversity.departments.map(item => item.$key)
    });
  }

  updateUniversity(university: UniversityForm) {
    const selectedUniversity = {
      name: university.name,
      headquarters: this.adjustProperty(university.headquarters, university.$key),
      departments: this.adjustProperty(university.departments, university.$key)
    };

    // this.headquarterService.deleteHeadquartersListByUniversityId(university.$key);
    // this.departmentService.deleteDepartmentsByUniversityId(university.$key);

    selectedUniversity.headquarters.forEach(element => {
      this.headquarterService.addHeadquarters(element);
    });
    selectedUniversity.departments.forEach(element => {
      this.departmentService.addDepartment(element);
    });

    return this.db.list(this.route).update(university.$key, {
      name: selectedUniversity.name,
      headquarters: selectedUniversity.headquarters.map(item => item.$key),
      departments: selectedUniversity.departments.map(item => item.$key)
    });
  }

  deleteUniversity($key: string) {
    return this.db.list<University>(this.route).remove($key);
  }

  adjustProperty(property = [], universityKey: string ) {
    return property.map(item => {
      item['$key'] = item['$key'] || this.db.createPushId();
      item['universityId'] = universityKey;
      return item;
    });
  }
}
