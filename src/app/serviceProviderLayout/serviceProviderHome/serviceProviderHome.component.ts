import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'serviceProviderHome',
  styleUrls: ['./serviceProviderHome.component.scss'],
  templateUrl: './serviceProviderHome.component.html'
})
export class ServiceProviderHome {

  constructor(private _spinner:BaThemeSpinner) {
  }
ngAfterViewInit(){
    this._spinner.hide();
  }
}
