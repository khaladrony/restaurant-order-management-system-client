import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Feature } from 'src/app/models/feature.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {

  title: string;
  featureForm: UntypedFormGroup;
  selectedRowIndex: number;
  isUpdateMode = false;
  features: Feature[] = [];
  feature: Feature;
  featureList: any = ['User Profile', 'Restaurant', 'Dish','Report']

  constructor(private formBuilder: UntypedFormBuilder,
    private utilService: UtilService,
    private confirmationModalService: ConfirmationModalService,
    private notifyService: NotificationService
  ) {
    this.selectedRowIndex = -1;
  }

  ngOnInit(): void {

    this.title = 'Create Feature';

    this.featureForm = this.formBuilder.group({
      featureName: new FormControl('', Validators.required),
      path: new FormControl('', Validators.required),
      parentFeature: [''],
      featureIcon: new FormControl(''),
      status: ['Active']
    });
  }

  submit() { 
    if (!this.featureForm.valid) {
      this.utilService.validateAllFormFields(this.featureForm);
      return;
    }

    this.feature=new Feature();
    this.feature.featureName = this.featureForm.value.featureName;
    this.feature.path = this.featureForm.value.path;
    this.feature.parentFeature = this.featureForm.value.parentFeature;
    this.feature.featureIcon = this.featureForm.value.featureIcon;
    this.feature.status = this.featureForm.value.status;

    this.features.push(this.feature);

    console.info(this.features);

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

  onSelectRow(feature: Feature, index: number) {
    this.isUpdateMode = true;

    this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

    if (this.selectedRowIndex == -1) {
      this.resetForm();
      return;
    }


    this.featureForm.controls['featureName'].setValue(feature.featureName);
    this.featureForm.controls['path'].setValue(feature.path);
    this.featureForm.controls['parentFeature'].setValue(feature.parentFeature);
    this.featureForm.controls['featureIcon'].setValue(feature.featureIcon);
    this.featureForm.controls['status'].setValue(feature.status);

  }

  updateSelectedRow() {
    this.feature.featureName = this.featureForm.value.featureName;
    this.feature.path = this.featureForm.value.path;
    this.feature.parentFeature = this.featureForm.value.parentFeature;
    this.feature.featureIcon = this.featureForm.value.featureIcon;
    this.feature.status = this.featureForm.value.status;

    this.features.push(this.feature);

    console.info(this.features);

    this.resetForm();

    this.notifyService.showSuccess("Updated successfully!", "UPDATED");
  }

  resetForm() {
    this.featureForm.reset();
    this.featureForm.controls['status'].setValue('Active');
    this.isUpdateMode = false;
  }


}
