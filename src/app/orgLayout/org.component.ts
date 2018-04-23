import {Component, trigger, state, style, transition, animate, Input, OnChanges, SimpleChanges,
  OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation} from '@angular/core';
import { Routes } from '@angular/router';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import * as jQuery from "jquery";
import { BaMenuService } from '../theme';
import { ORG_MENU } from './org.menu';
import {BaThemeSpinner} from "../theme/services";
import {ViewDataCollectorService} from "../commonServices/viewDataCollector.service";
import {SessionStorageService} from "ngx-webstorage"
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";
import {NotificationsService} from "angular2-notifications";

@Component({
  selector: 'org',
  template: `
    <ba-sidebar (itemClicked)="menuItemClicked($event)"></ba-sidebar>
    <!--<ba-page-top></ba-page-top>-->
    <page-top showTasks="true" (tasksClicked)="showHideTasks($event)" ></page-top>
    <div class="al-main" (click)="clickDetectedInMain($event)">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
      <app-menu [@slideInOut]="menuState" [items]="taskItems" (taskSelected)="taskSelected($event)"></app-menu>
      <div >
      <modal  [animation]="animation" [keyboard]="keyboard" [backdrop]="'static'" (onClose)="closed()" (onDismiss)="dismissed()"
              (onOpen)="opened()" #validationModal>
              <form #modalForm="ngForm">
                  <modal-header [show-close]="true">
                      <h4 class="modal-title">Task Details</h4>
                  </modal-header>
                  <modal-body>
                    ID : {{currentTask._id}}    <br>
                    Name : {{currentTask.name}}<br>
                    Status : {{currentTask.status}}<br>
                    Description : {{currentTask.description}}<br>
                  </modal-body>
                  <modal-footer>
                </modal-footer>
              </form>
          </modal>
        <button type="button" class="taskMenuLItem" style="float: left;display:none;" id="modalButton"
         (click)="validationModal.open('lg')">
        </button>
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
    `,
    styleUrls: ['./org.component.scss'],
    animations: [
      trigger('slideInOut', [
        state('in', style({
          transform: 'translate3d(0, 0, 0)',
        })),
        state('out', style({
          transform: 'translate3d(100%, 0, 0)',
          background: "#ffffff",
        })),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))
      ]),
    ],
    providers:[ViewDataCollectorService],
    encapsulation: ViewEncapsulation.None
})
export class OrgLayout implements OnInit{
  menuState:string = 'out';
  @ViewChild('modal')
  modal: ModalComponent;
  animation: boolean = true;
  keyboard: boolean = false;
  currentTask:any={};
  interValID:any;
  nsObj: NameSpaceUtil;
  namespace:any="";
  taskItems:any=[];
  config={};
  oldNotifications={};
  constructor(private _menuService: BaMenuService,private _spinner:BaThemeSpinner, private _service:NotificationsService,
    private storage:SessionStorageService, private viewDataCollectService:ViewDataCollectorService) {
      this.nsObj = new NameSpaceUtil(this.storage);
      this.config = this.storage.retrieve("configParams");
      this.namespace = this.nsObj.getNameSpace("InventoryStatus");
      //console.log("NameSpace : "+this.namespace);
      if(this.config["showInventoryStatus"])
      {
        this.initiateDataCollection();
        this.startInterval();
      }
  }
  closed() {
    console.log("Trying to close...");
  }

  dismissed() {
    console.log("dismissed...");
  }
  opened() {
  }
menuItemClicked(e){
  this.menuState = 'out';
    /*console.log("In baSidebar menu item clicked...");
    console.log(e);
    console.log(e.target.innerText);
    console.log(e.target.classList);
    console.log(String(e.target.innerText).indexOf("Assets"));*/
    if((String(e.target.innerText).indexOf("Assets")==-1)&&(String(e.target.innerText)!="")&&
      (String(e.target.innerText).indexOf("Vehicles")==-1)&&
      (String(e.target.className).indexOf("fa-bus")==-1)&&

      (String(e.target.innerText).indexOf("Campus")==-1)&&
      (String(e.target.className).indexOf("fa-building")==-1)&&

      (String(e.target.innerText).indexOf("Hotel")==-1)&&
      (String(e.target.className).indexOf("fa-building")==-1)&&

      (String(e.target.innerText).indexOf("Media")==-1)&&
      (String(e.target.className).indexOf("fa-video-camera")==-1)&&

      (String(e.target.className).indexOf("fa-wifi")==-1))
      {
        let clsList = e.target.offsetParent.classList.value;
        if(clsList.indexOf("selected")==-1)
          this._spinner.show();
      }
      else
        this._spinner.hide();
}

