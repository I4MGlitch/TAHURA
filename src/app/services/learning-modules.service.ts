import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearningModuleService {

  //private baseUrl = 'https://finaltahura.vercel.app';
  private baseUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) { }

  getLazyLearningModules(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getLazyLearningModules?page=${page}&pageSize=${pageSize}`);
  }

  createLearningModule(formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/api/learningModules`;
    return this.http.post<any>(url, formData);
  }

  updateLearningModule(id: string, formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/api/learningModules/${id}`;
    return this.http.put<any>(url, formData);
  }

  deleteLearningModule(id: string): Observable<any> {
    const url = `${this.baseUrl}/api/learningModules/${id}`;
    return this.http.delete<any>(url);
  }

  getLearningModuleDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/learningModules/${id}`);
  }
  
}
