import { Component, OnInit, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import {MatAccordion} from '@angular/material/expansion';

import aa from "node_modules/jquery/dist/jquery.min.js";
import bb from "node_modules/popper.js/dist/umd/popper.min.js";
import cc from "node_modules/bootstrap/dist/js/bootstrap.min.js";
// import dd from "node_modules/bootstrap/dist/css/bootstrap.min.css";

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    public products: any = [];
    public grandTotal !: number;
    collapseStatus:string;
    @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

    constructor(
        private cartService: CartService
    ) {
        this.collapseStatus='accordion-collapse collapse show';
     }

    ngOnInit(): void {

        this.cartService.getProducts()
            .subscribe(res => {
                this.products = res;
                this.grandTotal = this.cartService.getTotalPrice();
                console.log(res);
            })

    }

    changePayType(event:any){
        if(event.target.checked == true){
            console.log(event.target.value);
        }

    }

}
