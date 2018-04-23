import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'apnUserManagement',
  styleUrls: ['./apnUserManagement.component.scss'],
  templateUrl: './apnUserManagement.component.html'
})
export class APNUserManagement {

  constructor(private _spinner:BaThemeSpinner) {
    this._spinner.show();
  }
  ngAfterViewInit(){
    console.log("In APN UserManagement view init");
    this._spinner.hide();
  }

}
