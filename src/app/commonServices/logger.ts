import {SessionStorageService} from "ngx-webstorage";
export class Logger
{
    ns:string="";;
    currentRole:string="";
    currentOrgType:string="";
    prodMgrName:string="";
    prodMgrUUID:string="";
    providerMgrUUID:string="";
    orgMgrName:string="";
    orgMgrUUID:string="";
    storage:any;
    constructor() {
        this.storage = new SessionStorageService();
    }
    logger(data:any){
            console.log(data);
    }
    storeSuccessNotification(data:string){
        let tempData={};
        tempData["msg"]=data;
        tempData["time"]=new Date().toTimeString();
        tempData["id"]=new Date().getTime();
        //let prevNotifications=[];
        let prevNotifications = this.storage.retrieve("notifications");
        let arr=[],tempArr=[];
        if((String(prevNotifications)=="undefined")||(String(prevNotifications)=="null"))
            prevNotifications={};
        else
        {
            let tempJson={};
            tempJson = JSON.parse(String(prevNotifications));
            arr = tempJson["notif"];
        }
        tempArr.push(tempData);
        let temp={};
        temp["notif"]=tempArr.concat(arr);
        this.storage.store("notifications",JSON.stringify(temp));
    }
    storeFailNotification(data:string){
        let tempData={};
        tempData["msg"]=data;
        tempData["time"]=new Date().toTimeString();
        tempData["id"]=new Date().getTime();
        //let prevNotifications=[];
        let prevNotifications = this.storage.retrieve("failedNotifications");
        let arr=[],tempArr=[];
        if((String(prevNotifications)=="undefined")||(String(prevNotifications)=="null"))
            prevNotifications={};
        else
        {
            let tempJson={};
            tempJson = JSON.parse(String(prevNotifications));
            arr = tempJson["notif"];
        }
        tempArr.push(tempData);
        let temp={};
        temp["notif"]=tempArr.concat(arr);
        this.storage.store("failedNotifications",JSON.stringify(temp));
    }


}
