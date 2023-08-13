import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { NotifierService } from 'angular-notifier';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

    users: User[] = [];
    user: User;
    selectedRowIndex: number;
    isUpdateMode = false;
    userProfileForm: UntypedFormGroup;

    constructor(private formBuilder: UntypedFormBuilder,
        private confirmationModalService: ConfirmationModalService,
        private loader: NgxSpinnerService,
        private notifyService: NotificationService
    ) {
        this.selectedRowIndex = -1;
    }

    ngOnInit(): void {

        this.userProfileForm = this.formBuilder.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            email: new FormControl(''),
            address: new FormControl(''),
            phoneNo: new FormControl(''),
            status: ['Active']
        });
    }

    submit() {
        if (!this.userProfileForm.valid) {
            this.validateAllFormFields(this.userProfileForm);
            return;
        }

        this.user = new User();
        this.user.username = this.userProfileForm.value.username;
        this.user.password = this.userProfileForm.value.password;
        this.user.email = this.userProfileForm.value.email;
        this.user.address = this.userProfileForm.value.address;
        this.user.phoneNo = this.userProfileForm.value.phoneNo;
        this.user.status = this.userProfileForm.value.status;

        console.log(this.user);

        this.users.push(this.user);

        console.info(this.users);

        this.resetForm();

        this.notifyService.showSuccess("User created successfully!", "SUCCESS");

    }

    deleteUser() {
        console.log('delete button pressed');

        this.confirmationModalService.confirm(
            "Delete confirmation!",
            "Are you sure you want to delete?")
            .subscribe((answer) => {
                if (answer === 'yes') {
                    this.notifyService.showError("Data deleted successfully!", "DELETED");
                    // this.loader.hide();
                } else {
                    // this.loader.hide();
                    return;
                }
            });

    }

    onSelectRow(user: User, index: number) {
        this.isUpdateMode = true;

        this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

        if (this.selectedRowIndex == -1) {
            this.resetForm();
            return;
        }


        this.userProfileForm.controls['username'].setValue(user.username);
        this.userProfileForm.controls['password'].setValue(user.password);
        this.userProfileForm.controls['email'].setValue(user.email);
        this.userProfileForm.controls['phoneNo'].setValue(user.phoneNo);
        this.userProfileForm.controls['address'].setValue(user.address);
        this.userProfileForm.controls['status'].setValue(user.status);

    }

    updateSelectedRow() {
        this.user.username = this.userProfileForm.value.username;
        this.user.password = this.userProfileForm.value.password;
        this.user.email = this.userProfileForm.value.email;
        this.user.address = this.userProfileForm.value.address;
        this.user.phoneNo = this.userProfileForm.value.phoneNo;
        this.user.status = this.userProfileForm.value.status;

        console.log(this.user);

        this.users.push(this.user);

        console.info(this.users);

        this.resetForm();

        this.notifyService.showSuccess("User updated successfully!", "UPDATED");
    }

    resetForm() {
        this.userProfileForm.reset();
        this.userProfileForm.controls['status'].setValue('Active');
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
