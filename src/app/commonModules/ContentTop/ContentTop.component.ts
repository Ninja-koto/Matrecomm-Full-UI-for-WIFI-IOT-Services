import {Component,Input} from '@angular/core';

import {GlobalState} from '../../global.state';

@Component({
  selector: 'content-top',
  styleUrls: ['./ContentTop.scss'],
  templateUrl: './ContentTop.html',
})
export class ContentTop {
  @Input() url="/org/orgHome";
  public activePageTitle:string = '';

  constructor(private _state:GlobalState) {
    this._state.subscribe('menu.activeLink', (activeLink) => {
      if (activeLink) {
        this.activePageTitle = activeLink.title;
      }
    });
  }
  getURL(){
    return this.url;
  }
}
