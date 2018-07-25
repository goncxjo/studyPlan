import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectListComponent } from './components/subject/subject-list/subject-list.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';

const routes: Routes = [
  { path: 'subjects', component: SubjectListComponent },
  { path: 'subjects/edit/:$key', component: SubjectFormComponent },
  { path: 'subjects/create', component: SubjectFormComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {
}
