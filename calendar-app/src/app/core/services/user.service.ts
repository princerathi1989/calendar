import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../../models/user';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  add(data: User): Observable<any> {
    return this.httpClient.post(`${environment.api.baseUrl}/users`, data);
  }

  getAppointments(id: number): Observable<any> {
    return this.httpClient.get(`${environment.api.baseUrl}/appointments/${id}`);
  }

  saveAppointment(data: any): Observable<any> {
    return this.httpClient.put(`${environment.api.baseUrl}/appointments`, data);
  }

  verify(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${environment.api.baseUrl}/users/login`, { email, password });
  }
}
