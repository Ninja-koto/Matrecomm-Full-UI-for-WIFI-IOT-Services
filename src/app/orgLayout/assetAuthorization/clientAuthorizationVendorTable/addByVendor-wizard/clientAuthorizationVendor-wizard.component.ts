import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";
//import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import {IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts} from "../../../../commonModules/multiSelect/types";

@Component({
  selector: 'clientAuthorizationVendor-add-wizard',
  templateUrl: './clientAuthorizationVendor-wizard.component.html',
  styleUrls: ['./clientAuthorizationVendor-wizard.component.scss'],
  providers:[RPCService]
})
export class ClientAuthorizationVendorAddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public myFormLocations: FormGroup;

    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  step2Validition:boolean=false;

showTableErrorMsg:string="none";

  authorisedClients:any[]=[];
  manualModeSelectedRowsForDeletion:any[]=[];

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() locationData:any[]=[];


  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

  public vendorNames = [
    { value: '', display: 'Select One' },
    { value: 'Motorola', display: 'Motorola' },
    { value: 'Cisco', display: 'Cisco' },
    { value: 'Ruckus', display: 'Ruckus' },
    { value: 'Linksys', display: 'Linksys' },
    { value: 'Engnenius', display: 'Engnenius' },
    { value: 'Radmax', display: 'Radmax' }
  ]
    public modelNames = [
    { value: '', display: 'Select One' },
    { value: 'AP6511', display: 'AP6511' },
    { value: 'ZF-7025', display: 'ZF-7025' },
    { value: 'E3000', display: 'E3000' },
    { value: 'EAP300', display: 'EAP300' },
    { value: 'RAD8NR', display: 'RAD8NR' }
 ]
    public firmwareVersions = [
    { value: '', display: 'Select One' },
    { value: 'Windows 10', display: 'Windows 10' },
    { value: 'Windows 8', display: 'Windows 8' },
    { value: 'Windows 7', display: 'Windows 7' },
    { value: 'Windows Vista', display: 'Windows Vista' },
    { value: 'OS X 10.11(El Capitan)', display: 'OS X 10.11(El Capitan)' },
    { value: 'OS X 10.10(Yosemite)', display: 'OS X 10.10(Yosemite)' },
    { value: 'OS X 10.9(Mavericks)', display: 'OS X 10.9(Mavericks)' },
    { value: 'OS X 10.8(Mountain Lion)', display: 'OS X 10.8(Mountain Lion)' },
    { value: 'OS X 10.7(Lion)', display: 'OS X 10.7(Lion)' },
    { value: 'Android 6.0(Marshmallow)', display: 'Android 6.0(Marshmallow)' },
    { value: 'Android 5.1(Lollipop)', display: 'Android 5.1(Lollipop)' },
    { value: 'Android 5.0(Lollipop)', display: 'Android 5.0(Lollipop)' },
    { value: 'Android 4.4(KitKat)', display: 'Android 4.4(KitKat)' },
    { value: 'Android 4.3(Jelly Bean)', display: 'Android 4.3(Jelly Bean)' },
    { value: 'Android 4.2(Jelly Bean)', display: 'Android 4.2(Jelly Bean)' },
    { value: 'Android 4.1(Jelly Bean)', display: 'Android 4.1(Jelly Bean)' }

 ];

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

locOptions: IMultiSelectOption[] = [];

    constructor(private _fb: FormBuilder, private clientRpc:RPCService, private http:Http) {}

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
              profileName: ['', []],
              vendor: ['', []],
              model: ['', []],
              firmware: ['', []],
        });
       this.myFormLocations = this._fb.group({
            locations: [[],[Validators.required]]
        });

       this.locationData.forEach(loc => {
          loc["id"]=loc.uuid;
          loc["name"] = loc.City+"->"+loc.Building+"->"+loc.Floor;
        });
        this.locationData.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.locOptions = this.locationData;


        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {
           this.authorisedClients = this.data.authorizedAssets;
  let profileName =this.data.profileName;
         (<FormControl> this.myForm.controls["profileName"])
             .setValue(profileName, { onlySelf: true });

              let tempUUID=[],locs=[];
                locs=this.data.locations;
               locs.forEach(element => {
                  tempUUID.push(element.uuid);
                });
           (<FormControl> this.myFormLocations.controls["locations"])
             .setValue(tempUUID, { onlySelf: true });


           this.step1Validition=true;
          this.step2Validition=true;
        }
    }


