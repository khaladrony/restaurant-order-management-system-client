import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    // { path: '', component: LoginComponent },
    {   path: '', 
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule) },
    {path: '/admin', component: DashboardComponent }, 
    {path: '/admin/dashboard', component: DashboardComponent }, 
    {
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
    },
    {
        path: 'product',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/layouts/customer-order-layout/customer-order-layout.module').then(m => m.CustomerOrderModule)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [
    ],
})
export class AppRoutingModule { }
