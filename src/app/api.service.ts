import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface Employee {
  id: number;
  name: string;
  email: string;
  job_title: string;
  department: string;
  start_date: string;
  end_date: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getEmployees(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string[] }>,
    query: string | null,
    date: [] | null
  ): Observable<{ items: Employee[]; totalLength: number }> {
    console.log('date', typeof date, date);
    let params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('limit', `${pageSize}`)
      .append('sortField', `${sortField}`)
      .append('sortOrder', `${sortOrder}`)
      .append('query', `${query}`)
      .append('date', `${date}`);
    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });
    return this.http
      .get<{ items: Employee[]; totalLength: number }>(
        `${environment.backend_url}`,
        { params }
      )
      .pipe(catchError(() => of({ items: [], totalLength: 0 })));
  }

  generatePdf(data: Employee[]): Observable<{ link: string }> {
    return this.http
      .post<{ link: string }>(`${environment.backend_url}/pdf`, data)
      .pipe(catchError(() => of({ link: '' })));
  }

  generateCsv(data: Employee[]): Observable<{ link: string }> {
    return this.http
      .post<{ link: string }>(`${environment.backend_url}/csv`, data)
      .pipe(catchError(() => of({ link: '' })));
  }
}
