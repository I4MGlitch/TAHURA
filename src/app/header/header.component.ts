import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ChangeDetectorRef } from '@angular/core';  // Import ChangeDetectorRef

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userData: any = {};
  searchTerm: string = '';
  username: string | null = '';
  isLoggedIn: boolean = false;
  selectedImages: File[] = [];
  selectedImagesBase64: string[] = [];
  imagePreview: string | null = '';
  picChange: boolean = false
  selectedImage: File | null = null;
  usernames: any[] = [];

  constructor(private router: Router,
    private userService: UserService,
    private cdRef: ChangeDetectorRef) { }  // Inject ChangeDetectorRef

  ngOnInit(): void {
    this.checkLoginStatus();
    this.fetchAllUsernames()
  }

  fetchAllUsernames(): void {
    this.userService.fetchAllUsername().subscribe(
      (response) => {
        this.usernames = response;
      },
      (error) => {
        console.error('Error fetching all usernames:', error);
      }
    );
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

  editUser() {
    // Validate that all fields are filled
    if (
      !this.userData.username || 
      !this.userData.email || 
      !this.userData.password || 
      !this.selectedImages || 
      this.selectedImages.length === 0
    ) {
      alert('Please fill out all fields and select at least one image.');
      return;
    }
  
    // Prepare FormData for updating user
    const formData = new FormData();
    formData.append('username', this.userData.username);
    formData.append('email', this.userData.email);
    formData.append('password', this.userData.password);
  
    // Append new images
    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('photos', this.selectedImages[i]);
    }
  
    // Make HTTP request to update user
    this.userService.editUser(this.userData._id, formData).subscribe(
      (response: any) => {
        console.log('User updated successfully:', response);
        alert('User updated successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error updating user:', error);
        alert('Failed to update user.');
      }
    );
  }  

  onFileChange(event: any): void {
    this.selectedImages = [];
    this.selectedImagesBase64 = [];
    const files = event.target.files;

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.selectedImages.push(file);

        const reader = new FileReader();
        reader.onload = ((index) => {
          return (e: any) => {
            this.selectedImagesBase64.push(e.target.result);

            // Set the first image as the preview
            if (index === 0) {
              this.imagePreview = e.target.result;
            }
          };
        })(i); // Immediately invoke with the loop index

        reader.readAsDataURL(file); // Convert the file to a Base64 string
      }
      this.picChange = true;
    } else {
      // Clear selections if no file is selected
      this.imagePreview = null;
      this.selectedImages = [];
      this.selectedImagesBase64 = [];
    }
  }

  getImageUrl(imageData: any): string {
    if (imageData && imageData.data) {
      const blob = new Blob([new Uint8Array(imageData.data)], { type: imageData.contentType });
      return URL.createObjectURL(blob);
    }
    return 'assets/Images/logoTahura.png';
  }

  handleImageError(event: any, photo: any) {

  }

  getErrorImageUrl(): string {
    return 'assets/Images/logoTahura.png';
  }

  getProfilePic(username: string): string {
    // Ensure usernames array exists
    if (!this.usernames || !Array.isArray(this.usernames)) {
      return this.getErrorImageUrl();
    }
  
    // Find user by username
    const user = this.usernames.find((user) => user.username === username);
  
    // Validate user object and photos array
    if (user?.photos?.length > 0 && user.photos[0]?.data && user.photos[0]?.contentType) {
      return this.getImageUrl(user.photos[0].data);
    }
  
    // Check if current user has a valid profile pic
    if (this.userData?.photos?.length > 0 && this.userData.photos[0]?.data && this.userData.photos[0]?.contentType) {
      return this.getImageUrl(this.userData.photos[0].data);
    }
  
    // Return default error image if no valid profile picture is found
    return this.getErrorImageUrl();
  }

  onSearch() {
    this.closeMenu();
    if (this.searchTerm) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchTerm } });
    }
  }

  closeMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement;
    if (navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout(): void {
    localStorage.removeItem('token');  // Remove token
    localStorage.removeItem('user');   // Remove user data
    this.isLoggedIn = false;  // Update login status
    this.cdRef.detectChanges();  // Explicitly trigger change detection
    this.router.navigate(['/logreg-page']);  // Redirect to login page
  }
}
