import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Dish } from 'src/app/models/dish.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.scss']
})
export class DishComponent implements OnInit {

  title: string;
  dishForm: UntypedFormGroup;
  dishes: Dish[] = [];
  dish: Dish;
  selectedRowIndex: number;
  isUpdateMode = false;
  foodCategoryList: any = ['Burger', 'Pizza', 'Pasta', 'Chicken Fry']

  constructor(private formBuilder: UntypedFormBuilder,
    private utilService: UtilService,
    private confirmationModalService: ConfirmationModalService,
    private notifyService: NotificationService
  ) {
    this.selectedRowIndex = -1;
  }

  ngOnInit(): void {
    this.title = 'Dish Create';

    this.dishForm = this.formBuilder.group({
      dishName: new FormControl('', Validators.required),
      foodCategory: new FormControl(null, Validators.required),  
      status: ['Active']
    });
  }

  submit() {
    if (!this.dishForm.valid) {
      this.utilService.validateAllFormFields(this.dishForm);
      return;
    }

    this.dish = new Dish();
    this.dish.dishName = this.dishForm.value.dishName;
    this.dish.foodCategory = this.dishForm.value.foodCategory;
    this.dish.status = this.dishForm.value.status;

    this.dishes.push(this.dish);

    console.info(this.dish);

    this.resetForm();

    this.notifyService.showSuccess("Created successfully!", "SUCCESS");

  }

  delete() {
    this.confirmationModalService.confirm(
      "Delete confirmation!",
      "Are you sure you want to delete?")
      .subscribe((answer) => {
        if (answer === 'yes') {
          this.notifyService.showError("Deleted successfully!", "DELETED");
        } else {
          return;
        }
      });

  }

  onSelectRow(dish: Dish, index: number) {
    this.isUpdateMode = true;

    this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

    if (this.selectedRowIndex == -1) {
      this.resetForm();
      return;
    }


    this.dishForm.controls['dishName'].setValue(dish.dishName);
    this.dishForm.controls['foodCategory'].setValue(dish.foodCategory);
    this.dishForm.controls['status'].setValue(dish.status);

  }

  updateSelectedRow() {
    this.dish.dishName = this.dishForm.value.dishName;
    this.dish.foodCategory = this.dishForm.value.foodCategory;
    this.dish.status = this.dishForm.value.status;

    this.dishes.push(this.dish);

    console.info(this.dish);

    this.resetForm();

    this.notifyService.showSuccess("Updated successfully!", "UPDATED");
  }

  resetForm() {
    this.dishForm.reset();
    this.dishForm.controls['status'].setValue('Active');
    this.isUpdateMode = false;
  }

}
