
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
  selector: 'UserManagement-add-wizard',
  templateUrl: './userManagement-wizard.component.html',
  styleUrls: ['./userManagement-wizard.component.scss'],
  providers:[RPCService]
})

export class UserManagementAddWizardComponent implements OnInit {
    public myFormUserManagement: FormGroup;
    public myFormUserData: FormGroup;


    public submitted: boolean;
    public events: any[] = [];

   step1Validition:boolean=false;
   step2Validition:boolean=false;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

// Labels / Parents
    nsObj: NameSpaceUtil;
    namespace:string="";


    checkOutTimeValue:string="";
    checkInTimeValue:string="";
    showTimeErrorMsg:string="none";
    timeErrMsg:string="";

    constructor(private storage:SessionStorageService,private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {

     }

     checkInAndCheckOutTimeChanged(e,origin:string)
     {
       this.step1Validition=false;
       console.log(origin)
         console.log("In startAndEndTimeChanged");
         console.log(e);
         let st = this.myFormUserManagement.controls["checkInTime"].value;
         let et = this.myFormUserManagement.controls["checkOutTime"].value;
         if(origin=="fromStart")
             st=e;
         else
           et=e;
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
               this.myFormUserManagement.controls["checkInTime"].setValue("");
               this.checkInTimeValue="";
               //this.myForm2.controls["checkInTime"].setErrors({"stSTet":true});
               this.showTimeErrorMsg="block";
               this.timeErrMsg="Please select checkIn time Smaller checkOut Time";
             }
             else if(origin=="fromEnd")
             {
               console.log("Please select End time Greater..");
               this.myFormUserManagement.controls["checkOutTime"].setValue("");
               this.checkOutTimeValue="";
               //this.myForm2.controls["checkOut"].setErrors({"etGTst":true});
               this.showTimeErrorMsg="block";
               this.timeErrMsg="Please select checkOut time greaterthan checkIn time";
             }
           }
           else
           {
               this.showTimeErrorMsg="none";
               this.timeErrMsg="";
           }

         }
         st = this.myFormUserManagement.controls["checkInTime"].value;
         et = this.myFormUserManagement.controls["checkOutTime"].value;
         if((String(st)!="null")&&(String(st)!="")&&(String(et)!="null")&&(String(et)!=""))
           this.step1Validition=true;
         else
           this.step1Validition=false;
           console.log(this.myFormUserManagement.value);
     }


    ngOnInit() {

        this.myFormUserManagement = this._fb.group({
                firstName: ['', [Validators.required]],
                lastName: ['', [Validators.required]],
                roomNumber: ['', [Validators.required]],
                mobileNumber: ['', [Validators.required,CustomValidator.mobileNumberValidation]],
                emailId: ['', [Validators.required,CustomValidator.isValidMailFormat]],
                checkInTime: ['', [Validators.required]],
                checkOutTime: ['', [Validators.required]],
                voucher: ['', [Validators.required]]
        });

        this.myFormUserData = this._fb.group({
          dataRate: ['', [Validators.required]],
          dataLimit: ['', [Validators.required]],
          durationLimit: ['', [Validators.required]]
  });


  console.log("Operation : "+this.operation);
  console.log(this.data);


  if(this.operation=="Add")
  {

  }
  if(this.operation=="Modify")
  {



       (<FormControl> this.myFormUserManagement.controls["firstName"])
       .setValue(this.data.firstName, { onlySelf: true });

       (<FormControl> this.myFormUserManagement.controls["lastName"])
       .setValue(this.data.lastName, { onlySelf: true });

       (<FormControl> this.myFormUserManagement.controls["roomNumber"])
       .setValue(this.data.roomNumber, { onlySelf: true });

       (<FormControl> this.myFormUserManagement.controls["mobileNumber"])
       .setValue(this.data.mobileNumber, { onlySelf: true });

       (<FormControl> this.myFormUserManagement.controls["emailId"])
       .setValue(this.data.emailId, { onlySelf: true });

       (<FormControl> this.myFormUserManagement.controls["voucher"])
       .setValue(this.data.voucher, { onlySelf: true });


     let ctrl = this.myFormUserManagement.controls["checkInTime"];
      //ctrl.setValue(new Date(this.data.checkInTime));
      this.checkInTimeValue = String(new Date(this.data.checkInTime));
      ctrl = this.myFormUserManagement.controls["checkOutTime"];
      //ctrl.setValue(new Date(this.data.checkOutTime));
      this.checkOutTimeValue = String(new Date(this.data.checkOutTime));

      this.step1Validition=true;

      var temp={
        dataRate: this.data.dataRate,
        dataLimit: this.data.dataLimit,
        durationLimit:this.data.durationLimit,
      };
      console.log("temp");
      console.log(temp);

   (<FormGroup>this.myFormUserData)
       .setValue(temp, { onlySelf: true });

       this.step2Validition=true;


    }


        this. subcribeToFormChanges();
    }

    subcribeToFormChanges() {
      this.myFormUserManagement.statusChanges.subscribe(x =>{
        //console.log(x);
        setTimeout(function() {
          if((String(x)=="VALID")||(String(x)=="valid"))
          this.step1Validition=true;
        else
          this.step1Validition=false;
        }, 1000);

          });

          this.myFormUserData.statusChanges.subscribe(x =>{
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
let myFormUserManagementData=this.myFormUserManagement.value;
let myFormUserDataDetails=this.myFormUserData.value;

var FinalJson = {};

FinalJson["firstName"]= myFormUserManagementData.firstName;
FinalJson["lastName"]= myFormUserManagementData.lastName;
FinalJson["roomNumber"]= myFormUserManagementData.roomNumber;
FinalJson["mobileNumber"]= myFormUserManagementData.mobileNumber;
FinalJson["emailId"]= myFormUserManagementData.emailId;
FinalJson["checkInTime"]= myFormUserManagementData.checkInTime;
FinalJson["checkOutTime"]= myFormUserManagementData.checkOutTime;
FinalJson["voucher"]= myFormUserManagementData.voucher;

FinalJson["dataRate"]= myFormUserDataDetails.dataRate;
FinalJson["dataLimit"]= myFormUserDataDetails.dataLimit;
FinalJson["durationLimit"]= myFormUserDataDetails.durationLimit;



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
 this.clientRpc.orgRPCCall(op,"orgManagerHotelUserManagementMethod",finalData)
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
            log.storeSuccessNotification("In Hotel User Management "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Hotel User Management "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Hotel User Management "+this.operation+" Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);

  }
}
