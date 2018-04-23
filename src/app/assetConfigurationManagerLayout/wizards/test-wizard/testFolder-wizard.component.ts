import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../commonServices/RPC.service";
import {CustomValidator} from "../../../commonServices/customValidator.service";

@Component({
  selector: 'testFolder-wizard',
  templateUrl: './testFolder-wizard.component.html',
  styleUrls: ['./testFolder-wizard.component.scss'],
  providers:[RPCService]
})

export class TestFolderWizardComponent implements OnInit {
    public myFormCaptivePortal: FormGroup;
    public portalSettings: FormGroup;
    public myForm1: FormGroup;
    public myFormVPN: FormGroup;
    public myFormRadiusServer: FormGroup;
    public myFormSSID: FormGroup;
    public myFormWLANRule: FormGroup;
    public myFormSNMP: FormGroup;
    public myFormDHCP: FormGroup;
    public myFormDeviceDetails: FormGroup;
    public submitted: boolean;
    public events: any[] = [];

  step12Validition:boolean=true;
  step1Validition:boolean=true;
  step2Validition:boolean=true;
  step3Validition:boolean=true;
  step4Validition:boolean=true;
  step5Validition:boolean=true;
  step6Validition:boolean=true;
  step7Validition:boolean=true;
  step8Validition:boolean=true;
  step9Validition:boolean=false;
 

 CaptivePortal:FormControl;
 port:FormControl;
 server:FormControl;
 serverFail:FormControl;
 url:FormControl;
 AutoWhiteList:FormControl;
 AuthenticationTest:FormControl;
 redirecturl:FormControl;
 inUse:FormControl;
 redirection:FormControl;


portalSelectedRowsForDeletion=[];

  //portalSelectedRowsForDeletion:boolean=true;
  showPortalTableErrorMsg:string = "none";
 // Interface Details


  /*step1Validition:boolean=true;
  step2Validition:boolean=true;
  step3Validition:boolean=true;
  step4Validition:boolean=true;
  step5Validition:boolean=true;
  step6Validition:boolean=true;
  step7Validition:boolean=true;
  step8Validition:boolean=true;
  */
  public sessionTypes = [
    { value: '', display: 'Select One' },
    { value: 'ENABLE', display: 'ENABLE' },
    { value: "DISABLE", display: "DISABLE" }
    
  ]

  public captiveTypes = [
    { value: '', display: 'Select One' },
    { value: 'internal', display: 'Internal' },
    { value: "external", display: "External" }
    
  ]
  public snmpversions= ['v2c']
  public servertypes= ['Local']
  public status = [
    { value: '', display: 'Select One' },
    { value: 'yes', display: 'enable' },
    { value: "no", display: "disable" }
  ]

