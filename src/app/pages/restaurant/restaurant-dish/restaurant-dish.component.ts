import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dish } from 'src/app/models/dish.model';
import { FoodCategory } from 'src/app/models/food-category.model';
import { RestaurantDishResponse } from 'src/app/models/restaurant-dish-response.model';
import { RestaurantDish } from 'src/app/models/restaurant-dish.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { DishService } from 'src/app/services/dish.service';
import { FoodCategoryService } from 'src/app/services/food-category.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { RestaurantDishService } from 'src/app/services/restaurant-dish.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
    selector: 'app-restaurant-dish',
    templateUrl: './restaurant-dish.component.html',
    styleUrls: ['./restaurant-dish.component.scss']
})
export class RestaurantDishComponent implements OnInit {

    ROUTER_NAVIGATE: String;
    title: string;
    restaurantDishId: number;
    restaurantDishForm: UntypedFormGroup;
    selectedRowIndex: number;
    isUpdateMode = false;
    restaurantDishList: RestaurantDish[] = [];
    restaurantDish: RestaurantDish;
    selectedRestaurant: Restaurant = new Restaurant();
    selectedDish: Dish = new Dish();

    restaurantList: Restaurant[] = [];
    dishList: Dish[] = [];
    restaurantPreview = ''
    dishPreview = ''

    constructor(
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private utilService: UtilService,
        private confirmationModalService: ConfirmationModalService,
        private notifyService: NotificationService,
        private loader: NgxSpinnerService,
        private restaurantService: RestaurantService,
        private dishService: DishService,
        private restaurantDishService: RestaurantDishService
    ) {
        this.restaurantDish = new RestaurantDish();
        this.selectedRowIndex = -1;
        this.ROUTER_NAVIGATE = 'admin/restaurant-dish';
    }

    ngOnInit(): void {
        this.title = 'Restaurant Dish Mapping';

        this.restaurantDishForm = this.formBuilder.group({
            restaurantDishId: new FormControl(""),
            restaurant: new FormControl(null, Validators.required),
            dish: new FormControl(null, Validators.required),
            status: ['Active'],
        });

        this.loadListData();
        this.loadRestaurantList();
        this.loadDishList();
    }

    submit() {
        if (!this.restaurantDishForm.valid) {
            this.utilService.validateAllFormFields(this.restaurantDishForm);
            return;
        }

        this.restaurantDish = new RestaurantDish();
        this.restaurantDish.restaurant = this.selectedRestaurant;
        this.restaurantDish.foodDish = this.selectedDish;
        this.restaurantDish.status = this.restaurantDishForm.value.status;

        if (this.restaurantDishForm.valid) {
            this.loader.show();

            this.restaurantDishService.create(this.restaurantDish).subscribe({
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

    update() {
        this.restaurantDish.id = this.restaurantDishForm.value.restaurantDishId;
        this.restaurantDish.restaurant = this.selectedRestaurant;
        this.restaurantDish.foodDish = this.selectedDish;
        this.restaurantDish.status = this.restaurantDishForm.value.status;

        if (this.restaurantDishForm.valid) {
            this.loader.show();

            this.restaurantDishService.update(this.restaurantDish).subscribe({
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
        this.restaurantDishId = this.restaurantDishForm.value.restaurantDishId;

        this.confirmationModalService.confirm(
            "Delete confirmation!",
            "Are you sure you want to delete?")
            .subscribe((answer) => {
                if (answer === 'yes') {
                    this.restaurantDishService.delete(this.restaurantDishId).subscribe({
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

    onSelectRow(restaurantDish: RestaurantDish, index: number) {
        this.isUpdateMode = true;
        this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

        if (this.selectedRowIndex == -1) {
            this.resetForm();
            return;
        }


        this.restaurantDishForm.controls['restaurantDishId'].setValue(restaurantDish.id);
        this.restaurantDishForm.controls['restaurant'].setValue(restaurantDish.restaurant.id);
        this.restaurantDishForm.controls['dish'].setValue(restaurantDish.foodDish.id);
        this.restaurantDishForm.controls['status'].setValue(restaurantDish.status);

        this.onRestaurantChange(restaurantDish.restaurant.id);
        this.onDishChange(restaurantDish.foodDish.id);

        this.restaurantImagePopulate(restaurantDish.restaurant.imageByte, restaurantDish.restaurant.imageType,
            restaurantDish.restaurant.imageName);

        this.dishImagePopulate(restaurantDish.foodDish.imageByte, restaurantDish.foodDish.imageType,
            restaurantDish.foodDish.imageName);
    }

    loadListData() {
        let data = {};
        this.loader.show();
        this.restaurantDishService.getList(data).subscribe({
            next: (data) => {
                this.restaurantDishList = data.data;
                for (const restaurantDish of this.restaurantDishList) {
                    restaurantDish.restaurant.imageBlob = 'data:image/jpeg;base64,' + restaurantDish.restaurant.imageByte;
                    restaurantDish.foodDish.imageBlob = 'data:image/jpeg;base64,' + restaurantDish.foodDish.imageByte;
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

    resetForm() {
        this.restaurantDishForm.reset();
        this.restaurantDishForm.controls['status'].setValue('Active');
        this.isUpdateMode = false;
        this.restaurantDish = new RestaurantDish();
        this.selectedRowIndex = -1;
        this.loadListData();
        this.restaurantPreview = ''
        this.dishPreview = ''
    }

    loadRestaurantList() {
        let data = {};
        this.loader.show();
        this.restaurantService.getList(data).subscribe({
            next: (data) => {
                this.restaurantList = data.data;
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

    onRestaurantChange(restaurantId: number) {
        this.selectedRestaurant = this.restaurantList.find((restaurant) => restaurant.id === restaurantId) || new Restaurant();
    }

    onRestaurantScrollToEnd() {
        this.loadRestaurantList();
    }

    loadDishList() {
        let data = {};
        this.dishService.getList(data).subscribe({
            next: (data) => {
                this.dishList = data.data;
            },
            complete: () => { },
            error: (err) => {
                console.log(err);
            },
        });
    }

    onDishChange(dishId: number) {
        this.selectedDish = this.dishList.find((dish) => dish.id === dishId) || new Dish();
    }

    onDishScrollToEnd() {
        this.loadDishList();
    }

    restaurantImagePopulate(imageByte: string, imageType: string, imageName: string) {
        const imageBlob = this.dataURItoBlob(imageByte, imageType);
        const imageFile = new File([imageBlob], imageName, { type: imageType });

        if (imageFile) {
            // this.preview = '';
            const currentFile = imageFile;

            const reader = new FileReader();

            reader.onload = (e: any) => {
                console.log(e.target.result);
                this.restaurantPreview = e.target.result;
            };

            reader.readAsDataURL(currentFile);
        }
    }


    dishImagePopulate(imageByte: string, imageType: string, imageName: string) {
        const imageBlob = this.dataURItoBlob(imageByte, imageType);
        const imageFile = new File([imageBlob], imageName, { type: imageType });

        if (imageFile) {
            // this.preview = '';
            const currentFile = imageFile;

            const reader = new FileReader();

            reader.onload = (e: any) => {
                console.log(e.target.result);
                this.dishPreview = e.target.result;
            };

            reader.readAsDataURL(currentFile);
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
