import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'portalBilingPolicies',
  styleUrls: ['./portalBilingPolicies.component.scss'],
  templateUrl: './portalBilingPolicies.component.html'
})
export class PortalBilingPolicies {
mainTab:string="loginPortalPolicyTab";
  constructor(private _spinner:BaThemeSpinner) {
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
