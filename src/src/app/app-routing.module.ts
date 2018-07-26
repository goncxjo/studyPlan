import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectListComponent } from './components/subject/subject-list/subject-list.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';
import { UniversityListComponent } from './components/university/university-list/university-list.component';
import { UniversityFormComponent } from './components/university/university-form/university-form.component';

const routes: Routes = [
  { path: 'subjects', component: SubjectListComponent },
  { path: 'universities', component: UniversityListComponent },
  { path: 'universities/edit/:$key', component: UniversityFormComponent, data: { editMode: true } },
  { path: 'universities/create', component: UniversityFormComponent, data: { editMode: false } },
  { path: 'subjects/edit/:$key', component: SubjectFormComponent, data: { editMode: true } },
  { path: 'subjects/create', component: SubjectFormComponent, data: { editMode: false } }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {
}
