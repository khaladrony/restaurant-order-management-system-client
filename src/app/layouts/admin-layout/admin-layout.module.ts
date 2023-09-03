import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationComponent } from 'src/app/pages/organization/organization.component';
import { FeatureComponent } from 'src/app/pages/permission/feature/feature.component';
import { RolesComponent } from 'src/app/pages/permission/roles/roles.component';
import { RoleFeatureMappingComponent } from 'src/app/pages/permission/role-feature-mapping/role-feature-mapping.component';
import { RestaurantInfoComponent } from 'src/app/pages/restaurant/restaurant-info/restaurant-info.component';
import { FoodCategoryComponent } from 'src/app/pages/restaurant/food-category/food-category.component';
import { DishComponent } from 'src/app/pages/restaurant/dish/dish.component';
import { CustomersOrderComponent } from 'src/app/pages/restaurant/customers-order/customers-order.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RestaurantDishComponent } from 'src/app/pages/restaurant/restaurant-dish/restaurant-dish.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    OrganizationComponent,
    RolesComponent,
    FeatureComponent,
    RoleFeatureMappingComponent,
    RestaurantInfoComponent,
    FoodCategoryComponent,
    DishComponent,
    RestaurantDishComponent,
    CustomersOrderComponent
  ]
})

export class AdminLayoutModule {}
