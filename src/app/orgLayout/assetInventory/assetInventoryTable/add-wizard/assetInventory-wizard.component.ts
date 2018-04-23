import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
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
  selector: 'assetInventory-add-wizard',
  templateUrl: './assetInventory-wizard.component.html',
  styleUrls: ['./assetInventory-wizard.component.scss'],
  providers:[RPCService]
})

export class AssetInventoryAddWizardComponent implements OnInit {
    public myForm1: FormGroup;
    public myForm2: FormGroup;
    public myForm3: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
//    files:any[]=[];
  step1Validition:boolean=false;
  step2Validition:boolean=false;
  step3Validition:boolean=true;
  @Input() operation:string;
  @Input() data:any;
  @Input() locationData:any;
  //@Input() assetConfigTemplates:any;
  @Input() regProfilesData:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

  model: number[];

///FORM 2 Related
  upgradeType:string="manualUpgrade";
    // Settings configuration
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
locOptions: IMultiSelectOption[] = [];
manualUpgradeOptions: IMultiSelectOption[] = [];
selectedLocations:any[]=[];

//profiles:FormControl;
vendors:FormControl;
selectedScheduleType:string="immediately"
autoUpgradeVendors:any[]=[];
autoUpgradeModels:any[]=[];
autoUpgradeProfiles: IMultiSelectOption[] = [];

autoUpgradeVendor:FormControl;
autoUpgradeModel:FormControl;
autoUpgradeProfile:FormControl;

allProfiles:any[]=[];
showTableErrorMsg:string = "none";
autoUpgradeSelectedRowsForDeletion=[];



///FORM 3 related
dailyAtValue:string="";
startTimeValue:string="";
endTimeValue:string="";
atValue:string="";



    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http,private ref: ChangeDetectorRef) {

     }

    ngOnInit() {

        console.log("Operation : "+this.operation);
        console.log(this.data);

        this.myForm1 = this._fb.group({
            inventoryProfileName:['',[Validators.required]],
            locations: [[],[Validators.required]]
        });
        this.myForm2 = this._fb.group({
            upgradeType:['manualUpgrade',[Validators.required]],
            vendors:[[],[Validators.required]]
        });

        this.myForm3 = this._fb.group({
          selectSchedule:["immediately",[Validators.required]],
          dailyAt:["",[]],
          startTime:["",[]],
          endTime:["",[]],
          selectedWeekDays: new FormGroup({
                 sunday: new FormControl(''),
                 monday: new FormControl(''),
                 tuesday: new FormControl(''),
                 wednesday: new FormControl(''),
                 thursday: new FormControl(''),
                 friday: new FormControl(''),
                 saturday: new FormControl('')
             }),
          at:["",[]]
        });

        this.setScheduleControl();///Form 3
        this.subcribeToFormChanges();

        //this.momentValue = String(new Date());

              this.locationData.forEach(loc => {
                loc["id"]=loc.uuid;
                loc["name"] = loc.City+"->"+loc.Building+"->"+loc.Floor;
              });
              console.log(this.locationData);
              this.locationData.sort(function(a, b) {
                  var textA = a.name.toUpperCase();
                  var textB = b.name.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
              this.locOptions = this.locationData;

              /*this.assetConfigTemplates.forEach(tmplt => {
                tmplt["id"]=tmplt.uuid;
                tmplt["name"] = tmplt.configurationProfileName+"("+tmplt.vendor+"->"+tmplt.model+")";
              });
              this.assetConfigTemplates.sort(function(a, b) {
                  var textA = a.name.toUpperCase();
                  var textB = b.name.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
              this.automaticUpgradeOptions = this.assetConfigTemplates;*/
              this.regProfilesData.forEach(tmplt => {
                if(this.autoUpgradeVendors.indexOf(tmplt.vendor)==-1)
                  this.autoUpgradeVendors.push(tmplt.vendor);
                tmplt["id"]=tmplt.uuid;
                tmplt["name"] = tmplt.vendor;
              });
              ///SORTING VENDORS
              this.autoUpgradeVendors.sort(function(a, b) {
                var textA = a.toUpperCase();
                var textB = b.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

              this.regProfilesData.sort(function(a, b) {
                  var textA = a.name.toUpperCase();
                  var textB = b.name.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
              this.manualUpgradeOptions = this.regProfilesData;

        /*this.myForm1.controls['locations'].valueChanges
            .subscribe((selectedOptions) => {
              console.log(selectedOptions);
                // changes
            });*/

        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {
            //FORM 1 UPDATE
            (<FormControl>this.myForm1.controls['inventoryProfileName'])
              .setValue(this.data.inventoryProfileName, { onlySelf: true });
                let tempUUID=[],locs=[];
                locs=this.data.selectedLocation;
                locs.forEach(element => {
                  tempUUID.push(element.uuid);
                });
           (<FormControl> this.myForm1.controls["locations"])
             .setValue(tempUUID, { onlySelf: true });
           this.step1Validition=true;

           //FORM 2 UPDATE
          (<FormControl>this.myForm2.controls['upgradeType'])
              .setValue(this.data.ProfileDetails.upgradeType, { onlySelf: true });
          this.upgradeType = this.data.ProfileDetails.upgradeType;
          this.add_removeFormControls();
          if(this.upgradeType=="manualUpgrade")
          {
            console.log("in modify manualUpgrade");
            //add vendors
            let vendors = this.data.ProfileDetails.vendors;
            let tempVendors = this.regProfilesData.filter(val => vendors.includes(val.vendor));
            console.log("All Selected vendors");
            console.log(tempVendors);
            let temp=[];
            tempVendors.forEach(element => {
              temp.push(element.uuid);
            });
            (<FormControl> this.myForm2.controls["vendors"])
             .setValue(temp, { onlySelf: true });

          }
          else
          {
            console.log("in modify auto upgrade");
            this.allProfiles = this.data.ProfileDetails.profiles;
          }
          this.step2Validition=true;

          //FORM 3 UPDATE
          (<FormControl>this.myForm3.controls['selectSchedule'])
              .setValue(this.data.selectSchedule, { onlySelf: true });
          this.selectedScheduleType = this.data.selectSchedule;

          this.setScheduleControl();
          if(this.selectedScheduleType=="immediately")
          {
          }
          else if(this.selectedScheduleType=="addTaskForDailyExecution")
          {
            console.log("In addTaskForDailyExecution");
            let ctrl = this.myForm3.controls["dailyAt"];
            ctrl.setValue(new Date(this.data.dailyAt));
            console.log("Time : "+this.getFullDateForTime(this.data.dailyAt));
            this.dailyAtValue = String(this.getFullDateForTime(this.data.dailyAt));
            console.log("After Time");
          }
          else if(this.selectedScheduleType=="addTaskForDailyUntilExecution")
          {
            let ctrl = this.myForm3.controls["startTime"];
            ctrl.setValue(new Date(this.data.startTime));
            this.startTimeValue = String(this.getFullDateForTime(this.data.startTime));
            ctrl = this.myForm3.controls["endTime"];
            ctrl.setValue(new Date(this.data.endTime));
            this.endTimeValue = String(this.getFullDateForTime(this.data.endTime));
          }
          else if(this.selectedScheduleType=="addTaskForSelectedWeekDaysUntilExecution")
          {
            let days = this.data.selectedWeekDays;
            let temp={"sunday":false,"monday":false,"tuesday":false,"wednesday":false,"thursday":false,"friday":false,"saturday":false};

            days.forEach(element => {
              switch (String(element)) {
                case "0":temp["sunday"]=true;
                  break;
                case "1":temp["monday"]=true;
                  break;
                case "2":temp["tuesday"]=true;
                  break;
                case "3":temp["wednesday"]=true;
                  break;
                case "4":temp["thursday"]=true;
                  break;
                case "5":temp["friday"]=true;
                  break;
                case "6":temp["saturday"]=true;
                  break;
                default:
                  break;
              }
            });
            (<FormGroup>this.myForm3.controls["selectedWeekDays"])
             .setValue(temp, { onlySelf: true });
            let ctrl = this.myForm3.controls["at"];
            ctrl.setValue(new Date(this.data.at));

            this.atValue = String(this.getFullDateForTime(this.data.at));
          }


        }

  }

  onLocationSelect(e)
  {
    console.log("onLocationSElect");
    console.log(e);
    try{
    let locsFullData = this.locationData.filter(val => e.includes(val.uuid));
    locsFullData.forEach(element => {
      let ipv4 = element.IPv4Details;
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
    this.selectedLocations = locsFullData;
    console.log(this.selectedLocations);
  }
  catch(e){}
  }
  getFullDateForTime(time:string)
  {
    console.log(time);
    if((time.indexOf("PM")>0)||(time.indexOf("pm")>0)||(time.indexOf("AM")>0)||(time.indexOf("am")>0))
    {
      let temp=new Date();
      let hour = Number(time.substring(0,time.indexOf(":")));
      if((time.indexOf("PM")>0)||(time.indexOf("pm")>0))
      {
        if(hour!=12)
          hour = hour+12;
      }
      let min = Number(time.substring(time.indexOf(":")+1,time.indexOf(" ")));
      console.log(String(hour)+" : "+String(min));
      return new Date(temp.getFullYear(),temp.getMonth(),temp.getDate(),hour,min);
    }
    else
    {
      let temp=new Date();
      let hour = Number(time.substring(0,time.indexOf(":")));
      if((time.indexOf("PM")>0)||(time.indexOf("pm")>0))
      {
        if(hour!=12)
          hour = hour+12;
      }

      let min = Number(time.substring(time.indexOf(":")+1));
      console.log(String(hour)+" : "+String(min));
      return new Date(temp.getFullYear(),temp.getMonth(),temp.getDate(),hour,min);
    }
  }

getModelsAndProfiles(e)
{
  let ven= e.target.value;
  let modelsToShow= this.regProfilesData.filter(val => val.vendor==ven);
  console.log("Models to Shwo...");
  console.log(modelsToShow);
  this.autoUpgradeModels =[];
  this.autoUpgradeProfiles=[];
  this.myForm2.controls.autoUpgradeProfile.setValue([]);
    modelsToShow.forEach(element => {
      this.autoUpgradeModels.push(element.model);
    });
}
getProfiles(e)
{
  let mods= e.target.value;
  let currVendor = this.myForm2.controls.autoUpgradeVendor.value;
  console.log("Curr Vendor : "+currVendor);
  let profilesToShow= this.regProfilesData.filter(val => (val.model==mods&&val.vendor==currVendor));
  console.log("Profiles to Shwo...");
  console.log(profilesToShow);
  this.autoUpgradeProfiles=[];
  profilesToShow.forEach(ele=>{
    this.autoUpgradeProfiles.push(ele.profileName);
  });

}
addProfiles(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();
  let ven = this.myForm2.controls.autoUpgradeVendor.value;
  let mod = this.myForm2.controls.autoUpgradeModel.value;
  let pn = this.myForm2.controls.autoUpgradeProfile.value;
  console.log(ven);
  console.log(mod);
  console.log(pn);
  if((ven.length>0)&&(mod.length>0)&&(pn.length>0))
  {
    this.showTableErrorMsg="none";
      let doc = this.regProfilesData.filter(val => {
                            return (val.profileName==pn)&&
                            (val.model==mod)&&
                            (val.vendor==ven)
                              });
      console.log("Doc : ");
      console.log(doc);
      var uuid= "";
      if(doc.length>0)
        uuid = doc[0].uuid;
    this.allProfiles.push({ "model" : this.myForm2.controls.autoUpgradeModel.value,
              "selectProfile" : this.myForm2.controls.autoUpgradeProfile.value,
              "uuid" : uuid,
              "vendor" : this.myForm2.controls.autoUpgradeVendor.value});
    console.log("All Profviles...");
    console.log(this.allProfiles);
    this.myForm2.controls.autoUpgradeVendor.setValue([]);
    this.myForm2.controls.autoUpgradeModel.setValue([]);
    this.myForm2.controls.autoUpgradeProfile.setValue([]);
  }
  else
  {
    ///show error msg
    this.showTableErrorMsg="block";
  }
  if(this.allProfiles.length>0)
    this.step2Validition=true;
}
deleteSelectedProfiles(e)
{
  e.preventDefault();
  console.log("Before Delete All Profiles");
  console.log(this.allProfiles);
  this.autoUpgradeSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allProfiles.findIndex(val => val.uuid==ele.uuid);
    this.allProfiles.splice(index,1);
  })
  console.log("After Delete All Profiles");
  console.log(this.allProfiles);
  if(this.allProfiles.length<=0)
  {
    this.step2Validition=false;
    e.target.disabled=true;
  }
}

maintainSelectedData(e,val)
{
  console.log("In maintainSelectedData");
  console.log(e.target.checked);
    console.log(val);
  if(e.target.checked)
  {
    if(this.autoUpgradeSelectedRowsForDeletion.findIndex(ele => ele.uuid==val.uuid)<0)
      this.autoUpgradeSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.autoUpgradeSelectedRowsForDeletion.findIndex(ele => ele.uuid==val.uuid);
    this.autoUpgradeSelectedRowsForDeletion.splice(index,1);
  }
  console.log("All selected...");
  console.log(this.autoUpgradeSelectedRowsForDeletion);
}
 add_removeFormControls(){
    if(String(this.upgradeType)=="manualUpgrade")
    {
      if(this.myForm2.contains("autoUpgradeVendor"))
        this.myForm2.removeControl("autoUpgradeVendor");
      if(this.myForm2.contains("autoUpgradeModel"))
        this.myForm2.removeControl("autoUpgradeModel");
      if(this.myForm2.contains("autoUpgradeProfile"))
        this.myForm2.removeControl("autoUpgradeProfile");
      if(!this.myForm2.contains("vendors"))
        {
          this.vendors= new FormControl([],[Validators.required]);
          this.myForm2.addControl("vendors",this.vendors);
        }
    }
    else if(String(this.upgradeType)=="automaticUpgrade")
    {this.step2Validition=false;
      if(this.myForm2.contains("vendors"))
        this.myForm2.removeControl("vendors");
      if(!this.myForm2.contains("autoUpgradeVendor"))
        {
          this.autoUpgradeVendor= new FormControl([],[]);
          this.myForm2.addControl("autoUpgradeVendor",this.autoUpgradeVendor);
        }
      if(!this.myForm2.contains("autoUpgradeModel"))
        {
          this.autoUpgradeModel= new FormControl([],[]);
          this.myForm2.addControl("autoUpgradeModel",this.autoUpgradeModel);
        }
      if(!this.myForm2.contains("autoUpgradeProfile"))
        {
          this.autoUpgradeProfile= new FormControl([],[]);
          this.myForm2.addControl("autoUpgradeProfile",this.autoUpgradeProfile);
        }
    }
  }

selectUpgradeType(e)
  {
    console.log("Selected URL ...");
    console.log(e.target.value);
    this.upgradeType=e.target.value;
    this.add_removeFormControls();
  }

  setScheduleControl()
  {

    if(this.selectedScheduleType=="immediately")
   {this.step3Validition=true;
     let ctrl = this.myForm3.controls["dailyAt"];
     ctrl.setValidators([]);
     ctrl.setValue("");
     this.dailyAtValue="";
     ctrl.disable();
      ctrl = this.myForm3.controls["startTime"];
      ctrl.setValidators([]);
      ctrl.setValue("");
      this.startTimeValue="";
      ctrl.disable();
      ctrl = this.myForm3.controls["endTime"];
      ctrl.setValidators([]);
      ctrl.setValue("");
      this.endTimeValue="";
      ctrl.disable();

      let ctrl1 = this.myForm3.controls["selectedWeekDays"];
      ctrl1.disable();

      ctrl = this.myForm3.controls["at"];
      ctrl.setValidators([]);
      ctrl.setValue("");
      this.atValue="";
      ctrl.disable();
   }
   else if(this.selectedScheduleType=="addTaskForDailyExecution")
   { this.step3Validition=false;
     let ctrl = this.myForm3.controls["dailyAt"];
     ctrl.setValidators([Validators.required]);
      ctrl.enable();
      ctrl = this.myForm3.controls["startTime"];
      ctrl.setValidators([]);
      ctrl.setValue("");
      this.startTimeValue="";
      ctrl.disable();
      ctrl = this.myForm3.controls["endTime"];
      ctrl.setValidators([]);
       ctrl.setValue("");
       this.endTimeValue="";
      ctrl.disable();
      let ctrl1 = this.myForm3.controls["selectedWeekDays"];
      ctrl1.disable();

      ctrl = this.myForm3.controls["at"];
      ctrl.setValidators([]);
      ctrl.setValue("");
      this.atValue="";
      ctrl.disable();
   }
   else if(this.selectedScheduleType=="addTaskForDailyUntilExecution")
   {this.step3Validition=false;
     let ctrl = this.myForm3.controls["dailyAt"];
     ctrl.setValidators([]);
     ctrl.setValue("");
     this.dailyAtValue="";
     ctrl.disable();
      ctrl = this.myForm3.controls["startTime"];
      ctrl.setValidators([Validators.required]);
      ctrl.enable();
      ctrl = this.myForm3.controls["endTime"];
      ctrl.setValidators([Validators.required]);
      ctrl.enable();

      let ctrl1 = this.myForm3.controls["selectedWeekDays"];
      ctrl1.disable();
      ctrl = this.myForm3.controls["at"];
      ctrl.setValidators([]);
      ctrl.setValue("");
      this.atValue="";
      ctrl.disable();
   }
   else if(this.selectedScheduleType=="addTaskForSelectedWeekDaysUntilExecution")
   {
     this.step3Validition=false;
     let ctrl = this.myForm3.controls["dailyAt"];
     ctrl.setValidators([]);
     ctrl.setValue("");
     this.dailyAtValue="";
     ctrl.disable();
      ctrl = this.myForm3.controls["startTime"];
      ctrl.setValidators([]);
      ctrl.setValue("");
      this.startTimeValue="";
      ctrl.disable();
      ctrl = this.myForm3.controls["endTime"];
      ctrl.setValidators([]);
      ctrl.setValue("");
      this.endTimeValue="";
      ctrl.disable();
      let ctrl1 = this.myForm3.controls["selectedWeekDays"];
      ctrl1.enable();
      ctrl = this.myForm3.controls["at"];
      ctrl.setValidators([Validators.required]);
      ctrl.enable();
   }

  }

  scheduleChanged(e)
  {
    if(String(e)!="")
      this.step3Validition=true;
  }
  startAndEndTimeChanged(e,origin:string)
  {
    this.step3Validition=false;
      console.log("In startAndEndTimeChanged");
      console.log(e);
      let st = this.myForm3.controls["startTime"].value;
      let et = this.myForm3.controls["endTime"].value;
      console.log("ST : "+st);
      console.log("ET : "+et);
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
            this.myForm3.controls["startTime"].setValue("");
            this.startTimeValue="";
            this.myForm3.controls["startTime"].setErrors({"stSTet":true});
          }
          else if(origin=="fromEnd")
          {
            console.log("Please select End time Greater..");
            this.myForm3.controls["endTime"].setValue("");
            this.endTimeValue="";
            this.myForm3.controls["endTime"].setErrors({"etGTst":true});
          }
        }

      }
      st = this.myForm3.controls["startTime"].value;
      et = this.myForm3.controls["endTime"].value;
      if((String(st)!="null")&&(String(st)!="")&&(String(et)!="null")&&(String(et)!=""))
      {
        this.step3Validition=true;
      }
  }

  weekDaysAndTimeChanged(e)
  {
    console.log("In weekDaysAndTimeChanged");
    console.log(e);
    let at = this.myForm3.controls["at"].value;
    console.log("AT : "+at);
    setTimeout(function(){
    this.checkSelectedDays();
    }.bind(this),100);
  }
  checkSelectedDays()
  {
    let formData = this.myForm3.value;
    let weeksData = formData.selectedWeekDays;
    let weeks=[];
        if(String(weeksData.sunday)=="true")
          weeks.push("0");
        if(String(weeksData.monday)=="true")
          weeks.push("1");
        if(String(weeksData.tuesday)=="true")
          weeks.push("2");
        if(String(weeksData.wednesday)=="true")
          weeks.push("3");
        if(String(weeksData.thursday)=="true")
          weeks.push("4");
        if(String(weeksData.friday)=="true")
          weeks.push("5");
        if(String(weeksData.saturday)=="true")
          weeks.push("6");
      if(weeks.length<=0)
      {
        this.step3Validition=false;
        this.myForm3.controls["at"].setErrors({"selectWeekDays":true});
      }
      else
      {
        let at = this.myForm3.controls["at"].value;
        if((String(at)!="null")&&(String(at)!=""))
        {
          this.myForm3.controls["at"].setErrors(null);
          this.step3Validition=true;
        }
      }
  }
  selectWeekDays(e)
  {
    setTimeout(function(){
    this.checkSelectedDays();
    }.bind(this),100);
  }


 selectScheduleType(e)
 {
   this.selectedScheduleType = e.target.value;
   this.setScheduleControl();
 }


    	ngAfterViewInit	(){

      }


    subcribeToFormChanges() {
      console.log("In form change subscribe...");
      this.myForm1.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
      this.myForm2.statusChanges.subscribe(x =>{
        //console.log(x);
        if(String(this.upgradeType)=="manualUpgrade")
        {
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
        }

          });
        ///HERE myForm3 STATUS CHANGE SUBSCRIPTION IS NOT WORKING... SO HANDLING MANUALLY....
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

  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step
    let formData = this.myForm1.value;

    console.log("formData");
    console.log(formData);


    ///Form 1 Data...
    let locsFullData = this.locationData.filter(val => formData.locations.includes(val.uuid));
    let locs=[]
          locsFullData.forEach(ele => {
            locs.push({"Building" : ele.Building,
            "City" : ele.City,
            "Floor" : ele.Floor,
            "uuid" : ele.uuid});
          });

    let form2Data = this.myForm2.value;

    let finalData = {"date":new Date().toISOString()};
    finalData["inventoryProfileName"] = formData.inventoryProfileName;
    finalData["selectedLocation"]= locs;
    var tempProfile={"inventoryProfileName":formData.inventoryProfileName,
                    "upgradeType":form2Data.upgradeType};
        if(form2Data.upgradeType=="automaticUpgrade")
        {
          /*let profilesFullData= this.assetConfigTemplates.filter(val => form2Data.profiles.includes(val.uuid));
          let x=[];
          profilesFullData.forEach(ele => {
            x.push({"model" : ele.model,
                "selectProfile" : ele.selectProfile,
                "uuid" : ele.uuid,
                "vendor" : ele.vendor});
          });
          tempProfile["profiles"] = x;*/
          tempProfile["profiles"]=this.allProfiles;
        }
        else if(form2Data.upgradeType=="manualUpgrade")
        {
          let vendorsFullData= this.regProfilesData.filter(val => form2Data.vendors.includes(val.uuid));
          let x=[];
          vendorsFullData.forEach(element => {
            x.push(element.vendor);
          });
          tempProfile["vendors"] = x;
        }
    finalData["ProfileDetails"]=tempProfile;


///Form 3 Data
console.log(this.myForm3.value);

  let f3Data = this.myForm3.value;

if(String(f3Data.selectSchedule)=="addTaskForSelectedWeekDaysUntilExecution")
{
  let weeksData = f3Data.selectedWeekDays;
  let weeks=[];
  if(weeksData.sunday)
    weeks.push("0");
  if(weeksData.monday)
    weeks.push("1");
  if(weeksData.tuesday)
    weeks.push("2");
  if(weeksData.wednesday)
    weeks.push("3");
  if(weeksData.thursday)
    weeks.push("4");
  if(weeksData.friday)
    weeks.push("5");
  if(weeksData.saturday)
    weeks.push("6");
  f3Data["at"]=this.get24TimeFrom12(f3Data.at);
  f3Data["selectedWeekDays"] = weeks;
}
else if(String(f3Data.selectSchedule)=="addTaskForDailyUntilExecution")
{
    var startTimeStr= new Date(f3Data.startTime);
    var endTimeStr = new Date(f3Data.endTime);
    var startTimeStruct={}, endTimeStruct={};
    startTimeStruct["Year"]= startTimeStr.getFullYear();
    startTimeStruct["Month"]= startTimeStr.getMonth()+1;
    startTimeStruct["Day"]= startTimeStr.getDate();
    startTimeStruct["Hour"]= startTimeStr.getHours();
    startTimeStruct["Minute"]= startTimeStr.getMinutes();

    endTimeStruct["Year"]= endTimeStr.getFullYear();
    endTimeStruct["Month"]= endTimeStr.getMonth()+1;
    endTimeStruct["Day"]= endTimeStr.getDate();
    endTimeStruct["Hour"]= endTimeStr.getHours();
    endTimeStruct["Minute"]= endTimeStr.getMinutes();

    f3Data["startTimeStruct"]=startTimeStruct;
    f3Data["endTimeStruct"]=endTimeStruct;
}
else if(String(f3Data.selectSchedule)=="addTaskForDailyExecution")
{
f3Data["dailyAt"]=this.get24TimeFrom12(f3Data.dailyAt);
}
  console.log("Form 3 Data...");
  console.log(f3Data);





var d = new Date()

finalData = jQuery.extend(finalData,f3Data,{"diffToRemove": d.getTimezoneOffset()*-60});


  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
      console.log(finalData);
   this.clientRpc.orgRPCCall(op,"orgManagerInventoryProfileMethod",finalData)
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
            log.storeSuccessNotification("In Asset Inventory "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Asset Inventory "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Asset Inventory "+this.operation+" Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
    this.myForm1.reset();
  }
}
