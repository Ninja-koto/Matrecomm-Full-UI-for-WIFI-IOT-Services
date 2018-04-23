
import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
import {SessionStorageService} from 'ngx-webstorage';
@Component({
  selector: 'historicalLogs',
  styleUrls: ['./historicalLogs.component.scss'],
  templateUrl: './historicalLogs.component.html'
})
export class HistoricalLogs {
  logsFor:string="Locations"
  constructor(private _spinner:BaThemeSpinner,private storage:SessionStorageService) {
    this._spinner.show();
  }
  ngOnInit(){
    let role = this.storage.retrieve("role");
    console.log("Current Role : ", role);
    if(role=="CraftAirVehicleAdmin")
    this.logsFor= "Vehicles";
    else if(role=="CraftAirOrgMgr")
    this.logsFor= "Locations";

  }
  ngAfterViewInit(){
    console.log("In HistoricalLogs view init");
    this._spinner.hide();
  }

}
