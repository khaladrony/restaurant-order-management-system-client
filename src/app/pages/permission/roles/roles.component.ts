import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Role } from 'src/app/models/role.model';
import { ConfirmationModalService } from 'src/app/services/confirmation-modal/confirmation-modal.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  title: string;
  rolesForm: UntypedFormGroup;
  roles: Role[] = [];
  role: Role;
  selectedRowIndex: number;
  isUpdateMode = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private utilService: UtilService,
    private confirmationModalService: ConfirmationModalService,
    private notifyService: NotificationService
  ) {
    this.selectedRowIndex = -1;
  }

  ngOnInit(): void {
    this.title = 'Roles Create';

    this.rolesForm = this.formBuilder.group({
      rolesName: new FormControl('', Validators.required),
      status: ['Active']
    });
  }

  submit() {
    if (!this.rolesForm.valid) {
      this.utilService.validateAllFormFields(this.rolesForm);
      return;
    }

    this.role=new Role();
    this.role.rolesName = this.rolesForm.value.rolesName;
    this.role.status = this.rolesForm.value.status;

    this.roles.push(this.role);

    console.info(this.roles);

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

  onSelectRow(role: Role, index: number) {
    this.isUpdateMode = true;

    this.selectedRowIndex = index == this.selectedRowIndex ? -1 : index;

    if (this.selectedRowIndex == -1) {
      this.resetForm();
      return;
    }


    this.rolesForm.controls['rolesName'].setValue(role.rolesName);
    this.rolesForm.controls['status'].setValue(role.status);

  }

  updateSelectedRow() {
    this.role.rolesName = this.rolesForm.value.rolesName;
    this.role.status = this.rolesForm.value.status;

    this.roles.push(this.role);

    this.resetForm();

    this.notifyService.showSuccess("Updated successfully!", "UPDATED");
  }

  resetForm() {
    this.rolesForm.reset();
    this.rolesForm.controls['status'].setValue('Active');
    this.isUpdateMode = false;
  }

}
