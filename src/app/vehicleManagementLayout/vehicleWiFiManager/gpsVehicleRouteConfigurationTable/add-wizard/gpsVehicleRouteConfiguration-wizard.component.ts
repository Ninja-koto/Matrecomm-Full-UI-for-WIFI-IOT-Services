import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'gpsVehicleRouteConfiguration-add-wizard',
  templateUrl: './gpsVehicleRouteConfiguration-wizard.component.html',
  styleUrls: ['./gpsVehicleRouteConfiguration-wizard.component.css'],
  providers:[RPCService]
})
export class GPSVehicleRouteConfigurationAddWizardComponent implements OnInit {

      public myFormGPSVehicleRoute: FormGroup;
      public myFormBoarding: FormGroup;

    public submitted: boolean;
    public events: any[] = [];

  step1Validition:boolean=false;
  step2Validition:boolean=false;





public busRegNumbers = ['123'];
public speedLimits = ['20','30','40','50','60','70','80','90','100'];

public busPolicyNames = ['avc'];
public portalPolicyNames = ['avc'];
public billingPolicyNames = ['avc'];

layoutfr :FileReader;
disableImageLayoutLoadButton:boolean=true;
  imageLayoutStr:any;
imageLayoutURL:string;
showImageLayout:boolean=false;
timeRangeValid=false;

showIPTableErrorMsg:string = "none";
addIPAddressStatus:String="Disable";
ipAddress:FormControl;
ipAddressSelectedRowsForDeletion=[];
allIPAddressProfiles:any[]=[];
//countriesData:any;

startTimeValue:string="";
 endTimeValue:string="";
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

boardingSelectedRowsForDeletion=[];
allBoardingProfiles:any[]=[];



  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;


 public countries=[];

    constructor(private _fb: FormBuilder,private storage:SessionStorageService, private clientRpc: RPCService, private http:Http) {

     }


startAndEndTimeChanged(e,origin:string)
  {
    this.step1Validition=false;
      console.log("In startAndEndTimeChanged");
      console.log(e);
      let st = this.myFormGPSVehicleRoute.controls["startTime"].value;
      let et = this.myFormGPSVehicleRoute.controls["endTime"].value;
      let busreg = this.myFormGPSVehicleRoute.controls["busRegNumber"].value;
      let busroute = this.myFormGPSVehicleRoute.controls["routeNumber"].value;


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
            this.myFormGPSVehicleRoute.controls["startTime"].setValue("");
            this.startTimeValue="";
            this.showTimeErrorMsg="block";
            this.timeErrMsg="Please select Start time Smaller End Time";
          }
          else if(origin=="fromEnd")
          {
            console.log("Please select End time Greater..");
            this.myFormGPSVehicleRoute.controls["endTime"].setValue("");
            this.endTimeValue="";
            this.showTimeErrorMsg="block";
            this.timeErrMsg="Please select End time greaterthan Start Time";
          }
        }
        else
        {
            this.showTimeErrorMsg="none";
            this.timeErrMsg="";
        }

      }
      st = this.myFormGPSVehicleRoute.controls["startTime"].value;
      et = this.myFormGPSVehicleRoute.controls["endTime"].value;
      if((String(st)!="null")&&(String(st)!="")
      &&(String(et)!="null")&&(String(et)!=""))
        this.timeRangeValid=true;
      if((String(st)!="null")&&(String(st)!="")
      &&(String(et)!="null")&&(String(et)!="")
      &&(String(busreg)!="null")&&(String(busreg)!="")
      &&(String(busroute)!="null")&&(String(busroute)!="")
     )
      {
        this.step1Validition=true;
      }
      else
        this.step1Validition=false;
        console.log(this.myFormGPSVehicleRoute.value);
  }


changeFunction(e,origin){
console.log("fssfsdf");
console.log(e);
console.log('originbbb'+origin);

      let st = this.myFormGPSVehicleRoute.controls["startTime"].value;
      let et = this.myFormGPSVehicleRoute.controls["endTime"].value;
      let busreg = this.myFormGPSVehicleRoute.controls["busRegNumber"].value;
      let busroute = this.myFormGPSVehicleRoute.controls["routeNumber"].value;


         if(String(origin)=="fromBusReg")
          {
            busreg=e.target.value;
            console.log('busReg:'+busreg);
          }
        else if(String(origin)=="fromRouteNum")
          {
            busroute=e.target.value;
            console.log('fromRouteNum:'+busroute);
          }

            console.log(busreg);
            console.log(busroute);
            console.log(st);
            console.log(et);

      if((String(st)!="null")&&(String(st)!="")
      &&(String(et)!="null")&&(String(et)!="")
      &&(String(busreg)!="null")&&(String(busreg)!="")
      &&(String(busroute)!="null")&&(String(busroute)!=""))
      {
        this.step1Validition=true;
      }
      else
        this.step1Validition=false;

}




boardingAddProfiles(e){
  e.preventDefault();
//  console.log(e)
  this.addBoardingStatus=e.target.value;
 // console.log(this.addwlanIntStatus);

    if(!this.myFormBoarding.contains("boardingPointName"))
        {
          this.boardingPointName= new FormControl([],[]);
          this.myFormBoarding.addControl("boardingPointName",this.boardingPointName);
        }
             if(!this.myFormBoarding.contains("pickupTime"))
        {
          this.pickupTime= new FormControl([],[]);
          this.myFormBoarding.addControl("pickupTime",this.pickupTime);
        }
             if(!this.myFormBoarding.contains("dropTime"))
        {
          this.dropTime= new FormControl([],[]);
          this.myFormBoarding.addControl("dropTime",this.dropTime);
        }
        if(!this.myFormBoarding.contains("address"))
        {
          this.address= new FormControl([],[]);
          this.myFormBoarding.addControl("address",this.address);
        }
}

