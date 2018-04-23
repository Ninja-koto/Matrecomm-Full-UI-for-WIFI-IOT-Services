import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'assetRegistration',
  styleUrls: ['./assetRegistration.component.scss'],
  templateUrl: './assetRegistration.component.html'
})
export class AssetRegistration {

  constructor(private _spinner:BaThemeSpinner) {
    this._spinner.show();
  }
  ngAfterViewInit(){
    this._spinner.hide();
  }

}
