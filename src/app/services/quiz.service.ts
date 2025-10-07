import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
//private baseUrl = 'https://finaltahura.vercel.app';
  private baseUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) { }

  getQuiz(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getQuiz`);
  }

  // Create or update the quiz
  saveQuiz(quizData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/quiz`, quizData);
  }

  // Submit a quiz result
  submitQuizResult(username: string, score: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/quiz/result`, { username, score });
  }

  // Get all quiz results
  getQuizResults(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/quiz/results`);
  }

  // Delete the quiz
  deleteQuiz(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/api/quiz`);
  }

  resetQuiz(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/reset`);
  }
}
