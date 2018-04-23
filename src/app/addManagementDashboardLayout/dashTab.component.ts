import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dash-tab',
  template:
  `
    <div [hidden]="!isActive">
      <ng-content></ng-content>
    </div>
  `
})
export class DashTabComponent implements OnInit {
  @Input() title: string;
  @Input() tabID:string;
  @Input() tabIcon: string;
  @Input() hidden: boolean = false;
  @Input() isValid: boolean = true;
  @Input() showNext: boolean = false;
  @Input() showPrev: boolean = false;
  @Input() maxStepWidth:string = "75px";

  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

  private _isActive: boolean = false;
  isDisabled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  @Input('isActive') set isActive(isActive: boolean) {
    this._isActive = isActive;
    this.isDisabled = false;
  }

  get isActive(): boolean {
    return this._isActive;
  }

}
