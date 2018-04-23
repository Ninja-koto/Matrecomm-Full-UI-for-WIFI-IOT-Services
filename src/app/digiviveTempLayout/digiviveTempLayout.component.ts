
import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { DIGIVIVELAYOUT_MENU } from './digiviveTempLayout.menu';
import {BaThemeSpinner} from "../theme/services";
@Component({
  selector: 'digivive',
  templateUrl: './digiviveTempLayout.component.html',
  styleUrls: ['./digiviveTempLayout.component.scss']
})
export class DigiviveLayout {

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
    this._menuService.updateMenuByRoutes(<Routes>DIGIVIVELAYOUT_MENU);
  }
}
