import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniversityListComponent } from './components/university/university-list/university-list.component';
import { UniversityFormComponent } from './components/university/university-form/university-form.component';
import { CareerListComponent } from './components/career/career-list/career-list.component';
import { CareerFormComponent } from './components/career/career-form/career-form.component';
import { CareerPlanComponent } from './components/career/career-plan/career-plan.component';
import { SubjectListComponent } from './components/subject/subject-list/subject-list.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentPlanComponent } from './components/student/student-plan/student-plan.component';

const routes: Routes = [
  { path: 'universidades', component: UniversityListComponent },
  { path: 'universidades/crear', component: UniversityFormComponent, data: { editMode: false } },
  { path: 'universidades/editar/:$key', component: UniversityFormComponent, data: { editMode: true } },
  { path: 'carreras', component: CareerListComponent },
  { path: 'carreras/crear', component: CareerFormComponent, data: { editMode: false } },
  { path: 'carreras/editar/:$key', component: CareerFormComponent, data: { editMode: true } },
  { path: 'carreras/:$key/plan', component: CareerPlanComponent, data: { careerView: true } }
  { path: 'asignaturas', component: SubjectListComponent },
  { path: 'asignaturas/crear', component: SubjectFormComponent, data: { editMode: false } },
  { path: 'asignaturas/editar/:$key', component: SubjectFormComponent, data: { editMode: true } },
  { path: 'estudiantes', component: StudentListComponent },
  { path: 'estudiantes/crear', component: StudentFormComponent, data: { editMode: false } },
  { path: 'estudiantes/editar/:$key', component: StudentFormComponent, data: { editMode: true } },
  { path: 'estudiantes/:$key/plan', component: CareerPlanComponent, data: { careerView: false } },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {
}
