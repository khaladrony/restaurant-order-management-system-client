import { Routes } from "@angular/router";

import { LoginComponent } from "../../pages/login/login.component";
import { RegisterComponent } from "../../pages/register/register.component";
import { PasswordStrengthBarComponent } from "src/app/pages/login/password-strength-bar/password-strength-bar.component";

export const AuthLayoutRoutes: Routes = [
  {
    path: "",
    component: LoginComponent,
    children: [{ path: "", component: PasswordStrengthBarComponent }]
  }
//   { path: "register", component: RegisterComponent},
];
