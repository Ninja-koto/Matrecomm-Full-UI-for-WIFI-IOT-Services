import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup,FormArray , FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";
import {Angular2Csv} from "../../../../commonServices/csvFileGenerator";

@Component({
  selector: 'userManagement-add-wizard',
  templateUrl: './userManagement-wizard.component.html',
  styleUrls: ['./userManagement-wizard.component.scss'],
  providers:[RPCService]
})
export class UserManagementAddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public myFormManual: FormGroup;
    public myFormCSVMode: FormGroup;

    public submitted: boolean;
    public events: any[] = [];
    step1Validition:boolean=true;
    step2Validition:boolean=false;


//countriesData:any;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() locationData:any[]=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

  authorisedUsers:any[]=[];
  manualModeSelectedRowsForDeletion:any[]=[];
  manualModeTableErrMsg:string="";

  fr :FileReader;
  disableLoadButton:boolean=true;
  fileParseErr:boolean=false;
  fileStr:string="";
  parsedFile:any={};

showManualMode:boolean=true;
showTableErrorMsg:string="none";

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {

     }

initUsers(){
  return this._fb.group({
            userName: ['', [Validators.required, Validators.minLength(5)]],
            mobileNumber: ['', [Validators.required, CustomValidator.mobileNumberValidation]]
        });
}
    ngOnInit() {

        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm = this._fb.group({
              modeType: ['manualMode', [Validators.required]],

        });
        
        this.myFormManual = this._fb.group({
                authUsers: this._fb.array([
                      this.initUsers(),
                  ])
            });
        this.myFormCSVMode = this._fb.group({
             autherizedUsersCSVFile: ['', []]
        });

        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {
            var temp={
              modeType: this.data.modeType
            };

           (<FormGroup>this.myForm)
             .setValue(temp, { onlySelf: true });         
           this.authorisedUsers = this.data.authorisedUsers;
           this.step1Validition=true;
           this.step2Validition=true;
        }
    }

modeType(event)
{
  this.authorisedUsers=[];
  this.step2Validition=false;
  if(String(event.target.value)=="manualMode")
    this.showManualMode=true;
  else
    this.showManualMode=false;
}

addAddress(e) {
  e.preventDefault();
      const control = <FormArray>this.myFormManual.controls['authUsers'];
      control.push(this.initUsers());
}

