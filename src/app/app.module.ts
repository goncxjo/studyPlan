import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
// TOASTR
import { ToastrModule } from 'ngx-toastr';
// PROGRESSBAR
import { NgProgressModule } from 'ngx-progressbar';

// COMPONENTS
import { NetworkComponent } from './components/network/network.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';
import { SubjectListComponent } from './components/subject/subject-list/subject-list.component';
import { SubjectMultiselectorComponent } from './components/subject/subject-multiselector/subject-multiselector.component';
import { UniversityListComponent } from './components/university/university-list/university-list.component';
import { UniversityFormComponent } from './components/university/university-form/university-form.component';
import { UniversitySelectorComponent } from './components/university/university-selector/university-selector.component';
import { CareerListComponent } from './components/career/career-list/career-list.component';
import { CareerFormComponent } from './components/career/career-form/career-form.component';
import { CareerSelectorComponent } from './components/career/career-selector/career-selector.component';
import { DepartmentMultiselectorComponent } from './components/department/department-multiselector/department-multiselector.component';

// SERVICES
import { SubjectService } from './services/subject.service';
import { UniversityService } from './services/university.service';
import { CareerService } from './services/career.service';
import { SelectorComponent } from './components/shared/selector/selector.component';
import { DepartmentSelectorComponent } from './components/department/department-selector/department-selector.component';
import { CareerOptionSelectorComponent } from './components/career/career-option-selector/career-option-selector.component';
import { CareerOptionMultiselectorComponent } from './components/career/career-option-multiselector/career-option-multiselector.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { StudentService } from './services/student.service';


@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    SubjectListComponent,
    SubjectFormComponent,
    SubjectMultiselectorComponent,
    UniversityListComponent,
    UniversityFormComponent,
    UniversitySelectorComponent,
    CareerListComponent,
    CareerFormComponent,
    CareerSelectorComponent,
    SelectorComponent,
    DepartmentMultiselectorComponent,
    DepartmentSelectorComponent,
    CareerOptionSelectorComponent,
    CareerOptionMultiselectorComponent,
    StudentFormComponent,
    StudentListComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    NgProgressModule,
  ],
  providers: [
    SubjectService,
    UniversityService,
    CareerService,
    StudentService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
