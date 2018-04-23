import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";

@Component({
  selector: 'eventManagement-add-wizard',
  templateUrl: './eventManagement-wizard.component.html',
  styleUrls: ['./eventManagement-wizard.component.scss'],
  providers:[RPCService]
})

export class EventManagementAddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public myFormContact: FormGroup;
    public myFormAPDetails: FormGroup;
    public myFormBandwidth: FormGroup;
    public myFormUrlSettings: FormGroup;  

    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  //step1Validition:boolean=true;

  //step2Validition:boolean=false;
  step2Validition:boolean=true;
  step3Validition:boolean=true;
  step4Validition:boolean=true;
   step5Validition:boolean=true;

startTimeValue:string="";
endTimeValue:string="";

macSelectStatus:boolean=false;

apMAC:FormControl;
showMACTableErrorMsg:string = "none";
macSelectedRowsForDeletion=[];
allMACProfiles:any[]=[];

  selectBandwidth:string="Unlimited";
  selectDailyBandwidth:string;

DailyBandWidth:FormControl;
deviceBandwidth:FormControl;
perUserBandwidth:FormControl;


addUrlStatus:String="Disable";
urlSelectedRowsForDeletion=[];



 public portalPolicyNames= ['avc'];
 public billingPolicyNames= ['bbv'];
showUrlTableErrorMsg:string = "none";
allUrlProfiles:any[]=[];


  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {
 
     }

 startAndEndTimeChanged(e,origin:string)
  {
    this.step1Validition=false;
      console.log("In startAndEndTimeChanged");
      console.log(e);
      let st = this.myForm.controls["startTime"].value;
      let et = this.myForm.controls["endTime"].value;
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
            this.myForm.controls["startTime"].setValue("");
            this.startTimeValue="";
            this.myForm.controls["startTime"].setErrors({"stSTet":true});
          }
          else if(origin=="fromEnd")
          {
            console.log("Please select End time Greater..");
            this.myForm.controls["endTime"].setValue("");
            this.endTimeValue="";
            this.myForm.controls["endTime"].setErrors({"etGTst":true});
          }
        }
        
      }
      st = this.myForm.controls["startTime"].value;
      et = this.myForm.controls["endTime"].value;
      if((String(st)!="null")&&(String(st)!="")&&(String(et)!="null")&&(String(et)!=""))
      {
        this.step1Validition=true;
      }
  }

 selectActionEventType(e)
{
    console.log("in selectActionEventType");
    console.log(e.target.id)
    let sessionAct=false;
    let macAct=false;
    
    if(String(e.target.id)=="allowSingleSessionPerUser")
    {
      sessionAct=e.target.checked;
      macAct=this.myFormAPDetails.controls.enableMacAddressAuth.value;
    }
    else if(String(e.target.id)=="enableMacAddressAuth")
    {
      this.macSelectStatus=e.target.checked;
      macAct=e.target.checked;
      sessionAct=this.myFormAPDetails.controls.allowSingleSessionPerUser.value; 

    }
    
    if(sessionAct||macAct)
      this.step3Validition=true;
    else
      this.step3Validition=false; 
      this.add_removeMACFormControls();

}

addMACProfiles(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();
  let mac = this.myFormAPDetails.controls.apMAC.value;
  console.log(mac);
  if(mac.length>0)
  {
    this.showMACTableErrorMsg="none";
 console.log('myFormAPDetails.controls.apMAC');
 console.log(this.myFormAPDetails.controls.apMAC.errors);
 if(this.myFormAPDetails.controls.apMAC.errors==null){
    this.allMACProfiles.push({ "apMAC" : this.myFormAPDetails.controls.apMAC.value, 
                  "id":  new Date().getTime(), 
                });
    console.log("All apMAC Profiles...");
    console.log(this.allMACProfiles);
    this.myFormAPDetails.controls.apMAC.setValue([]);
  }
  }
  else
  {
    ///show error msg
    this.showMACTableErrorMsg="block";
  }
  if(this.allMACProfiles.length>0)
    this.step3Validition=true;
}


addURLProfiles(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();
  let url = this.myFormUrlSettings.controls.referrerURL.value;
  console.log(url);
  if(url.length>0)
  {
    this.showUrlTableErrorMsg="none";
 console.log('myFormUrlSettings.controls.referrerURL');
 console.log(this.myFormUrlSettings.controls.referrerURL.errors);
 if(this.myFormUrlSettings.controls.referrerURL.errors==null){
    this.allUrlProfiles.push({ "referrerURL" : this.myFormUrlSettings.controls.referrerURL.value, 
                  "id":  new Date().getTime(), 
                });
    console.log("All referrerURL Profiles...");
    console.log(this.addURLProfiles);
    this.myFormUrlSettings.controls.referrerURL.setValue([]);
  }
  }
  else
  {
    ///show error msg
    this.showUrlTableErrorMsg="block";
  }
  if(this.allUrlProfiles.length>0)
    this.step5Validition=true;
}


