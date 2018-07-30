import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Student } from '../models/student';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private route: string = '/students';

  student: Observable<Student>;
  students: Observable<Student[]>;

  constructor(private db: AngularFireDatabase) {
    this.students = db.list<Student>(this.route)
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

  getStudents(name: string = '', universityId: string = '') {
    this.students = this.db.list<Student>(this.route, ref => ref.orderByChild('universityId').startAt(universityId))
    .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      }))
    );
    return this.students;
  }

  getStudentById(id: string) {
    return this.student = this.db.object<Student>(this.route + '/' + id).valueChanges();
  }

  addStudent(student: Student) {
    return this.db.list(this.route).push({
      name: student.name,
      age: student.age,
      studentId: student.studentId,
      universityId: student.universityId,
      careerId: student.careerId,
      careerOptionId: student.careerOptionId,
    });
  }

  updateStudent(student: Student) {
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
