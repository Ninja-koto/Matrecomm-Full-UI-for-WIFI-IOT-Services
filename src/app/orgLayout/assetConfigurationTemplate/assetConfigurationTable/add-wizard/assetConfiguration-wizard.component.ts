import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";

@Component({
  selector: 'assetConfiguration-add-wizard',
  templateUrl: './assetConfiguration-wizard.component.html',
  styleUrls: ['./assetConfiguration-wizard.component.scss'],
  providers:[RPCService]
})
export class AssetConfigurationAddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;

  

//countriesData:any;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() regProfilesData:any=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;


 public countries=[];
 profileNames:any=[];
 models:any=[];
 vendors:any=[];

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {}

    ngOnInit() {
      
        // the long way
        // this.myForm = new FormGroup({ 
        //     name: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
        //     address: new FormGroup({
        //         address1: new FormControl('', <any>Validators.required),
        //         postcode: new FormControl('8000')
        //     })
        // });
        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm = this._fb.group({
              configurationProfileName: ['', [Validators.required,Validators.minLength(5)]],
              vendor: ['', [Validators.required]],
              model: ['', [Validators.required]],
              selectProfile: ['', [Validators.required]],
  
        });
 

        this.subcribeToFormChanges();
        this.regProfilesData.forEach(tmplt => {
                this.vendors.push(tmplt.vendor);
              });
        if(this.operation=="Add")
        {
          
        }
        if(this.operation=="Modify")
        {
            (<FormControl> this.myForm.controls["configurationProfileName"])
             .setValue(this.data.configurationProfileName, { onlySelf: true });
            (<FormControl> this.myForm.controls["vendor"])
             .setValue(this.data.vendor, { onlySelf: true });
             this.getModelsAndProfiles_Help(this.data.vendor);
             (<FormControl> this.myForm.controls["model"])
             .setValue(this.data.model, { onlySelf: true });
             this.getProfiles_Help(this.data.model);
             (<FormControl> this.myForm.controls["selectProfile"])
             .setValue(this.data.selectProfile, { onlySelf: true });
           
          this.step1Validition=true;
   
        }
    }
    		ngAfterViewInit		(){
      }

getModelsAndProfiles(e)
{
  let ven= e.target.value;
  this.getModelsAndProfiles_Help(ven);
}
getModelsAndProfiles_Help(ven)
{
  let modelsToShow= this.regProfilesData.filter(val => val.vendor==ven);
  console.log("Models to Shwo...");
  console.log(modelsToShow);
  this.models =[];
  this.profileNames=[];
  this.myForm.controls.model.setValue([]);
  this.myForm.controls.selectProfile.setValue([]);
    modelsToShow.forEach(element => {
      this.models.push(element.model);
    });
}
getProfiles(e)
{
  let mods= e.target.value;
  this.getProfiles_Help(mods);
}

getProfiles_Help(mods)
{
  let currVendor = this.myForm.controls.vendor.value;
  console.log("Curr Vendor : "+currVendor);
  let profilesToShow= this.regProfilesData.filter(val => (val.model==mods&&val.vendor==currVendor));
  console.log("Profiles to Shwo...");
  console.log(profilesToShow);
  this.profileNames=[];
  profilesToShow.forEach(ele=>{
    this.profileNames.push(ele.profileName);
  });
}
    subcribeToFormChanges() {
      this.myForm.statusChanges.subscribe(x =>{
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
    
    console.log(this.myForm.value);

    let finalData = jQuery.extend(this.myForm.value,{"date":new Date().toISOString()});
    let doc = this.regProfilesData.filter(val => {
                            return (val.profileName==finalData.selectProfile)&&
                            (val.model==finalData.model)&&
                            (val.vendor==finalData.vendor)
                              });
      var uuid= "";
      if(doc.length>0)
        uuid = doc[0].uuid;
    finalData["BaseProfileUUID"]=uuid;
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  this.clientRpc.orgRPCCall(op,"orgManagerAssetConfigurationProfileMethod",finalData)
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
            log.storeSuccessNotification("In Asset Configuration Template "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Asset Configuration Template "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Asset Configuration Template "+this.operation+" Failed");
          }
        }
      });
      
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
