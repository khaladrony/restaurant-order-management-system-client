import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FoodCategory } from 'src/app/models/food-category.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-food-category',
  templateUrl: './food-category.component.html',
  styleUrls: ['./food-category.component.scss']
})
export class FoodCategoryComponent implements OnInit {

  title: string;
  foodCategoryForm: UntypedFormGroup;
  foodCategories: FoodCategory[] = [];
  foodCategory: FoodCategory;
  selectedRowIndex: number;
  isUpdateMode = false;

  //Image upload
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;

  constructor(private formBuilder: UntypedFormBuilder,
    private utilService: UtilService,
    private confirmationModalService: ConfirmationModalService,
    private notifyService: NotificationService,
    private httpClient: HttpClient
  ) {
    this.selectedRowIndex = -1;
  }

  ngOnInit(): void {
    this.title = 'Food Category Create';

    this.foodCategoryForm = this.formBuilder.group({
      foodCategory: new FormControl('', Validators.required),
      status: ['Active']
    });
  }

  submit() {
    if (!this.foodCategoryForm.valid) {
      this.utilService.validateAllFormFields(this.foodCategoryForm);
      return;
    }

    this.foodCategory = new FoodCategory();
    this.foodCategory.foodCategory = this.foodCategoryForm.value.foodCategory;
    this.foodCategory.status = this.foodCategoryForm.value.status;

    this.foodCategories.push(this.foodCategory);

    console.info(this.foodCategories);

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

  onSelectRow(foodCategory: FoodCategory, index: number) {
    this.isUpdateMode = true;

    this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

    if (this.selectedRowIndex == -1) {
      this.resetForm();
      return;
    }


    this.foodCategoryForm.controls['foodCategory'].setValue(foodCategory.foodCategory);
    this.foodCategoryForm.controls['status'].setValue(foodCategory.status);

  }

  updateSelectedRow() {
    this.foodCategory.foodCategory = this.foodCategoryForm.value.foodCategory;
    this.foodCategory.status = this.foodCategoryForm.value.status;

    this.foodCategories.push(this.foodCategory);

    console.info(this.foodCategories);

    this.resetForm();

    this.notifyService.showSuccess("Updated successfully!", "UPDATED");
  }

  resetForm() {
    this.foodCategoryForm.reset();
    this.foodCategoryForm.controls['status'].setValue('Active');
    this.isUpdateMode = false;
  }

  //Image upload

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }


  //Gets called when the user clicks on submit to upload the image
  upload() {



  }

}
