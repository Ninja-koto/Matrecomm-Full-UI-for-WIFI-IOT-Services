import {Component, OnInit, ViewChild,Input,Output,EventEmitter, ViewEncapsulation} from '@angular/core';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {GlobalState} from '../../global.state';
import {SessionStorageService} from "ngx-webstorage";
import 'style-loader!./PageTop.scss';

@Component({
  selector: 'page-top',
  templateUrl: './PageTop.html',
  encapsulation: ViewEncapsulation.None
})
export class PageTop implements OnInit {

  @Input() showTasks:boolean=false;
  @Output() tasksClicked = new EventEmitter<any>();

  @ViewChild('modal')



 modal: ModalComponent;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = false;
    backdrop: string | boolean = 'static';

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;
  public notif:string="null";
  public failedNotif:string="null";
  private interValID:any="";

  constructor(private _state:GlobalState, private _storage:SessionStorageService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
      //_storage.observe("").emit()
      //this.notif = this._storage.retrieve("notifications");


    });
  }
  ngOnInit(){
this.startInterval();
console.log("In PageTop constructor")
      console.log(this.notif);
  }
   startInterval(){
  this.interValID = setInterval(() => {
      this.notif = this._storage.retrieve("notifications");
      this.failedNotif = this._storage.retrieve("failedNotifications");
      /*console.log("notifications....");
      console.log(this.notif);*/
    }, 5000);
}

ngOnDestroy() {
  if (this.interValID) {
    console.log("In User Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}
toggleMenu1(e){
  /*console.log("In toggleMenu1");
  console.log(e);
  console.log(this.tasksClicked);*/
  try{
  this.tasksClicked.emit(e);
  }
  catch(e)
  {
    console.log(e);
  }
}
  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }
  test()
  {
    return false;
  }
getUserName(){
  return this._storage.retrieve("loggedInUserName");
}
getUserRole(){
  return this._storage.retrieve("role");
}
getLicenseInfo(){
  return this._storage.retrieve("orgLicenseStatus");
}
getLicenseMessage(){
  return this._storage.retrieve("orgLicenseMessage");
}
getMessage(){
  return this._storage.retrieve("orgMessage");
}
getAccessPrivileges(){
  return this._storage.retrieve("AccessPrivileges");
}
    closed() {
      console.log("Trying to close...");
        //this.output = '(closed) ' + this.selected;
    }
    close1(){
        console.log("In close1...");
    }
    dismissed() {

    }
    opened() {

    }

    open() {
        //this.modal.open();
    }
}
