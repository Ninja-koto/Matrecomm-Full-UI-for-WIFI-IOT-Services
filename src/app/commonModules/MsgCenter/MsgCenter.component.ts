import {Component,Input,OnChanges,SimpleChanges} from '@angular/core';

import {MsgCenterService} from './MsgCenter.service';
import {SessionStorageService} from "ngx-webstorage";
@Component({
  selector: 'msg-center',
  providers: [MsgCenterService],
  styleUrls: ['./MsgCenter.scss'],
  templateUrl: './MsgCenter.html'
})
export class MsgCenter implements OnChanges{
@Input() notif:string="";
@Input() failedNotif:string="";

  public notifications:Array<Object>;
  public messages:Array<Object>;
  private interValID:any="";
  tempNotif:any=[];
  tempErrorNotif:any=[];
  constructor(private _baMsgCenterService:MsgCenterService, private storage:SessionStorageService) {
    this.getNotifs();
    //this.notifications = this.notif;//this._baMsgCenterService.getNotifications();
    this.messages = this._baMsgCenterService.getMessages();
  }
  ngOnChanges(change:SimpleChanges){
    /*console.log("In Ment Item SimpleChanges...")
    console.log(change);*/
    this.getNotifs();
    this.getErrorNotifs();
  }

  getNotifs(){
    //console.log("In getNotifs");
    let prevNotifications = this.notif;
    //console.log(prevNotifications);
    let arr=[];
    try{
    if((String(prevNotifications)=="undefined")||(String(prevNotifications)=="null")||(String(prevNotifications)==""))
    {
        prevNotifications="";
        this.tempNotif=[];
    }
    else
    {
        let tempJson={};
        //console.log(prevNotifications);
        tempJson = JSON.parse(String(prevNotifications));
        arr = tempJson["notif"];
        this.tempNotif=arr;
    }
  }
  catch(e)
  {
    console.log("Exception in getNotifs...");
  }
    //console.log(this.tempNotif);
  }
  getErrorNotifs(){
    //console.log("In getNotifs");
    let prevNotifications = this.failedNotif;
    //console.log(prevNotifications);
    let arr=[];
    try{
    if((String(prevNotifications)=="undefined")||(String(prevNotifications)=="null")||(String(prevNotifications)==""))
    {
        prevNotifications="";
        this.tempErrorNotif=[];
    }
    else
    {
        let tempJson={};
        //console.log(prevNotifications);
        tempJson = JSON.parse(String(prevNotifications));
        arr = tempJson["notif"];
        this.tempErrorNotif=arr;
    }
  }
  catch(e)
  {
    console.log("Exception in getNotifs...");
  }
  }

  removeNotification(e,msgId)
  {
    //console.log("In removeNotification...");
    e.preventDefault();

        let prevNotifications = this.storage.retrieve("notifications");
        let arr=[];
        if((String(prevNotifications)=="undefined")||(String(prevNotifications)=="null"))
            prevNotifications={};
        else
        {
            let tempJson={};
            tempJson = JSON.parse(String(prevNotifications));
            arr = tempJson["notif"];
        }

    let index = arr.findIndex(val => val.id==msgId);
    /*console.log("Found Index..");
    console.log(index);*/
    arr.splice(index,1);

        //arr.push(tempData);
        let temp={};
        temp["notif"]=arr;
        this.storage.store("notifications",JSON.stringify(temp));
    this.tempNotif=arr;
  }

  removeErrorNotification(e,msgId)
  {
    //console.log("In removeNotification...");
    e.preventDefault();

        let prevNotifications = this.storage.retrieve("failedNotifications");
        let arr=[];
        if((String(prevNotifications)=="undefined")||(String(prevNotifications)=="null"))
            prevNotifications={};
        else
        {
            let tempJson={};
            tempJson = JSON.parse(String(prevNotifications));
            arr = tempJson["notif"];
        }

    let index = arr.findIndex(val => val.id==msgId);
    /*console.log("Found Index..");
    console.log(index);*/
    arr.splice(index,1);

        //arr.push(tempData);
        let temp={};
        temp["notif"]=arr;
        this.storage.store("failedNotifications",JSON.stringify(temp));
    this.tempErrorNotif=arr;
  }


  clearAllNotifications(e){
    /*console.log("In clearAllNotifications...");
    console.log(e);*/
    let prevNotifications = this.storage.retrieve("notifications");
        let temp={};
        temp["notif"]=[];
        this.storage.store("notifications",JSON.stringify(temp));
        this.tempNotif=[];
  }

  clearAllErrorNotifications(e){
    /*console.log("In clearAllNotifications...");
    console.log(e);*/
    let prevNotifications = this.storage.retrieve("failedNotifications");
        let temp={};
        temp["notif"]=[];
        this.storage.store("failedNotifications",JSON.stringify(temp));
        this.tempErrorNotif=[];
  }



}