  addportalStatus:String="Disable";

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;
captivePortalName:string="";
  portalAddProfiles(e){
  e.preventDefault();
      console.log('e output')

    console.log(e)
  this.addportalStatus=e.target.value;
  if(!this.portalSettings.contains("CaptivePortal"))
        {
          this.CaptivePortal= new FormControl([],[]);
          this.portalSettings.addControl("CaptivePortal",this.CaptivePortal);
        }
        if(!this.portalSettings.contains("port"))
        {
          this.port= new FormControl([],[]);
          this.portalSettings.addControl("port",this.port);
        }
        if(!this.portalSettings.contains("server"))
        {
          this.server= new FormControl([],[]);
          this.portalSettings.addControl("server",this.server);
        }
        if(!this.portalSettings.contains("serverFail"))
        {
          this.serverFail= new FormControl([],[]);
          this.portalSettings.addControl("serverFail",this.serverFail);
        }
        if(!this.portalSettings.contains("url"))
        {
          this.url= new FormControl([],[]);
          this.portalSettings.addControl("url",this.url);
        }
        if(!this.portalSettings.contains("AutoWhiteList"))
        {
          this.AutoWhiteList= new FormControl([],[]);
          this.portalSettings.addControl("AutoWhiteList",this.AutoWhiteList);
        }
        
        if(!this.portalSettings.contains("AuthenticationTest"))
        {
          this.AuthenticationTest= new FormControl([],[]);
          this.portalSettings.addControl("AuthenticationTest",this.AuthenticationTest);
        }
        if(!this.portalSettings.contains("redirecturl"))
        {
          this.redirecturl= new FormControl([],[]);
          this.portalSettings.addControl("redirecturl",this.redirecturl);
        }
        if(!this.portalSettings.contains("inUse"))
        {
          this.inUse= new FormControl([],[]);
          this.portalSettings.addControl("inUse",this.inUse);
        }
        if(!this.portalSettings.contains("redirection"))
        {
          this.redirection= new FormControl([],[]);
          this.portalSettings.addControl("redirection",this.redirection);
        }
}

cancelPortalProfiles(e){
  e.preventDefault();
 // console.log(e)
  this.addportalStatus=e.target.value;
        if(this.portalSettings.contains("CaptivePortal"))
        this.portalSettings.removeControl("CaptivePortal");
        if(this.portalSettings.contains("port"))
        this.portalSettings.removeControl("port");
        if(this.portalSettings.contains("server"))
        this.portalSettings.removeControl("server");
        if(this.portalSettings.contains("serverFail"))
        this.portalSettings.removeControl("serverFail");
        if(this.portalSettings.contains("url"))
        this.portalSettings.removeControl("url");
        if(this.portalSettings.contains("AutoWhiteList"))
        this.portalSettings.removeControl("AutoWhiteList");
        if(this.portalSettings.contains("AuthenticationTest"))
        this.portalSettings.removeControl("AuthenticationTest");
        if(this.portalSettings.contains("redirecturl"))
        this.portalSettings.removeControl("redirecturl");
        if(this.portalSettings.contains("inUse"))
        this.portalSettings.removeControl("inUse");
        if(this.portalSettings.contains("redirection"))
        this.portalSettings.removeControl("redirection");
        this.showPortalTableErrorMsg="none";
}


maintainPortalSelectedData(e,val)
{
  console.log(e.target.checked);
    console.log(val);
  if(e.target.checked)
  {
    if(this.portalSelectedRowsForDeletion.findIndex(ele => ele.id==val.id)<0)
      this.portalSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.portalSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.portalSelectedRowsForDeletion.splice(index,1);
  }

}

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
        this.myFormCaptivePortal = this._fb.group({
             
              CaptivePortal: ['', [Validators.required, Validators.minLength(4)]],
              AutoWhiteList: ['disable', [Validators.required]],
              inUse: ['no', [Validators.required]],
              port: ['', [Validators.required, CustomValidator.portArubaValidation]],
              redirection: ['disable', [Validators.required]],
              redirecturl: ['', [Validators.required]],
              server: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
              serverFail: ['disable', [Validators.required]],
              url: ['', [Validators.required]]
              
        });
        this.myForm1 = this._fb.group({
              authtext: ['', [Validators.required]],
              autowhite: ['', [Validators.required]],
              mode: ['', [Validators.required]],
              externalRedirect: ['', [Validators.required]],
              internalRedirect: ['', [Validators.required]],
              serverfail: ['', [Validators.required]],
              servername: ['', [Validators.required]],
              url: ['', [Validators.required]],
              port: ['', [Validators.required]]

          });
        this.myFormVPN = this._fb.group({
            vpnPrimaryServer: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
            vpnBackupServer: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
            vpnUserName: ['', [Validators.required, Validators.minLength(5)]],
            vpnPassword: ['', [Validators.required, Validators.minLength(5)]],
            secretKey: ['', [Validators.required, Validators.minLength(5)]]
          });
        this.myFormRadiusServer = this._fb.group({
            port: ['', [Validators.required,  CustomValidator.portArubaValidation]],
            serverIP: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
            key: ['', [Validators.required, Validators.minLength(5)]],
            acctPort: ['', [Validators.required,  CustomValidator.portArubaValidation]],
            radiusTemplate: ['', [Validators.required, Validators.minLength(3)]]
          });
        this.myFormSSID = this._fb.group({
          profileName: ['', [Validators.required, Validators.minLength(4)]],
          extCaptive: [this.captivePortalName, [Validators.required, Validators.minLength(4)]],
          external: ['', [Validators.required]],
          failures: ['', [Validators.required]],
          dtim: ['', [Validators.required]],
          timeout: ['', [Validators.required]],
          vlan: ['', [Validators.required,  CustomValidator.vlanValidation]],
          authServer: ['', [Validators.required, Validators.minLength(3)]]
        });
        this.myFormWLANRule = this._fb.group({
          profileName: ['', [Validators.required, Validators.minLength(4)]]
        });
        this.myFormSNMP = this._fb.group({
          communityString: ['', [Validators.required, Validators.minLength(6)]],
          ip: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
          name: ['', [Validators.required]],
          snmpversion: ['', [Validators.required]]
        });
        
        this.myFormDHCP = this._fb.group({
         // defaultRouteIp: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
          dnsServerIp: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
          dhcpProfileName: ['', [Validators.required, Validators.minLength(3)]],
          subnetMask: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
          subnetStr: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
          leaseTime: ['', [Validators.required, CustomValidator.leaseTimeValidation]],
          vlanIDStr: ['', [Validators.required, CustomValidator.vlanValidation]],
          serverType: ['', [Validators.required]],
          routeIp: ['', [Validators.required, CustomValidator.ipv4AddressValidation]]
        });

