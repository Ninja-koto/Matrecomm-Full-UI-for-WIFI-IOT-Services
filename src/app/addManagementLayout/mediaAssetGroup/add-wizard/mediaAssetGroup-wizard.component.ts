
import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../commonServices/RPC.service";
import {CustomValidator} from "../../../commonServices/customValidator.service";
import {Logger} from "../../../commonServices/logger";
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
@Component({
  selector: 'profileCreation-add-wizard',
  templateUrl: './mediaAssetGroup-wizard.component.html',
  styleUrls: ['./mediaAssetGroup-wizard.component.scss'],
  providers:[RPCService]
})

export class ProfileMediaAddWizardComponent implements OnInit {
    public myFormProfile: FormGroup;
    public myFormAssetGroup: FormGroup;

    public submitted: boolean;
    public events: any[] = [];

    step1Validition:boolean=false;
    step2Validition:boolean=true;

    sourceAssets = [];
    targetAssets = [];
    selectedAssetDevices=[];

  @Input() operation:string;
  @Input() data:any;
  @Input() mediaFilesData:any=[];
  @Input() profileData:any=[];
  @Input() allProfileNames:any=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;


    constructor(private storage:SessionStorageService,private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {

     }

    ngOnInit() {
        this.myFormProfile = this._fb.group({
              profileName: ['', [Validators.required]],
        });
           this.myFormAssetGroup = this._fb.group({
        });

        this.selectedAssetDevices = this.mediaFilesData;
        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {

        }

        if(this.operation=="Modify")
        {

        }

    }
    		ngAfterViewInit	(){

      }


        onPageAssetGroup(e)
        {
          console.log("In pageLoaded");
          console.log(e);
          if($.trim(e)=="Media Select Asset Group")
            {
              console.log("Media Movies Details ");
             this.sourceAssets=this.mediaFilesData;
            console.log(this.sourceAssets);

            }
        }


    subcribeToFormChanges() {
      this.myFormProfile.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
          this.myFormAssetGroup.statusChanges.subscribe(x =>{
              });
            }

  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

let selectedAssetsArray =[];
for(let i=0;i<this.targetAssets.length;i++)
{
  let selectedAssets ={};
  console.log(this.targetAssets[i]);
  selectedAssets["selectedAssetName"]=this.targetAssets[i];
  selectedAssetsArray.push(selectedAssets);
}

    let formDataProfile = this.myFormProfile.value;

    var FinalJson = {};

    FinalJson["profileName"] = this.myFormProfile.controls.profileName.value;
    FinalJson["selectedAssetGroup"] = selectedAssetsArray;


    let finalData = jQuery.extend(FinalJson,{"date":new Date().toISOString()});
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  console.log("final data");
  console.log(finalData);
  console.log("Entering RPC");

  this.clientRpc.orgRPCCall(op,"orgManagerMediaAssetGroupMethod",finalData)
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
    this.myFormAssetGroup.reset();
    this.myFormProfile.reset();
  }
}
