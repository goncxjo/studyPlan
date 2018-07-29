import { Injectable } from '@angular/core';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';
import { Subject } from '../models/subject';
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

  addSubject(subject: Subject) {
    return this.db.list<Subject>(this.route).push({
      name: subject.name,
      code: subject.code,
      year: subject.year,
      quarter: subject.quarter,
      classLoad: subject.classLoad,
      credits: subject.credits,
      correlatives: subject.correlatives,
      career: subject.career,
      careerOption: subject.careerOption
    });
  }

  updateSubject(subject: Subject) {
    return this.db.list<Subject>(this.route).update(subject.$key, {
      name: subject.name,
      code: subject.code,
      year: subject.year,
      quarter: subject.quarter,
      classLoad: subject.classLoad,
      credits: subject.credits,
      correlatives: subject.correlatives,
      career: subject.career,
      careerOption: subject.careerOption
    });
  }

  deleteSubject($key: string) {
    return this.db.list<Subject>(this.route).remove($key);
  }
}
