import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logreg-page',
  templateUrl: './logreg-page.component.html',
  styleUrls: ['./logreg-page.component.css']
})
export class LogregPageComponent {

  loginPassword: string = '';
  registerPassword: string = '';
  isRegisterActive: boolean = false; // Untuk toggle antara login dan register
  registerData = {
    username: '',
    email: '',
    password: ''
  };
  loginData = {
    username: '',
    password: ''
  };

  constructor(private userService: UserService, private router: Router) { }

  // Toggle password visibility
  togglePassword(inputId: string, iconId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const icon = document.getElementById(iconId) as HTMLElement;

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  }

  // Show register form
  showRegister(): void {
    this.isRegisterActive = true;
  }

  // Show login form
  showLogin(): void {
    this.isRegisterActive = false;
  }

  login() {
    if (this.loginData.username && this.loginData.password) {
      this.userService.login(this.loginData).subscribe(
        response => {
          console.log('Login response:', response); // Debugging
          
          // Save the token
          if (response.token) {
            this.userService.saveToken(response.token);
          } else {
            console.error('Token missing in response');
            return;
          }
  
          // Extract user data
          const user = response.user || {}; // Fallback to empty object if 'user' is undefined
          const username = user.username || 'Unknown User'; // Fallback value for username
          const email = user.email || 'Unknown Email'; // Fallback value for email
  
          localStorage.setItem('user', JSON.stringify({ username, email }));
          
          // Update the isLoggedIn state in the parent component (HeaderComponent)
          this.userService.setIsLoggedIn(true); // Assuming a service method to update logged-in status
  
          // Navigate based on role
          if (this.userService.isAdmin()) {
            this.router.navigate(['/admin-page']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error => {
          alert('Login failed: E-mail or Password does not exist');
        }
      );
    } else {
      alert('Please fill out both email and password.');
    }
  }

  register() {
    // Ensure registerData is valid before submission
    if (this.registerData.username && this.registerData.email && this.registerData.password) {
      this.userService.register(this.registerData).subscribe(
        response => {
          // Successful registration response
          alert('Registration successful!');
          this.showLogin(); // Switch to login after successful registration
        },
        error => {
          // Error handling
          if (error.status === 400) {
            // Handle specific error based on status code or response
            const errorMessage = error.error?.message || 'Registration failed. Please try again.';
            alert(errorMessage);
          } else {
            // Handle other errors
            alert('An unexpected error occurred. Please try again later.');
          }
        }
      );
    } else {
      alert('Please fill out all fields.');
    }
  }
  
}
