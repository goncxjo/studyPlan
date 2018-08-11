import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Subject, SubjectForm, SubjectList, SubjectMiniList } from '../models/subject/subject';
import { STATES } from '../models/subject/state';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private route = '/subjects';

  subject: Observable<Subject>;
  subjects: Observable<Subject[]>;
  subjectList: Observable<SubjectList[]>;
  subjectMiniList: Observable<SubjectMiniList[]>;

  constructor(private db: AngularFireDatabase) {
    this.subjects = db.list<Subject>(this.route)
    .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        const val = c.payload.val();
        val.$key = key;
        return val;
      }))
    );

    this.subjectList = db.list<SubjectList>(this.route)
    .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        const val = c.payload.val();
        val.$key = key;
        return val;
      }))
    );

    this.subjectMiniList = db.list<SubjectMiniList>(this.route)
    .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        const val = c.payload.val();
        val.$key = key;
        return val;
      }))
    );
  }

  getSubjects() {
    return this.subjects;
  }

  getSubjectList() {
    return this.subjectList;
  }

  getSubjectMiniList() {
    return this.subjectMiniList;
  }

  getSubjectById(id: string) {
    return this.subject = this.db.object<Subject>(this.route + '/' + id).valueChanges();
  }

  getStates(): any[] {
    return STATES;
  }

  getStateValue(key: string) {
    return STATES.find(i => i.key === key).value || '';
  }

  addSubject(subject: SubjectForm) {
    const newSubjectKey = this.db.createPushId();
    return this.db.list(this.route).set(newSubjectKey, {
      name: subject.name,
      code: subject.code,
      year: subject.year,
      quarter: subject.quarter,
      classLoad: subject.classLoad,
      credits: subject.credits,
      correlatives: subject.correlatives,
      universityId: subject.universityId,
      careerId: subject.careerId,
      careerOptions: subject.careerOptions,
      isCrossDisciplinary: subject.isCrossDisciplinary
    });
  }

  updateSubject(subject: Subject) {
    return this.db.list(this.route).set(subject.$key, {
      name: subject.name,
      code: subject.code,
      year: subject.year,
      quarter: subject.quarter,
      classLoad: subject.classLoad,
      credits: subject.credits,
      correlatives: subject.correlatives,
      universityId: subject.universityId,
      careerId: subject.careerId,
      careerOptions: subject.careerOptions,
      isCrossDisciplinary: subject.isCrossDisciplinary
    });
  }

  deleteSubject($key: string) {
    return this.db.list<Subject>(this.route).remove($key);
  }
}
