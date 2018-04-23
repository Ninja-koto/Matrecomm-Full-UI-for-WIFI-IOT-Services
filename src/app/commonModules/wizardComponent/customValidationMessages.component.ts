import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {CustomValidator } from '../../commonServices/customValidator.service';

@Component({
  selector: 'error-messages',
  template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})
export class CustomValidationMessagesComponent {
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return CustomValidator.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}