maintainMACSelectedData(e,val)
{
  console.log("In maintainMACSelectedData");
  console.log(e.target.checked);
    console.log(val);
  if(e.target.checked)
  {
    if(this.macSelectedRowsForDeletion.findIndex(ele => ele.id==val.id)<0)
      this.macSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.macSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.macSelectedRowsForDeletion.splice(index,1);
  }
  console.log("All selected...");
  console.log(this.macSelectedRowsForDeletion);
}
deleteMACSelectedProfiles(e)
{
  e.preventDefault();
  console.log("Before Delete All Profiles");
  console.log(this.allMACProfiles);
  this.macSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allMACProfiles.findIndex(val => val.id==ele.id);
    this.allMACProfiles.splice(index,1);
  })
  console.log("After Delete All  MAC Profiles");
  console.log(this.allMACProfiles);
  if(this.allMACProfiles.length<=0)
  {
    this.step3Validition=false;
    e.target.disabled=true;
  }
}  

 add_removeMACFormControls()
 {
    if(this.macSelectStatus==false)
    {
      this.showMACTableErrorMsg="none";
      if(this.myFormAPDetails.contains("apMAC"))
        this.myFormAPDetails.removeControl("apMAC");
    }
    else if(this.macSelectStatus==true)
    {
      console.log("in apMAC");
      this.step3Validition=false;
      if(!this.myFormAPDetails.contains("apMAC"))
        {
          this.apMAC= new FormControl([],[CustomValidator.macAddressValidation]);
          this.myFormAPDetails.addControl("apMAC",this.apMAC);
        }

    }
    console.log(this.macSelectStatus)
  }
selectBandwidthType(event)
{
    console.log("selectBandwidthType...");
  console.log(event.target.value);
  this.selectBandwidth=event.target.value; 
   this.add_removeBandwidthFormControls();
}
selectDailyBandwidthType(event)
{
    console.log("selectDailyBandwidthType...");
  console.log(event.target.value);
  this.selectDailyBandwidth=event.target.value; 
  this.add_removeDailyBandwidthFormControls();
}
add_removeBandwidthFormControls()
 {
    if(String(this.selectBandwidth)=="Unlimited")
    {
      if(this.myFormBandwidth.contains("DailyBandWidth"))
        this.myFormBandwidth.removeControl("DailyBandWidth");
  
        if(String(this.selectDailyBandwidth)=="DeviceBandwidth")
        {
        if(this.myFormBandwidth.contains("deviceBandwidth"))
        this.myFormBandwidth.removeControl("deviceBandwidth");
       }
        else if(String(this.selectDailyBandwidth)=="perUserBandwidth")
        {
        if(this.myFormBandwidth.contains("perUserBandwidth"))
        this.myFormBandwidth.removeControl("perUserBandwidth");
       }
       
      this.selectDailyBandwidth="";
      this.step4Validition=true;

    }
    else if(String(this.selectBandwidth)=="DailyLimit")
    {
      console.log("in selectBandwidth");
      this.step4Validition=false;

      if(!this.myFormBandwidth.contains("DailyBandWidth"))
        {
          this.DailyBandWidth= new FormControl([],[]);
          this.myFormBandwidth.addControl("DailyBandWidth",this.DailyBandWidth);
        }
    }
    console.log('this.selectBandwidth')   
    console.log(this.selectBandwidth)
   //  this.step4Validition=true;
  }

add_removeDailyBandwidthFormControls()
 {
    if(String(this.selectDailyBandwidth)=="DeviceBandwidth")
    {   
      if(this.myFormBandwidth.contains("perUserBandwidth"))
        this.myFormBandwidth.removeControl("perUserBandwidth");
      if(!this.myFormBandwidth.contains("deviceBandwidth"))
        {
          this.deviceBandwidth= new FormControl([],[Validators.required]);
          this.myFormBandwidth.addControl("deviceBandwidth",this.deviceBandwidth);
        }
    }
    else if(String(this.selectDailyBandwidth)=="PerUserBandwidth")
    {
     if(this.myFormBandwidth.contains("deviceBandwidth"))
        this.myFormBandwidth.removeControl("deviceBandwidth");

      if(!this.myFormBandwidth.contains("perUserBandwidth"))
        {
          this.perUserBandwidth= new FormControl([],[Validators.required]);
          this.myFormBandwidth.addControl("perUserBandwidth",this.perUserBandwidth);
        }

    }
    console.log('this.selectBandwidth')   
    console.log(this.selectBandwidth)
    this.step4Validition=true;

  }

