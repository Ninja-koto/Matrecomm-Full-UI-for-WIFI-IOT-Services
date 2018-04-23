
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
  selector: 'blockedDevice-add-wizard',
  templateUrl: './blockedDevice-wizard.component.html',
  styleUrls: ['./blockedDevice-wizard.component.scss'],
  providers: [RPCService]
})

export class blockedDeviceAddWizardComponent implements OnInit {
  public myFormBlockedDevice: FormGroup;
  public myFormBlockedDeviceList: FormGroup;
  public submitted: boolean;
  public events: any[] = [];
  public selectedScheduleType: string = "immediately"
  step1Validition: boolean = false;
  step2Validition: boolean = true;


sourceDevices = [];
targetDevices = [];

  ///FORM 3 related
  dailyAtValue: string = "";
  startTimeValue: string = "";
  endTimeValue: string = "";
  atValue: string = "";

  nsObj: NameSpaceUtil;
  namespace:string="";

  public user: any;

  @Input() operation: string;
  @Input() data: any;
  @Input() mediaFilesData: any = [];
  @Output() closeModalWizard = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<string>();
  headers: Headers;

  selectedMediaFiles: any[] = [];


  constructor(private storage:SessionStorageService,private _fb: FormBuilder, private clientRpc: RPCService, private http: Http) {

  }

  ngOnInit() {
    this.myFormBlockedDevice = this._fb.group({
       blockedAssest: ['', [Validators.required]],
    });
      this.myFormBlockedDeviceList = this._fb.group({

    });
    this.selectedMediaFiles=this.mediaFilesData;
  this. subcribeToFormChanges();

  }

    subcribeToFormChanges() {
      this.myFormBlockedDevice.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
          this.myFormBlockedDeviceList.statusChanges.subscribe(x =>{

              });
            }


            onPageBlockedAsset(e)
            {
              console.log("In pageLoaded");
              console.log(e);
              if($.trim(e)=="Media Block List")
                {
                  console.log("Media Block Details ");
                 this.sourceDevices=this.selectedMediaFiles;
                 console.log(this.sourceDevices);

                }
            }

  ngAfterViewInit() {

  }
   gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

    let selectedAssetsArray =[];
    for(let i=0;i<this.targetDevices.length;i++)
    {
      let selectedAssets ={};
      console.log(this.targetDevices[i]);
      selectedAssets["blockedAssetName"]=this.targetDevices[i];
      selectedAssetsArray.push(selectedAssets);
    }

let FinalJson = {};

FinalJson["profileName"] = this.myFormBlockedDevice.controls.blockedAssest.value;
FinalJson["blockedAssetGroup"] = selectedAssetsArray;


    let finalData = jQuery.extend(FinalJson,{"date":new Date().toISOString()});

console.log('/....finalData......');
console.log(finalData);
var op;
if(this.operation=="Add")
  op="create";
else
{
  op="update";
  finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
}

  this.clientRpc.orgRPCCall(op,"orgManagerMediaBlockedDeviceMethod",finalData)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        let log = new Logger();
        if(String(res.type)=="undefined")
        {
          //log.storeFailNotification("Modify in UserRegistration Failed");
          try{
          if((res.result.status=="Success")||(res.result.Status=="Success"))
          {
            console.log("Trigger reload Event....");
            log.storeSuccessNotification("In Media Management "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Media Management "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Media Management "+this.operation+" Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  this.myFormBlockedDevice.reset();
  this.myFormBlockedDeviceList.reset();

  }
}
