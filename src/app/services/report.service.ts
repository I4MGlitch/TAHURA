import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
//private baseUrl = 'https://finaltahura.vercel.app';
  private baseUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) { }
  
  // Fetch all reports
  getReports(): Observable<Report[]> {
    return this.http.get<any>(`${this.baseUrl}/report`);
  }

  // Add a new report
  addReport(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.baseUrl}/report`, report);
  }

  // Delete a report by ID
  deleteReport(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/report/${id}`);
  }
}