maintainUrlSelectedData(e,val)
{
  console.log(e.target.checked);
    console.log(val);
  if(e.target.checked)
  {
    if(this.urlSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.urlSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.urlSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.urlSelectedRowsForDeletion.splice(index,1);
  }
//  console.log(this.urlSelectedRowsForDeletion);
}

deleteUrlSelectedProfiles(e)
{
  e.preventDefault();
 // console.log(this.allRadioProfiles);
   this.urlSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allUrlProfiles.findIndex(val => val.id==ele.id);
    this.allUrlProfiles.splice(index,1);
  })
  this.urlSelectedRowsForDeletion=[];
  if(this.urlSelectedRowsForDeletion.length<=0)
  {
//    this.step3Validition=false;
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
  
        this.myForm = this._fb.group({
            eventName: ['', [Validators.required]],
            ssidName: ['', [Validators.required]],
            startTime:['',[Validators.required]],
            endTime:['',[Validators.required]],
            address: ['', [Validators.required]],      
          });
          
        this.myFormContact = this._fb.group({
            clientName: ['', [Validators.required]],      
            email: ['', [Validators.required,CustomValidator.isValidMailFormat]],
            mobile: ['', [Validators.required,Validators.maxLength(10),CustomValidator.mobileNumberValidation]],
            clientAddress: ['', [Validators.required]],      
    
          });
            this.myFormAPDetails = this._fb.group({
            userSessionTimeLimit: ['', []],
             allowSingleSessionPerUser: ['', []],
            enableMacAddressAuth: ['', []],
           
          });    
             this.myFormBandwidth = this._fb.group({
            BandwidthDetails: ['Unlimited', []],
        

          });       
            this.myFormUrlSettings = this._fb.group({        
            portalPolicyName: ['', []],
            billingPolicyName: ['', []],
            domainName: ['', []],
            referrerURL: ['', []],

            });                
         

        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {
          
        }
        if(this.operation=="Modify")
        {
          (<FormControl> this.myForm.controls["eventName"])
             .setValue(this.data.eventName, { onlySelf: true });
          (<FormControl> this.myForm.controls["ssidName"])
             .setValue(this.data.ssidName, { onlySelf: true });
          (<FormControl> this.myForm.controls["address"])
             .setValue(this.data.address, { onlySelf: true });
            (<FormControl> this.myForm.controls["startTime"])
            .setValue(String(new Date(this.data.startTime)));
            this.startTimeValue =String(new Date(this.data.startTime));
            (<FormControl>this.myForm.controls["endTime"])
            .setValue(String(new Date(this.data.endTime)));       
            this.endTimeValue =String(new Date(this.data.endTime));

           this.step1Validition=true;     
           var temp2={
              clientName: this.data.clientName,
              email: this.data.email,
              mobile:this.data.mobile,           
              clientAddress: this.data.clientAddress,             
            };       
        (<FormGroup>this.myFormContact)
             .setValue(temp2, { onlySelf: true });
 this.step2Validition=true;
   
          (<FormControl> this.myFormAPDetails.controls["userSessionTimeLimit"])
             .setValue(this.data.userSessionTimeLimit, { onlySelf: true });
          (<FormControl> this.myFormAPDetails.controls["allowSingleSessionPerUser"])
             .setValue(this.data.allowSingleSessionPerUser, { onlySelf: true });
          (<FormControl> this.myFormAPDetails.controls["enableMacAddressAuth"])
             .setValue(this.data.enableMacAddressAuth, { onlySelf: true });

    
    let enableMac =this.data.enableMacAddressAuth;
      console.log('enableMac');
       console.log('enableMac'+enableMac);
    //  this.add_removeMACFormControls();

      if(enableMac=true)
      {
           this.macSelectStatus=true;
           this.add_removeMACFormControls();
           this.macSelectStatus=true;
           console.log('avddvd');

           this.allMACProfiles = this.data.allMACProfiles;
    }
    else 
    {
       console.log('eeeeeeeeee');
    }
 this.step3Validition=true;
 
 let bandwidthType =this.data.bandwidthDetails;
           console.log('bandwidthType'+bandwidthType);
           if(bandwidthType=='Unlimited')
           {
            this.add_removeBandwidthFormControls();
             (<FormControl> this.myFormBandwidth.controls["BandwidthDetails"])
             .setValue(this.data.bandwidthDetails, { onlySelf: true });
     
           }
     else if(bandwidthType=='DailyLimit')
     {     
             this.selectBandwidth=bandwidthType;
             this.add_removeBandwidthFormControls();
              (<FormControl> this.myFormBandwidth.controls["BandwidthDetails"])
             .setValue(this.data.bandwidthDetails, { onlySelf: true });

                let dailyBandwidthType =this.data.dailyBandWidth;
                console.log('dailyBandwidthType'+dailyBandwidthType);

      if(dailyBandwidthType=='DeviceBandwidth')
      {
         this.selectDailyBandwidth=dailyBandwidthType;
          console.log('dailyBandwidthType'+dailyBandwidthType);
           this.add_removeDailyBandwidthFormControls();
           (<FormControl> this.myFormBandwidth.controls["DailyBandWidth"])
             .setValue(this.data.dailyBandWidth, { onlySelf: true });

              (<FormControl> this.myFormBandwidth.controls["deviceBandwidth"])
             .setValue(this.data.deviceBandwidth, { onlySelf: true });
      }
     else if(dailyBandwidthType=='PerUserBandwidth')
     {
                 console.log('dailyBandwidthfdfdfdfgdType'+dailyBandwidthType);

             this.add_removeDailyBandwidthFormControls();
             (<FormControl> this.myFormBandwidth.controls["DailyBandWidth"])
             .setValue(this.data.dailyBandWidth, { onlySelf: true });
             (<FormControl> this.myFormBandwidth.controls["perUserBandwidth"])
             .setValue(this.data.perUserBandwidth, { onlySelf: true });
     }

    }
              this.step4Validition=true;
     
            (<FormControl> this.myFormUrlSettings.controls["portalPolicyName"])
             .setValue(this.data.portalPolicyName, { onlySelf: true });

            (<FormControl> this.myFormUrlSettings.controls["billingPolicyName"])
             .setValue(this.data.billingPolicyName, { onlySelf: true });

            (<FormControl> this.myFormUrlSettings.controls["domainName"])
             .setValue(this.data.domainName, { onlySelf: true });
          
           this.allUrlProfiles=this.data.allUrlProfiles;

       
          this.step5Validition=true;
         
        }
    }
    		ngAfterViewInit		(){
      }
    subcribeToFormChanges() {
      this.myForm.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });

      this.myFormContact.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
      });
     this.myFormAPDetails.statusChanges.subscribe(x=>{
    
      });  
      this.myFormBandwidth.statusChanges.subscribe(x=>{
   
      });   
        this.myFormUrlSettings.statusChanges.subscribe(x=>{
  
      });       

     }
  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);

  let myFormApDetailsData=this.myFormAPDetails.value;
   let myFormApDetailsProfile={};
    myFormApDetailsProfile['userSessionTimeLimit']= myFormApDetailsData.userSessionTimeLimit;    
     myFormApDetailsProfile['allowSingleSessionPerUser']= myFormApDetailsData.allowSingleSessionPerUser;    
   
      myFormApDetailsProfile['enableMacAddressAuth']= myFormApDetailsData.enableMacAddressAuth;    

