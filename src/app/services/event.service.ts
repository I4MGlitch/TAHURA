import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
//private baseUrl = 'https://finaltahura.vercel.app';
  private baseUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) { }

  fetchEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/events`);
  }

  addEvent(event: any): Observable<{ message: string; event: any }> {
    return this.http.post<{ message: string; event: any }>(`${this.baseUrl}/api/events`, event);
  }

  deleteEvent(eventId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/api/events/${eventId}`);
  }
}
