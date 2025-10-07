import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-submit-report-page',
  templateUrl: './submit-report-page.component.html',
  styleUrls: ['./submit-report-page.component.css']
})
export class SubmitReportPageComponent {

  report: any = {
    username: '',
    description: ''
  };
  
  userData: any = {};
  searchTerm: string = '';
  username: string | null = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private reportService: ReportService) { }  // Inject ChangeDetectorRef

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    // Check if the user is logged in
    this.userService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.isLoggedIn = true;
        this.username = this.userService.getUsernameFromToken();
        console.log('Decoded username:', this.username);
        if (this.username) {
          this.fetchUserData(this.username);
          this.report.username = this.username 
        }
      }
    });
    this.cdRef.detectChanges();  // Explicitly trigger change detection to update view
  }

  fetchUserData(username: string): void {
    console.log('Fetching data for username:', username);
    this.userService.getUserByUsername(username).subscribe(
      data => {
        this.userData = data;
        console.log('User data fetched successfully:', this.userData);
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  onSubmit(): void {
    if (!this.report.description.trim()){ alert("Fill out all information"); return;};

    this.reportService.addReport(this.report).subscribe({
      next: (res) => {
        console.log('Report submitted:', res);
        this.report.description = ''; // Clear the textarea after submission
      },
      error: (err) => {
        console.error('Error submitting report:', err);
      }
    });
  }

}
