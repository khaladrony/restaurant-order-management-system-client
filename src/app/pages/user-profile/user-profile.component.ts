import { Component, OnInit } from "@angular/core";
import {
    FormControl,
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from "@angular/forms";
import { User } from "src/app/models/user.model";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationModalService } from "src/app/services/confirmation-modal/confirmation-modal.service";
import { NotifierService } from "angular-notifier";
import { NotificationService } from "src/app/services/notification/notification.service";
import { UtilService } from "src/app/services/util.service";
import { UserService } from "src/app/services/user.service";
import { Role } from "src/app/models/role.model";
import { RoleService } from "src/app/services/role.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
    users: User[] = [];
    user: User;
    selectedRowIndex: number;
    isUpdateMode = false;
    userProfileForm: UntypedFormGroup;
    roleList: Role[] = [];
    selectedRole: Role = new Role();
    userId: number;

    constructor(
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private confirmationModalService: ConfirmationModalService,
        private loader: NgxSpinnerService,
        private notifyService: NotificationService,
        private utilService: UtilService,
        private userService: UserService,
        private roleService: RoleService,
    ) {
        this.user = new User();
        this.selectedRowIndex = -1;
    }

    ngOnInit(): void {
        this.userProfileForm = this.formBuilder.group({
            username: new FormControl("", Validators.required),
            password: new FormControl("", Validators.required),
            email: new FormControl(""),
            address: new FormControl(""),
            phoneNo: new FormControl(""),
            status: ["Active"],
            role: new FormControl(null, Validators.required),
            userId: new FormControl("")
        });

        this.loadRoleList();
        this.loadListData();
    }

    submit() {
        if (!this.userProfileForm.valid) {
            this.utilService.validateAllFormFields(this.userProfileForm);
            return;
        }

        this.user = new User();
        this.user.username = this.userProfileForm.value.username;
        this.user.password = this.userProfileForm.value.password;
        this.user.email = this.userProfileForm.value.email;
        this.user.address = this.userProfileForm.value.address;
        this.user.phoneNo = this.userProfileForm.value.phoneNo;
        this.user.status = this.userProfileForm.value.status;
        this.user.role = this.selectedRole;

        if (this.userProfileForm.valid) {
            this.loader.show();

            this.userService.create(this.user).subscribe({
                next: (response) => {
                    console.log(response);
                    this.notifyService.showSuccess("success", response.message);

                    this.router.navigate(["admin/user-profile"]);
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
        this.user.id = this.userProfileForm.value.userId;
        this.user.username = this.userProfileForm.value.username;
        this.user.password = this.userProfileForm.value.password;
        this.user.email = this.userProfileForm.value.email;
        this.user.address = this.userProfileForm.value.address;
        this.user.phoneNo = this.userProfileForm.value.phoneNo;
        this.user.status = this.userProfileForm.value.status;
        this.user.role = this.selectedRole;

        if (this.userProfileForm.valid) {
            this.loader.show();

            this.userService.update(this.user).subscribe({
                next: (response) => {
                    console.log(response);
                    this.notifyService.showSuccess("success", response.message);

                    this.router.navigate(["admin/user-profile"]);
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

    deleteUser() {
        this.userId = this.userProfileForm.value.userId;

        this.confirmationModalService
            .confirm("Delete confirmation!", "Are you sure you want to delete?")
            .subscribe((answer) => {
                if (answer === "yes") {
                    this.userService.delete(this.userId).subscribe({
                        next: () => {
                            this.notifyService.showSuccess(
                                "success",
                                "Deleted Successfully."
                            );

                            this.router.navigate(["admin/role"]);
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

    onSelectRow(user: User, index: number) {
        this.isUpdateMode = true;
        this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

        if (this.selectedRowIndex == -1) {
            this.resetForm();
            return;
        }

        this.userProfileForm.controls["userId"].setValue(user.id);
        this.userProfileForm.controls["username"].setValue(user.username);
        this.userProfileForm.controls["password"].setValue(user.password);
        this.userProfileForm.controls["email"].setValue(user.email);
        this.userProfileForm.controls["phoneNo"].setValue(user.phoneNo);
        this.userProfileForm.controls["address"].setValue(user.address);
        this.userProfileForm.controls["status"].setValue(user.status);
        this.userProfileForm.controls["role"].setValue(user.role.id);
        this.selectedRole = user.role;
    }

    loadListData() {
        let data = {};
        this.loader.show();
        this.userService.getList(data).subscribe({
            next: (data) => {
                this.users = data.data;
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
        this.userProfileForm.reset();
        this.userProfileForm.controls["status"].setValue("Active");
        this.isUpdateMode = false;
        this.selectedRowIndex = -1;
        this.loadListData();
    }

    loadRoleList() {
        let data = {};
        this.roleService.getList(data).subscribe({
            next: (data) => {
                this.roleList = data.data;
            },
            complete: () => { },
            error: (err) => {
                console.log(err);
            },
        });
    }

    onRoleChange(roleId: number) {
        this.selectedRole = this.roleList.find((role) => role.id === roleId) || new Role();
    }

    onScrollToEnd() {
        this.loadRoleList();
    }
}
