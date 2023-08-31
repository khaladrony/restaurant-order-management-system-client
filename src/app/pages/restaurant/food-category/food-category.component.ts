import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { FileDetails } from 'src/app/models/file-details.model';
import { FoodCategory } from 'src/app/models/food-category.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FoodCategoryService } from 'src/app/services/food-category.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
    selector: 'app-food-category',
    templateUrl: './food-category.component.html',
    styleUrls: ['./food-category.component.scss']
})
export class FoodCategoryComponent implements OnInit {

    ROUTER_NAVIGATE: String;
    title: string;
    foodCategoryId: number;
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
    imageShow:any;

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
        private foodCategoryService: FoodCategoryService,
        private sanitizer: DomSanitizer
    ) {
        this.selectedRowIndex = -1;
        this.foodCategory = new FoodCategory();
        this.ROUTER_NAVIGATE = 'admin/food-category';
    }

    ngOnInit(): void {
        this.title = 'Food Category Create';

        this.foodCategoryForm = this.formBuilder.group({
            foodCategoryId: new FormControl(""),
            foodCategory: new FormControl('', Validators.required),
            status: ['Active']
        });

        this.loadListData();
    }

    submit() {
        if (!this.foodCategoryForm.valid) {
            this.utilService.validateAllFormFields(this.foodCategoryForm);
            return;
        }

        this.foodCategory = new FoodCategory();
        this.foodCategory.category = this.foodCategoryForm.value.foodCategory;
        this.foodCategory.status = this.foodCategoryForm.value.status;

        if (this.foodCategoryForm.valid) {
            this.loader.show();

            this.foodCategoryService.create(this.foodCategory, this.currentFile).subscribe({
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
        this.foodCategory.id = this.foodCategoryForm.value.foodCategoryId;
        this.foodCategory.category = this.foodCategoryForm.value.foodCategory;
        this.foodCategory.status = this.foodCategoryForm.value.status;

        if (this.foodCategoryForm.valid) {
            this.loader.show();

            this.foodCategoryService.update(this.foodCategory, this.currentFile).subscribe({
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
        this.foodCategoryId = this.foodCategoryForm.value.foodCategoryId;

        this.confirmationModalService.confirm(
            "Delete confirmation!",
            "Are you sure you want to delete?")
            .subscribe((answer) => {
                if (answer === 'yes') {
                    this.foodCategoryService.delete(this.foodCategoryId).subscribe({
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

    onSelectRow(foodCategory: FoodCategory, index: number) {
        this.isUpdateMode = true;

        this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

        if (this.selectedRowIndex == -1) {
            this.resetForm();
            return;
        }

        this.foodCategoryForm.controls['foodCategoryId'].setValue(foodCategory.id);
        this.foodCategoryForm.controls['foodCategory'].setValue(foodCategory.category);
        this.foodCategoryForm.controls['status'].setValue(foodCategory.status);        
        this.imagePopulate(foodCategory);
        

    }

    imagePopulate(foodCategory: FoodCategory){
        const imageBlob = this.dataURItoBlob(foodCategory.imageByte, foodCategory.imageType );
        const imageFile = new File([imageBlob], foodCategory.imageName, { type: foodCategory.imageType });

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
        const blob = new Blob([int8Array], { type: imageType});    
        return blob;
     }

    loadListData() {
        let data = {};
        this.loader.show();
        this.foodCategoryService.getList(data).subscribe({
            next: (data) => {
                this.foodCategories = data.data;

                for (const food of this.foodCategories) {
                    food.imageBlob = 'data:image/jpeg;base64,' + food.imageByte;
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
        this.foodCategoryForm.reset();
        this.foodCategoryForm.controls['status'].setValue('Active');
        this.isUpdateMode = false;
        this.foodCategory = new FoodCategory();
        this.selectedRowIndex = -1;
        this.loadListData();
        this.preview = '';
        this.message = '';
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

}
