import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
// COMPONENTS
import { NetworkComponent } from './components/network/network.component';
import { SubjectFormComponent } from './components/subject/subject-form/subject-form.component';
import { SubjectListComponent } from './components/subject/subject-list/subject-list.component';
import { SubjectSelectorComponent } from './components/subject/subject-selector/subject-selector.component';
// import { UniversityFormComponent } from './components/network/university/university-form/university-form.component';
// import { CareerFormComponent } from './components/network/career/career-form/career-form.component';
// SERVICES
import { SubjectService } from './services/subject.service';
import { UniversityService } from './services/university.service';
import { CareerService } from './services/career.service';
import { StateSelectorComponent } from './components/subject/state-selector/state-selector.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    SubjectFormComponent,
    SubjectListComponent,
    // UniversityFormComponent,
    // CareerFormComponent,
    SubjectSelectorComponent,
    StateSelectorComponent
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
  providers: [SubjectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
