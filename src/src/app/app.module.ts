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

// COMPONENTS
import { NetworkComponent } from './components/network/network.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';
import { SubjectListComponent } from './components/subject/subject-list/subject-list.component';
import { SubjectSelectorComponent } from './components/subject/subject-selector/subject-selector.component';
// import { StateSelectorComponent } from './components/subject/state-selector/state-selector.component';
import { UniversityListComponent } from './components/university/university-list/university-list.component';
import { UniversityFormComponent } from './components/university/university-form/university-form.component';
// import { CareerFormComponent } from './components/network/career/career-form/career-form.component';

// SERVICES
import { SubjectService } from './services/subject.service';
import { UniversityService } from './services/university.service';
import { CareerService } from './services/career.service';


@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    SubjectFormComponent,
    SubjectListComponent,
    UniversityFormComponent,
    SubjectSelectorComponent,
    UniversityListComponent
    // CareerFormComponent,
    // StateSelectorComponent,
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
  ],
  providers: [SubjectService, UniversityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
