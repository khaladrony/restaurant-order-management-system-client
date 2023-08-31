import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() { }


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
