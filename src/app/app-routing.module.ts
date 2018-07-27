import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectListComponent } from './components/subject/subject-list/subject-list.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';
import { UniversityListComponent } from './components/university/university-list/university-list.component';
import { UniversityFormComponent } from './components/university/university-form/university-form.component';
import { CareerListComponent } from './components/career/career-list/career-list.component';
import { CareerFormComponent } from './components/career/career-form/career-form.component';

const routes: Routes = [
  { path: 'universities', component: UniversityListComponent },
  { path: 'universities/create', component: UniversityFormComponent, data: { editMode: false } },
  { path: 'universities/edit/:$key', component: UniversityFormComponent, data: { editMode: true } },
  { path: 'careers', component: CareerListComponent },
  { path: 'careers/create', component: CareerFormComponent, data: { editMode: false } },
  { path: 'careers/edit/:$key', component: CareerFormComponent, data: { editMode: true } },
  { path: 'subjects', component: SubjectListComponent },
  { path: 'subjects/create', component: SubjectFormComponent, data: { editMode: false } },
  { path: 'subjects/edit/:$key', component: SubjectFormComponent, data: { editMode: true } },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {
}
