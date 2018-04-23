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
  selector: 'loginPortalPolicy-add-wizard',
  templateUrl: './loginPortalPolicy-wizard.component.html',
  styleUrls: ['./loginPortalPolicy-wizard.component.scss'],
  providers:[RPCService]
})

export class LoginPortalPolicyAddWizardComponent implements OnInit {  
    public myFormLoginDetails: FormGroup;
    public myFormLoginOptions: FormGroup;
    
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  step2Validition:boolean=false;
 
  logofr :FileReader;
  termsfr :FileReader;

disableImageLogoLoadButton:boolean=true;
  imageLogoStr:any;
imageLogoURL:string;
showImageLogo:boolean=false; 

disableTermsLoadButton:boolean=true;
  termsStr:any;
  termsStrTxt:string;

showTerms:boolean=false; 
imageFile:any;

   public loginMethods = [
    { value: '', display: 'Select One' },
    //{ value: 'UserName/Password', display: 'UserName/Password' },
    { value: 'UserName/Password + SMS OTP', display: 'UserName/Password + SMS OTP' },
    { value: 'UserName + SMS OTP', display: 'UserName + SMS OTP' }
  ]
  
  disableLoadButton:boolean=true;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

 public countries=[];

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {
 
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
        this.myFormLoginDetails = this._fb.group({
              portalName: ['', [Validators.required]],
              logoImage: ['', []],
              loginMethod: ['', [Validators.required]],
              userMacAuthentication: ['', []],
              authenticateUserBasedOnAP: ['', []],
              termsAndConditions: ['', []],   
        });
      
       this.myFormLoginOptions = this._fb.group({
              landingURL: ['', [Validators.required]],
              otpValidPeriod: ['', []],
              quitePeriod: ['', []],
              userIdLength: ['', []],
              allowUserToRegisterFromPortal: ['', []],
              allowAuthorisedUsersOnlyToRegistration: ['', []],
        });
      

        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {
          
        }
        if(this.operation=="Modify")
        {

         this.imageLogoURL = this.data.logoImage;     
         this.termsStr =this.data.termsAndConditions;
         this.showImageLogo=true;
         this.showTerms=true;

         (<FormControl> this.myFormLoginDetails.controls["portalName"])
             .setValue(this.data.portalName, { onlySelf: true });
        (<FormControl> this.myFormLoginDetails.controls["loginMethod"])
             .setValue(this.data.loginMethod, { onlySelf: true });
        (<FormControl> this.myFormLoginDetails.controls["userMacAuthentication"])
             .setValue(this.data.userMacAuthentication, { onlySelf: true });
        (<FormControl> this.myFormLoginDetails.controls["authenticateUserBasedOnAP"])
             .setValue(this.data.authenticateUserBasedOnAP, { onlySelf: true });

            var temp={
              landingURL: this.data.landingURL,
              otpValidPeriod: this.data.otpValidPeriod,
              quitePeriod: this.data.quitePeriod,
              userIdLength: this.data.userIdLength,
              allowUserToRegisterFromPortal: this.data.allowUserToRegisterFromPortal,
              allowAuthorisedUsersOnlyToRegistration: this.data.allowAuthorisedUsersOnlyToRegistration,
            
            };
            console.log("temp");
            console.log(temp);
 
           (<FormGroup>this.myFormLoginOptions)
             .setValue(temp, { onlySelf: true });
      
           this.step1Validition=true;
          this.step2Validition=true;
         
        }
    }
    		ngAfterViewInit		(){
      }

 

