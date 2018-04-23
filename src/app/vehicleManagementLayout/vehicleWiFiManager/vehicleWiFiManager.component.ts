
import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";

@Component({
  selector: 'vehicleWiFiManager',
  styleUrls: ['./vehicleWiFiManager.component.scss'],
  templateUrl: './vehicleWiFiManager.component.html'
})
export class VehicleWiFiManager {
   mainTab:string = "vehiclePolicyTab";
    innerTab:string="innerGpsVehicleConfigurationTab";

  constructor(private _spinner: BaThemeSpinner) {
    this._spinner.show();
    console.log("In VehicleWiFiManager");
  }
  ngAfterViewInit(){
    this._spinner.hide();
  }
  mainTabChanged(e)
{
  this.mainTab = String(e.tabID);
  if(this.mainTab=="gpsVehicleConfigurationTab")
    this.innerTab="innerGpsVehicleConfigurationTab"
}
innerTabChanged(e)
{
  /*console.log("Inner Tab Changed...");
  console.log(e);
  console.log(e.tabID);*/
  this.innerTab = String(e.tabID);
}

}
