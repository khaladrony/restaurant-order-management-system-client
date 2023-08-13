import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.scss']
})
export class RestaurantInfoComponent implements OnInit {

  restaurantForm: UntypedFormGroup;
  restaurant: Restaurant;
  restaurants: Restaurant[] = [];
  selectedRowIndex: number;
  isUpdateMode = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private confirmationModalService: ConfirmationModalService,
    private loader: NgxSpinnerService,
    private notifyService: NotificationService) {
    this.selectedRowIndex = -1;
  }

  ngOnInit(): void {
    this.restaurantForm = this.formBuilder.group({
      restaurantName: new FormControl('', Validators.required),
      branchCode: new FormControl('', Validators.required),
      branchManager: new FormControl(''),
      address: new FormControl(''),
      phoneNo: new FormControl('', Validators.required),
      webAddress: new FormControl(''),
      status: ['Active']
    });
  }

  submit() {

    if (!this.restaurantForm.valid) {
      this.validateAllFormFields(this.restaurantForm);
      return;
    }


    this.restaurant = new Restaurant();

    this.restaurant.restaurantName = this.restaurantForm.value.restaurantName;
    this.restaurant.branchCode = this.restaurantForm.value.branchCode;
    this.restaurant.branchManager = this.restaurantForm.value.branchManager;
    this.restaurant.address = this.restaurantForm.value.address;
    this.restaurant.phoneNo = this.restaurantForm.value.phoneNo;
    this.restaurant.webAddress = this.restaurantForm.value.webAddress;
    this.restaurant.status = this.restaurantForm.value.status;

    this.restaurants.push(this.restaurant);

    this.resetForm();

    this.notifyService.showSuccess("User created successfully!", "SUCCESS");
  }

  delete() {
    console.log('delete button pressed');

    this.confirmationModalService.confirm(
      "Delete confirmation!",
      "Are you sure you want to delete?")
      .subscribe((answer) => {
        if (answer === 'yes') {
          this.notifyService.showError("Data deleted successfully!", "DELETED");
        } else {
          return;
        }
      });

  }

  onSelectRow(restaurant: Restaurant, index: number) {

    this.isUpdateMode = true;

    this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

    if (this.selectedRowIndex == -1) {
      this.resetForm();
      return;
    }


    this.restaurantForm.controls['restaurantName'].setValue(restaurant.restaurantName);
    this.restaurantForm.controls['branchCode'].setValue(restaurant.branchCode);
    this.restaurantForm.controls['branchManager'].setValue(restaurant.branchManager);
    this.restaurantForm.controls['phoneNo'].setValue(restaurant.phoneNo);
    this.restaurantForm.controls['address'].setValue(restaurant.address);
    this.restaurantForm.controls['status'].setValue(restaurant.status);

  }

  updateSelectedRow() {
    this.restaurant.restaurantName = this.restaurantForm.value.restaurantName;
    this.restaurant.branchCode = this.restaurantForm.value.branchCode;
    this.restaurant.branchManager = this.restaurantForm.value.branchManager;
    this.restaurant.address = this.restaurantForm.value.address;
    this.restaurant.phoneNo = this.restaurantForm.value.phoneNo;
    this.restaurant.webAddress = this.restaurantForm.value.webAddress;
    this.restaurant.status = this.restaurantForm.value.status;

    console.log(this.restaurant);

    this.restaurants.push(this.restaurant);

    console.info(this.restaurant);

    this.resetForm();

    this.notifyService.showSuccess("User updated successfully!", "UPDATED");
  }

  resetForm() {
    this.restaurantForm.reset();
    this.restaurantForm.controls['status'].setValue('Active');
    this.isUpdateMode = false;
  }

  validateAllFormFields(formGroup: FormGroup) {
    let invalidFieldCount = 0;
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      const el = document.getElementById(field);

      if (control instanceof FormControl && el && (control?.value == null
        || control?.value === undefined || control?.value == '') && control?.status == "INVALID") {
        control.markAsTouched({ onlySelf: true });
        invalidFieldCount++;
      } else if (control instanceof FormGroup) {
        control.clearValidators();
        control.markAsPristine();
      }
    });

    return invalidFieldCount;
  }

}
