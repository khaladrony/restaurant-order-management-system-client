import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Restaurant } from 'src/app/models/restaurant.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
    selector: 'app-restaurant-info',
    templateUrl: './restaurant-info.component.html',
    styleUrls: ['./restaurant-info.component.scss']
})
export class RestaurantInfoComponent implements OnInit {

    ROUTER_NAVIGATE: String;
    title: String;
    restaurantId:number;
    restaurantForm: UntypedFormGroup;
    restaurant: Restaurant;
    restaurants: Restaurant[] = [];
    selectedRowIndex: number;
    isUpdateMode = false;

    //Image upload
    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = '';
    preview = '';

    constructor(
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private confirmationModalService: ConfirmationModalService,
        private loader: NgxSpinnerService,
        private notifyService: NotificationService,
        private utilService: UtilService,
        private restaurantService:RestaurantService
    ) {
        this.selectedRowIndex = -1;
        this.restaurant = new Restaurant();
        this.ROUTER_NAVIGATE = 'admin/restaurant';
    }

    ngOnInit(): void {
        this.title = 'Create Restaurant';

        this.restaurantForm = this.formBuilder.group({
            restaurantId: new FormControl(''),
            restaurantName: new FormControl('', Validators.required),
            address: new FormControl(''),            
            phoneNo: new FormControl(''),
            webAddress: new FormControl(''),
            status: ['Active']
        });
        this.loadListData();
    }

    submit() {

        if (!this.restaurantForm.valid) {
            this.utilService.validateAllFormFields(this.restaurantForm);
            return;
        }

        this.restaurant = new Restaurant();
        this.restaurant.name = this.restaurantForm.value.restaurantName;
        this.restaurant.address = this.restaurantForm.value.address;
        this.restaurant.phoneNo = this.restaurantForm.value.phoneNo;
        this.restaurant.webAddress = this.restaurantForm.value.webAddress;
        this.restaurant.status = this.restaurantForm.value.status;

        if (this.restaurantForm.valid) {
            this.loader.show();

            this.restaurantService.create(this.restaurant, this.currentFile).subscribe({
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
        this.restaurant.id = this.restaurantForm.value.restaurantId;
        this.restaurant.name = this.restaurantForm.value.restaurantName;
        this.restaurant.address = this.restaurantForm.value.address;
        this.restaurant.phoneNo = this.restaurantForm.value.phoneNo;
        this.restaurant.webAddress = this.restaurantForm.value.webAddress;
        this.restaurant.status = this.restaurantForm.value.status;

        if (this.restaurantForm.valid) {
            this.loader.show();

            this.restaurantService.update(this.restaurant, this.currentFile).subscribe({
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
        console.log('delete button pressed');

        this.confirmationModalService.confirm(
            "Delete confirmation!",
            "Are you sure you want to delete?")
            .subscribe((answer) => {
                if (answer === 'yes') {
                    this.restaurantService.delete(this.restaurantId).subscribe({
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

    onSelectRow(restaurant: Restaurant, index: number) {

        this.isUpdateMode = true;

        this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

        if (this.selectedRowIndex == -1) {
            this.resetForm();
            return;
        }


        this.restaurantForm.controls['restaurantId'].setValue(restaurant.id);
        this.restaurantForm.controls['restaurantName'].setValue(restaurant.name);
        this.restaurantForm.controls['phoneNo'].setValue(restaurant.phoneNo);
        this.restaurantForm.controls['address'].setValue(restaurant.address);
        this.restaurantForm.controls['status'].setValue(restaurant.status);
        this.imagePopulate(restaurant);

    }

    loadListData() {
        let data = {};
        this.loader.show();
        this.restaurantService.getList(data).subscribe({
            next: (data) => {
                this.restaurants = data.data;

                for (const restaurant of this.restaurants) {
                    restaurant.imageBlob = 'data:image/jpeg;base64,' + restaurant.imageByte;
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
        this.restaurantForm.reset();
        this.restaurantForm.controls['status'].setValue('Active');
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

    imagePopulate(restaurant: Restaurant) {
        const imageBlob = this.dataURItoBlob(restaurant.imageByte, restaurant.imageType);
        const imageFile = new File([imageBlob], restaurant.imageName, { type: restaurant.imageType });

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
