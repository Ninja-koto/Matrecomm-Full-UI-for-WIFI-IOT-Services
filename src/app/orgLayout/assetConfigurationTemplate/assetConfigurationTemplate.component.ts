import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'assetConfigurationTemplate',
  styleUrls: ['./assetConfigurationTemplate.component.scss'],
  templateUrl: './assetConfigurationTemplate.component.html'
})
export class AssetConfigurationTemplate {

  constructor(private _spinner:BaThemeSpinner) {
    this._spinner.show();
  }
  ngAfterViewInit(){
    this._spinner.hide();
  }

}
