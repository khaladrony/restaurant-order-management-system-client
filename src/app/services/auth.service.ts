import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  setToken(token:string):void{
    sessionStorage.setItem('token',token);
  }

  getToken():string|null{
    return sessionStorage.getItem('token');
  }

  isLoggedIn(){
    return this.getToken()!==null;
  }

  logout(){
    sessionStorage.removeItem('token');
    this.router.navigate([''])
  }

  login({email,password}: any):Observable<any>{
    if(email==='rony@gmail.com'&& password==='abc123'){
      this.setToken('ansdlsdkjsldlsdkslkds');
      return of({name:'Khalad Mosharaf', email:'rony@gamail.com'});
    }
    return throwError(new Error('Failed to login'));
  }
}
