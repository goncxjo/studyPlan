import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Career, CareerForm, CareerList, CareerMiniList } from '../models/career/career';
import { CareerOption, CareerOptionMiniList } from '../models/career/option';
import { LEVELS } from '../models/career/level';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private route = '/careers';
  private routeOptions = '/careerOptions';

  career: Observable<Career>;
  careers: Observable<Career[]>;
  careerList: Observable<CareerList[]>;
  careerMiniList: Observable<CareerMiniList[]>;
  option: Observable<CareerOption>;
  options: Observable<CareerOption[]>;
  optionMiniList: Observable<CareerOptionMiniList[]>;

  constructor(private db: AngularFireDatabase) {
    this.careers = db.list<Career>(this.route)
    .snapshotChanges().pipe(
      map(cs => cs.map(c => {
        const key = c.payload.key;
        const val = c.payload.val();
        val.$key = key;
        return val;
      })));

      this.careerList = db.list<CareerList>(this.route)
      .snapshotChanges().pipe(
        map(cl => cl.map(c => {
          const key = c.payload.key;
          const val = c.payload.val();
          const levels = this.getLevels();
          val.level = {
            $key: val.level,
            value: levels.find(l => l.key === (val.level || '')).value || ''
          };
          val.$key = key;
          return val;
        })));

    this.careerMiniList = db.list<CareerMiniList>(this.route)
    .snapshotChanges().pipe(
      map(cs => cs.map(c => {
        const key = c.payload.key;
        const val = c.payload.val();
        val.$key = key;
        return val;
      })));

    this.options = db.list<CareerOption>(this.routeOptions)
    .snapshotChanges().pipe(
      map(os => os.map(o => {
        const key = o.payload.key;
        const val = o.payload.val();
        val.$key = key;
        return val;
      })));

    this.optionMiniList = db.list<CareerOptionMiniList>(this.routeOptions)
    .snapshotChanges().pipe(
      map(os => os.map(o => {
        const key = o.payload.key;
        const val = o.payload.val();
        val.$key = key;
        return val;
      })));
  }

  getCareers() {
    return this.careers;
  }

  getCareerList() {
    return this.careerList;
  }

  getCareerMiniList() {
    return this.careerMiniList;
  }

  getCareerById(id: string) {
    return this.career = this.db.object<Career>(this.route + '/' + id).valueChanges();
  }

  getLevels(): any[] {
    return LEVELS;
  }

  getLevelValue(key: string) {
    return LEVELS.find(i => i.key === key).value || '';
  }

  addCareer(career: CareerForm) {
    const newCareerKey = this.db.createPushId();
    const newCareer = {
      $key: newCareerKey,
      name: career.name,
      length: career.length,
      level: career.level,
      about: career.about,
      goals: career.goals,
      universityId: career.universityId,
      departmentId: career.departmentId,
      options: this.adjustProperty(career.options, newCareerKey)
    };

    newCareer.options.forEach(element => {
      this.addOption(element);
    });

    return this.db.list(this.route).set(newCareerKey, {
      name: newCareer.name,
      length: career.length,
      level: newCareer.level,
      about: newCareer.about,
      goals: newCareer.goals,
      universityId: newCareer.universityId,
      options: newCareer.options.map(item => item.$key),
      departmentId: newCareer.departmentId
    });
  }

  updateCareer(career: CareerForm) {
    const selectedCareer = {
      $key: career.$key,
      name: career.name,
      length: career.length,
      level: career.level,
      about: career.about,
      goals: career.goals,
      universityId: career.universityId,
      departmentId: career.departmentId,
      options: this.adjustProperty(career.options, career.$key)
    };

    // this.updateCareerOptions(career.$key, selectedCareer.options);
    selectedCareer.options.forEach(element => {
      this.setOption(element);
    });

    return this.db.list(this.route).set(selectedCareer.$key, {
      name: selectedCareer.name,
      length: selectedCareer.length,
      level: selectedCareer.level,
      about: selectedCareer.about,
      goals: selectedCareer.goals,
      universityId: selectedCareer.universityId,
      options: selectedCareer.options.map(item => item.$key),
      departmentId: selectedCareer.departmentId
    });
  }

  deleteCareer($key: string) {
    return this.db.list<Career>(this.route).remove($key);
  }

  // OPTIONS
  getOptions() {
    return this.options;
  }

  getOptionMiniList() {
    return this.optionMiniList;
  }

  getOptionById(id: string) {
    return this.option = this.db.object<CareerOption>(this.routeOptions + '/' + id).valueChanges();
  }

  addOption(option: CareerOption) {
    const ref = this.db.list(this.routeOptions).query.ref;
    const child = ref.child(option.$key);
    child.set({
      name: option.name,
      careerId: option.careerId,
    });
  }

  setOption(option: CareerOption) {
    return this.db.list<CareerOption>(this.routeOptions).set(option.$key, {
      name: option.name,
      careerId: option.careerId,
    });
  }

  deleteOption($key: string) {
    return this.db.list<CareerOption>(this.routeOptions).remove($key);
  }

  adjustProperty(property = [], careerKey: string) {
    return property.map(item => {
      item['$key'] = item['$key'] || this.db.createPushId();
      item['careerId'] = careerKey;
      return item;
    });
  }
}
