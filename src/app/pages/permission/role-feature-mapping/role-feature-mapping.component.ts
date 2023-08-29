import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FeatureMapping } from 'src/app/models/feature-mapping.model';
import { Feature } from 'src/app/models/feature.model';
import { Role } from 'src/app/models/role.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { FeatureMappingService } from 'src/app/services/feature-mapping.service';
import { FeatureService } from 'src/app/services/feature.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { RoleService } from 'src/app/services/role.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
    selector: 'app-role-feature-mapping',
    templateUrl: './role-feature-mapping.component.html',
    styleUrls: ['./role-feature-mapping.component.scss']
})
export class RoleFeatureMappingComponent implements OnInit {

    title: string;
    featureMappingForm: UntypedFormGroup;
    selectedRowIndex: number;
    isUpdateMode = false;
    featureMaps: FeatureMapping[] = [];
    featureMap: FeatureMapping;
    selectedRole: Role = new Role();
    selectedFeature: Feature = new Feature();

    featureList: Feature[] = [];
    roleList: Role[] = [];
    featureMapId: number;

    constructor(
        private router: Router,
        private formBuilder: UntypedFormBuilder,
        private utilService: UtilService,
        private confirmationModalService: ConfirmationModalService,
        private notifyService: NotificationService,
        private loader: NgxSpinnerService,
        private featureService: FeatureService,
        private roleService: RoleService,
        private featureMappingService: FeatureMappingService
    ) {
        this.featureMap = new FeatureMapping();
        this.selectedRowIndex = -1;
    }

    ngOnInit(): void {
        this.title = 'Create Feature Mapping';

        this.featureMappingForm = this.formBuilder.group({
            featureMapId: new FormControl(""),
            role: new FormControl(null, Validators.required),
            feature: new FormControl(null, Validators.required),
            status: ['Active'],            
        });

        this.loadListData();
        this.loadRoleList();
        this.loadFeatureList();
    }

    submit() {
        if (!this.featureMappingForm.valid) {
            this.utilService.validateAllFormFields(this.featureMappingForm);
            return;
        }

        this.featureMap = new FeatureMapping();
        this.featureMap.roleId = this.featureMappingForm.value.role;
        this.featureMap.featureId = this.featureMappingForm.value.feature;
        this.featureMap.status = this.featureMappingForm.value.status;

        if (this.featureMappingForm.valid) {
            this.loader.show();

            this.featureMappingService.create(this.featureMap).subscribe({
                next: (response) => {
                    console.log(response);
                    this.notifyService.showSuccess("success", response.message);

                    this.router.navigate(["admin/feature-map"]);
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
        this.featureMap.id = this.featureMappingForm.value.featureMapId;
        this.featureMap.roleId = this.featureMappingForm.value.role;
        this.featureMap.featureId = this.featureMappingForm.value.feature;
        this.featureMap.status = this.featureMappingForm.value.status;

        if (this.featureMappingForm.valid) {
            this.loader.show();

            this.featureMappingService.update(this.featureMap).subscribe({
                next: (response) => {
                    console.log(response);
                    this.notifyService.showSuccess("success", response.message);

                    this.router.navigate(["admin/feature-map"]);
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
        this.featureMapId = this.featureMappingForm.value.featureMapId;

        this.confirmationModalService.confirm(
            "Delete confirmation!",
            "Are you sure you want to delete?")
            .subscribe((answer) => {
                if (answer === 'yes') {
                    this.featureMappingService.delete(this.featureMapId).subscribe({
                        next: () => {
                            this.notifyService.showSuccess(
                                "success",
                                "Deleted Successfully."
                            );

                            this.router.navigate(["admin/feature-map"]);
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

    onSelectRow(featureMap: FeatureMapping, index: number) {
        this.isUpdateMode = true;
        this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

        if (this.selectedRowIndex == -1) {
            this.resetForm();
            return;
        }


        this.featureMappingForm.controls['featureMapId'].setValue(featureMap.id);
        this.featureMappingForm.controls['role'].setValue(featureMap.roleId);
        this.featureMappingForm.controls['feature'].setValue(featureMap.featureId);
        this.featureMappingForm.controls['status'].setValue(featureMap.status);

    }

    loadListData() {
        let data = {};
        this.loader.show();
        this.featureMappingService.getList(data).subscribe({
            next: (data) => {
                this.featureMaps = data.data;
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
        this.featureMappingForm.reset();
        this.featureMappingForm.controls['status'].setValue('Active');
        this.isUpdateMode = false;
        this.featureMap = new FeatureMapping();
        this.selectedRowIndex = -1;
        this.loadListData();
    }

    loadFeatureList() {
        let data = {};
        this.loader.show();
        this.featureService.getList(data).subscribe({
            next: (data) => {
                this.featureList = data.data;
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

    onFeatureChange(featureId: number) {
        this.selectedFeature = this.featureList.find((feature) => feature.id === featureId) || new Feature();
    }

    onFeatureScrollToEnd() {
        this.loadFeatureList();
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

    onRoleScrollToEnd() {
        this.loadRoleList();
    }

}
