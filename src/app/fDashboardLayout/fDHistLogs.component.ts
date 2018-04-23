
import { Routes } from '@angular/router';
import { TreeMenuService } from './sidebar/treeMenu/treeMenu.service';
//import { BaMenuService } from '../theme';
import { FDASHBOARDLAYOUT_MENU } from './fDashboardLayout.menu';
import {FDashboardDataService} from "./fDashboardLayout.service";

import { Component,Input, OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../commonServices/tableDataCollector.service';
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../commonServices/RPC.service";
import {CustomValidator} from "../commonServices/customValidator.service";
import {Logger} from "../commonServices/logger";
import {IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts} from "../commonModules/multiSelect/types";
import {BaThemeSpinner} from "../theme/services";
import {Angular2Csv} from "../commonServices/csvFileGenerator";
import {CsvCreator} from "../commonServices/csvFileCreator";

@Component({
  selector: 'fDHistLogs',
  templateUrl:'fDHistLogs.component.html' ,
  styleUrls:['fDHistLogs.component.scss'],
  providers:[FDashboardDataService,CollectionTableDataCollectorService,RPCService],
  encapsulation: ViewEncapsulation.None
})
export class FDHistLogs {

  @Input() logsFor:string="Locations";
    public myForm: FormGroup;
    step1Validition:boolean=false;
      tableData :any=[];
    startTimeValue:string="";
    endTimeValue:string="";
    logReqSent:boolean =false;
    totalUsedData:string="0 MB";
    selectedLogType:string="";


    public logsType = [
            { value: '', display: 'Select One' },
            { value: 'UserUsageLogs', display: 'User Usage Logs' },
            { value: 'BranchWiseLoginCount', display: 'Branch wise Login Count' },
            { value: 'OnlineOfflineCount', display: 'Device Online/Offline Logs' },
            { value: 'Report', display: 'Report' },

        ]

    mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-secondary',//'btn btn-default btn-block',
    dynamicTitleMaxItems: 5,
    displayAllSelectedText: true
};
// Text configuration
myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    defaultTitle: 'Select',
    allSelected: 'All selected',
};

// Labels / Parents
locOptions: IMultiSelectOption[] = [];

    columns= [
      {
        key: 'userName',
        label: 'UserName'
      },
      {
        key: 'branch',
        label: 'Location'
      },
      {
        key: 'loginTime',
        label: 'Login Time'
      },
      {
        key: 'lastUpdateTime',
        label: 'Last Seen'
      },
     {
        key: 'usedData',
        label: 'Used Data'
      }
      ];
@ViewChild('modal')
    modal: ModalComponent;
    //model: AddPerson = new AddPerson();

     index: number = 0;
    backdropOptions = [true, false, 'static'];
    cssClass: string = '';

    animation: boolean = true;
    keyboard: boolean = false;
    backdrop: string | boolean = 'static';
    css: boolean = false;

    selected: string;
    output: string;

    currWizardOp:string;
    currWizardData:any;
    addWizard:boolean=false;
    modifyWizard:boolean=false;
    rowsOnEachPage=5;
    replaceWithNewData=false;

   // eraseModal:boolean = false;
    interValID:any;
    lastUpdatedTime:number;
    deleteParamForSelected:any;

    nsObj: NameSpaceUtil;
    namespace:string="";
    allLocations:any[]=[];
    constructor(private storage:SessionStorageService,private _fb: FormBuilder, private tableDataCollectService:CollectionTableDataCollectorService ,
    private _spinner:BaThemeSpinner,private clientRpc: RPCService, private http:Http, private _menuService:TreeMenuService, vcRef: ViewContainerRef) {
      this.lastUpdatedTime = new Date().getTime();
    }



  getNameSpace(coll:string){
    return this.nsObj.getNameSpace(coll);
  }
  ngAfterViewInit(){
  this._spinner.hide();
}