  taskSelected(item)
  {
    console.log("Selected Task");
    console.log(item);
    this.currentTask = item;
    this._spinner.show();
    jQuery('#modalButton').click();
    this._spinner.hide();
  }

  showHideTasks(e)
  {
    /*console.log("In showHideTasks");
    console.log(e);*/
    // 1-line if statement that toggles the value:
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }




  clickDetectedInMain(e)
  {
    //console.log(e);
    let clsList = e.target.classList.value;
    if((clsList.indexOf("taskMenuLItem")==-1)&&(clsList.indexOf("taskMenuList")==-1)
      &&(clsList.indexOf("taskMenuChildItem")==-1))
      this.menuState = 'out';
    //else
     // this.menuState = 'in';
  }

  initiateDataCollection(){

      try{

        var paramsForData={};
        let query={}, projectQuery={};
        let time = new Date().getTime();//current time
        let oldTime = time-300000;///5 Mins back time

        let selectRange = {
          "$gte":String(new Date(oldTime).toISOString())//,
          //"$lte":String(new Date().toISOString())
        };
        query["date"] = selectRange;
        //paramsForData["match"]
        projectQuery["date"]=1;
        projectQuery["description"]=1;
        projectQuery["name"]=1;
        projectQuery["percentage"]=1;
        projectQuery["status"]=1;
        projectQuery["uuid"]=1;
        paramsForData["dataQuery"]= query;
        paramsForData["projectQuery"] = projectQuery;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=1000;
        //console.log(selectRange);
        //console.log(paramsForData);
            this.viewDataCollectService.getPostDataForApStats(paramsForData)
              .subscribe(result => {
                var res = result;//.json();
                //this.tableData= res.data;
                //this.showChart=true;
                //console.log(res.data);
                if(res.data===undefined)
                  res.data=[];
                this.taskItems = res.data;
                this.taskItems.forEach(task => {
                  let show=false;
                  if(String(this.oldNotifications[task.uuid])=="undefined")
                    show = true;
                  else if(new Date(String(this.oldNotifications[task.uuid])).getTime()< new Date(String(task.date)).getTime())
                    show = true;
                  if(show)
                    {
                      console.log("SHOW IN NOTIFICATIONS.....");
                      this.oldNotifications[task.uuid]=task.date;
                      if(String(task.status)=="failed")
                        this._service.create("In Inventory "+task.name,task.description,"error",this.config["notificationConfig"]);
                      else
                        this._service.create("In Inventory "+task.name,task.description,"success",this.config["notificationConfig"]);
                    }
                    else
                      {
                        console.log("SKIPPING NOTIFICATIONS.....");
                      }
                });
                //this.storeData(res.data);
            });

            let keys = Object.keys(this.oldNotifications);
           // console.log("LEN : ");
            if(keys===undefined)
              keys=[];
            //console.log(keys.length);
            keys.forEach(element => {
              let oldDate = this.oldNotifications[element];
              //console.log((new Date().getTime())- (new Date(oldDate).getTime()) );
              if( ( (new Date().getTime())- (new Date(oldDate).getTime()) )> 86400000)
                delete this.oldNotifications[element];
            });

      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }

  }

  startInterval(){
    var paramsForData={};
   //console.log("In start Interval...");
    this.interValID = setInterval(() => {
      //console.log("GETTING TASK DATA....");
      this.initiateDataCollection();
      }, 10000);
  }
  ngOnDestroy() {
    if (this.interValID) {
      console.log("In NgxLineChart Component Destroying Set Interval...");
      clearInterval(this.interValID);
    }
  }


  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>ORG_MENU);
  }
}
