import { Component, Input, OnInit, Type } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ng-bootstrap-confirmation-modal',
  templateUrl: './ngx-bootstrap-confirmation-modal.component.html',
  styleUrls: ['./ngx-bootstrap-confirmation-modal.component.css']
})
export class NgBootstrapConfirmationModalComponent {
  title: string;
  message: string;
  answer: string = "";

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  respond(answer: string) {
    this.answer = answer;

    this.bsModalRef.hide();
  }
}