        this.portalSettings = this._fb.group({
          defaultRouteIp: ['', [Validators.required]],
          dnsServerIp: ['', [Validators.required]],
          dhcpProfileName: ['', [Validators.required]],
          AuthenticationTest: ['', [Validators.required]],
          redirecturl: ['', [Validators.required]]
        });

        this.myFormDeviceDetails = this._fb.group({
          nameStr: ['', [Validators.required]],
          locationStr: ['', [Validators.required]]
        });
        this.subcribeToFormChanges();

        if(this.operation=="Add")
        {
          
        }
        
        if(this.operation=="Modify")
        {
            var temp={
              ldapIPAddress: this.data.ldapIPAddress,
              ldapPort: this.data.ldapPort,
              ldapAdminBaseDN: this.data.ldapAdminBaseDN,
              ldapUserName: this.data.ldapUserName,
              ldapPassword:this.data.ldapPassword
            };
            console.log("temp");
            console.log(temp);
            var temp2={
              mailHost: this.data.mailHost,
              mailPort: this.data.mailPort,
              mailSessionType: this.data.mailSessionType,
              mailUserName: this.data.mailUserName,
              mailPassword: this.data.mailPassword,
              mailSender:this.data.mailSender
            };
           (<FormGroup>this.myFormCaptivePortal)
             .setValue(temp, { onlySelf: true });
           (<FormGroup>this.myForm1)
             .setValue(temp2, { onlySelf: true });
          this.step1Validition=true;
          this.step2Validition=true;
        }
            

    }
    		ngAfterViewInit		(){

      }

  pageLoaded(e)
  {
    console.log("In pageLoaded...");
    console.log(e);
    if(e=="SSID Configuration")
    {
      console.log("CAptivePortal Name ");
      let cap = this.myFormCaptivePortal.controls.CaptivePortal.value;
      console.log(cap);
      this.myFormSSID.controls.extCaptive.setValue(cap);
  
      console.log("Radius Server Name");
      let rad = this.myFormRadiusServer.controls.radiusTemplate.value;
      console.log(rad);
      this.myFormSSID.controls.authServer.setValue(rad);
    }
  else if(e=="WLAN Access Rule")
    {
      console.log("access rule");
      let cap = this.myFormSSID.controls.profileName.value;
      console.log(cap);
      this.myFormWLANRule.controls.profileName.setValue(cap);
    }
  }
storeCaptivePortalName(e)
{
  console.log("In storeCAptivefdfdfd");
  console.log(e);
  this.captivePortalName=e.target.value;
}

    subcribeToFormChanges() {
      this.myFormCaptivePortal.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });

      this.myForm1.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
      });
      this.myFormVPN.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step3Validition=true;
          else
            this.step3Validition=false;
      });
      this.myFormRadiusServer.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step4Validition=true;
          else
            this.step4Validition=false;
      });
      this.myFormSSID.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step5Validition=true;
          else
            this.step5Validition=false;
      });
      this.myFormWLANRule.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step6Validition=true;
          else
            this.step6Validition=false;
      });
      this.myFormSNMP.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step7Validition=true;
          else
            this.step7Validition=false;
      });
      this.myFormDHCP.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step8Validition=true;
          else
            this.step8Validition=false;
      });
      this.myFormDeviceDetails.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step9Validition=true;
            else
            this.step9Validition=false;
      });
        //const myFormStatusChanges$ = this.myForm.statusChanges;
        //const myFormValueChanges$ = this.myForm.valueChanges;
        //myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        //myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }
    
    /*save(model: User, isValid: boolean) {
        this.submitted = true;
        console.log(model, isValid);
    }*/

  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step    
    
    console.log(this.myFormCaptivePortal.value);
    //console.log(this.myForm1.value);
    console.log(this.myFormVPN.value);
    console.log(this.myFormRadiusServer.value);
    console.log(this.myFormSSID.value);
    console.log(this.myFormWLANRule.value);
    console.log(this.myFormSNMP.value);
    console.log(this.myFormDHCP.value);
    console.log(this.myFormDeviceDetails.value);

let myFormVPNData=this.myFormVPN.value;
let myFormCaptivePortalData=this.myFormCaptivePortal.value;
let myFormRadiusServerData=this.myFormRadiusServer.value;
let myFormSSIDData=this.myFormSSID.value;
let myFormSNMPData=this.myFormSNMP.value;
let myFormDHCPData=this.myFormDHCP.value;
let myFormWLANData=this.myFormWLANRule.value;
let myFormDeviceDetailsData=this.myFormDeviceDetails.value;

