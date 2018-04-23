import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";
@Component({
  selector: 'eventManagement',
  styleUrls: ['./eventManagement.component.scss'],
  templateUrl: './eventManagement.component.html'
})
export class EventManagement {

  constructor( private _spinner: BaThemeSpinner) {
    this._spinner.show();
  }
  ngAfterViewInit(){
  this._spinner.hide();
}

}
