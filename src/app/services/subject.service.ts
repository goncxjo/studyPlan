import { Injectable } from '@angular/core';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireAction } from 'angularfire2/database';
import { Subject, SubjectCorrelative } from '../models/subject';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private route: string = '/subjects';
  private routeCorrelative: string = '/correlatives';
  private routeApproved: string = '/correlatives/approved';
  private routeRegularized: string = '/correlatives/regularized';

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
    let correlatives = {
      approved: subject.correlatives.approved.map(item => {
        const subjectCorrelative = {
          $key: newSubjectKey,
          fromSubject: item,
          universityId: subject.universityId,
          careerId: subject.careerId,
          careerOptions: subject.careerOptions,
        };
        return subjectCorrelative
      }),
      regularized: subject.correlatives.regularized.map(item => {
        const subjectCorrelative = {
          $key: newSubjectKey,
          fromSubject: item,
          universityId: subject.universityId,
          careerId: subject.careerId,
          careerOptions: subject.careerOptions,
        };
        return subjectCorrelative
      }),
    };

    correlatives.approved.forEach(element => {
      this.addSubjectCorrelative(element, this.routeApproved);
    });
    correlatives.regularized.forEach(element => {
      this.addSubjectCorrelative(element, this.routeRegularized);
    });

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
    let correlatives = {
      approved: subject.correlatives.approved.map(item => {
        const subjectCorrelative = {
          $key: subject.$key,
          fromSubject: item,
          universityId: subject.universityId,
          careerId: subject.careerId,
          careerOptions: subject.careerOptions,
        };
        return subjectCorrelative
      }),
      regularized: subject.correlatives.regularized.map(item => {
        const subjectCorrelative = {
          $key: subject.$key,
          fromSubject: item,
          universityId: subject.universityId,
          careerId: subject.careerId,
          careerOptions: subject.careerOptions,
        };
        return subjectCorrelative
      }),
    };

    this.updateCorrelatives(subject.$key, correlatives);

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

  getSubjectsCorrelativesBySubjectId(id: string, route: string) {
    return this.subjects = this.db.list<SubjectCorrelative>(route,
      ref => ref.orderByKey().startAt(id))
      .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      })));
  }

  addSubjectCorrelative(subjectCorrelative: SubjectCorrelative, route: string) {
    const ref = this.db.list(route).query.ref;
    const child = ref.child(subjectCorrelative.$key);
    return child.set({
      fromSubject: subjectCorrelative.fromSubject,
      universityId: subjectCorrelative.universityId,
      careerId: subjectCorrelative.careerId,
      careerOptionId: subjectCorrelative.careerOptionId,
    }); 
  }

  deleteSubjectCorrelative(subjectKey: string, route: string) {
    return this.db.list(route).remove(subjectKey);
  }

  updateCorrelatives(subjectKey: string, correlatives) {
    this.deleteSubjectCorrelative(subjectKey, this.routeApproved);
    this.deleteSubjectCorrelative(subjectKey, this.routeRegularized);
    
    correlatives.approved.forEach(element => {
      this.addSubjectCorrelative(element, this.routeApproved);
    });
    correlatives.regularized.forEach(element => {
      this.addSubjectCorrelative(element, this.routeRegularized);
    });
  }
}
