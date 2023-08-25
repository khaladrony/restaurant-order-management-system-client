import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { NgBootstrapConfirmationModalComponent } from 'src/app/pages/ngx-bootstrap-confirmation-modal/ng-bootstrap-confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {

  bsModalRef: BsModalRef;

  constructor(
    private bsModalService: BsModalService 
    ) { }

  confirm(title: string, message: string): Observable<string> {

    const initialState = {
      title: title,
      message: message,
      answer: "",
    };
    this.bsModalRef = this.bsModalService.show(NgBootstrapConfirmationModalComponent, { initialState });

    return new Observable<string>(this.getConfirmSubscriber());
  }

  private getConfirmSubscriber() {
    return (observer: any) => {
      const subscription = this.bsModalService.onHidden.subscribe((reason: string) => {
        observer.next(this.bsModalRef.content.answer);
        observer.complete();
      });

      return {
        unsubscribe() {
          subscription.unsubscribe();
        }
      };
    }
  }
}
