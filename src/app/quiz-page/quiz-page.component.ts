import { ChangeDetectorRef, Component } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-quiz-page',
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.css']
})
export class QuizPageComponent {

  quizData: any;
  currentQuestionIndex: number = 0;
  answers: string[] = [];
  usernam: string = '';
  score: number = 0;
  quizResults: any[] = [];
  userRank: number | null = null;
  usernames: any[] = [];

  userData: any = {};
  searchTerm: string = '';
  username: string | null = '';
  isLoggedIn: boolean = false;
  userQuizResult: any;

  constructor(private quizService: QuizService, 
    private router: Router,
      private userService: UserService,
      private cdRef: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.fetchQuiz();
    this.checkLoginStatus();
    this.getQuizResults();
    this.fetchAllUsernames();
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
          this.usernam = this.username 
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
    // if (this.userData?.photos?.length > 0 && this.userData.photos[0]?.data && this.userData.photos[0]?.contentType) {
    //   return this.getImageUrl(this.userData.photos[0].data);
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

  getQuizResults(): void {
    this.quizService.getQuizResults().subscribe({
      next: (results) => {
        // Sort by score descending
        this.quizResults = results.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
  
        // Find the logged-in user's result
        this.userQuizResult = this.quizResults.find(result => result.username === this.username);
  
        // Find the rank (index + 1)
        if (this.userQuizResult) {
          this.userRank = this.quizResults.findIndex(r => r.username === this.username) + 1;
        }
      },
      error: (err) => {
        console.error('Failed to fetch quiz results', err);
      }
    });
  }
  
  fetchQuiz(): void {
    this.quizService.getQuiz().subscribe({
      next: (data) => {
        this.quizData = data;
        this.answers = Array(data.questions.length).fill(null);
      },
      error: (err) => {
        console.error('Error fetching quiz:', err);
      }
    });
  }

  selectAnswer(index: number, value: string): void {
    this.answers[index] = value;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quizData.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  finishQuiz(): void {
    const correctAnswers = this.quizData.questions.map((q: { correctAnswer: any; }) => q.correctAnswer);
    this.score = this.answers.filter((a, i) => a === correctAnswers[i]).length;

    this.quizService.submitQuizResult(this.usernam, this.score).subscribe({
      next: () => alert(`Quiz submitted! You scored ${this.score}/${correctAnswers.length}`),
      error: (err) => console.error('Error submitting result:', err)
    });
  }
}
