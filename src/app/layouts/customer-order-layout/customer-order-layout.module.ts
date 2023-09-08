import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from 'src/app/pages/restaurant/customers-order/cart/cart.component';
import { ProductsComponent } from 'src/app/pages/restaurant/customers-order/products/products.component';
import { HeaderComponent } from 'src/app/pages/restaurant/customers-order/header/header.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { CustomerOrderLayoutRoutes } from './customer-order-layout.routing';
import { CheckoutComponent } from 'src/app/pages/restaurant/customers-order/checkout/checkout.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';


@NgModule({  
  imports: [
    CommonModule,
    RouterModule.forChild(CustomerOrderLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule
  ],
  declarations: [
    HeaderComponent,
    CartComponent,
    ProductsComponent,
    CheckoutComponent,
    FilterPipe
  ]
})
export class CustomerOrderModule { }