clickedWizardButtonID(val :string)
    {
      console.log("Clicked Wizard Operation ID...");
      console.log(val);
    }
    selectedRowData(val:any)
    {
      console.log("selectedRowData...");
      console.log(val);
      this.currWizardData=val;
      this.deleteParamForSelected= {"users":[{"uuid":this.currWizardData.uuid}]};
    }
    selectedWizardOperation(val:string)
    {
      console.log("selectedWizardOperation...");
      console.log(val);

    }
    closed() {
      console.log("Trying to close...");
        //this.output = '(closed) ' + this.selected;
    }
    close1(){
      //this.eraseModal=true;
      console.log("Event caught to replace Table data....");
      this.replaceWithNewData=true;
      this.currWizardOp="";
      this.addWizard=false;
      this.modifyWizard=false;
      this.currWizardData={};
        console.log("In close1...");
    }
    dismissed() {
        this.startTimeValue="";
        this.endTimeValue="";
        this.myForm.controls.locations.setValue([]);
        this.myForm.controls.userName.setValue("");
        this.myForm.controls.logType.setValue("");
        //this.selectedLogType="";
      console.log("dismissed...");
      this.currWizardOp="";
      this.addWizard=false;
      this.modifyWizard=false;
      this.currWizardData={};
        this.output = '(dismissed)';
    }
    opened() {
        this.output = '(opened)';
    }

    open() {
        //this.modal.open();
    }
  ngOnInit() {
      this._menuService.updateMenuByRoutes(<Routes>FDASHBOARDLAYOUT_MENU);
     this.nsObj = new NameSpaceUtil(this.storage);
        this.getAllLocations();
        this.myForm = this._fb.group({
              startTime:["",[]],
              endTime:["",[]],
              userName:["",[]],
              locations: [[],[]],
              logType:["",[]]
        });
console.log(this.logReqSent);
console.log(this.selectedLogType);
        //this.subcribeToFormChanges();
}

getAllLocations(){
      let ns = this.nsObj.getNameSpace("CraftAirOrgLocation");
      try{
        var paramsForData1={};
        let query={};
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {

                  this.allLocations=result.data;
                  console.log("All Locations1 : ");
                  console.log(this.allLocations);
                  this.allLocations.forEach(loc => {
                        loc["id"]=loc.uuid;
                        loc["name"] = loc.City+"->"+loc.Building;//+"->"+loc.Floor;
                    });
                    this.allLocations.sort(function(a, b) {
                        var textA = a.name.toUpperCase();
                        var textB = b.name.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    });
                    this.locOptions = this.allLocations;
          });
      }
      catch(e)
      {
        console.log("getAllLocations Data load Failed... ");
      }
}

startAndEndTimeChanged(e,origin:string)
  {
      this.step1Validition=false;
      console.log("In startAndEndTimeChanged");
      console.log(e);
      let st = this.myForm.controls["startTime"].value;
      let et = this.myForm.controls["endTime"].value;
      if(origin=="fromStart") st=e;
      else et=e;
      console.log("ST : "+st);
      console.log("ET : "+et);
      console.log(this.startTimeValue);
      console.log(this.endTimeValue);
      if((String(et)!="null")&&(String(et)!="")&&(String(st)!="null")&&(String(st)!=""))
      {
        let tempSt = new Date(st);
        let tempEt = new Date(et);
        console.log(tempEt.getTime()-tempSt.getTime());
        if((tempEt.getTime()-tempSt.getTime())<0)
        {
          if(origin=="fromStart")
          {
            console.log("Please select Start time Smaller..");
            this.myForm.controls["startTime"].setValue("");
            this.startTimeValue="";
            this.myForm.controls["startTime"].setErrors({"stSTet":true});
          }
          else if(origin=="fromEnd")
          {
            console.log("Please select End time Greater..");
            this.myForm.controls["endTime"].setValue("");
            this.endTimeValue="";
            this.myForm.controls["endTime"].setErrors({"etGTst":true});
          }
        }

      }
      st = this.myForm.controls["startTime"].value;
      et = this.myForm.controls["endTime"].value;
      let logType = this.myForm.controls.logType.value;
      if((String(st)!="null")&&(String(st)!="")&&(String(et)!="null")&&(String(et)!="")&&(logType!=""))
        this.step1Validition=true;
      else
        this.step1Validition=false;
      //console.log(this.step1Validition);
  }
validateLogsSelection(e){
//console.log(e)
//console.log("In validateLogsSelection");
let currLogType = e.target.value
this.selectedLogType = currLogType;
let st = this.myForm.controls["startTime"].value;
let et = this.myForm.controls["endTime"].value;
if((String(st)!="null")&&(String(st)!="")&&(String(et)!="null")&&(String(et)!="")&&(currLogType!=""))
this.step1Validition=true;
else
this.step1Validition=false;

}
subcribeToFormChanges() {
      this.myForm.statusChanges.subscribe(x =>{
        //console.log(x);
          /*if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;*/
          });
    }

