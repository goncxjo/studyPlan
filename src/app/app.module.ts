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
import { AngularFireAuthModule } from 'angularfire2/auth';
// TOASTR
import { ToastrModule } from 'ngx-toastr';
// PROGRESSBAR
import { NgProgressModule } from 'ngx-progressbar';
// NG-BOOTSTRAP
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// MODULES
import { CoreModule } from './core/core.module';

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
import { LoadingComponent } from './components/shared/loading/loading.component';
import { SelectorComponent } from './components/shared/selector/selector.component';
import { DepartmentSelectorComponent } from './components/department/department-selector/department-selector.component';
import { CareerOptionSelectorComponent } from './components/career/career-option-selector/career-option-selector.component';
import { CareerOptionMultiselectorComponent } from './components/career/career-option-multiselector/career-option-multiselector.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { StudentListComponent } from './components/student/student-list/student-list.component';
import { CareerPlanComponent } from './components/career/career-plan/career-plan.component';
import { StudentPlanComponent } from './components/student/student-plan/student-plan.component';
import { BooleanSelectorComponent } from './components/shared/boolean-selector/boolean-selector.component';
import { FormModalComponent } from './components/shared/form-modal/form-modal.component';
import { StateSelectorComponent } from './components/subject/state-selector/state-selector.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
// SERVICES
import { SubjectService } from './services/subject.service';
import { UniversityService } from './services/university.service';
import { CareerService } from './services/career.service';
import { StudentService } from './services/student.service';
import { AuthService } from './core/auth.service';

// GUARD
import { AuthGuard } from './core/auth.guard';

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
    CareerPlanComponent,
    StudentPlanComponent,
    LoadingComponent,
    BooleanSelectorComponent,
    FormModalComponent,
    StateSelectorComponent,
    UserProfileComponent,
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
    NgbModule.forRoot(),
    CoreModule,
    AngularFireAuthModule,
  ],
  providers: [
    SubjectService,
    UniversityService,
    CareerService,
    StudentService,
    AuthService,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FormModalComponent
  ]
})
export class AppModule { }