removeAddress(e,i: number) {
  e.preventDefault();
    const control = <FormArray>this.myFormManual.controls['authUsers'];
    control.removeAt(i);
}
addUsers(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();

  console.log(this.myFormManual.value);
  console.log("authorisedUsers");
  console.log(this.authorisedUsers);
  
  /*let userName = this.myFormManual.controls.userName.value;
  let mobileNumber = this.myFormManual.controls.mobileNumber.value;
  console.log(userName);
  console.log(mobileNumber);
  
  if((String(userName).length>0)&&(String(mobileNumber).length>0))
  {
    if((this.myFormManual.controls.mobileNumber.errors==null)&&(this.myFormManual.controls.userName.errors==null))
    {
   this.showTableErrorMsg="none";
    this.authorisedUsers.push({ "userName" : String(this.myFormManual.controls.userName.value), 
                  "id":  new Date().getTime(), 
              "mobileNumber" : String(this.myFormManual.controls.mobileNumber.value),
          });
    this.myFormManual.controls.userName.setValue([]);
    this.myFormManual.controls.mobileNumber.setValue([]);
  }
  else
    this.showTableErrorMsg="block";
  }
  else
  {
    //show error msg
    this.showTableErrorMsg="block";
  }
  if(this.authorisedUsers.length>0)
    this.step2Validition=true;
  else
    this.step2Validition=false;*/
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
deleteSelectedUsers(e)
{
  e.preventDefault();
  console.log("Before Delete All Profiles");
  console.log(this.authorisedUsers);
  /*this.manualModeSelectedRowsForDeletion.forEach(ele=>{
    let index = this.authorisedUsers.findIndex(val => val.id==ele.id);
    this.authorisedUsers.splice(index,1); 
})
this.manualModeSelectedRowsForDeletion=[];
  console.log("After Delete All Profiles");
  console.log(this.authorisedUsers);
  if(this.authorisedUsers.length<=0)
  {
    this.step2Validition=false;
    e.target.disabled=true;
  }*/
}

onFileChange(e){
    this.clearSelectedFileContent();
    try{
      var file=e.currentTarget.files[0];
      this.fr = new FileReader();
      this.fr.onload = this.processFile.bind(this);
      this.fr.readAsText(file);
    }
    catch(e)
    {
      //THIS EXCEPTION COMES WHEN USER DO NOT SELECT ANY FILE (CANCEL SELECTION)
      console.log("On File Change Error...");
      this.myFormCSVMode.controls.autherizedUsersCSVFile.setErrors({"selectCSVFile":true});
      this.clearSelectedFileContent();
      this.disableLoadButton=true;//DISABLING LOAD BUTTON ON FILE CHANGE FAILURE
      //console.log(e);
    }
  }
clearSelectedFileContent(){
    this.disableLoadButton=false; //TODISABLE LOAD BUTTON
    this.fileParseErr=false; //CLEAR PREVIOUS ERRORS
    this.fileStr=""; //RESETTING CONFIG  FILE CONTENT
    this.parsedFile={}; //RESETTING CONFIG FILE OBJECT
  }
processFile(e){
    this.fileStr =String(e.currentTarget.result);
    console.log("File Str");
    console.log(this.fileStr);
    try{
      var userArray=this.fileStr.split("\n");
      console.log(userArray);
      if(userArray.length>0)
      {
          let docHeader= userArray[0];
          let docHeaderColumns = docHeader.split(",");
          let userNameIndex=0,mobileNumberIndex=0;
          let acIndexFound=false,mbIndexFound=false;
          console.log(docHeaderColumns);
          if(docHeaderColumns.length>0)
          {
            for(let i=0;i<docHeaderColumns.length;i++)
            {
              if((docHeaderColumns[i].indexOf("User Name")>=0)||(docHeaderColumns[i].indexOf("UserName")>=0))
              {
                userNameIndex=i;
                acIndexFound=true;
              }
            
              else if((docHeaderColumns[i].indexOf("Mobile Number")>=0)||(docHeaderColumns[i].indexOf("MobileNumber")>=0))
              {
                mobileNumberIndex=i;
                mbIndexFound=true;
              }
            }
          }
          console.log("auth : "+userNameIndex+", MB : "+mobileNumberIndex);
          if(acIndexFound&&mbIndexFound)
          {
              this.authorisedUsers=[];
              for(let j=1;j<userArray.length;j++)
              {
                let currCols= userArray[j].split(",");
                if((String(currCols[userNameIndex])!="undefined")&&(String(currCols[userNameIndex])!="")&&
                (String(currCols[mobileNumberIndex])!="undefined")&&(String(currCols[mobileNumberIndex])!="")) 
                  this.authorisedUsers.push({
                    "userName":this.removeExtraChar(String(currCols[userNameIndex])),
                    "mobileNumber":this.removeExtraChar(String(currCols[mobileNumberIndex]))
                  });
              }
              console.log(this.authorisedUsers);
              if(this.authorisedUsers.length>0)
              {
                this.step2Validition=true;
                console.log("Step 2 Valid");
              }
              else
              {
                this.step2Validition=false;
                console.log("Step 2 InValid");
              }
          }
          else
            throw "File Exception";
          console.log("Parsed File...");
          console.log(this.fileStr);
          console.log(this.authorisedUsers);
          this.myFormCSVMode.controls.autherizedUsersCSVFile.setErrors(null);
          //this.authorisedUsers=[this.parsedFile];
          this.disableLoadButton=false; //ENABLING LOAD BUTTON ON PARSE SUCCESSFUL
      }
    }
    catch(e){
      console.log("In Exception...");
      console.log(this.fileParseErr);
      this.fileParseErr =true; //SHOWING ERRORS
      this.disableLoadButton=true; //DISABLING LOAD BUTTON ON PARSE FAILURE
      this.myFormCSVMode.controls.autherizedUsersCSVFile.setErrors({"invalidCSVFile":true});
    }
  }

removeExtraChar(un:string)
{
  if(un.indexOf('r')>=0)
    {console.log("R Found...");
    console.log(un);
      un= un.substring(0,un.indexOf("r"))+un.substring(un.indexOf("r")+1)
    }
  return un;
}
downloadCSV(e)
{
    console.log("In downloadCSV...");
    console.log(e);
    var options = { 
    fieldSeparator: ',',
    quoteStrings: '',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: false,
    title:"Users Details",
    useBom: false
  };
  let header = {
      "userName":"UserName",
      "mobileNumber":"Mobile Number"};
  let data=[
    {
      "userName":"abcd",
      "mobileNumber":"9848012345"
    },
    {
      "userName":"xyz",
      "mobileNumber":"9848022338"
    }
  ];
    let fileName = "Sample";
    new Angular2Csv(data, fileName,header,options);
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
      this.myFormManual.statusChanges.subscribe(x =>{
        //console.log("myFormManual : "+x);
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
          });
    this.myFormCSVMode.statusChanges.subscribe(x =>{
        //console.log("myFormCSVMode : "+x);

          });


     }
  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

    /*console.log(this.myForm.value);
    console.log("myFormManual");
    console.log(this.myFormManual.value);*/

    let finalData = jQuery.extend(this.myForm.value,{"date":new Date().toISOString()});
    if(String(finalData.modeType)=="manualMode")
    {
      let dat = this.myFormManual.value;
      this.authorisedUsers= dat.authUsers;
    }
    this.authorisedUsers.forEach(element => {
      if((String(element.id)!="undefined")&&(String(element.id)!="null"))
      {
        delete element.id;
      }
      element["date"]=new Date().toISOString();
    });
    finalData["users"]=this.authorisedUsers;
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
  this.clientRpc.orgRPCCall(op,"orgManagerUserRegistrationMethod",finalData)
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
            log.storeSuccessNotification("In UserRegistration "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In UserRegistration "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In UserRegistration "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