if(myFormApDetailsData.enableMacAddressAuth==true)
        {   
      myFormApDetailsProfile['allMACProfiles']= this.allMACProfiles;    
        }

  let myFormBandwidthData=this.myFormBandwidth.value;
  let myFormBandwidthProfile={};
 
if(myFormBandwidthData.BandwidthDetails=='DailyLimit')
        {   
       myFormBandwidthProfile['bandwidthDetails']= myFormBandwidthData.BandwidthDetails;    
         
      myFormBandwidthProfile['dailyBandWidth']= myFormBandwidthData.DailyBandWidth;   
if(myFormBandwidthData.DailyBandWidth=='DeviceBandwidth')
{
      myFormBandwidthProfile['deviceBandwidth']= myFormBandwidthData.deviceBandwidth;   
}
else if(myFormBandwidthData.DailyBandWidth=='PerUserBandwidth')
{
      myFormBandwidthProfile['perUserBandwidth']= myFormBandwidthData.perUserBandwidth;   
}
  }
else if (myFormBandwidthData.BandwidthDetails=='Unlimited')
{
       myFormBandwidthProfile['bandwidthDetails']= myFormBandwidthData.BandwidthDetails;    

}
  let myFormUrlSettingsData=this.myFormUrlSettings.value;


    let finalData = jQuery.extend(this.myForm.value,this.myFormContact.value,myFormApDetailsProfile,myFormBandwidthProfile,{"date":new Date().toISOString()});
      finalData['portalPolicyName']= myFormUrlSettingsData.portalPolicyName;     
      finalData['billingPolicyName']= myFormUrlSettingsData.billingPolicyName;  
      finalData['domainName']= myFormUrlSettingsData.domainName;    

      finalData['allUrlProfiles']= this.allUrlProfiles;    


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
  
  this.clientRpc.orgRPCCall(op,"orgManagerEventManagementMethod",finalData)
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
            log.storeSuccessNotification("In Event Management "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Event Management "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Event Management "+this.operation+" Failed");
          }
        }
      });
      
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  //  this.myForm.reset();*/
  }
}
