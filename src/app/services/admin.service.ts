import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 //private baseUrl = 'https://finaltahura.vercel.app';
  private baseUrl = 'http://localhost:4242';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.saveToken(response.token);
          this.setIsLoggedIn(true);
        } else {
          console.error('Token missing in response');
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.setIsLoggedIn(false);
  }

  private saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role === 'admin';
      } catch (error) {
        console.error('Invalid token format', error);
      }
    }
    return false;
  }

}
