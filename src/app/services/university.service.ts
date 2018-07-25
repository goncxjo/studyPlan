import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { University } from '../models/university';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  universityList: AngularFireList<any>;
  selectedUniversity: University = new University(); 

  constructor(private db: AngularFireDatabase) { }

  getUniversities() {
    return this.universityList = this.db.list('universities');
  }

  insertUniversity(university: University) {
    const ref = this.db.list('/universities').query.ref;
    ref.child(university.$key.toString()).set({
      name: university.name
    });
  }

  updateUniversity(university: University) {
    this.universityList.update(university.$key, {
      name: University.name,
    });
  }

  deleteUniversity($key: string) {
    this.universityList.remove($key);
  }
}
