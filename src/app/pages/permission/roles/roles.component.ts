import { Component, OnInit } from "@angular/core";
import {
    FormControl,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Role } from "src/app/models/role.model";
import { ConfirmationModalService } from "src/app/services/confirmation-modal/confirmation-modal.service";
import { NotificationService } from "src/app/services/notification/notification.service";
import { RoleService } from "src/app/services/role.service";
import { UtilService } from "src/app/services/util.service";

@Component({
    selector: "app-roles",
    templateUrl: "./roles.component.html",
    styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
    title: string;
    roleId: number;
    rolesForm: UntypedFormGroup;
    roles: Role[] = [];
    role: Role;
    selectedRowIndex: number;
    isUpdateMode = false;

    constructor(
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private utilService: UtilService,
        private confirmationModalService: ConfirmationModalService,
        private notifyService: NotificationService,
        private loader: NgxSpinnerService,
        private roleService: RoleService
    ) {
        this.selectedRowIndex = -1;
        this.role = new Role();
    }

    ngOnInit(): void {
        this.title = "Create Role";

        this.rolesForm = this.formBuilder.group({
            rolesName: new FormControl("", Validators.required),
            status: ["Active"],
            roleId: new FormControl(""),
        });

        this.loadListData();
    }

    submit() {
        if (!this.rolesForm.valid) {
            this.utilService.validateAllFormFields(this.rolesForm);
            return;
        }

        this.role = new Role();
        this.role.name = this.rolesForm.value.rolesName;
        this.role.status = this.rolesForm.value.status;

        if (this.rolesForm.valid) {
            this.loader.show();

            this.roleService.create(this.role).subscribe({
                next: (response) => {
                    console.log(response);
                    this.notifyService.showSuccess("success", response.message);

                    this.router.navigate(["admin/role"]);
                },
                complete: () => {
                    this.loadListData();
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
        this.role.name = this.rolesForm.value.rolesName;
        this.role.status = this.rolesForm.value.status;
        this.role.id = this.rolesForm.value.roleId;

        if (this.rolesForm.valid) {
            this.loader.show();

            this.roleService.update(this.role).subscribe({
                next: (response) => {
                    this.notifyService.showSuccess("success", response.message);

                    this.router.navigate(["admin/role"]);
                },
                complete: () => {
                    this.loadListData();
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
        this.roleId = this.rolesForm.value.roleId;
        this.confirmationModalService
            .confirm("Delete confirmation!", "Are you sure you want to delete?")
            .subscribe((answer) => {
                if (answer === "yes") {
                    this.roleService.delete(this.roleId).subscribe({
                        next: () => {
                            this.notifyService.showSuccess(
                                "success",
                                "Deleted Successfully."
                            );

                            this.router.navigate(["admin/role"]);
                        },
                        complete: () => {
                            this.loadListData();
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

    loadListData() {
        let data = {};
        this.loader.show();
        this.roleService.getList(data).subscribe({
            next: (data) => {
                this.roles = data.data;
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

    onSelectRow(role: Role, index: number) {
        this.isUpdateMode = true;

        this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

        if (this.selectedRowIndex == -1) {
            this.resetForm();
            return;
        }

        this.rolesForm.controls["rolesName"].setValue(role.name);
        this.rolesForm.controls["status"].setValue(role.status);
        this.rolesForm.controls["roleId"].setValue(role.id);
    }

    resetForm() {
        this.rolesForm.reset();
        this.rolesForm.controls["status"].setValue("Active");
        this.isUpdateMode = false;
        this.role = new Role();
        this.selectedRowIndex = -1;
    }
}
