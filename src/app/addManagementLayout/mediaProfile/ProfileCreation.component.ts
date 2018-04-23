import {Component} from '@angular/core';
import { BaThemeSpinner } from "../../theme/services";
@Component({
  selector: 'profileCreation',
  templateUrl: 'ProfileCreation.component.html',
  styles:[`.btn btn-primary{
  position: absolute;
    top: 50%;
}`]

})
export class profileCreation{
  constructor(private _spinner:BaThemeSpinner) {
        this._spinner.show();
      }
 ngAfterViewInit() {
    this._spinner.hide();
  }
}