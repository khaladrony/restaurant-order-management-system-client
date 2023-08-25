import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-customers-order',
  templateUrl: './customers-order.component.html',
  styleUrls: ['./customers-order.component.scss']
})
export class CustomersOrderComponent implements OnInit {

  title: string;
  foodCategoryForm: UntypedFormGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

  submit() { }
}
