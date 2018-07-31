import { Injectable } from '@angular/core';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';
import { Subject, SubjectCorrelative } from '../models/subject';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private route: string = '/subjects';

  subject: Observable<Subject>;
  subjects: Observable<Subject[]>;
  subjectCorrelatives: Observable<SubjectCorrelative[]>;

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

  getSubjectsByCareer(id: string) {
    return this.subjects = this.db.list<Subject>(this.route,
      ref => ref.orderByChild('careerId').startAt(id))
      .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      })));
  }

  addSubject(subject: Subject) {
    const newSubjectKey = this.db.createPushId();
    return this.db.list(this.route).set(newSubjectKey, {
      name: subject.name,
      code: subject.code,
      year: subject.year,
      quarter: subject.quarter,
      classLoad: subject.classLoad,
      credits: subject.credits,
      correlatives: subject.correlatives,
      careerId: subject.careerId,
      careerOptions: subject.careerOptions,
      universityId: subject.universityId,
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
      careerId: subject.careerId,
      careerOptions: subject.careerOptions,
      universityId: subject.universityId,
    });
  }

  deleteSubject($key: string) {
    return this.db.list<Subject>(this.route).remove($key);
  }
}
