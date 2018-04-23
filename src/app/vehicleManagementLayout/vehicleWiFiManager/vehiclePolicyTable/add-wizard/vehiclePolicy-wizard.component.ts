import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {SessionStorageService} from "ngx-webstorage";
import {Logger} from "../../../../commonServices/logger"

@Component({
  selector: 'vehiclePolicy-add-wizard',
  templateUrl: './vehiclePolicy-wizard.component.html',
  styleUrls: ['./vehiclePolicy-wizard.component.css'],
  providers:[RPCService]
})
export class VehiclePolicyAddWizardComponent implements OnInit {

      public myFormVehiclePolicy: FormGroup;

    public submitted: boolean;
    public events: any[] = [];

  step1Validition:boolean=false;

selectedWeeks=[]

mStartTimeValue:string="";
mEndTimeValue:string="";
eStartTimeValue:string="";
eEndTimeValue:string="";

showTimeErrorMsg:string="none";
timeErrMsg:string="";

pickupTimeValue:string="";
 dropTimeValue:string="";
showBoardingTimeErrorMsg:string="none";
boardingTimeErrMsg:string="";
showBoardingTableErrorMsg:string = "none";

addBoardingStatus:String="Disable";
boardingPointName: FormControl;
pickupTime: FormControl;
dropTime: FormControl;
address: FormControl;

scheduleStatus:string="disable";
selectedWeekDays:FormGroup;
swd:FormGroup;

showMStartTimeErrorMsg:string="none";
mStartTimeErrMsg:string="";
showMEndTimeErrorMsg:string="none";
mEndTimeErrMsg:string="";

showMStartEndTimeErrorMsg:string="none";
mStartmEndTimeErrMsg="";


showEStartTimeErrorMsg:string="none";
eStartTimeErrMsg:string="";
showEEndTimeErrorMsg:string="none";
eEndTimeErrMsg:string="";

showEStartEndTimeErrorMsg:string="none";
eStartmEndTimeErrMsg="";

  mStartHours;
  mStartMinutes
  mEndHours;
  mEndMinutes;

  eStartHours;
  eStartMinutes
  eEndHours;
  eEndMinutes;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;


 public countries=[];

