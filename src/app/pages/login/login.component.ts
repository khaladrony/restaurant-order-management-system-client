import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm = new FormGroup({
        email: new FormControl(''),
        password: new FormControl('')

    });

    constructor(private router: Router, private auth:AuthService) { }

    ngOnInit() {
        if(this.auth.isLoggedIn()){
            this.router.navigate(['admin']);
        }
    }
    ngOnDestroy() {
    }

    onSubmit(): void {
        if(this.loginForm.valid){
            this.auth.login(this.loginForm.value).subscribe(
                (result)=>{
                    this.router.navigate(['admin']);
                },
                (err: Error)=>{
                    alert(err.message);
                }
                
            );
        }

    }

}
