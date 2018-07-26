import { Injectable } from '@angular/core';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';
import { University } from '../models/university';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private route: string = '/universities';

  university: Observable<University>;
  universities: Observable<University[]>;

  constructor(private db: AngularFireDatabase) {
    this.universities = db.list<University>(this.route)
      .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      }
      ))
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
    this.universities.forEach( x => noExist = !x.find(o => o.$key == university.$key));
    return new Promise((resolve, reject) => {
      const ref = this.db.list(this.route).query.ref;
      const child = ref.child(university.$key.toLowerCase());
      if (noExist) {
        resolve(child.set({
          name: university.name,
          headquarter: university.headquarter
        }));
      } else {
        reject(Error("El código de la Universidad ya existe"));
      }
    });
  }

  updateUniversity(university: University) {
    return this.db.list<University>(this.route).update(university.$key, {
      name: university.name,
      headquarter: university.headquarter
    });
  }

  deleteUniversity($key: string) {
    return this.db.list<University>(this.route).remove($key);
  }
}
