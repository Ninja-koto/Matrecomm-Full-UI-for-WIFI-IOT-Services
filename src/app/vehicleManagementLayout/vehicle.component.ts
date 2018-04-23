
import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { VEHICLELAYOUT_MENU } from './vehicle.menu';
import {BaThemeSpinner} from "../theme/services";
@Component({
  selector: 'vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleLayout {

  constructor(private _menuService: BaMenuService,private _spinner:BaThemeSpinner) {
    
  }
menuItemClicked(e){

  if(String(e.target.innerText)!="")
    {
      let clsList = e.target.offsetParent.classList.value;
      if(clsList.indexOf("selected")==-1)
        this._spinner.show();
    }
    else
      this._spinner.hide();
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>VEHICLELAYOUT_MENU);
  }
}
