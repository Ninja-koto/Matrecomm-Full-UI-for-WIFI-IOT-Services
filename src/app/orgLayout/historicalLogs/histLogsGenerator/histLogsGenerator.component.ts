
import { Component,Input, OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../commonServices/RPC.service";
import {CustomValidator} from "../../../commonServices/customValidator.service";
import {Logger} from "../../../commonServices/logger";
//import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import {IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts} from "../../../commonModules/multiSelect/types";
import {BaThemeSpinner} from "../../../theme/services";
//import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import {Angular2Csv} from "../../../commonServices/csvFileGenerator";

@Component({
  selector: 'histLogs-Generator',
  templateUrl: './histLogsGenerator.component.html',
  styleUrls: ['./histLogsGenerator.component.scss'],
  providers:	[CollectionTableDataCollectorService,RPCService],
  encapsulation: ViewEncapsulation.None
})
export class HistLogsGenerator implements OnInit {
    @Input() logsFor:string="Locations";
    public myForm: FormGroup;
    step1Validition:boolean=false;
      tableData :any=[];
    startTimeValue:string="";
    endTimeValue:string="";
    logReqSent:boolean =false;
    totalUsedData:string="0 MB";

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
    private _spinner:BaThemeSpinner,private clientRpc: RPCService, private http:Http, vcRef: ViewContainerRef) {
      this.lastUpdatedTime = new Date().getTime();
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
     this.nsObj = new NameSpaceUtil(this.storage);
     if(this.logsFor=="Locations")
        this.getAllLocations();
     else
     {
         this.columns= [
                {
                    key: 'userName',
                    label: 'UserName'
                },
                {
                    key: 'route',
                    label: 'Route'
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
        this.getAllRoutes();

     }
        this.myForm = this._fb.group({
              startTime:["",[]],
              endTime:["",[]],
              userName:["",[]],
              locations: [[],[]]
        });

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
                        loc["name"] = loc.City+"->"+loc.Building+"->"+loc.Floor;
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

getAllRoutes(){
      let ns = this.nsObj.getNameSpace("BusConfiguration");
      try{
        var paramsForData1={};
        let query={};
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {

                  this.allLocations=result.data;

                  this.allLocations.forEach(loc => {
                        loc["id"]=loc.accessPointMac;
                        loc["name"] = loc.City+"->"+loc.busRouteNumber;
                    });
                    console.log("All Routes : ");
                  console.log(this.allLocations);
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
      if((String(st)!="null")&&(String(st)!="")&&(String(et)!="null")&&(String(et)!=""))
      {
        this.step1Validition=true;
      }
      console.log(this.step1Validition);
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
    var options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title:"Report",
    useBom: true
  };
  let header={};
  if(this.logsFor=="Vehicles")
    {
   header = {
     "apMAC":"AccessPoint MAC",
     "clientMAC":"Client MAC",
     "nasIPAddress":"AccessPoint IP",
     "userIPAddress":"User IP ",
      "route":"Route",
      "lastUpdateTime":"Last Seen",
      "loginTime":"LogIn Time",
      "usedData":"Used Data",
      "userName":"UserName"};
    }
    else
    {
        header = {
          "apMAC":"AccessPoint MAC",
     "clientMAC":"Client MAC",
     "nasIPAddress":"AccessPoint IP",
     "userIPAddress":"User IP ",
      "location":"Location",
      "lastUpdateTime":"Last Seen",
      "loginTime":"LogIn Time",
      "usedData":"Used Data",
      "userName":"UserName"};
    }
    let fileName = "Logs_"+new Date().toLocaleString();
    new Angular2Csv(this.tableData, fileName,header,options);
}
gotoFinalSubmit(e)
  {
      e.preventDefault();
    console.log("Final Submit in add-wizard....");
    console.log(e);
    let formData = this.myForm.value;
    console.log(this.myForm.value);
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

this.clientRpc.orgRPCCall("create","getHistLogsOfLocationsAndRoutes",finalData)
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
  $('#closeWiz').click();
  //this.modal.dismiss();
}


}


