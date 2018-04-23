

import { Component, OnInit, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Http, Headers, Response } from "@angular/http";
import "rxjs/Rx";
import { Observable } from "rxjs";
import * as jQuery from "jquery";
import { RPCService } from "../../../commonServices/RPC.service";
import { CustomValidator } from "../../../commonServices/customValidator.service";
import { Logger } from "../../../commonServices/logger";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from "../../../commonModules/multiSelect/types";
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'deployment-add-wizard',
  templateUrl: './deployment-wizard.component.html',
  styleUrls: ['./deployment-wizard.component.scss'],
  providers: [RPCService]
})

export class DeploymentAddWizardComponent implements OnInit {
  public myFormDeployment: FormGroup;
  public myFormDeploymentProfile: FormGroup;
  public myForm3: FormGroup;
  public submitted: boolean;
  public events: any[] = [];
  public selectedScheduleType: string = "immediately"
  step1Validition: boolean = false;
  step2Validition: boolean = false;
  step3Validition: boolean = true;
 public  allDevices = [];
 public  allProfiles = [];//['Profile 1','Profile 2','Profile 3','Profile 4'];

  ///FORM 3 related
  dailyAtValue: string = "";
  startTimeValue: string = "";
  endTimeValue: string = "";
  atValue: string = "";

  public user: any;
    nsObj: NameSpaceUtil;
  namespace:string="";

  @Input() operation: string;
  @Input() data: any;
  @Input() mediaFilesData: any = [];
  @Input() profileData: any = [];
  @Input() allMediaProfiles: any = [];
  @Output() closeModalWizard = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<string>();
  headers: Headers;
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-secondary',//'btn btn-default btn-block',
    dynamicTitleMaxItems: 1,
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
  mediaProfileOptions: IMultiSelectOption[] = [];
  mediaFileOptions: IMultiSelectOption[] = [];
  selectedMediaFiles: any[] = [];





  constructor(private storage:SessionStorageService,private _fb: FormBuilder, private clientRpc: RPCService, private http: Http) {

  }

  ngOnInit() {
     this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("deployment");
      console.log("NameSpace : "+this.namespace);

    console.log("Operation : " + this.operation);
    console.log("Operation : " + this.operation);
    console.log(this.data);
    this.myFormDeployment = this._fb.group({
      mediaAssetGroup: ['', [Validators.required, Validators.minLength(5)]],
      //SMPPPassword: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.myFormDeploymentProfile = this._fb.group({
      mediaProfile: [[], [Validators.required]]
      //SMPPPassword: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.myForm3 = this._fb.group({
      selectSchedule: ["immediately", [Validators.required]],
      dailyAt: ["", []],
      startTime: ["", []],

    });
    console.log(this.mediaFilesData);
    let temp = this.mediaFilesData;
    this.allDevices=temp;
    console.log(this.allDevices);

    this.mediaProfileOptions = [
      { id: 1, name: 'Profile 1' },
      { id: 2, name: 'Profile 2' },
    ];
    this.subcribeToFormChanges();
    console.log(this.mediaFilesData);
    /*
    this.mediaFilesData.forEach(loc => {
      loc["id"] = loc._id;
      loc["name"] = loc.filename + " ( Size: " + this.convertBytesToMegaBytes(loc.length) + " )"; //loc.City+"->"+loc.Building+"->"+loc.Floor;
    });
    console.log(this.mediaFilesData);
    this.mediaFilesData.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    this.mediaFileOptions = this.mediaFilesData;*/

    if (this.operation == "Add") {

    }

    if (this.operation == "Modify") {
   /*   (<FormControl>this.myFormDeployment.controls['profileName'])
        .setValue(this.data.profileName, { onlySelf: true });
      let tempUUID = [], locs = [];
      locs = this.data.files;
      console.log(locs);
      locs.forEach(element => {
        tempUUID.push(element.id);
      });
      (<FormControl>this.myFormDeploymentProfile.controls["files"])
        .setValue(tempUUID, { onlySelf: true });
      this.step1Validition = true;*/
    }

  }
  startAndEndTimeChanged(e)
  {
    this.step3Validition=false;
      console.log("In startAndEndTimeChanged");
      console.log(e);

      if((String(e)!="null")&&(String(e)!=""))
      {
        this.step3Validition=true;
      }
  }

  selectScheduleType(e) {
    this.selectedScheduleType = e.target.value;
    console.log(this.selectedScheduleType)
    if (this.selectedScheduleType == "immediately")
      this.step3Validition = true;
     else
      this.step3Validition = false;
  }

  getLocalTime(value) {
    return String(new Date(value).toLocaleDateString()) + ", " + String(new Date(value).toLocaleTimeString());
  }
  onProfileSelect(e) {
    console.log(this.mediaProfileOptions);

  }

