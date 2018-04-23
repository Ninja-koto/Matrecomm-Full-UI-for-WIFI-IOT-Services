import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'userManagement',
  styleUrls: ['./userManagement.component.scss'],
  templateUrl: './userManagement.component.html'
})
export class UserManagement {

  constructor(private _spinner:BaThemeSpinner) {
    this._spinner.show();
  }
  ngAfterViewInit(){
    console.log("In UserManagement view init");
    this._spinner.hide();
  }

}
