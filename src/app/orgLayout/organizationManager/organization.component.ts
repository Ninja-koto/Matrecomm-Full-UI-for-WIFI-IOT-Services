import {Component} from '@angular/core';
import {BaThemeSpinner} from "../../theme/services";

@Component({
  selector: 'organization',
  styleUrls: ['./organization.component.scss'],
  templateUrl: './organization.component.html'
})
export class OrganizationManager {
  mainTab:string = "emailServerTab";
  innerTab:string= "webCredentialsTab";

  constructor(private _spinner: BaThemeSpinner) {
    this._spinner.show();
    console.log("In OrganizationManager");
  }
  ngAfterViewInit(){
    this._spinner.hide();
  }
  mainTabChanged(e)
  {
    /*console.log("Tab Changed...");
    console.log(e);
    console.log(e.tabID);*/
    this.mainTab = String(e.tabID);
    if(this.mainTab=="orgCredentialsTab")
      this.innerTab="webCredentialsTab";
  }
  innerTabChanged(e)
  {
    /*console.log("Inner Tab Changed...");
    console.log(e);
    console.log(e.tabID);*/
    this.innerTab = String(e.tabID);
  }

}
