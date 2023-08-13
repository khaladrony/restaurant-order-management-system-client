import { Routes } from '@angular/router';
import { CartComponent } from 'src/app/pages/restaurant/customers-order/cart/cart.component';
import { ProductsComponent } from 'src/app/pages/restaurant/customers-order/products/products.component';
import { CustomerOrderLayoutComponent } from './customer-order-layout.component';

export const CustomerOrderLayoutRoutes: Routes = [
  {
    path: '', component: CustomerOrderLayoutComponent,
    children: [
      { path: '', component: ProductsComponent },
      { path: 'cart', component: CartComponent }
    ]
  }
];

