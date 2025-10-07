import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TAHURAProject';

  showHeaderFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      const hiddenRoutes = ['/logreg-page' , '/admin-page'];
      this.showHeaderFooter = this.router.url !== '/login';
      this.showHeaderFooter = !hiddenRoutes.includes(this.router.url);
    });
  }

}
