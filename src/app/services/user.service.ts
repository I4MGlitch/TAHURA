import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:4242'
  //private baseUrl = 'https://finaltahura.vercel.app';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
    this.setIsLoggedIn(true);
  }
  isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    }
    return false;
  }
  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }
  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const username = decodedToken.username;

      console.log('Username:', username);
      return username || null;
    }
    return null;
  }
  getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${username}`);
  }
  fetchAllUsernames(): Observable<{ username: string; profilePic: string | null }[]> {
    return this.http.get<{ username: string; profilePic: string | null }[]>('http://localhost:4242/all-usernames');
  }
  fetchAllUsername(): Observable<{ username: string; profilePic: string | null }[]> {
    return this.http.get<{ username: string; profilePic: string | null }[]>(`${this.baseUrl}/all-usernames`);
  }
  getUserData(): any {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return {
        username: decodedToken?.username,
        role: decodedToken?.role
      };
    }
    return null;
  }
  getAllUsers(page: number, pageSize: number): Observable<{ usersData: any[], totalPages: number }> {
    return this.http.get<{ usersData: any[], totalPages: number }>(
      `${this.baseUrl}/api/users?page=${page}&pageSize=${pageSize}`
    );
  }
  submitUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users`, formData);
  }
  editUser(userId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/users/${userId}`, formData);
  }
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/users/${userId}`);
  }
}
