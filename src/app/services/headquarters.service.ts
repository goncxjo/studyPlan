import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Headquarters } from '../models/headquarters';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {
  private route: string = '/headquarters';

  headquarters: Observable<Headquarters>;
  headquartersList: Observable<Headquarters[]>;

  constructor(private db: AngularFireDatabase) {
    this.headquartersList = db.list<Headquarters>(this.route)
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

  getAllHeadquarters() {
    return this.headquartersList;
  }

  getHeadquartersById(id: string) {
    return this.headquarters = this.db.object<Headquarters>(this.route + '/' + id).valueChanges();
  }

  addHeadquarters(headquarters: Headquarters) {
    const ref = this.db.list(this.route).query.ref;
    const child = ref.child(headquarters.$key);
    child.set({
      name: headquarters.name,
      address: headquarters.address,
      city: headquarters.city,
      country: headquarters.country,
      telephone: headquarters.telephone,
      universityId: headquarters.universityId,
      isHead: headquarters.isHead,
    });
  }

  updateHeadquarters(headquarters: Headquarters) {
    return this.db.list<Headquarters>(this.route).update(headquarters.$key, {
      name: headquarters.name,
      address: headquarters.address,
      city: headquarters.city,
      country: headquarters.country,
      telephone: headquarters.telephone,
      universityId: headquarters.universityId,
      isHead: headquarters.isHead,
    });
  }

  deleteHeadquarters($key: string) {
    return this.db.list<Headquarters>(this.route).remove($key);
  }
}
