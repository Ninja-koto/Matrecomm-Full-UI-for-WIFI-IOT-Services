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
  selector: 'assetRegistration-add-wizard',
  templateUrl: './assetRegistration-wizard.component.html',
  styleUrls: ['./assetRegistration-wizard.component.scss'],
  providers:[RPCService]
})

export class AssetRegistrationAddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
    disableLoadButton:boolean=true;
    showProfileTable:boolean=false;
//    files:any[]=[];
  step1Validition:boolean=false;
public loadFileErr:boolean= false;
fileParseErr:boolean=false;
  public user: any;
  fr :FileReader;
  configFile:any={};
  configFileStr:string="";
  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;
  showUrlType:string="ftp";
  userName:FormControl;
  password:FormControl;
    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http,private ref: ChangeDetectorRef) {

     }

    ngOnInit() {
        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm = this._fb.group({
             urlType:['ftp', [Validators.required]],
             fileType: ['', []],
             firmwareLocationURL:["",[Validators.required]],
        });

        this.subcribeToFormChanges();

        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {

        }
  }
  add_removeFormControls(){
    if(String(this.showUrlType)=="tftp")
    {
      this.myForm.controls["firmwareLocationURL"].setValue("");
      if(this.myForm.contains("userName"))
        this.myForm.removeControl("userName");
      if(this.myForm.contains("password"))
        this.myForm.removeControl("password");
    }
    else if((String(this.showUrlType)=="ftp")||(String(this.showUrlType)=="http"))
    {  console.log("before add controls...");
      this.myForm.controls["firmwareLocationURL"].setValue("");
      this.userName= new FormControl('',[Validators.required]);
      this.password= new FormControl('',[Validators.required]);
      this.myForm.addControl("userName",this.userName);
      this.myForm.addControl("password",this.password);
    }
  }
  selectURLType(e)
  {
    console.log("Selected URL ...");
    console.log(e.target.value);
    this.showUrlType=e.target.value;
    this.add_removeFormControls();
  }
  processFile(e){
    this.configFileStr =String(e.currentTarget.result);
    try{
    this.configFile= JSON.parse(this.configFileStr);
    this.myForm.controls.fileType.setErrors(null);
    this.disableLoadButton=false; //ENABLING LOAD BUTTON ON PARSE SUCCESSFUL
    }
    catch(e){
      /*console.log("In Exception...");
      console.log(this.fileParseErr);*/
      this.fileParseErr =true; //SHOWING ERRORS
      this.disableLoadButton=true; //DISABLING LOAD BUTTON ON PARSE FAILURE
      this.myForm.controls.fileType.setErrors({"invalidConfigFile":true});
    }
  }
  clearSelectedFileContent(){
    this.disableLoadButton=false; //TODISABLE LOAD BUTTON
    this.fileParseErr=false; //CLEAR PREVIOUS ERRORS
    this.showProfileTable=false; //DISABLING TABLE
    this.configFileStr=""; //RESETTING CONFIG  FILE CONTENT
    this.configFile={}; //RESETTING CONFIG FILE OBJECT
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
      this.myForm.controls.fileType.setErrors({"selectConfigFile":true});
      this.clearSelectedFileContent();
      this.disableLoadButton=true;//DISABLING LOAD BUTTON ON FILE CHANGE FAILURE
      //console.log(e);
    }
  }

  loadInitiated(e)
  {
    e.preventDefault();
    //console.log("Load Initiated...");
    if(this.fileParseErr)
    {
      this.disableLoadButton=false;
      this.myForm.controls.fileType.setErrors({"invalidConfigFile":true});
      this.showProfileTable=false;
      //console.log("ERROR>>>>");
    }
    else
    {
      if(this.configFile.copyright == "MatreComm Technologies Pvt Ltd")
      {
        console.log("Valid config...");
        this.add_removeFormControls();
        this.myForm.controls.fileType.setErrors(null);
        this.disableLoadButton=true;
        this.showProfileTable=true;
        console.log("Table Data...");
        console.log(this.configFile);
      }
      else
      {
        console.log("Invalid config...");
        this.myForm.controls.fileType.setErrors({"invalidConfigFile":true});
        this.disableLoadButton=false;
        this.showProfileTable=false;
      }
      //console.log("NO ERROR>>>>");
    }
  }

  onFirmWareLocationURLChange(e,prefix)
  {
    console.log("In onFirmWareLocationURLChange");
    console.log(e);
    console.log(prefix);
    let url = String(this.myForm.controls["firmwareLocationURL"].value);
    url = url.replace(/^\s+|\s+$/g, "");//removing leading and trailing white spaces
    if(url.indexOf(prefix)<0)
      {
        if(prefix=="ftp://")
          this.myForm.controls["firmwareLocationURL"].setErrors({'ftpUrlErr':true});
        if(prefix=="tftp://")
          this.myForm.controls["firmwareLocationURL"].setErrors({'tftpUrlErr':true});
        if(prefix=="http://")
          this.myForm.controls["firmwareLocationURL"].setErrors({'httpUrlErr':true});
      }
  }


    	ngAfterViewInit	(){

      }


    subcribeToFormChanges() {
      this.myForm.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });

        }



  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

    let finalData = jQuery.extend(this.myForm.value,this.configFile,{"date":new Date().toISOString()});
    delete finalData.fileType;
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
      console.log(finalData);
   this.clientRpc.orgRPCCall(op,"orgManagerAssetRegistrationMethod",finalData)
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
            log.storeSuccessNotification("In Asset Registration "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Asset Registration "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Asset Registration "+this.operation+" Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
    this.myForm.reset();
  }
}
