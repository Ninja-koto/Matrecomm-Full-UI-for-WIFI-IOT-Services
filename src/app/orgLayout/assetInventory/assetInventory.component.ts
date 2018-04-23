import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'assetInventory',
  styleUrls: ['./assetInventory.component.scss'],
  templateUrl: './assetInventory.component.html'
})
export class AssetInventory {

  constructor(private _spinner:BaThemeSpinner) {
    this._spinner.show();
  }
  ngAfterViewInit(){
    this._spinner.hide();
  }

}