    constructor(private _fb: FormBuilder,private storage:SessionStorageService, private clientRpc: RPCService, private http:Http) {

     }

scheduleChanged(e,origin)
  {

if(origin=='fromMStart')
{
  let mSTime = new Date(this.mStartTimeValue).toTimeString();
  let mSHours=Number(mSTime.match(/^(\d+)/)[1]);
  let mSMinutes= Number(mSTime.match(/:(\d+)/)[1]);

  this.mStartHours=mSHours;
  this.mStartMinutes= mSMinutes;

    if(mSHours>=12)
    {
        this.showMStartTimeErrorMsg="block";
        this.mStartTimeErrMsg="StartTime should be lessthan 12 PM";
        this.step1Validition=false;

    }
    else if(mSHours<12)
    {
       this.showMStartTimeErrorMsg="none";
    }
}

else if(origin=='fromMEnd')
{
  let mETime = new Date(this.mEndTimeValue).toTimeString();
  let mEHours=Number(mETime.match(/^(\d+)/)[1]);
  let mEMinutes= Number(mETime.match(/:(\d+)/)[1]);

     this.mEndHours=mEHours;
     this.mEndMinutes=mEMinutes;

    if(mEHours>=12)
    {
        this.showMEndTimeErrorMsg="block";
        this.mEndTimeErrMsg="EndTime should be lessthan 12 PM";
        this.step1Validition=false;
    }
    else if(mEHours<12)
    {
      this.showMEndTimeErrorMsg="none";
    }

}

else if(origin=='fromEStart')
{
  let eSTime = new Date(this.eStartTimeValue).toTimeString();
  let eSHours=Number(eSTime.match(/^(\d+)/)[1]);
  let eSMinutes= Number(eSTime.match(/:(\d+)/)[1]);

     this.eStartHours=eSHours;
     this.eStartMinutes=eSMinutes;

    if(eSHours<12)
    {
        this.showEStartTimeErrorMsg="block";
        this.eStartTimeErrMsg="EndTime should be greaterthan 12 PM";
        this.step1Validition=false;
    }
    else if(eSHours>=12)
    {
      this.showEStartTimeErrorMsg="none";
    }

}
else if(origin=='fromEEnd')
{
  let eETime = new Date(this.eEndTimeValue).toTimeString();
  let eEHours=Number(eETime.match(/^(\d+)/)[1]);
  let eEMinutes= Number(eETime.match(/:(\d+)/)[1]);

     this.eEndHours=eEHours;
     this.eEndMinutes=eEMinutes;

    if(eEHours<12)
    {
        this.showEEndTimeErrorMsg="block";
        this.eEndTimeErrMsg="EndTime should be greaterthan 12 PM";
        this.step1Validition=false;
    }
    else if(eEHours>=12)
    {
      this.showEEndTimeErrorMsg="none";
    }

}

if((String(this.mStartHours)!="null")&&(String(this.mEndHours)!="null"))
 {
    if((this.showMEndTimeErrorMsg=="none")&&(this.showMStartTimeErrorMsg=="none"))
    {
      if(((this.mEndHours-this.mStartHours)<0)||((this.mEndMinutes-this.mStartMinutes)<0))
      {
         this.showMStartEndTimeErrorMsg="block";
         this.mStartmEndTimeErrMsg="Please select Start time Smaller End Time";
      }
       else
     {
       this.showMStartEndTimeErrorMsg="none";
     }
    }

}

if((String(this.eStartHours)!="null")&&(String(this.eEndHours)!="null"))
 {
    if((this.showEEndTimeErrorMsg=="none")&&(this.showEStartTimeErrorMsg=="none"))
    {
      if(((this.eEndHours-this.eStartHours)<0)||((this.eEndMinutes-this.eStartMinutes)<0))
      {
         console.log('cccccc');
         this.showEStartEndTimeErrorMsg="block";
         this.eStartmEndTimeErrMsg="Please select Start time Smaller End Time";
      }
       else
     {
       console.log('dddddd');
       this.showEStartEndTimeErrorMsg="none";
     }
    }

}

  }
selectScheduleStatus(event)
{

  console.log(event.target.value);
  this.scheduleStatus=event.target.value;
  this.setScheduleControl();
}
 setScheduleControl()
  {
    if(this.scheduleStatus=="Daily")
   {

        this.step1Validition=true;
     if(this.myFormVehiclePolicy.contains("selectedWeekDays"))
        this.myFormVehiclePolicy.removeControl("selectedWeekDays");
  }
  else if(this.scheduleStatus=="SelectedDays")
  {
    this.step1Validition=false;
    let swd= new FormGroup({
                 sunday: new FormControl(''),
                 monday: new FormControl(''),
                 tuesday: new FormControl(''),
                 wednesday: new FormControl(''),
                 thursday: new FormControl(''),
                 friday: new FormControl(''),
                 saturday: new FormControl('')
             });
     this.myFormVehiclePolicy.addControl("selectedWeekDays",swd);

  }
}
selectWeekDays(e)
  {
    setTimeout(function(){

    this.checkSelectedDays();
    }.bind(this),100);
  }
checkSelectedDays()
  {

    let formData = this.myFormVehiclePolicy.value;
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

      this.selectedWeeks=weeks;
      if(weeks.length<=0)
      {
        this.step1Validition=false;

      }

      else
      {

       let  pn = this.myFormVehiclePolicy.controls["policyName"].value;
      if((String(pn)!="null")&&(String(pn)!="")
      &&(String(this.mStartHours)!="null")&&(String(this.mStartHours)!="")
      &&(String(this.mEndHours)!="null")&&(String(this.mEndHours)!="")
      &&(String(this.eStartHours)!="null")&&(String(this.eStartHours)!="")
      &&(String(this.eEndHours)!="null")&&(String(this.eEndHours)!="")
     )
      {
        this.step1Validition=true;
      }
      else
        this.step1Validition=false;
      }
  }



selectPolicy(e){

      let  pn = this.myFormVehiclePolicy.controls["policyName"].value;
      if((String(pn)!="null")&&(String(pn)!="")
      &&(String(this.mStartHours)!="null")&&(String(this.mStartHours)!="")
      &&(String(this.mEndHours)!="null")&&(String(this.mEndHours)!="")
      &&(String(this.eStartHours)!="null")&&(String(this.eStartHours)!="")
      &&(String(this.eEndHours)!="null")&&(String(this.eEndHours)!="")
     )
      {
        this.step1Validition=true;
      }
      else
        this.step1Validition=false;
      }


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


