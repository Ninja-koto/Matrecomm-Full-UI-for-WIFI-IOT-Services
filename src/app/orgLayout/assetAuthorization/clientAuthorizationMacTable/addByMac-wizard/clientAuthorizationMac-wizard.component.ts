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
  selector: 'clientAuthorizationMac-add-wizard',
  templateUrl: './clientAuthorizationMac-wizard.component.html',
  styleUrls: ['./clientAuthorizationMac-wizard.component.scss'],
  providers:[RPCService]
})
export class ClientAuthorizationMacAddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public myFormManual: FormGroup;
    public myFormCSVMode: FormGroup;
    public myFormLocations: FormGroup;

    public submitted: boolean;
    public events: any[] = [];
    step1Validition:boolean=true;
    step2Validition:boolean=false;
    step3Validition:boolean=false;


//countriesData:any;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() locationData:any[]=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

  authorisedClients:any[]=[];
  manualModeSelectedRowsForDeletion:any[]=[];
  manualModeTableErrMsg:string="";

  fr :FileReader;
  disableLoadButton:boolean=true;
  fileParseErr:boolean=false;
  fileStr:string="";
  parsedFile:any={};

showManualMode:boolean=true;
showTableErrorMsg:string="none";

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

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {

     }


    ngOnInit() {

        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm = this._fb.group({
              modeType: ['manualMode', [Validators.required]],

        });
        this.myFormManual = this._fb.group({
              assetName: ['', []],
              macAddress: ['', []],
              serialNumber: ['', []],
        });
        this.myFormCSVMode = this._fb.group({
             autherizedClientsCSVFile: ['', []]
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
            var temp={
              modeType: this.data.modeType
            };
           (<FormGroup>this.myForm)
             .setValue(temp, { onlySelf: true });

        this.authorisedClients = this.data.authorizedAssets;

               let tempUUID=[],locs=[];
                locs=this.data.locations;
               locs.forEach(element => {
                  tempUUID.push(element.uuid);
                });
           (<FormControl> this.myFormLocations.controls["locations"])
             .setValue(tempUUID, { onlySelf: true });

           this.step1Validition=true;
          this.step2Validition=true;
          this.step3Validition=true;

        }
    }

modeType(event)
{
  this.authorisedClients=[];
  this.step2Validition=false;
  if(String(event.target.value)=="manualMode")
    this.showManualMode=true;
  else
    this.showManualMode=false;
}

addClients(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();
  let assetName = this.myFormManual.controls.assetName.value;
  let mac = this.myFormManual.controls.macAddress.value;
  let sr = this.myFormManual.controls.serialNumber.value;
  console.log(assetName);
  console.log(mac);
  console.log(sr);
  if((assetName.length>0)&&(mac.length>0)&&(sr.length>0))
  {
    this.showTableErrorMsg="none";
    let res=CustomValidator.macAddressValidation({"value":mac});
    if(String(res)=="null")
    {
      this.authorisedClients.push({ "assetName" : assetName,
                "macAddress" : mac,
                "id" : new Date().getTime(),
                "serialNumber" : sr});
      console.log("All clients...");
      console.log(this.authorisedClients);
      this.myFormManual.controls.assetName.setValue([]);
      this.myFormManual.controls.macAddress.setValue([]);
      this.myFormManual.controls.serialNumber.setValue([]);
    }
    else
    {
      this.manualModeTableErrMsg="Please enter valid MAC Address eg:'00:0a:95:9d:68:16'";
      this.showTableErrorMsg="block";
    }
  }
  else
  {
    ///show error msg
    this.manualModeTableErrMsg="Please enter AssetName, MAC Address, Serial Number";
    this.showTableErrorMsg="block";
  }
  if(this.authorisedClients.length>0)
    this.step2Validition=true;
  else
    this.step2Validition=false;
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
    this.step2Validition=false;
    e.target.disabled=true;
  }
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
      this.myFormCSVMode.controls.autherizedClientsCSVFile.setErrors({"selectCSVFile":true});
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
    try{
      var clientArray=this.fileStr.split("\n");
      if(clientArray.length>0)
      {
          let docHeader= clientArray[0];
          let docHeaderColumns = docHeader.split(",");
          let assetNameIndex=0,macIndex=0,serialNumberIndex=0;
          let anIndexFound=false,macIndexFound=false,srIndexFound=false;
          if(docHeaderColumns.length>0)
          {
            for(let i=0;i<docHeaderColumns.length;i++)
            {
              if(docHeaderColumns[i].indexOf("Client Name")>=0)
              {
                assetNameIndex=i;
                anIndexFound=true;
              }
              else if(docHeaderColumns[i].indexOf("Mac Address")>=0)
              {
                macIndex=i;
                macIndexFound=true;
              }
              else if(docHeaderColumns[i].indexOf("Serial Number")>=0)
              {
                serialNumberIndex=i;
                srIndexFound=true;
              }
            }
          }
          console.log("client : "+assetNameIndex+", MAC : "+macIndex+", SR : "+serialNumberIndex);
          if(anIndexFound&&macIndexFound&&srIndexFound)
          {
              this.authorisedClients=[];
              for(let j=1;j<clientArray.length;j++)
              {
                let currCols= clientArray[j].split(",");
                if((String(currCols[assetNameIndex])!="undefined")&&(String(currCols[assetNameIndex])!="")&&
                (String(currCols[macIndex])!="undefined")&&(String(currCols[macIndex])!="")&&
                (String(currCols[serialNumberIndex])!="undefined")&&(String(currCols[serialNumberIndex])!=""))
                  this.authorisedClients.push({
                    "assetName":currCols[assetNameIndex],
                    "macAddress":currCols[macIndex],
                    "serialNumber":currCols[serialNumberIndex]
                  });
              }
              console.log(this.authorisedClients);
              if(this.authorisedClients.length>0)
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
          console.log(this.authorisedClients);
          this.myFormCSVMode.controls.autherizedClientsCSVFile.setErrors(null);
          //this.authorisedClients=[this.parsedFile];
          this.disableLoadButton=false; //ENABLING LOAD BUTTON ON PARSE SUCCESSFUL
      }
    }
    catch(e){
      console.log("In Exception...");
      console.log(this.fileParseErr);
      this.fileParseErr =true; //SHOWING ERRORS
      this.disableLoadButton=true; //DISABLING LOAD BUTTON ON PARSE FAILURE
      this.myFormCSVMode.controls.autherizedClientsCSVFile.setErrors({"invalidCSVFile":true});
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
      this.myFormManual.statusChanges.subscribe(x =>{
        //console.log("myFormManual : "+x);
          });
    this.myFormCSVMode.statusChanges.subscribe(x =>{
        //console.log("myFormCSVMode : "+x);

          });
    this.myFormLocations.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step3Validition=true;
          else
            this.step3Validition=false;
          });


     }
  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

    console.log(this.myForm.value);
let formData = this.myFormLocations.value;

    console.log(this.myForm.value);
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

    let finalData = jQuery.extend(this.myForm.value,locationDataProfile,{"date":new Date().toISOString()});
    finalData["authorizedAssets"]=this.authorisedClients;
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
  this.clientRpc.orgRPCCall(op,"orgManagerAuthorisedClientsMACMethod",finalData)
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
            log.storeSuccessNotification("In Client Authorization MAC "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Client Authorization MAC "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Client Authorization MAC "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
   // this.myForm.reset();*/
  }
}