cancelBoardingProfiles(e){
  e.preventDefault();
 // console.log(e)
  this.addBoardingStatus=e.target.value;

    if(this.myFormBoarding.contains("boardingPointName"))
        this.myFormBoarding.removeControl("boardingPointName");
  if(this.myFormBoarding.contains("pickupTime"))
  {
        this.myFormBoarding.controls["pickupTime"].setValue("");
        this.myFormBoarding.removeControl("pickupTime");
        this.pickupTimeValue="";
  }
  if(this.myFormBoarding.contains("dropTime"))
   {
         this.myFormBoarding.controls["dropTime"].setValue("");
          this.myFormBoarding.removeControl("dropTime");
          this.dropTimeValue="";
   }
if(this.myFormBoarding.contains("address"))
        this.myFormBoarding.removeControl("address");

}
scheduleChanged(e)
  {
    if(String(e)!="")
    console.log('e');

   //   this.step2Validition=true;
  }

submitBoardingProfiles(e)
{
//  console.log(e);
  e.preventDefault();
  let name = this.myFormBoarding.controls.boardingPointName.value;
  let pickup = this.myFormBoarding.controls.pickupTime.value;
   let drop = this.myFormBoarding.controls.dropTime.value;
  let address = this.myFormBoarding.controls.address.value;

  if((name.length>0)&&(pickup.length>0)&&(drop.length>0)&&(String(address).length>0))
  {
    this.showBoardingTableErrorMsg="none";

    if((this.myFormBoarding.controls.boardingPointName.errors==null)
    &&(this.myFormBoarding.controls.pickupTime.errors==null)&&
    (this.myFormBoarding.controls.dropTime.errors==null)&&
    (this.myFormBoarding.controls.address.errors==null))
    {
    this.allBoardingProfiles.push({ "boardingPointName" : this.myFormBoarding.controls.boardingPointName.value,
                  "id":  new Date().getTime(),
              "pickupTime" : this.myFormBoarding.controls.pickupTime.value,
            "dropTime" : this.myFormBoarding.controls.dropTime.value,
            "address" : this.myFormBoarding.controls.address.value,
          });
    }
    console.log(this.allBoardingProfiles);
    this.myFormBoarding.controls.boardingPointName.setValue([]);
    this.myFormBoarding.controls.pickupTime.setValue([]);
    this.myFormBoarding.controls.dropTime.setValue([]);
    this.myFormBoarding.controls.address.setValue([]);
 this.addBoardingStatus="Disable";
  }
  else
  {
    this.showBoardingTableErrorMsg="block";
  }
  if(this.allBoardingProfiles.length>0)
    this.step2Validition=true;
}

 maintainBoardingSelectedData(e,val)
{
//  console.log(e.target.checked);
//    console.log(val);
  if(e.target.checked)
  {
    if(this.boardingSelectedRowsForDeletion.findIndex(ele => ele.id==val.id)<0)
      this.boardingSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.boardingSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.boardingSelectedRowsForDeletion.splice(index,1);
  }
}

deleteBoardingSelectedProfiles(e)
{
  e.preventDefault();
 console.log("lanIntSelectedRowsForDeletion");
 console.log(this.boardingSelectedRowsForDeletion);
    this.boardingSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allBoardingProfiles.findIndex(val => val.id==ele.id);
    this.allBoardingProfiles.splice(index,1);
  })
  this.boardingSelectedRowsForDeletion=[];

  if(this.boardingSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }
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

       this.myFormGPSVehicleRoute = this._fb.group({
            routeNumber: ['', [Validators.required]],
            busRegNumber: ['', [Validators.required]],
            startTime: ['', []],
            endTime: ['', []]
          });

         this.myFormBoarding = this._fb.group({

          });

        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {

            var temp={
              address: this.data.address,
              continent: this.data.continent,
              country:this.data.country,
              city: this.data.city,
              email: this.data.email,
              officePhone: this.data.officePhone,
              mobilePhone:this.data.mobilePhone
            };

           var temp2={
              busRegNumber: this.data.busRegNumber,
              busRouteNumber: this.data.busRouteNumber,
              accessPointMac:this.data.accessPointMac,
              ssid: this.data.ssid
            };
/*
           (<FormGroup>this.myFormAddress)
             .setValue(temp, { onlySelf: true });
          this.addCountriesToSelect(this.data.continent);
          this.step1Validition=true;
             (<FormGroup>this.myFormVehicleDetails)
             .setValue(temp2, { onlySelf: true });
                 this.step2Validition=true;
        */
        }
    }
    		ngAfterViewInit		(){
      }



    subcribeToFormChanges() {
     /*
     this.myFormGPSVehicleRoute.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))

          this.step1Validition=true;

          else
            this.step1Validition=false;
         });

    */
    this.myFormBoarding.statusChanges.subscribe(x =>{
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

    console.log(this.myFormGPSVehicleRoute.value);

    let finalData = jQuery.extend(this.myFormGPSVehicleRoute.value,{"date":new Date().toISOString()});
   console.log('finalData');
    console.log(finalData);

  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }/*
  this.clientRpc.orgRPCCall(op,"orgManagerAdminMethod",finalData)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        if(res.result.status=="Success")
        {
          console.log("Trigger reload Event....");
        }
        else
        {
          console.log("Do Nothing....");
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);*/
  }
}
