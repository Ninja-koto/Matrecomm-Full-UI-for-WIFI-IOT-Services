import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';

import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';
import { layoutPaths } from './theme/theme.constants';
import {NotificationsService} from "angular2-notifications";
//const configParam = require("../../configParams");
import {Http, Response, Headers, RequestOptions } from "@angular/http";
import {Observable} from 'rxjs/Rx';
import {SessionStorageService} from "ngx-webstorage";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import 'style-loader!./app.scss';
import 'style-loader!./theme/initial.scss';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <!--<button (click)="clicked($event)"> </button>-->
      <simple-notifications [options]="options"></simple-notifications>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls:["./app.component.scss"]
})
export class App {
  public options = {
    timeOut: 5000,
    lastOnBottom: true
}
  isMenuCollapsed: boolean = false;

  constructor(private _state: GlobalState,
    private _service: NotificationsService,
              private _imageLoader: BaImageLoaderService,
              private _spinner: BaThemeSpinner,
              private viewContainerRef: ViewContainerRef,
              private themeConfig: BaThemeConfig, private http:Http,
              private storage:SessionStorageService) {

    /*
    this.getJSON().subscribe(data => {
      this.storage.store("configParams",data);
      ///TO DISABLE ALL CONSOLE LOGS
      if(data.disableConsoleLogs)
        console.log = function(){};
      //console.log(data);

    }, error => console.log(error));*/
    themeConfig.config();
    this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }


public getJSON(): Observable<any> {
  return this.http.get("assets/param.config.json")
                  .map((res:any) => res.json());
                  //.catch((error:any) => console.log(error));
}

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
      this._spinner.innerSpinHide();
    });
    /*const toast = this._service.success('Item created!', 'Click to undo...', {
      timeOut: 0,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });*/
    /*this._service.success(
      'Some Title',
      'Some Content',
      {
          timeOut: 5000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          maxLength: 20
      }
    );*/
    /*toast.click.subscribe((event) => {
      console.log("event");
      console.log(event);
  });*/

  }
  clicked(e)
  {
    this._service.success(
      'Some Title',
      'Some Content',
      {
          timeOut: 5000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          animate:"scale",
          maxLength: 20
      }
    );
  }

  private _loadImages(): void {
    // register some loaders
    BaThemePreloader.registerLoader(this._imageLoader.load(layoutPaths.images.root + 'sky-bg.jpg'));
  }

}