  imageLogoProcessFile(e){
    this.imageLogoStr="";
    this.imageLogoURL="";
    this.imageLogoStr =String(e.target.result);
    this.imageLogoURL = this.imageLogoStr
    console.log('cccccc//ccc');
    console.log(this.imageLogoStr);
  }
  onImageLogoChange(e){
      //    console.log(e);
 
    try{
      var file=e.target.files[0];
   //  this.imageFile=e.target.files[0];
      this.logofr = new FileReader();
      this.logofr.onload = this.imageLogoProcessFile.bind(this);
      this.disableImageLogoLoadButton=false;
      this.logofr.readAsDataURL(file);
            
    }
    catch(e)
    {
      //THIS EXCEPTION COMES WHEN USER DO NOT SELECT ANY FILE (CANCEL SELECTION)
      console.log("On File Change Error...");
      this.disableImageLogoLoadButton=true;//DISABLING LOAD BUTTON ON FILE CHANGE FAILURE
   //   console.log(e);
    }
  }
 termsProcessFile(e){
   this.termsStr=String(e.target.result);
    this.termsStrTxt =this.termsStr;

    console.log('this.termsStrTxt');
    console.log(this.termsStr);
        console.log(this.termsStrTxt);

  }
 onFileChange(e){
          console.log(e);
    try{
      var file=e.target.files[0];
      this.termsfr = new FileReader();
      this.termsfr.onload = this.termsProcessFile.bind(this);
      this.disableTermsLoadButton=false;
      this.termsfr.readAsText(file);
            
    }
    catch(e)
    {
      //THIS EXCEPTION COMES WHEN USER DO NOT SELECT ANY FILE (CANCEL SELECTION)
      console.log("On File Change Error...");
    //  this.myFormLoginDetails.controls.termsAndConditions.setErrors({"selectTextFile":true});
       //     this.clearSelectedFileContent();

      this.disableTermsLoadButton=true;//DISABLING LOAD BUTTON ON FILE CHANGE FAILURE
   //   console.log(e);
    }
  }
/*  clearSelectedFileContent(){
    this.disableTermsLoadButton=false; //TODISABLE LOAD BUTTON
    this.termsStrTxt="";
  }*/
logoLoadInitiated(e)
  {
    e.preventDefault();
    //console.log("Load Initiated...");
        this.disableImageLogoLoadButton=true;    
        this.showImageLogo=true;
   
  }
closeImage(e){
console.log('fdddffdf....')
console.log(e)
this.showImageLogo=false;
         $('#fileSelect').val("");
         $('#imageUrl').attr("src","");
this.imageLogoStr="";
this.imageLogoURL="";
}
termsLoadInitiated(e)
  {
    e.preventDefault();
    //console.log("Load Initiated...");
        this.disableTermsLoadButton=true;    
        this.showTerms=true;
   
  }
closeTermsImage(e){
console.log(e)
this.showTerms=false;
        $('#termsAndConditions').val("");
        $('#tcDiv').val("");
this.termsStrTxt="";
this.termsStr="";
}
    subcribeToFormChanges() {
      this.myFormLoginDetails.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
           this.myFormLoginOptions.statusChanges.subscribe(x =>{
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
    
  //  console.log(this.myFormLoginDetails.value);
let myFormLoginData=this.myFormLoginDetails.value;
var myFormLoginDataProfile={};

     myFormLoginDataProfile["portalName"]=myFormLoginData.portalName;
     myFormLoginDataProfile["logoImage"]=this.imageLogoURL;
     myFormLoginDataProfile["loginMethod"]=myFormLoginData.loginMethod;
     myFormLoginDataProfile["userMacAuthentication"]=myFormLoginData.userMacAuthentication;
     myFormLoginDataProfile["authenticateUserBasedOnAP"]=myFormLoginData.authenticateUserBasedOnAP;
     myFormLoginDataProfile["termsAndConditions"]=this.termsStrTxt;

    let finalData = jQuery.extend(myFormLoginDataProfile,this.myFormLoginOptions.value,{"date":new Date().toISOString()});
 console.log("finalData");
 console.log(finalData);
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
     console.log(" update finalData");
     console.log(finalData);
  }
 
  this.clientRpc.orgRPCCall(op,"ccpLoginDetailsMethod",finalData)
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
            log.storeSuccessNotification("In Login Portal Policy "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Login Portal Policy "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Login Portal Policy "+this.operation+" Failed");
          }
        }
      });
      
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
   // this.myFormBasic.reset();
  }
}
