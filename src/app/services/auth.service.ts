import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { EnvService } from "./env.service";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private router: Router,
        private httpClient: HttpClient,
        private environment:EnvService) {

        }

    setToken(token: string): void {
        sessionStorage.setItem("token", token);
    }

    getToken(): string | null {
        return sessionStorage.getItem("token");
    }

    isLoggedIn() {
        return this.getToken() !== null;
    }

    logout() {
        sessionStorage.removeItem("token");
        this.router.navigate([""]);
    }

    login(user: any): Observable<any> {
        return this.httpClient.post(`${this.environment.apiURL}/auth/login`, user);
    }
    
}