 /* onMediaFileSelect(e) {
    console.log("onLocationSElect");
    console.log(e);
    try {
   /*   let locsFullData = this.mediaFilesData.filter(val => e.includes(val.id));
      locsFullData.forEach(element => {
        /*let ipv4 = element.IPv4Details;
        let tempIps="";
        for(let i=0;i<ipv4.length;i++)
          {
            if(i>=1)
              {
                tempIps = tempIps+"...";
              break;
              }
            tempIps = tempIps+ipv4[i].startIPv4+"-"+ipv4[i].endIPv4+"; ";
          }
          element["ips"]=tempIps;
      });
      this.selectedMediaFiles = locsFullData;
      console.log(this.selectedMediaFiles);
    }
    catch (e) { }
}*/
  convertBytesToMegaBytes(data: any) {
    if ((data != undefined) && (data != undefined)) {
      let packetCount = Number(data);
      var ext = "";
      data = (packetCount) / 1024; //KB
      ext = " KB";
      //console.log("Data : "+data);
      data = Math.round(data);
      var dataStr = "0";
      if ((ext == " KB") && (data > 1024)) {
        data = data / 1024; //MB
        //data = Math.round(data);
        dataStr = data.toFixed(3);
        ext = " MB";
      }
      else {
        dataStr = data.toFixed(3);
        ext = " KB";
      }
      if ((ext == " MB") && (data > 1024)) {
        data = data / 1024; //MB
        dataStr = data.toFixed(3);
        ext = " GB";
      }
      return String(dataStr) + ext;
    }
    else
      return "0 KB";
  }

  subcribeToFormChanges() {
    this.myFormDeployment.statusChanges.subscribe(x => {
      //console.log(x);
      if ((String(x) == "VALID") || (String(x) == "valid"))
        this.step1Validition = true;
      else
        this.step1Validition = false;
    });
    this.myFormDeploymentProfile.statusChanges.subscribe(x => {
      //console.log(x);
      if ((String(x) == "VALID") || (String(x) == "valid"))
        this.step2Validition = true;
      else
        this.step2Validition = false;
    });

    this.myForm3.statusChanges.subscribe(x => {
      /*//console.log(x);
      if ((String(x) == "VALID") || (String(x) == "valid"))
        this.step3Validition = true;
      else
        this.step3Validition = false;*/
    });
    //const myFormStatusChanges$ = this.myForm.statusChanges;
    //const myFormValueChanges$ = this.myForm.valueChanges;
    //myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
    //myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
  }

  /*save(model: User, isValid: boolean) {
      this.submitted = true;
      console.log(model, isValid);
  }*/


  onPageAssetDetails(e)
  {
    console.log("In pageLoaded");
    console.log(e);
    /*if($.trim(e)=="Media Asset Details")
      {
        console.log("Media Movies Details ");
        let temp = this.mediaFilesData;
       this.allDevices=temp;
       console.log(this.allDevices);

      }*/
  }



  get24TimeFrom12(time:string)
  {
    console.log(time);
    let hour = Number(time.substring(0,time.indexOf(":")));
    if((time.indexOf("PM")>0)||(time.indexOf("pm")>0))
    {
      if(hour!=12)
        hour = hour+12;
    }
    let min = Number(time.substring(time.indexOf(":")+1,time.indexOf(" ")));
    return String(hour)+":"+min;
  }
  gotoFinalSubmit(val: any) {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

    let f3Data = this.myForm3.value;

    console.log(f3Data);

let startTimeStruct={};
 if(String(f3Data.selectSchedule)=="addTaskForDailyUntilExecution")
{
    var startTimeStr= new Date(f3Data.startTime);

    startTimeStruct["Year"]= startTimeStr.getFullYear();
    startTimeStruct["Month"]= startTimeStr.getMonth()+1;
    startTimeStruct["Day"]= startTimeStr.getDate();
    startTimeStruct["Hour"]= startTimeStr.getHours();
    startTimeStruct["Minute"]= startTimeStr.getMinutes();

}

  console.log("Form 3 Data...");
  console.log(startTimeStruct);

     var FinalJSON = {};


     FinalJSON["mediaAssetGroup"] = this.myFormDeployment.controls.mediaAssetGroup.value;
     FinalJSON["mediaProfile"] = this.myFormDeploymentProfile.controls.mediaProfile.value;
     if(String(f3Data.selectSchedule)=="addTaskForDailyUntilExecution")
     FinalJSON["scheduleData"] = startTimeStruct;
      else
      FinalJSON["scheduleData"] = "immediately";

    let finalData = jQuery.extend(FinalJSON, { "date": new Date().toISOString() });
    var op;
    if (this.operation == "Add")
      op = "create";
    else {
      op = "update";
      finalData = jQuery.extend(finalData, { "uuid": this.data.uuid });
    }
    console.log("Final Data");
    console.log(finalData);
    this.clientRpc.orgRPCCall(op, "orgManagerMediaDeploymentMethod", finalData)
      .subscribe(res => {
        console.log("OUTPUT...");
        console.log(res);
        let log = new Logger();
        if (String(res.type) == "undefined") {
          //log.storeFailNotification("Modify in UserRegistration Failed");
          try {
            if ((res.result.status == "Success") || (res.result.Status == "Success")) {
              console.log("Trigger reload Event....");
              log.storeSuccessNotification("In Media Management " + this.operation + " succeeded");
            }
            else {
              log.storeFailNotification("In Media Management " + this.operation + " Failed");
              console.log("Do Nothing....");
            }
          }
          catch (e) { }
        }
        else {
          if (String(res.type) == "error") {
            log.storeFailNotification("In Media Management " + this.operation + " Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
    this.myFormDeployment.reset();
    this.myFormDeploymentProfile.reset();
    this.myForm3.reset();
  }
   ngAfterViewInit() {

  }

}
