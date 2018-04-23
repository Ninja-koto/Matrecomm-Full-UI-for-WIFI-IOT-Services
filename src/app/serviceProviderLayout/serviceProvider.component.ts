import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import {SERVICEPROVIDER_MENU } from './serviceProvider.menu';
import {BaThemeSpinner} from "../theme/services";

@Component({
  selector: 'serviceProvider',
  template: `
    <ba-sidebar (itemClicked)="menuItemClicked($event)"></ba-sidebar>
    <!--<ba-page-top></ba-page-top>-->
    <page-top></page-top>
    <div class="al-main">
      <div class="al-content">
        <!--<ba-content-top></ba-content-top>-->
        <content-top [url]="'/serviceProvider/home'"></content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
    <!--<div class="al-footer-right">Created with <i class="ion-heart"></i></div>-->
    <div class="al-footer-main clearfix">
      <div class="al-copy">&copy; <a href="http://matrecomm.com/">MatreComm Technologies Pvt Ltd </a> 2017</div>
      <!--<ul class="al-share clearfix">
        <li><i class="socicon socicon-facebook"></i></li>
        <li><i class="socicon socicon-twitter"></i></li>
        <li><i class="socicon socicon-google"></i></li>
        <li><i class="socicon socicon-github"></i></li>
      </ul>-->
    </div>
  </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class ServiceProviderLayout {

  constructor(private _menuService: BaMenuService,private _spinner:BaThemeSpinner) {
    this._spinner.show();
  }
  ngAfterViewInit(){
    this._spinner.hide();
  }
menuItemClicked(e){
    /*console.log("In baSidebar menu item clicked...");
    console.log(e);
    console.log(e.target.innerText);
    console.log(String(e.target.innerText).indexOf("Assets"));*/
    /*if((String(e.target.innerText).indexOf("Assets")==-1)&&(String(e.target.innerText)!="")&&
                  (String(e.target.className).indexOf("fa-wifi")==-1))*/
      this._spinner.show();
    /*else
      this._spinner.hide();*/
  }
  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>SERVICEPROVIDER_MENU);
  }
}
