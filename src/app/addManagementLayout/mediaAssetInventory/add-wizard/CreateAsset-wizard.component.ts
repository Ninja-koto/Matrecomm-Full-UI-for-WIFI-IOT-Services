
import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../commonServices/RPC.service";
import {CustomValidator} from "../../../commonServices/customValidator.service";
import {Logger} from "../../../commonServices/logger";
import {IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts} from "../../../commonModules/multiSelect/types";
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
@Component({
  selector: 'CreateAsset-add-wizard',
  templateUrl: './CreateAsset-wizard.component.html',
  styleUrls: ['./CreateAsset-wizard.component.scss'],
  providers:[RPCService]
})

export class CreateAssetAddWizardComponent implements OnInit {
    public myFormAssetInventory: FormGroup;

    public submitted: boolean;
    public events: any[] = [];

   step1Validition:boolean=false;

  @Input() operation:string;
  @Input() data:any;
  @Input() mediaFilesData:any=[];
  @Input() profileData:any=[];
  @Input() allProfileNames:any=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

// Labels / Parents
    nsObj: NameSpaceUtil;
    namespace:string="";

    constructor(private storage:SessionStorageService,private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {

     }

    ngOnInit() {

        this.myFormAssetInventory = this._fb.group({
                assetDeviceName: ['', [Validators.required]],
                assetIPAddress: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
                assetMACAddress: ['', [Validators.required,CustomValidator.macAddressValidation]],
                assetUsername: ['', [Validators.required]],
                assetPassword: ['', [Validators.required]],
                assetStorageSize: ['', [Validators.required]],
                assetDeviceConfig: ['', [Validators.required]],
                assetMaxUsers: ['', [Validators.required]],
        });

        this. subcribeToFormChanges();
    }

    subcribeToFormChanges() {
      this.myFormAssetInventory.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });

            }

  gotoFinalSubmit(val:any)
  {
     console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step
let myFormAssetData=this.myFormAssetInventory.value;

var FinalJson = {};

FinalJson["assetDeviceName"]= myFormAssetData.assetDeviceName;
FinalJson["assetIPAddress"]= myFormAssetData.assetIPAddress;
FinalJson["assetMACAddress"]= myFormAssetData.assetMACAddress;
FinalJson["assetUsername"]= myFormAssetData.assetUsername;
FinalJson["assetPassword"]= myFormAssetData.assetPassword;
FinalJson["assetStorageSize"]= myFormAssetData.assetStorageSize;
FinalJson["assetDeviceConfig"]= myFormAssetData.assetDeviceConfig;
FinalJson["assetMaxUsers"]= myFormAssetData.assetMaxUsers;

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
 this.clientRpc.orgRPCCall(op,"orgManagerMediaAssetInventoryMethod",finalData)
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
    this.myFormAssetInventory.reset();
  }
}
