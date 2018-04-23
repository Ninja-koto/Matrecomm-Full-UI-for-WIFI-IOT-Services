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
import {CsvCreator} from "../../../../commonServices/csvFileCreator";
import {BaThemeSpinner} from "../../../../theme/services";
@Component({
  selector: 'apnUserManagement-add-wizard',
  templateUrl: './apnUserManagement-wizard.component.html',
  styleUrls: ['./apnUserManagement-wizard.component.scss'],
  providers:[RPCService]
})
export class APNUserManagementAddWizardComponent implements OnInit {
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

showManualMode:boolean=false;
showTableErrorMsg:string="none";

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http,
      private _spinner: BaThemeSpinner) {

     }


    ngOnInit() {

        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myFormCSVMode = this._fb.group({
             apnUsersCSVFile: ['', []]
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
    
           this.authorisedUsers = this.data.authorisedUsers;
           this.step2Validition=true;
        }
    }

resetToDefault(e)
{
  this.myFormCSVMode.controls["apnUsersCSVFile"].reset();
}

removeUser(user:any,e)
{
  //this._spinner.show();
  console.log(e);
  e.preventDefault();
console.log(user);
let index= this.authorisedUsers.findIndex(ele=>ele.id==user);
this.authorisedUsers.splice(index,1);
//this._spinner.hide();

if(this.authorisedUsers.length<=0)
{
  this.myFormCSVMode.controls["apnUsersCSVFile"].reset();
  //unselect FILE
}
//let index = this.manualModeSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
//this.manualModeSelectedRowsForDeletion.splice(index,1);
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
      this.myFormCSVMode.controls.apnUsersCSVFile.setErrors({"selectCSVFile":true});
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
    //console.log(this.fileStr);
    try{
      var userArray=this.fileStr.split("\n");
      console.log(userArray);
      if(userArray.length>0)
      {
        
          let docHeader= userArray[0];
          let docHeaderColumns = docHeader.split(",");
          let userNameIndex=0,customerIdIndex=0, circuitIdIndex=0;
          let unIndexFound=false,cidIndexFound=false, circuitIndexFound=false;
          console.log(docHeaderColumns);
          let colsIndex=[];
          if(docHeaderColumns.length>0)
          {
            for(let i=0;i<docHeaderColumns.length;i++)
            {
              if((docHeaderColumns[i].indexOf("User Name")>=0)||(docHeaderColumns[i].indexOf("UserName")>=0))
              {
                colsIndex.push("userName");
                userNameIndex=i;
                unIndexFound=true;
              }
            
              else if((docHeaderColumns[i].indexOf("Customer ID")>=0)||(docHeaderColumns[i].indexOf("CustomerID")>=0))
              {
                colsIndex.push("customerID");
                customerIdIndex=i;
                cidIndexFound=true;
              }
              else if((docHeaderColumns[i].indexOf("Circuit ID")>=0)||(docHeaderColumns[i].indexOf("CircuitID")>=0))
              {
                colsIndex.push("circuitID");
                circuitIdIndex =i;
                circuitIndexFound =true;
              }
              else
              {
                colsIndex.push(String(docHeaderColumns[i]).toLowerCase());
              }
            }
          }
          console.log("auth : "+userNameIndex+", MB : "+customerIdIndex);
          if(unIndexFound&&cidIndexFound)
          {
              this.authorisedUsers=[];
              console.log(userArray.length);
              for(let j=1;j<userArray.length;j++)
              {
                let currCols= userArray[j].split(",");
                let temp={};
                let len=0
                for (var index = 0; index < currCols.length; index++) {
                  var element = currCols[index];
                  len++;
                  temp[colsIndex[index]]=element;
                }
                temp["id"]=String(new Date().getTime())+"_"+String(j);
                if(len==docHeaderColumns.length)
                  this.authorisedUsers.push(temp);
                /*if((String(currCols[userNameIndex])!="undefined")&&(String(currCols[userNameIndex])!="")&&
                (String(currCols[customerIdIndex])!="undefined")&&(String(currCols[customerIdIndex])!=""))
                { 
                  this.authorisedUsers.push({
                    "userName":this.removeExtraChar(String(currCols[userNameIndex])),
                    "customerID":this.removeExtraChar(String(currCols[customerIdIndex]))
                  });
                }
                else
                {

                }*/
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
          this.myFormCSVMode.controls.apnUsersCSVFile.setErrors(null);
          //this.authorisedUsers=[this.parsedFile];
          this.disableLoadButton=false; //ENABLING LOAD BUTTON ON PARSE SUCCESSFUL
      }
    }
    catch(e){
      console.log("In Exception...");
      console.log(e);
      console.log(this.fileParseErr);
      this.fileParseErr =true; //SHOWING ERRORS
      this.disableLoadButton=true; //DISABLING LOAD BUTTON ON PARSE FAILURE
      this.myFormCSVMode.controls.apnUsersCSVFile.setErrors({"invalidCSVFile":true});
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
    /*var options = { 
    fieldSeparator: ',',
    quoteStrings: '',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: false,
    title:"Users Details",
    useBom: false
  };
  let arr=["User Name","Customer ID","Circuit ID","City","Circle","Region","Customer Loopback IP","Dummy 1",
  "Dummy 2","Dummy 3","Dummy 4","Dummy 5","Dummy 6","Dummy 7","Dummy 8","Dummy 9","Dummy 10","Dummy 11","Dummy 12","Dummy 13"];
  let header = {};
  //let data=[];
  arr.forEach(element => {
    header[String(element).toLowerCase()]=element;
  });
  for (var index = 0; index < 2; index++) {
    let temp ={
      "user name":"user1@sbi.com","customer id":"SBI10001","circuit id":"CIR001",
      "city":"Delhi","circle":"Delhi","region":"North","customer loopback ip":"1.1.1.1","dummy 1":"xyz123",
    "dummy 2":"xyz125","dummy 3":"xyz127","dummy 4":"xyz129","dummy 5":"xyz131","dummy 6":"xyz133",
    "dummy 7":"xyz135","dummy 8":"xyz137","dummy 9":"xyz139","dummy 10":"xyz141","dummy 11":"xyz143",
    "dummy 12":"xyz145","dummy 13":"xyz147"};
    data.push(temp);
  }
    //new Angular2Csv(data, fileName,header,options);*/
  let data="";
//  data ="'User Name','Customer ID','Circuit ID','City','Circle','Region','Customer Loopback IP','Dummy 1','Dummy 2','Dummy 3','Dummy 4','Dummy 5','Dummy 6','Dummy 7','Dummy 8','Dummy 9','Dummy 10','Dummy 11','Dummy 12','Dummy 13'\n"
//  data = data+"'user1@sbi.com','SBI10001','CIR001','Delhi','Delhi','North','1.1.1.1','xyz123','xyz125','xyz127','xyz129','xyz131','xyz133','xyz135','xyz137','xyz139','xyz141','xyz143','xyz145','xyz147'\n"
//  data = data+"'user2@sbi.com','SBI10002','CIR002','Mumbai','Mumbai','West','1.1.1.2','xyz124','xyz126','xyz128','xyz130','xyz132','xyz134','xyz136','xyz138','xyz140','xyz142','xyz144','xyz146','xyz148'\n"
    
  data ="User Name,Customer ID,Circuit ID,City,Circle,Region,Customer Loopback IP,Dummy 1,Dummy 2,Dummy 3,Dummy 4,Dummy 5,Dummy 6,Dummy 7,Dummy 8,Dummy 9,Dummy 10,Dummy 11,Dummy 12,Dummy 13\n";
  data = data+"user1@sbi.com,SBI10001,CIR001,Delhi,Delhi,North,1.1.1.1,xyz123,xyz125,xyz127,xyz129,xyz131,xyz133,xyz135,xyz137,xyz139,xyz141,xyz143,xyz145,xyz147\n";
  data = data+"user2@sbi.com,SBI10002,CIR002,Mumbai,Mumbai,West,1.1.1.2,xyz124,xyz126,xyz128,xyz130,xyz132,xyz134,xyz136,xyz138,xyz140,xyz142,xyz144,xyz146,xyz148\n";
    let fileName = "Sample";
    new CsvCreator(data,fileName,"Title");
}

    		ngAfterViewInit		(){
      }


    subcribeToFormChanges() {
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

    let finalData = {"date":new Date().toISOString()};
    
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
  this.clientRpc.orgRPCCall(op,"nocApnUserRegistrationMethod",finalData)
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
            log.storeSuccessNotification("In APN UserRegistration "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In APN UserRegistration "+this.operation+" Failed");
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