var vpnTempProfile={};
var captivePortalTempProfile={};
var radiusServerProfile={};
var ssidProfile={};
var snmpProfile={};
var dhcpProfile={};
var wlanProfile={};
var deviceProfile={};
var globalTempProfile={};
var deviceTempProfiles={};
var getAllTempProfile={};

  captivePortalTempProfile["CaptivePortal"]=myFormCaptivePortalData.CaptivePortal;
  captivePortalTempProfile["AutoWhiteList"]=myFormCaptivePortalData.AutoWhiteList;
  captivePortalTempProfile["inUse"]=myFormCaptivePortalData.inUse;
  captivePortalTempProfile["port"]=myFormCaptivePortalData.port;
  captivePortalTempProfile["redirection"]=myFormCaptivePortalData.redirection;
  captivePortalTempProfile["redirecturl"]=myFormCaptivePortalData.redirecturl;
  captivePortalTempProfile["server"]=myFormCaptivePortalData.server;
  captivePortalTempProfile["serverFail"]=myFormCaptivePortalData.serverFail;
  captivePortalTempProfile["url"]=myFormCaptivePortalData.url;

  radiusServerProfile["port"]=myFormRadiusServerData.port;
  radiusServerProfile["serverIP"]=myFormRadiusServerData.serverIP;
  radiusServerProfile["key"]=myFormRadiusServerData.key;
  radiusServerProfile["acctPort"]=myFormRadiusServerData.acctPort;
  radiusServerProfile["radiusTemplate"]=myFormRadiusServerData.radiusTemplate;

  vpnTempProfile["vpnPrimaryServer"]=myFormVPNData.vpnPrimaryServer;
  vpnTempProfile["vpnBackupServer"]=myFormVPNData.vpnBackupServer;
  vpnTempProfile["vpnUserName"]=myFormVPNData.vpnUserName;
  vpnTempProfile["vpnPassword"]=myFormVPNData.vpnPassword;
  vpnTempProfile["secretKey"]=myFormVPNData.secretKey;

  ssidProfile["profileName"]=myFormSSIDData.profileName;
  ssidProfile["extCaptive"]=myFormSSIDData.extCaptive;
  ssidProfile["external"]=myFormSSIDData.external;
  ssidProfile["failures"]=myFormSSIDData.failures;
  ssidProfile["dtim"]=myFormSSIDData.dtim;
  ssidProfile["timeout"]=myFormSSIDData.timeout;
  ssidProfile["vlan"]=myFormSSIDData.vlan;
  ssidProfile["authServer"]=myFormSSIDData.authServer;

  wlanProfile["profileName"]=myFormWLANData.profileName;

  snmpProfile["communityString"]=myFormSNMPData.communityString;
  snmpProfile["ip"]=myFormSNMPData.ip;
  snmpProfile["name"]=myFormSNMPData.name;
  snmpProfile["snmpversion"]=myFormSNMPData.snmpversion;

  dhcpProfile["dnsServerIp"]=myFormDHCPData.dnsServerIp;
  dhcpProfile["dhcpProfileName"]=myFormDHCPData.dhcpProfileName;
  dhcpProfile["subnetMask"]=myFormDHCPData.subnetMask;
  dhcpProfile["subnetStr"]=myFormDHCPData.subnetStr;
  dhcpProfile["leaseTime"]=myFormDHCPData.leaseTime;
  dhcpProfile["vlanIDStr"]=myFormDHCPData.vlanIDStr;
  dhcpProfile["serverType"]=myFormDHCPData.serverType;
  dhcpProfile["routeIp"]=myFormDHCPData.routeIp;

  deviceProfile["assetHostName"]=myFormDeviceDetailsData.nameStr;
  deviceProfile["assetLocation"]=myFormDeviceDetailsData.locationStr;

  //deviceTempProfiles["deviceDetails"]=deviceProfile;

  globalTempProfile["dhcp"]=dhcpProfile;
  globalTempProfile["radiusTemplate"]=radiusServerProfile;
  
  getAllTempProfile["captivePortal"]=captivePortalTempProfile;
  getAllTempProfile["VPN"]=vpnTempProfile;
  getAllTempProfile["ssidDetails"]=ssidProfile;
  getAllTempProfile["snmp"]=snmpProfile;
  getAllTempProfile["global"]=globalTempProfile;
  getAllTempProfile["ssidName"]=wlanProfile;
  getAllTempProfile["deviceDetails"]=deviceProfile;


    let finalData = jQuery.extend(getAllTempProfile,{"date":new Date().toISOString()});
    console.log('/....finalData......');
    console.log(finalData);
   // let finalData = jQuery.extend(this.myFormCaptivePortal.value,this.myFormVPN.value,this.myFormRadiusServer.value,this.myFormSSID.value,this.myFormWLANRule.value,this.myFormSNMP.value,this.myFormDHCP.value,{"date":new Date().toISOString()});
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  /*
  //this.clientRpc.clientRPCCall(op,"orgManagerLDAPSMTPMethod",finalData);
  this.clientRpc.clientRPCCall(op,"orgManagerLDAPSMTPMethod",finalData)
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
    this.closeModalWizard.emit(val);
    this.myForm.reset();*/
  }
}
