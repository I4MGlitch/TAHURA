import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
//private baseUrl = 'https://finaltahura.vercel.app';
  private baseUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) { }

  getLazyPost(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getLazyPosts?page=${page}&pageSize=${pageSize}`);
  }
  createPost(postData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/post`, postData);
  }
  likePost(postId: string, username: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/like-post`, { postId, username });
  }  
  dislikePost(postId: string, username: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/dislike-post`, { postId, username });
  }  
  addComment(postId: string, username: string, comment: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/add-comment`, { postId, username, comment });
  }
  editPost(postId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/post/${postId}`, formData);
  }
  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/post/${postId}`);
  }
}