ngOnDestroy() {
  if (this.interValID) {
    console.log("In User Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}

downloadLogs(e)
{
    console.log("In downloadLogs...");
    console.log(e);
    let fileName = "";
    var data = "";
    let title = "Reports";
    console.log(this.selectedLogType);
    if(this.selectedLogType=="UserUsageLogs")
    {
      console.log("in UserUsageLogs");
        fileName = "UserUsageLogs_"+new Date().toLocaleString();
        data = "UserName, Location, Login Time, Last Updated Time, Used Data\r\n";//, User IP, AP IP, User MAC, AP MAC\r\n";
        this.tableData.forEach(doc => {
            var login, logout, location="",apIP="",userIP="",apMAC="",userMAC="";
            if((String(doc.location)!="undefined")&&(String(doc.location)!="null"))
                location = doc.location;
            if((String(doc.apMAC)!="undefined")&&(String(doc.apMAC)!="null"))
                apMAC = doc.apMAC;
            if((String(doc.clientMAC)!="undefined")&&(String(doc.clientMAC)!="null"))
                userMAC = doc.clientMAC;
            if((String(doc.userIPAddress)!="undefined")&&(String(doc.userIPAddress)!="null"))
                userIP = doc.userIPAddress;
            if((String(doc.nasIPAddress)!="undefined")&&(String(doc.nasIPAddress)!="null"))
                apIP = doc.nasIPAddress;
            if( (String(doc.loginTime)!="undefined")&&(String(doc.loginTime)!="")&&(String(doc.loginTime)!=" ") )
            {
                    login =new Date(doc.loginTime);
                    login =login.toLocaleDateString() +" "+ login.toLocaleTimeString();
                    doc.loginTime = login;
            }
            if( (String(doc.lastUpdateTime)!="undefined")&&(String(doc.lastUpdateTime)!="")&&(String(doc.lastUpdateTime)!=" ") )
            {
                    logout =new Date(doc.lastUpdateTime);
                    logout=logout.toLocaleDateString() +" "+ logout.toLocaleTimeString();
                    doc.lastUpdateTime = logout;
            }
            data = data+doc.userName+","+location+","+login+","+logout+","+doc.usedData/*+","+userIP+","+apIP+","+userMAC+","+apMAC*/+"\r\n";
        });
    }
    else if(this.selectedLogType=="BranchWiseLoginCount")
    {
      console.log("in BranchWiseLoginCount");
        fileName = "BranchWiseLoginCount_"+new Date().toLocaleString();
        data = "Branch, Date, Count\r\n";
        this.tableData.forEach(doc => {
            var branch="", date="", count=0;
            if((String(doc.branch)!="undefined")&&(String(doc.branch)!="null"))
                branch = doc.branch;
            if((String(doc.date)!="undefined")&&(String(doc.date)!="null"))
                date = doc.date;
            if((String(doc.count)!="undefined")&&(String(doc.count)!="null"))
                count = doc.count;
            data = data+branch+","+date+","+count+"\r\n";
        });
    }
    else if(this.selectedLogType=="OnlineOfflineCount")
    {
      console.log("in OnlineOfflineCount");
      fileName = "OnlineOfflineCount_"+new Date().toLocaleString();
        data = "Time, Online Count, Offline Count\r\n";
        this.tableData.forEach(doc => {
            var time="", onlineCount="", offlineCount=0;
            if((String(doc.time)!="undefined")&&(String(doc.time)!="null"))
                time = doc.time;
            if((String(doc.onlineCount)!="undefined")&&(String(doc.onlineCount)!="null"))
                onlineCount = doc.onlineCount;
            if((String(doc.offlineCount)!="undefined")&&(String(doc.offlineCount)!="null"))
                offlineCount = doc.offlineCount;
            data = data+time+","+onlineCount+","+offlineCount+"\r\n";
        });
    }
    else if(this.selectedLogType=="Report")
    {
      console.log("in Report");
        fileName = "Report"+new Date().toLocaleString();
        data = "City, Branch, Used Data, User Count\r\n";
        this.tableData.forEach(doc => {
            var city="", branch="", usedData="", userCount="";
            if((String(doc.city)!="undefined")&&(String(doc.city)!="null"))
                city = doc.city;
            if((String(doc.branch)!="undefined")&&(String(doc.branch)!="null"))
                branch = doc.branch;
            if((String(doc.usedData)!="undefined")&&(String(doc.usedData)!="null"))
                usedData = doc.usedData;
            if((String(doc.userCount)!="undefined")&&(String(doc.userCount)!="null"))
                userCount = doc.userCount;
            data = data+city+","+branch+","+usedData+","+userCount+"\r\n";
        });
    }
    new CsvCreator(data, fileName,title);
}
gotoFinalSubmit(e)
  {
      e.preventDefault();
    console.log("Final Submit in add-wizard....");
    console.log(e);
    let formData = this.myForm.value;
    console.log(this.myForm.value);
if(this.selectedLogType=="UserUsageLogs")
{
    this.columns= [
      {
        key: 'userName',
        label: 'UserName'
      },
      {
        key: 'location',
        label: 'Location'
      },
      {
        key: 'loginTime',
        label: 'Login Time'
      },
      {
        key: 'lastUpdateTime',
        label: 'Last Seen'
      },
     {
        key: 'usedData',
        label: 'Used Data'
      }
      ];
}
else if(this.selectedLogType=="BranchWiseLoginCount")
{
    this.columns= [
      {
        key: 'branch',
        label: 'Branch'
      },
      {
        key: 'date',
        label: 'Date'
      },
      {
        key: 'count',
        label: 'Count'
      }
      ];
}
else if(this.selectedLogType=="OnlineOfflineCount")
{
    this.columns= [
      {
        key: 'time',
        label: 'Time'
      },
      {
        key: 'onlineCount',
        label: 'Online Count'
      },
      {
        key: 'offlineCount',
        label: 'Offline Count'
      }
      ];
}
else if(this.selectedLogType=="Report")
{
    this.columns= [
      {
        key: 'city',
        label: 'City'
      },
      {
        key: 'branch',
        label: 'Branch'
      },
      {
        key: 'usedData',
        label: 'Used Data'
      },
      {
        key: 'userCount',
        label: 'User Count'
      }];
}



/*let locsFullData = this.allLocations.filter(val => formData.locations.includes(val.uuid));
    let locs=[]
          locsFullData.forEach(ele => {
            locs.push({"Building" : ele.Building,
            "City" : ele.City,
            "Floor" : ele.Floor,
            "uuid" : ele.uuid});
          });
    formData["locations"]=locs;*/
    if(this.logsFor=="Vehicles")
    {
        let macs=[];
        formData.locations.forEach(element => {
            let mac= String(element);
          macs.push(mac.substring(mac.indexOf("( ")+2,mac.indexOf(" )")));
        });
        formData["routes"]=macs;
    }
    formData["startDate"] = new Date(this.startTimeValue).toISOString();
    formData["endDate"] = new Date(this.endTimeValue).toISOString();
    formData["logsFor"]= this.logsFor;

    let finalData = jQuery.extend(formData,{"date":new Date().toISOString()});
  console.log("finalData");
  console.log(finalData);

this.clientRpc.orgRPCCall("create","getHistLogsOfFedbankDashboardUsers",finalData)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        let log = new Logger();
        this._spinner.hide();
        if(String(res.type)=="undefined")
        {
          //log.storeFailNotification("Modify in UserRegistration Failed");
          try{
          if((res.result.status=="Success")||(res.result.Status=="Success"))
          {
            console.log("Trigger reload Event....");
            log.storeSuccessNotification("Get Historical Logs succeeded");
            this.tableData= res.result.Data;
            let tData = res.result.TotalData;
            let ext=" MB";
            if(tData>=1024)
                {
                    tData=tData/1024;
                    ext = " GB";
                }
            this.totalUsedData = String(Number(tData).toFixed(3))+ext;
          }
          else
          {
            log.storeFailNotification("Get Historical Logs  Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("Get Historical Logs  Failed");
          }
        }

      });
      this._spinner.show();

  this.logReqSent=true;
  this.startTimeValue="";
  this.endTimeValue="";
  this.myForm.controls.locations.setValue([]);
  this.myForm.controls.userName.setValue("");
  this.myForm.controls.logType.setValue("");
  $('#closeWiz').click();
  //this.modal.dismiss();
}

}
