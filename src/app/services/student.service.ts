import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UniversityService } from './university.service';
import { CareerService } from './career.service';

import { Student, StudentForm, StudentList } from '../models/student/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private route = '/students';

  student: Observable<Student>;
  students: Observable<Student[]>;
  studentList: Observable<StudentList[]>;

  constructor(
    private db: AngularFireDatabase
    , private universityService: UniversityService
    , private careerService: CareerService
  ) {
    this.students = db.list<Student>(this.route)
    .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        const val = c.payload.val();
        val.$key = key;
        return val;
      }))
    );

    this.studentList = db.list<StudentList>(this.route).snapshotChanges().pipe(
      map(sl => sl.map(s => {
        const key = s.payload.key;
        const val = s.payload.val();
        val.$key = key;

        this.universityService.getUniversities().subscribe(us => {
          val.universityName = this.getPropertyName(us, val.universityId);
        });
        this.careerService.getCareers().subscribe(cs => {
          val.careerName = this.getPropertyName(cs, val.careerId);
        });
        this.careerService.getOptions().subscribe(cs => {
          val.careerOptionName = this.getPropertyName(cs, val.careerOptionId);
        });

        return val;
      })));
  }

  getPropertyName(propertyArray = [], propKey: string) {
    const dic = propertyArray.map(p => ({ $key: p.$key, name: p.name }));
    const property = dic.find(p => p.$key === propKey);
    return property ? property['name'] : '';
  }

  getStudents() {
    return this.students;
  }

  getStudentList() {
    return this.studentList;
  }

  getStudentById(id: string) {
    return this.student = this.db.object<Student>(this.route + '/' + id).valueChanges();
  }

  addStudent(student: StudentForm) {
    const newStudentKey = this.db.createPushId();
    return this.db.list(this.route).set(newStudentKey, {
      name: student.name,
      age: student.age,
      studentId: student.studentId,
      universityId: student.universityId,
      careerId: student.careerId,
      careerOptionId: student.careerOptionId
    });
  }

  updateStudent(student: StudentForm) {
    return this.db.list(this.route).update(student.$key, {
      name: student.name,
      age: student.age,
      studentId: student.studentId,
      universityId: student.universityId,
      careerId: student.careerId,
      careerOptionId: student.careerOptionId,
    });
  }

  deleteStudent($key: string) {
    return this.db.list<Student>(this.route).remove($key);
  }
}
