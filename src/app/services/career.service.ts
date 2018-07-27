import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Career, Level, LEVELS } from '../models/career';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private route: string = '/careers';

  career: Observable<Career>;
  careers: Observable<Career[]>;

  constructor(private db: AngularFireDatabase) {
    this.careers = db.list<Career>(this.route)
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

  getCareers() {
    return this.careers;
  }

  getCareerById(id: string) {
    return this.career = this.db.object<Career>(this.route + '/' + id).valueChanges();
  }

  getLevels(): Observable<Level[]> {
    return of(LEVELS);
  }

  addCareer(career: Career) {
    return this.db.list<Career>(this.route).push({
    });
  }

  updateCareer(career: Career) {
    return this.db.list<Career>(this.route).update(career.$key, {
    });
  }

  deleteCareer($key: string) {
    return this.db.list<Career>(this.route).remove($key);
  }
}
