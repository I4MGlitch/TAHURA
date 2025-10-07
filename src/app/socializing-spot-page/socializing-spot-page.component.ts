import { Component } from '@angular/core';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-socializing-spot-page',
  templateUrl: './socializing-spot-page.component.html',
  styleUrls: ['./socializing-spot-page.component.css']
})
export class SocializingSpotPageComponent {
  postList: any[] = [];
  currentPagePost = 1;
  totalPagesPost = 1;
  currentPageInputPost = 1;
  selectedPost: any = {};
  searchQuery: string = '';
  selectedSort: string = '';
  isLoggedIn: boolean = false;
  username: any = '';
  usernames: any[] = [];
  userProfile: any = {};
  isLoading = false;
  pageSize = 20;
  selectedImages: File[] = [];
  selectedImagesBase64: string[] = [];
  imagePreview: string | null = '';
  picChange: boolean = false
  selectedImage: File | null = null;
  newComment: any = ''

  postData: any = {
    username: '',
    date: '',
    description: '',
    like: [],
    dislike: [],
    photos: [],
    comments: []
  };

  constructor(private postService: PostService, private userService: UserService) { }
  
  ngOnInit() {
    this.loadPost();
    this.fetchAllUsernames();
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
          this.fetchUserpfuserProfile(this.username);
        }
      }
    });
  }

  fetchUserpfuserProfile(username: string): void {
    console.log('Fetching data for username:', username);
    this.userService.getUserByUsername(username).subscribe(
      data => {
        this.userProfile = data;
        console.log('User data fetched successfully:', this.userProfile);
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
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

  loadPost() {
    this.isLoading = true;
    this.postService.getLazyPost(this.currentPagePost, this.pageSize).subscribe(response => {
      this.postList = response.postData;
      this.totalPagesPost = response.totalPages;
      this.currentPageInputPost = this.currentPagePost;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching posts:', error);
      this.isLoading = false;
    });
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
  
    // // Check if current user has a valid profile pic
    // if (this.userProfile?.photos?.length > 0 && this.userProfile.photos[0]?.data && this.userProfile.photos[0]?.contentType) {
    //   return this.getImageUrl(this.userProfile.photos[0].data);
    // }
  
    // Return default error image if no valid profile picture is found
    return this.getErrorImageUrl();
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

  // Handle page input change for post
  changePagePost() {
    const page = Number(this.currentPageInputPost);
    if (!isNaN(page) && page >= 1 && page <= this.totalPagesPost) {
      this.goToPagePost(page);
    } else {
      this.currentPageInputPost = this.currentPagePost;
    }
  }

  // Go to specific page for post
  goToPagePost(page: number) {
    if (page >= 1 && page <= this.totalPagesPost) {
      this.currentPagePost = page;
      this.loadPost();
    }
  }

  // Validate input for post pagination
  validatePageInputPost() {
    if (this.currentPageInputPost < 1 || this.currentPageInputPost > this.totalPagesPost) {
      this.currentPageInputPost = this.currentPagePost;
    }
  }

  setSelectedPost(post: any) {
    this.selectedPost = { ...post }; // Copy the object to avoid reference issues
    console.log(post)
  }

  getfilteredPosts() {
    let posts = this.postList;
  
    // My Post filter
    if (this.selectedSort === 'mypost') {
      posts = posts.filter(post => post.username === this.username);
    }
  
    // Search filter
    if (this.searchQuery?.trim()) {
      posts = posts.filter(post =>
        post.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  
    // Sort by latest or most liked
    if (this.selectedSort === 'latest') {
      posts = posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (this.selectedSort === 'mostLiked') {
      posts = posts.sort((a, b) => b.like.length - a.like.length);
    }
  
    return posts;
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

  submitPost() {
    if (!this.isLoggedIn) {
      alert('You must be logged in to perform this action.');
      return;
    }

    if (this.selectedImages.length === 0) {
      console.error('Please select an image.');
      alert('Please fill out all information.');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('description', this.postData.description);
    formData.append('date', this.postData.date || new Date().toISOString());

    for (let i = 0; i < this.selectedImages.length; i++) {
      formData.append('photos', this.selectedImages[i]);
    }

    // Make the HTTP request using the service
    this.postService.createPost(formData).subscribe(
      (response: any) => {
        console.log('Post added successfully:', response);
        alert('Post added successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error adding post:', error);
      }
    );
  }

  editPost() {
    if (!this.isLoggedIn) {
      alert('You must be logged in to perform this action.');
      return;
    }

    if (!this.selectedPost || !this.selectedPost._id) {
      console.error('No post selected for editing.');
      return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('description', this.selectedPost.description);

    if (this.selectedImages.length > 0) {
      for (let i = 0; i < this.selectedImages.length; i++) {
        formData.append('photos', this.selectedImages[i]);
      }
    }

    // Make the HTTP request using the service
    this.postService.editPost(this.selectedPost._id, formData).subscribe(
      (response: any) => {
        console.log('Post updated successfully:', response);
        alert('Post updated successfully!');
        window.location.reload();
      },
      (error: any) => {
        console.error('Error updating post:', error);
      }
    );
  }

  deletePost(postId: string) {
    if (!this.isLoggedIn) {
      alert('You must be logged in to perform this action.');
      return;
    }

    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe({
        next: (response) => {
          console.log('Post deleted:', response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }

  onLike(postId: string, username: string, event: MouseEvent): void {
    if (!this.isLoggedIn) {
      alert('You must be logged in to perform this action.');
      return;
    }

    event.stopPropagation(); // Prevent modal opening

    this.postService.likePost(postId, username).subscribe({
      next: (response) => {
        const post = this.postList.find((p: { _id: any }) => p._id === postId);
        if (post) {
          post.like = response.likes; // Update likes array
        }
      },
      error: (error) => {
        console.error('Error toggling like:', error);
      },
    });
  }

  onDislike(postId: string, username: string, event: MouseEvent): void {
    if (!this.isLoggedIn) {
      alert('You must be logged in to perform this action.');
      return;
    }
    event.stopPropagation(); // Prevent modal opening

    this.postService.dislikePost(postId, username).subscribe({
      next: (response) => {
        const post = this.postList.find((p: { _id: any }) => p._id === postId);
        if (post) {
          post.dislike = response.dislikes; // Update dislikes array
        }
      },
      error: (error) => {
        console.error('Error toggling dislike:', error);
      },
    });
  }

  onAddComment(postId: string, username: string, comment: string): void {
    if (!this.isLoggedIn) {
      alert('You must be logged in to perform this action.');
      return;
    }
    
    if (!comment.trim()) {
      console.log('Empty adding comment');
      return; // Avoid empty comments
    }

    this.postService.addComment(postId, username, comment).subscribe({
      next: (response) => {
        const post = this.postList.find((p: { _id: any }) => p._id === postId);
        if (post) {
          post.comments = response.comments; // Update comments with latest data
        }
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      },
    });
  }
}
