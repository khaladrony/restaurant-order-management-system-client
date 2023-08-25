import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private environment: EnvService
  ) { }

  create(user: User): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData: FormData = new FormData();
    formData.append('userDTO', JSON.stringify(user));

    return this.httpClient.post(`${this.environment.apiURL}/users/add`, formData, { headers: headers });
  }


  update(user: User): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData: FormData = new FormData();
    formData.append('roleDTO', JSON.stringify(user));

    return this.httpClient.put(`${this.environment.apiURL}/users/update`, formData, { headers: headers });
  }


  delete(id: any): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams();
    params = params.append('id', id);

    return this.httpClient.delete(`${this.environment.apiURL}/users/delete`, { headers, params });
  }

  getList(formData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post(`${this.environment.apiURL}/users/list`, formData, { headers: headers });
  }
}
