import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'locationManagement',
  styleUrls: ['./locationManagement.component.scss'],
  templateUrl: './locationManagement.component.html'
})
export class LocationManagement {

  constructor( private _spinner: BaThemeSpinner) {
    this._spinner.show();
  }

ngAfterViewInit(){
  this._spinner.hide();
}
}
