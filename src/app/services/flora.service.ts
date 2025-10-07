import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloraService {
  
  //private baseUrl = 'https://finaltahura.vercel.app';
  private baseUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) {}

  getFloraDetails(id: String): Observable<any> {
    const url = `${this.baseUrl}/api/getFloraDetails/${id}`;
    return this.http.get<any>(url);
  }
  getAllFlora(): Observable<any> {
    const url = `${this.baseUrl}/api/getAllFlora`;
    return this.http.get<any>(url);
  }
  getPartialFlora(): Observable<any> {
    const url = `${this.baseUrl}/api/getPartialFlora`;
    return this.http.get<any>(url);
  }
  getLoadFlora(page: number, limit: number): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<any[]>(`${this.baseUrl}/api/getLoadFlora`, { params })
  }
  searchFlora(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/search/flora`, { params: { query } });
  }

  getFlora(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getLazyFlora?page=${page}`);
  } 

  deletePhoto(floraId: string, photoIndex: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/flora/${floraId}/photo/${photoIndex}`);
  }

  submitFlora(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/flora`, formData);
  }
  
  deleteFloraPhoto(floraId: string, photoIndex: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/flora/${floraId}/photo/${photoIndex}`);
  }

  deleteFlora(floraId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/flora/${floraId}`);
  }

  editFlora(floraId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/flora/${floraId}`, formData);
  }
  
}
