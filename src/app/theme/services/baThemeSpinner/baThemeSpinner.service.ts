import {Injectable} from '@angular/core';

@Injectable()
export class BaThemeSpinner {

  private _selector:string = 'preloader';
  private _selector1:string = 'preloader1';
  private _element:HTMLElement;
  private _element1:HTMLElement;

  constructor() {
    this._element = document.getElementById(this._selector);
    this._element1 = document.getElementById(this._selector1);
  }

  public show():void {
    this._element.style['display'] = 'block';
  }

  public hide(delay:number = 0):void {
    setTimeout(() => {
      this._element.style['display'] = 'none';
    }, delay);
  }
  public innerSpinShow():void {
    this._element1.style['display'] = 'block';
  }

  public innerSpinHide(delay:number = 0):void {
    setTimeout(() => {
      this._element1.style['display'] = 'none';
    }, delay);
  }
}
