import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FeatureMapping } from 'src/app/models/feature-mapping.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
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

  roleList: any = ['ROLE_CUSTOMER', 'ROLE_ADMIN', 'ROLE_SUPPORT']
  featureList: any = ['User Profile', 'Restaurant', 'Dish', 'Report']

  constructor(private formBuilder: UntypedFormBuilder,
    private utilService: UtilService,
    private confirmationModalService: ConfirmationModalService,
    private notifyService: NotificationService
  ) {
    this.selectedRowIndex = -1;
  }

  ngOnInit(): void {
    this.title = 'Feature Mapping Create';

    this.featureMappingForm = this.formBuilder.group({
      role: new FormControl(null, Validators.required),
      feature: new FormControl(null, Validators.required),
      status: ['Active']
    });
  }

  submit() { 
    if (!this.featureMappingForm.valid) {
      this.utilService.validateAllFormFields(this.featureMappingForm);
      return;
    }

    this.featureMap=new FeatureMapping();
    this.featureMap.role = this.featureMappingForm.value.role;
    this.featureMap.feature = this.featureMappingForm.value.feature;
    this.featureMap.status = this.featureMappingForm.value.status;

    this.featureMaps.push(this.featureMap);

    console.info(this.featureMaps);

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

  onSelectRow(featureMap: FeatureMapping, index: number) {
    this.isUpdateMode = true;

    this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

    if (this.selectedRowIndex == -1) {
      this.resetForm();
      return;
    }


    this.featureMappingForm.controls['role'].setValue(featureMap.role);
    this.featureMappingForm.controls['feature'].setValue(featureMap.feature);
    this.featureMappingForm.controls['status'].setValue(featureMap.status);

  }

  updateSelectedRow() {
    this.featureMap=new FeatureMapping();
    this.featureMap.role = this.featureMappingForm.value.role;
    this.featureMap.feature = this.featureMappingForm.value.feature;
    this.featureMap.status = this.featureMappingForm.value.status;

    this.featureMaps.push(this.featureMap);

    console.info(this.featureMaps);

    this.resetForm();

    this.notifyService.showSuccess("Updated successfully!", "UPDATED");
  }

  resetForm() {
    this.featureMappingForm.reset();
    this.featureMappingForm.controls['status'].setValue('Active');
    this.isUpdateMode = false;
  }

}
