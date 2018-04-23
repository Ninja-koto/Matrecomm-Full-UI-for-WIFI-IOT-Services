import {Component} from "@angular/core"
import {BaThemeSpinner} from "../../theme/services";

@Component({
    selector:'media-mgmt',
    template: `
    <mediaStore-table></mediaStore-table>
    <!--<mediaProfile-table></mediaProfile-table>-->
    `
})

export class MediaManagement{

    constructor(private _spinner:BaThemeSpinner) {
      this._spinner.show();
    }
    ngAfterViewInit(){
      this._spinner.hide();
    }

}