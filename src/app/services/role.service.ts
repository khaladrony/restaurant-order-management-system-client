import { Injectable } from "@angular/core";
import { EnvService } from "./env.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Role } from "../models/role.model";

@Injectable({
  providedIn: "root",
})
export class RoleService {

  API_FEATURE_NAME: String;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private environment: EnvService
  ) {
    this.API_FEATURE_NAME = '/roles';
  }

  create(role: Role): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData: FormData = new FormData();
    formData.append('roleDTO', JSON.stringify(role));

    return this.httpClient.post(`${this.environment.apiURL}${this.API_FEATURE_NAME}/add`, formData, { headers: headers });
  }


  update(role: Role): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData: FormData = new FormData();
    formData.append('roleDTO', JSON.stringify(role));

    return this.httpClient.put(`${this.environment.apiURL}${this.API_FEATURE_NAME}/update`, formData, { headers: headers });
  }


  delete(id: any): Observable<any> {
    const token = sessionStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams();
    params = params.append('id', id);

    return this.httpClient.delete(`${this.environment.apiURL}${this.API_FEATURE_NAME}/delete`, { headers, params });
  }

  getList(formData: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post(`${this.environment.apiURL}${this.API_FEATURE_NAME}/list`, formData, { headers: headers });
  }
}
