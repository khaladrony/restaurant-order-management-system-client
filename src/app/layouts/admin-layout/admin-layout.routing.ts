import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { OrganizationComponent } from 'src/app/pages/organization/organization.component';
import { FeatureComponent } from 'src/app/pages/permission/feature/feature.component';
import { RolesComponent } from 'src/app/pages/permission/roles/roles.component';
import { RoleFeatureMappingComponent } from 'src/app/pages/permission/role-feature-mapping/role-feature-mapping.component';
import { RestaurantInfoComponent } from 'src/app/pages/restaurant/restaurant-info/restaurant-info.component';
import { FoodCategoryComponent } from 'src/app/pages/restaurant/food-category/food-category.component';
import { DishComponent } from 'src/app/pages/restaurant/dish/dish.component';
import { CustomersOrderComponent } from 'src/app/pages/restaurant/customers-order/customers-order.component';
import { RestaurantDishComponent } from 'src/app/pages/restaurant/restaurant-dish/restaurant-dish.component';
import { CheckoutComponent } from 'src/app/pages/restaurant/customers-order/checkout/checkout.component';

export const AdminLayoutRoutes: Routes = [
    {
        path: '', component: AdminLayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'user-profile', component: UserProfileComponent },
            { path: 'role', component: RolesComponent },
            { path: 'feature', component: FeatureComponent },
            { path: 'feature-map', component: RoleFeatureMappingComponent },
            { path: 'organization', component: OrganizationComponent },
            { path: 'restaurant', component: RestaurantInfoComponent },
            { path: 'food-category', component: FoodCategoryComponent },
            { path: 'dish', component: DishComponent },
            { path: 'customer-order', component: CustomersOrderComponent },
            { path: 'restaurant-dish', component: RestaurantDishComponent },
            { path: 'checkout', component: CheckoutComponent }
        ]
    }
];
