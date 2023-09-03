import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Dish } from 'src/app/models/dish.model';
import { FileDetails } from 'src/app/models/file-details.model';
import { FoodCategory } from 'src/app/models/food-category.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { DishService } from 'src/app/services/dish.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FoodCategoryService } from 'src/app/services/food-category.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
    selector: 'app-dish',
    templateUrl: './dish.component.html',
    styleUrls: ['./dish.component.scss']
})
export class DishComponent implements OnInit {

    ROUTER_NAVIGATE: String;

    title: string;
    dishId: number;
    dishForm: UntypedFormGroup;
    dishes: Dish[] = [];
    dish: Dish;
    selectedRowIndex: number;
    isUpdateMode = false;
    selectedFoodCategory: FoodCategory = new FoodCategory();
    foodCategoryList: FoodCategory[] = [];

    //Image upload
    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = '';
    preview = '';
    imageShow: any;

    imageInfos?: Observable<any>;
    fileDetails!: FileDetails;
    fileUris: Array<string> = [];

    constructor(
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private confirmationModalService: ConfirmationModalService,
        private loader: NgxSpinnerService,
        private notifyService: NotificationService,
        private utilService: UtilService,
        private fileUploadService: FileUploadService,
        private dishService: DishService,
        private foodCategoryService: FoodCategoryService
    ) {
        this.selectedRowIndex = -1;
        this.dish = new Dish();
        this.ROUTER_NAVIGATE = 'admin/dish';

    }

    ngOnInit(): void {
        this.title = 'Dish Create';

        this.dishForm = this.formBuilder.group({
            dishId: new FormControl(""),
            dishName: new FormControl('', Validators.required),
            foodCategory: new FormControl(null, Validators.required),
            status: ['Active']
        });

        this.getFoodCategoryList();
        this.loadListData();
    }

    submit() {
        if (!this.dishForm.valid) {
            this.utilService.validateAllFormFields(this.dishForm);
            return;
        }

        this.dish = new Dish();
        this.dish.name = this.dishForm.value.dishName;
        this.dish.foodCategory = this.selectedFoodCategory;
        this.dish.status = this.dishForm.value.status;

        if (this.dishForm.valid) {
            this.loader.show();

            this.dishService.create(this.dish, this.currentFile).subscribe({
                next: (response) => {
                    console.log(response);
                    this.notifyService.showSuccess("success", response.message);

                    this.router.navigate([this.ROUTER_NAVIGATE]);
                },
                complete: () => {
                    this.loader.hide();
                    this.resetForm();
                },
                error: (err) => {
                    console.log(err);
                    this.notifyService.showError("error", err.error?.message);
                    this.loader.hide();
                },
            });
        }
    }

    updateSelectedRow() {
        this.dish.id = this.dishForm.value.dishId;
        this.dish.name = this.dishForm.value.dishName;
        this.dish.foodCategory = this.selectedFoodCategory;
        this.dish.status = this.dishForm.value.status;

        if (this.dishForm.valid) {
            this.loader.show();

            this.dishService.update(this.dish, this.currentFile).subscribe({
                next: (response) => {
                    console.log(response);
                    this.notifyService.showSuccess("success", response.message);

                    this.router.navigate([this.ROUTER_NAVIGATE]);
                },
                complete: () => {
                    this.loader.hide();
                    this.resetForm();
                },
                error: (err) => {
                    console.log(err);
                    this.notifyService.showError("error", err.error?.message);
                    this.loader.hide();
                },
            });
        }
    }

    delete() {
        this.dishId = this.dishForm.value.dishId;

        this.confirmationModalService.confirm(
            "Delete confirmation!",
            "Are you sure you want to delete?")
            .subscribe((answer) => {
                if (answer === 'yes') {
                    this.dishService.delete(this.dishId).subscribe({
                        next: () => {
                            this.notifyService.showSuccess(
                                "success",
                                "Deleted Successfully."
                            );

                            this.router.navigate([this.ROUTER_NAVIGATE]);
                        },
                        complete: () => {
                            this.loader.hide();
                            this.resetForm();
                        },
                        error: (err) => {
                            this.notifyService.showError("error", err.message);
                            console.log(err);
                        },
                    });
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


        this.dishForm.controls['dishId'].setValue(dish.id);
        this.dishForm.controls['dishName'].setValue(dish.name);
        this.dishForm.controls["foodCategory"].setValue(dish.foodCategory.id);
        this.dishForm.controls['status'].setValue(dish.status);  
        this.selectedFoodCategory = dish.foodCategory;
        this.imagePopulate(dish);

    }

    loadListData() {
        let data = {};
        this.loader.show();
        this.dishService.getList(data).subscribe({
            next: (data) => {
                this.dishes = data.data;

                for (const dish of this.dishes) {
                    dish.imageBlob = 'data:image/jpeg;base64,' + dish.imageByte;
                }
            },
            complete: () => {
                this.loader.hide();
            },
            error: (err) => {
                console.log(err);
                this.loader.hide();
            },
        });
    }

    getFoodCategoryList() {
        let data = {};
        this.loader.show();
        this.foodCategoryService.getList(data).subscribe({
            next: (data) => {
                this.foodCategoryList = data.data;
            },
            complete: () => {
                this.loader.hide();
            },
            error: (err) => {
                console.log(err);
                this.loader.hide();
            },
        });
    }

    onFoodCategoryChange(foodCategoryId: number) {
        this.selectedFoodCategory = this.foodCategoryList.find((foodCategory) => foodCategory.id === foodCategoryId) || new FoodCategory();
    }

    onScrollToEnd() {
        this.getFoodCategoryList();
    }

    resetForm() {
        this.dishForm.reset();
        this.dishForm.controls['status'].setValue('Active');
        this.isUpdateMode = false;
        this.loadListData();
        this.preview = '';
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

    imagePopulate(dish: Dish) {
        const imageBlob = this.dataURItoBlob(dish.imageByte, dish.imageType);
        const imageFile = new File([imageBlob], dish.imageName, { type: dish.imageType });

        if (imageFile) {
            this.preview = '';
            this.currentFile = imageFile;

            const reader = new FileReader();

            reader.onload = (e: any) => {
                console.log(e.target.result);
                this.preview = e.target.result;
            };

            reader.readAsDataURL(this.currentFile);
        }
    }

    dataURItoBlob(dataURI, imageType) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: imageType });
        return blob;
    }

}
