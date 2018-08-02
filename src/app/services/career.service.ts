import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Career, CareerOption, LEVELS } from '../models/career';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private route: string = '/careers';
  private routeOptions: string = '/careerOptions';

  career: Observable<Career>;
  careers: Observable<Career[]>;
  option: Observable<CareerOption>;
  options: Observable<CareerOption[]>;

  constructor(private db: AngularFireDatabase) {
    this.careers = db.list<Career>(this.route)
      .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      })));

    this.options = db.list<CareerOption>(this.routeOptions)
      .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      })));
  }

  getCareers() {
    return this.careers;
  }

  getCareerById(id: string) {
    return this.career = this.db.object<Career>(this.route + '/' + id).valueChanges();
  }

  getLevels(): any[] {
    return LEVELS;
  }

  getLevelValue(key: string) {
    return LEVELS.find(i => i.key == key).value || '';
  }

  addCareer(career: Career) {
    const newCareerKey = this.db.createPushId();
    let newCareer = {
      $key: newCareerKey,
      name: career.name,
      length: career.length,
      level: career.level,
      about: career.about,
      goals: career.goals,
      universityId: career.universityId,
      departmentId: career.departmentId,
      options: career.options.map((item: CareerOption) => {
        if (!item.$key) {
          item.$key = this.db.createPushId();
          item.careerId = newCareerKey;
        }
        return item;
      })
    }

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
      options: newCareer.options.map((item: CareerOption) => item.$key),
      departmentId: newCareer.departmentId
    });
  }

  updateCareer(career: Career) {
    let selectedCareer = {
      $key: career.$key,
      name: career.name,
      length: career.length,
      level: career.level,
      about: career.about,
      goals: career.goals,
      universityId: career.universityId,
      departmentId: career.departmentId,
      options: career.options.map((item: CareerOption) => {
        item.$key = item.$key || this.db.createPushId();
        item.careerId = item.careerId || career.$key;
        return item;
      })
    }

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
      options: selectedCareer.options.map((item: CareerOption) => item.$key),
      departmentId: selectedCareer.departmentId
    });
  }

  deleteCareer($key: string) {
    return this.db.list<Career>(this.route).remove($key);
  }

  getOptions() {
    return this.options;
  }

  getOptionsByCareerId(id: string) {
    return this.options = this.db.list<CareerOption>(this.routeOptions,
      ref => ref.orderByChild('careerId').startAt(id))
      .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      })));;
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

  updateCareerOptions(careerKey: string, options: CareerOption[]) {
    return this.options.forEach(os => os
      .filter(o => o.$key == careerKey)
      .forEach(o => {
        const changedOption = options.find(x => x.$key == o.$key);
        !changedOption ? this.deleteOption(o.$key) : this.setOption(changedOption); 
      }));
  }

  deleteOption($key: string) {
    return this.db.list<CareerOption>(this.routeOptions).remove($key);
  }
}
