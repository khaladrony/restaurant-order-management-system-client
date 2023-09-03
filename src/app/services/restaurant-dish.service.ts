import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from './env.service';
import { RestaurantDish } from '../models/restaurant-dish.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RestaurantDishService {

    API_FEATURE_NAME: String;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private environment: EnvService
    ) {
        this.API_FEATURE_NAME = '/restaurant-dish';
    }


    create(restaurantDish: RestaurantDish): Observable<any> {
        const token = sessionStorage.getItem("token");
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        const formData: FormData = new FormData();
        formData.append('restaurantDishDTO', JSON.stringify(restaurantDish));

        return this.httpClient.post(`${this.environment.apiURL}${this.API_FEATURE_NAME}/add`, formData, { headers: headers });
    }


    update(restaurantDish: RestaurantDish): Observable<any> {
        const token = sessionStorage.getItem("token");
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        const formData: FormData = new FormData();
        formData.append('restaurantDishDTO', JSON.stringify(restaurantDish));

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
