import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'assetAuthorization',
  styleUrls: ['./assetAuthorization.component.scss'],
  templateUrl: './assetAuthorization.component.html'
})
export class AssetAuthorization {
 mainTab:string = "apAuthorizationTab";
 constructor( private _spinner: BaThemeSpinner) {
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
