import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Organization } from 'src/app/models/organization.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {


  organizationForm: UntypedFormGroup;
  organization: Organization;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.organizationForm = this.formBuilder.group({
      organizationName: [''],
      email: [''],
      address: [''],
      phoneNo: [''],
      webAddress:[''],
      status: ['Active']
  });
  }

  submit(){

    this.organization=new Organization();

    this.organization.organizationName=this.organizationForm.value.organizationName;
    this.organization.email=this.organizationForm.value.email;
    this.organization.webAddress=this.organizationForm.value.webAddress;
    this.organization.address=this.organizationForm.value.address;
    this.organization.phoneNo=this.organizationForm.value.phoneNo;
    this.organization.status=this.organizationForm.value.status;


  }
}
