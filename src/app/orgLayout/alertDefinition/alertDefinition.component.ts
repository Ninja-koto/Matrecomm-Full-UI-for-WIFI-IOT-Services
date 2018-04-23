import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'alertDefinition',
  styleUrls: ['./alertDefinition.component.scss'],
  templateUrl: './alertDefinition.component.html'
})
export class AlertDefinition {
  mainTab:string="alertUsersTab";
  constructor(private _spinner: BaThemeSpinner) {
    this._spinner.show();
  }
  ngAfterViewInit(){
    this._spinner.hide();
  }
  mainTabChanged(e)
  {
    this.mainTab = String(e.tabID);
  }

}
