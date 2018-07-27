import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { University } from '../models/university';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Headquarters } from '../models/headquarters';
import { HeadquartersService } from './headquarters.service';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private route: string = '/universities';

  university: Observable<University>;
  universities: Observable < University[] > ;

  constructor(private db: AngularFireDatabase, private headquarterService: HeadquartersService) {
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
    let noExist = true;
    this.universities.forEach(x => noExist = !x.find(o => o.$key == university.$key));
    return new Promise((resolve, reject) => {
      const ref = this.db.list(this.route).query.ref;
      const child = ref.child(university.$key.toLowerCase());
      if (noExist) {
        let newUniversity = {
          name: university.name,
          headquarter: university.headquarter,
          headquarters: university.headquarters.map((item: Headquarters) => {
            item.$key = this.db.createPushId();
            return item;
          })
        };

        newUniversity.headquarters.forEach(element => {
          this.headquarterService.addHeadquarters(element);
        });

        resolve(child.set({
          name: newUniversity.name,
          headquarter: newUniversity.headquarter,
          headquarters: newUniversity.headquarters.map((item: Headquarters) => item.$key)
        }));
      } else {
        reject(Error("El código de la Universidad ya existe"));
      }
    });
  }

  updateUniversity(university: University) {
    let selectedUniversity = {
      name: university.name,
      headquarter: university.headquarter,
      headquarters: university.headquarters.map((item: Headquarters) => {
        if(!item.$key) {
          item.$key = this.db.createPushId();
        }
        return item;
      })
    };

    selectedUniversity.headquarters.forEach(element => {
      this.headquarterService.addHeadquarters(element);
    });

    return this.db.list(this.route).set(university.$key, {
      name: selectedUniversity.name,
      headquarter: selectedUniversity.headquarter,
      headquarters: selectedUniversity.headquarters.map((item: Headquarters) => item.$key)
    });
  }

  deleteUniversity($key: string) {
    return this.db.list<University>(this.route).remove($key);
  }
}
