import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'studyPlan!';
  isNavbarCollapsed = true;

  constructor(
    private db: AngularFireDatabase
    , public router: Router
    , public auth: AuthService
  ) { }

  isHome() {
    return this.router.url === '/';
  }
}