addClients(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();
 // let profileName = this.myForm.controls.profileName.value;
  let vendor = this.myForm.controls.vendor.value;
  let model = this.myForm.controls.model.value;
  let firmware = this.myForm.controls.firmware.value;

 // console.log(profileName);
  console.log(vendor);
  console.log(model);
   console.log(firmware);

  if((String(vendor).length>0)&&(String(model).length>0)&&(String(firmware).length>0))
  {
   this.showTableErrorMsg="none";
    this.authorisedClients.push({
                  "id":  new Date().getTime(),
              "vendor" : this.myForm.controls.vendor.value,
            "model" : this.myForm.controls.model.value,
            "firmware" : this.myForm.controls.firmware.value,
          });
   // this.myForm.controls.profileName.setValue([]);
    this.myForm.controls.vendor.setValue([]);
    this.myForm.controls.model.setValue([]);
    this.myForm.controls.firmware.setValue([]);
  }
  else
  {
    //show error msg
    this.showTableErrorMsg="block";
  }
  if(this.authorisedClients.length>0)
    this.step1Validition=true;
  else
    this.step1Validition=false;
}


maintainSelectedData(e,val)
{
  console.log("In maintainSelectedData");
  console.log(e.target.checked);
    console.log(val);
  if(e.target.checked)
  {
    if(this.manualModeSelectedRowsForDeletion.findIndex(ele => ele.id==val.id)<0)
      this.manualModeSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.manualModeSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.manualModeSelectedRowsForDeletion.splice(index,1);
  }
  console.log("All selected...");
  console.log(this.manualModeSelectedRowsForDeletion);
}
deleteSelectedClients(e)
{
  e.preventDefault();
  console.log("Before Delete All Profiles");
  console.log(this.authorisedClients);
  this.manualModeSelectedRowsForDeletion.forEach(ele=>{
    let index = this.authorisedClients.findIndex(val => val.id==ele.id);
    this.authorisedClients.splice(index,1);
  })
  this.manualModeSelectedRowsForDeletion=[];
  console.log("After Delete All Profiles");
  console.log(this.authorisedClients);
  if(this.authorisedClients.length<=0)
  {
    this.step1Validition=false;
    e.target.disabled=true;
  }
}
   		ngAfterViewInit		(){
      }

    subcribeToFormChanges() {
      this.myForm.statusChanges.subscribe(x =>{
       //console.log(x);
        });
         this.myFormLocations.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
          });

     }
  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step
let profileName = this.myForm.controls.profileName.value;
let formData = this.myFormLocations.value;

let locsFullData = this.locationData.filter(val => formData.locations.includes(val.uuid));
    let locs=[]
          locsFullData.forEach(ele => {
            locs.push({"Building" : ele.Building,
            "City" : ele.City,
            "Floor" : ele.Floor,
            "uuid" : ele.uuid});
          });
    let locationDataProfile = {};
    locationDataProfile["locations"]= locs;

    console.log(this.myForm.value);
    let finalData = jQuery.extend(locationDataProfile,{"date":new Date().toISOString()});
    finalData["authorizedAssets"]=this.authorisedClients;
    finalData["profileName"]=profileName;

    console.log("finalData");
    console.log(finalData);

  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }

  this.clientRpc.orgRPCCall(op,"orgManagerAuthorisedClientsVendorMethod",finalData)
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
            log.storeSuccessNotification("In Client Authorization Vendor "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Client Authorization Vendor "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Client Authorization Vendor "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  //  this.myForm.reset();
  }
}
