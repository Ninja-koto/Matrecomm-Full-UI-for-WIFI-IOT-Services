import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'serviceProviderManager',
  styleUrls: ['./serviceProviderManager.component.scss'],
  templateUrl: './serviceProviderManager.component.html'
})
export class ServiceProviderManager {
mainTab:string = "dataCenterTab";
  constructor(private _spinner:BaThemeSpinner) {
  }
  ngAfterViewInit(){
    this._spinner.hide();
  }
  mainTabChanged(e)
  {
    this.mainTab = String(e.tabID);
  }

}
