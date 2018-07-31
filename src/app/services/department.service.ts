import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Department } from '../models/department';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private route: string = '/departments';

  department: Observable<Department>;
  departments: Observable<Department[]>;

  constructor(private db: AngularFireDatabase) {
    this.departments = db.list<Department>(this.route)
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

  getDepartments(name: string = '', universityId: string = '') {
    this.departments = this.db.list<Department>(this.route, ref => ref.orderByChild('universityId').startAt(universityId))
    .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      }))
    );
    return this.departments;
  }

  getDepartmentById(id: string) {
    return this.department = this.db.object<Department>(this.route + '/' + id).valueChanges();
  }

  getDepartmentsByUniversity(id: string) {
    return this.departments = this.db.list<Department>(this.route,
      ref => ref.orderByChild('universityId').startAt(id))
      .snapshotChanges().pipe(
      map(changes => changes.map(c => {
        const key = c.payload.key;
        let val = c.payload.val();
        val.$key = key;
        return val;
      })));
  }

  addDepartment(department: Department) {
    const ref = this.db.list(this.route).query.ref;
    const child = ref.child(department.$key);
    child.set({
      name: department.name,
      universityId: department.universityId,
    });
  }

  updateDepartment(department: Department) {
    return this.db.list<Department>(this.route).update(department.$key, {
      name: department.name,
      universityId: department.universityId,
    });
  }

  deleteDepartment($key: string) {
    return this.db.list<Department>(this.route).remove($key);
  }

  deleteDepartmentsByUniversityId(universityKey: string) {
    return this.db.list<Department>(this.route, ref => ref.orderByChild('universityId').equalTo(universityKey)).remove();
  }
}