       this.myFormVehiclePolicy = this._fb.group({
            policyName: ['', [Validators.required]],
            scheduleType: ['Daily', [Validators.required]],
            mStartTime: ['', []],
            mEndTime: ['', []],
            eStartTime: ['', []],
            eEndTime: ['', []],

        });

        //this.setScheduleControl();///Form 3

        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {

      console.log('this.data.mStartTimeeeee:  '+ this.data.mStartTime);
      console.log('this.data.mEndTimeeeee:  '+ this.data.mEndTime);
      console.log('this.data.eStartTimeeeee:  '+ this.data.eStartTime);
      console.log('this.data.eEndTimeeee:  '+ this.data.eEndTime);

        let mST = this.myFormVehiclePolicy.controls['mStartTime'];
            mST.setValue(new Date(this.data.mStartTime));
            this.mStartTimeValue = String(this.getFullDateForTime(this.data.mStartTime));

        let mET = this.myFormVehiclePolicy.controls['mEndTime'];
            mET.setValue(new Date(this.data.mEndTime));
            this.mEndTimeValue = String(this.getFullDateForTime(this.data.mEndTime));

        let eST = this.myFormVehiclePolicy.controls['eStartTime'];
            eST.setValue(new Date(this.data.eStartTime));
            this.eStartTimeValue = String(this.getFullDateForTime(this.data.eStartTime));

        let eET = this.myFormVehiclePolicy.controls['eEndTime'];
            eET.setValue(new Date(this.data.eEndTime));
            this.eEndTimeValue = String(this.getFullDateForTime(this.data.eEndTime));

     (<FormControl>this.myFormVehiclePolicy.controls['policyName'])
              .setValue(this.data.policyName, { onlySelf: true });

       (<FormControl>this.myFormVehiclePolicy.controls['scheduleType'])
              .setValue(this.data.scheduleType, { onlySelf: true });

          this.scheduleStatus = this.data.scheduleType;

           this.setScheduleControl();

          if(this.scheduleStatus=="SelectedDays")
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

           (<FormGroup>this.myFormVehiclePolicy.controls["selectedWeekDays"])
             .setValue(temp, { onlySelf: true });

          }
        }
    }

 getFullDateForTime(time:string)
  {
    console.log('eeeer '+time);
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




    		ngAfterViewInit		(){
      }

    subcribeToFormChanges() {

     this.myFormVehiclePolicy.statusChanges.subscribe(x =>{
        //console.log(x);
    /*      if((String(x)=="VALID")||(String(x)=="valid"))

          this.step1Validition=true;

          else
            this.step1Validition=false;*/
         });

         }
  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step
    console.log(this.myFormVehiclePolicy.value);

   let myFormVehiclePolicyData= this.myFormVehiclePolicy.value;
   let vehiclePolicyProfile={};

   vehiclePolicyProfile['mStartTime']=myFormVehiclePolicyData.mStartTime;
   vehiclePolicyProfile['mEndTime']=myFormVehiclePolicyData.mEndTime;
   vehiclePolicyProfile['eStartTime']=myFormVehiclePolicyData.eStartTime;
   vehiclePolicyProfile['eEndTime']=myFormVehiclePolicyData.eEndTime;
   vehiclePolicyProfile['policyName']=myFormVehiclePolicyData.policyName;

 let SelectedDaysType = myFormVehiclePolicyData.scheduleType;
   if(SelectedDaysType=="Daily")
   {
        vehiclePolicyProfile['scheduleType']=SelectedDaysType;
   }
   else
   {
        vehiclePolicyProfile['scheduleType']=SelectedDaysType;
        vehiclePolicyProfile['selectedWeekDays']=this.selectedWeeks;
   }

    let finalData = jQuery.extend(vehiclePolicyProfile,{"date":new Date().toISOString()});
   console.log('finalData');
    console.log(finalData);

  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  console.log('before RPC call');
  this.clientRpc.orgRPCCall(op,"orgManagerBusPolicyMethod",finalData)
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
            log.storeSuccessNotification("In Vehicle Policy "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Vehicle Policy "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Vehicle Policy "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
