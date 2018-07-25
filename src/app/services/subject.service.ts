import { Injectable } from '@angular/core';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';
import { Subject, State, STATES } from '../models/subject';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private route: string = '/subjects';

  subject: Observable<Subject>;
  subjects: Observable<Subject[]>;

  constructor(private db: AngularFireDatabase) {
    this.subjects = db.list<Subject>(this.route)
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

  getSubjects() {
    return this.subjects;
  }

  getSubjectById(id: string) {
    return this.subject = this.db.object<Subject>(this.route + '/' + id).valueChanges();
  }

  getStates(): Observable<State[]> {
    return of(STATES);
  }

  addSubject(subject: Subject) {
    this.db.list<Subject>(this.route).push({
      name: subject.name,
      code: subject.code,
      classLoad: subject.classLoad,
      quarter: subject.quarter,
      state: subject.state,
      correlatives: subject.correlatives 
    });
  }
  
  updateSubject(subject: Subject) {
    this.db.list<Subject>(this.route).update(subject.$key, {
      name: subject.name,
      code: subject.code,
      quarter: subject.quarter,
      classLoad: subject.classLoad,
      state: subject.state,
      correlatives: subject.correlatives
    });
  }

  deleteSubject($key: string) {
    this.db.list<Subject>(this.route).remove($key);
  }
}
