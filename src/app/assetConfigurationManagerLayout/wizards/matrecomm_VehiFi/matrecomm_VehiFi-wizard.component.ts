import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../commonServices/RPC.service";
import {CustomValidator} from "../../../commonServices/customValidator.service";

//import {MATRECOMMSETJSON} from "./matrecommSetJson"

@Component({
  selector: 'matrecomm-VehiFi',
  templateUrl: './matrecomm_VehiFi-wizard.component.html',
  styleUrls: ['./matrecomm_VehiFi-wizard.component.scss'],
  providers:[RPCService]
})

export class MatrecommVehiFiWizardComponent implements OnInit {
    public myFormDhcp          : FormGroup;
    public myFormDns           : FormGroup;
    public myFormLanInterface  : FormGroup;
    public myFormWanInterface  : FormGroup;
    public myFormSimApn        : FormGroup;
    public myFormRadio         : FormGroup;
    public myFormCaptive       : FormGroup;
    public myFormVpn           : FormGroup;
    public myFormNtp           : FormGroup;
    public myFormSnmp          : FormGroup;
    public myFormHostname      : FormGroup;
   

    public submitted: boolean;
    public events: any[] = [];

   step1Validition:boolean=false;
   step2Validition:boolean=false;
   step3Validition:boolean=false;
   step4Validition:boolean=false;
   step5Validition:boolean=false;
   step6Validition:boolean=false;
   step7Validition:boolean=false;
   step8Validition:boolean=false;
   step9Validition:boolean=false;
   step10Validition:boolean=false;
   step11Validition:boolean=false;

//radio  
   key:FormControl;
//ntp 
   server:FormControl;

public interfaceTypes=['lan'];
public lanIntNames=['eth0'];
public lanProtoTypes=['static'];

public wanIntNames=['eth1'];
public wanProtoTypes=['dhcp'];

public wwan0IntNames=['wwan0'];
public wwan0ProtoTypes=['dhcp'];
public wwan0DeviceTypes=['cdc-wdm0'];

public wwan1IntNames=['wwan1'];
public wwan1ProtoTypes=['dhcp'];
public wwan1DeviceTypes=['cdc-wdm1'];

public networkTypes=['lan'];
public modeTypes=['ap','sta','adhoc','wds','monitor','mesh'];
public hwmodes=['11g','11a','11b'];
public htmodes=['HT20','HT40','HT40+','Ht40-','NONE'];
public deviceTypes=['radio0'];
public channelTypes=['auto','1','2','3','4','5','6','7','8','9','10','11'];
public authenticationTypes=['open','psk'];

public nasInterfaces=['br-lan'];

public snmpGroups=['private','public'];
public snmpSecNames=['rw','ro'];
public snmpVersions=['v2c'];

addNtpListStatus:String="Disable";
showNtpListTableErrorMsg:string = "none";
allNtpListProfiles:any[]=[];
ntpListSelectedRowsForDeletion=[];

authenticationStatus="open";
hostname;
//Modify....................



  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  @Output() finalSubmitData= new EventEmitter<Object>();
  headers:Headers;

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {
 
     }

authenticationProfiles(e){
 // e.preventDefault();
      this.authenticationStatus=this.myFormRadio.controls.authenticationType.value;

      if(this.authenticationStatus=='psk')
        {
         if(!this.myFormRadio.contains("key"))
          {
            this.key= new FormControl('',[]);
            this.myFormRadio.addControl("key",this.key);
          }  
        }
    else
      {
        if(this.myFormRadio.contains("key"))
        this.myFormRadio.removeControl("key");
      }
}

ntpListAddProfiles(e){
  e.preventDefault();
  this.addNtpListStatus=e.target.value;

      if(!this.myFormNtp.contains("server"))
        {
          this.server= new FormControl('',[]);
          this.myFormNtp.addControl("server",this.server);
        }  
}   
cancelNtpListProfiles(e){
  e.preventDefault();
  this.addNtpListStatus=e.target.value;

    if(this.myFormNtp.contains("server"))
        this.myFormNtp.removeControl("server");
  
    this.showNtpListTableErrorMsg="none";
}

submitNtpListProfiles(e)
{
//  console.log(e);
  e.preventDefault();
   let server = this.myFormNtp.controls.server.value;
    
  if((String(server).length>0))
  {
    this.showNtpListTableErrorMsg="none";
     if((this.myFormNtp.controls.server.errors==null))
        {
        this.allNtpListProfiles.push({
                  "id": new Date().getTime(), 
                 "server" : this.myFormNtp.controls.server.value,   
                        });
    this.myFormNtp.controls.server.setValue([]);
  
    this.addNtpListStatus="Disable";
  }
  }
  else
  {
    this.showNtpListTableErrorMsg="block";
  }
  if(this.allNtpListProfiles.length>0)
    this.step9Validition=true;
}

maintainNtpListSelectedData(e,val)
{
 
  if(e.target.checked)
  {
    if(this.ntpListSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.ntpListSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.ntpListSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.ntpListSelectedRowsForDeletion.splice(index,1);
  }
}

deleteNtpListSelectedProfiles(e)
{
  e.preventDefault();
   this.ntpListSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allNtpListProfiles.findIndex(val => val.id==ele.id);
    this.allNtpListProfiles.splice(index,1);
  })
  this.ntpListSelectedRowsForDeletion=[];
  if(this.ntpListSelectedRowsForDeletion.length<=0)
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
 //       console.log("Operation : "+this.operation);
   //     console.log(this.data);
    
        this.myFormDhcp = this._fb.group({
            interfaceName: ['', [Validators.required]],
            startAddress: ['', [Validators.required,CustomValidator.matrecommStartAddressValidation]],
            limitAddresses: ['', [Validators.required,CustomValidator.matrecommLimitAddressValidation]],
            leaseTime: ['', [Validators.required,CustomValidator.matrecommLeaseTimeValidation]],

          });

       this.myFormDns = this._fb.group({
            domain: ['', [Validators.required]],
            authoritative: ['', [Validators.required]],
            domainNeeded: ['', [Validators.required]],
            bogusPriv: ['', [Validators.required]],
            localService: ['', [Validators.required]],
            localiseQueries: ['', [Validators.required]],
            noNegativeCache: ['', [Validators.required]],
            readEthers: ['', [Validators.required]],
            rebindLocalHost: ['', [Validators.required]],
            rebindProtection: ['', [Validators.required]],
            expandHosts: ['', [Validators.required]],
            filterwin2k: ['', [Validators.required]],
    
          });          
         
       this.myFormLanInterface = this._fb.group({
            lanIfName: ['', [Validators.required]],
            lanAddress: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
            lanProtoType: ['', [Validators.required]],
            subnet: ['', [Validators.required,CustomValidator.subnetValidation]],
          });

      this.myFormWanInterface = this._fb.group({
            wanIntName: ['', [Validators.required]],
            wanProtoType: ['', [Validators.required]],
            wwan0IntName: ['', [Validators.required]],
            wwan0DeviceType: ['', [Validators.required]],
            wwan0ProtoType: ['', [Validators.required]],
            wwan1IntName: ['', [Validators.required]],
            wwan1ProtoType: ['', [Validators.required]],
            wwan1DeviceType: ['', [Validators.required]],
          });

      this.myFormSimApn = this._fb.group({
            wwan0Apn: ['', [Validators.required]],
            wwan0Pin: ['', [Validators.required]],
            wwan1Apn: ['', []],
            wwan1Pin: ['', []],
           
          });

      this.myFormRadio = this._fb.group({
            network: ['', [Validators.required]],
            ssid: ['', [Validators.required]],
            device: ['', [Validators.required]],
            htmode: ['', [Validators.required]],
            hwmode: ['', [Validators.required]],
            mode: ['', [Validators.required]],
            channel: ['', [Validators.required]],
            authenticationType: ['', [Validators.required]],
          });          

     this.myFormCaptive = this._fb.group({
            nasIntf: ['', [Validators.required]],
            portalIP: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
            portalPort: ['', [Validators.required]],
            redirectUrl: ['', [Validators.required]],
          });
     this.myFormVpn = this._fb.group({
            vpnServer: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
            vpnExtIp: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
            netmask: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
            lanIP: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
          });
          
     this.myFormNtp = this._fb.group({
            enableServer: ['', [Validators.required]],
            ntpStatus: ['', [Validators.required]],
          });         
     this.myFormSnmp = this._fb.group({
            privateGroup: ['', [Validators.required]],
            privateSecName: ['', [Validators.required]],
            privateVersion: ['', [Validators.required]],
            publicGroup: ['', [Validators.required]],
            publicSecName: ['', [Validators.required]],
            publicVersion: ['', [Validators.required]],

          }); 
     this.myFormHostname = this._fb.group({
            hostname: ['', [Validators.required]],
          });    

var gbProfile={};
var dhcpProfile={};         
var dhcpLanProfile={};         

gbProfile = this.data["global"];
dhcpProfile=gbProfile["dhcp"];
dhcpLanProfile=dhcpProfile["lan"];
var dhcpDnsProfile={};         
dhcpDnsProfile=dhcpProfile["dnsmasq"];

var interfaceProfiles={};
var lanIntProfiles={};
interfaceProfiles = this.data["interfaces"];
lanIntProfiles=interfaceProfiles["LAN"];

var wanIntProfiles={};
var wwan0IntProfiles={};
var wwan1IntProfiles={};
wanIntProfiles=interfaceProfiles["WAN"];
wwan0IntProfiles=interfaceProfiles["WWAN0"];
wwan1IntProfiles=interfaceProfiles["WWAN1"];

var simApnProfiles={};
var wwan0ApnProfiles={};
var wwan1ApnProfiles={};

simApnProfiles=gbProfile["simApnDetails"];
wwan0ApnProfiles=simApnProfiles["wwan0"];
wwan1ApnProfiles=simApnProfiles["wwan1"];

var wlanProfiles={};
var radioDetailsProfiles={};
wlanProfiles = this.data["WLAN"];
radioDetailsProfiles=wlanProfiles["radioDetails"];

var captiveProfiles={};
captiveProfiles = this.data["captivePortal"];
var vpnProfiles={};
vpnProfiles = this.data["VPN"];

var ntpProfiles={};
ntpProfiles=gbProfile["ntp"];

var snmpProfiles={};
var privateV2cProfiles={};
var publicV2cProfiles={};

snmpProfiles = this.data["SNMP"];
privateV2cProfiles=snmpProfiles["privateV2c"];
publicV2cProfiles=snmpProfiles["publicV2c"];

this.hostname= this.data["hostname"];

        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {
          
        }
        if(this.operation=="Modify")
        {
          (<FormControl> this.myFormDhcp.controls["interfaceName"])
             .setValue(dhcpLanProfile["interface"], { onlySelf: true }); 
         (<FormControl> this.myFormDhcp.controls["startAddress"])
             .setValue(dhcpLanProfile["start"], { onlySelf: true }); 
         (<FormControl> this.myFormDhcp.controls["limitAddresses"])
             .setValue(dhcpLanProfile["limit"], { onlySelf: true }); 
         (<FormControl> this.myFormDhcp.controls["leaseTime"])
             .setValue(dhcpLanProfile["leaseTime"], { onlySelf: true }); 
         this.step1Validition=true;
           
          (<FormControl> this.myFormDns.controls["domain"])
             .setValue(dhcpDnsProfile["domain"], { onlySelf: true }); 
         (<FormControl> this.myFormDns.controls["authoritative"])
             .setValue(dhcpDnsProfile["authoritative"], { onlySelf: true }); 
         (<FormControl> this.myFormDns.controls["domainNeeded"])
             .setValue(dhcpDnsProfile["domainNeeded"], { onlySelf: true }); 
         (<FormControl> this.myFormDns.controls["bogusPriv"])
             .setValue(dhcpDnsProfile["bogusPriv"], { onlySelf: true }); 
        (<FormControl> this.myFormDns.controls["expandHosts"])
             .setValue(dhcpDnsProfile["expandHosts"], { onlySelf: true }); 
        (<FormControl> this.myFormDns.controls["localiseQueries"])
             .setValue(dhcpDnsProfile["localiseQueries"], { onlySelf: true }); 
        (<FormControl> this.myFormDns.controls["noNegativeCache"])
             .setValue(dhcpDnsProfile["noNegativeCache"], { onlySelf: true }); 
        (<FormControl> this.myFormDns.controls["readEthers"])
             .setValue(dhcpDnsProfile["readEthers"], { onlySelf: true }); 
        (<FormControl> this.myFormDns.controls["rebindLocalHost"])
             .setValue(dhcpDnsProfile["rebindLocalHost"], { onlySelf: true }); 
        (<FormControl> this.myFormDns.controls["rebindProtection"])
             .setValue(dhcpDnsProfile["rebindProtection"], { onlySelf: true }); 
        (<FormControl> this.myFormDns.controls["filterwin2k"])
             .setValue(dhcpDnsProfile["filterwin2k"], { onlySelf: true }); 
        (<FormControl> this.myFormDns.controls["localService"])
             .setValue(dhcpDnsProfile["localService"], { onlySelf: true }); 
         this.step2Validition=true;

        (<FormControl> this.myFormLanInterface.controls["lanIfName"])
             .setValue(lanIntProfiles["ifName"], { onlySelf: true }); 
        (<FormControl> this.myFormLanInterface.controls["lanAddress"])
             .setValue(lanIntProfiles["ipAddress"], { onlySelf: true }); 
        (<FormControl> this.myFormLanInterface.controls["lanProtoType"])
             .setValue(lanIntProfiles["protoType"], { onlySelf: true }); 
        (<FormControl> this.myFormLanInterface.controls["subnet"])
             .setValue(lanIntProfiles["subnet"], { onlySelf: true }); 
         this.step3Validition=true;

        (<FormControl> this.myFormWanInterface.controls["wanIntName"])
             .setValue(wanIntProfiles["ifName"], { onlySelf: true }); 
        (<FormControl> this.myFormWanInterface.controls["wanProtoType"])
             .setValue(wanIntProfiles["protoType"], { onlySelf: true });     

       (<FormControl> this.myFormWanInterface.controls["wwan0IntName"])
             .setValue(wwan0IntProfiles["ifName"], { onlySelf: true }); 
        (<FormControl> this.myFormWanInterface.controls["wwan0ProtoType"])
             .setValue(wwan0IntProfiles["protoType"], { onlySelf: true });          
       (<FormControl> this.myFormWanInterface.controls["wwan0DeviceType"])
             .setValue(wwan0IntProfiles["device"], { onlySelf: true }); 
        (<FormControl> this.myFormWanInterface.controls["wwan1ProtoType"])
             .setValue(wwan1IntProfiles["protoType"], { onlySelf: true });          
       (<FormControl> this.myFormWanInterface.controls["wwan1IntName"])
             .setValue(wwan1IntProfiles["ifName"], { onlySelf: true }); 
        (<FormControl> this.myFormWanInterface.controls["wwan1DeviceType"])
             .setValue(wwan1IntProfiles["device"], { onlySelf: true });          
         this.step4Validition=true;

      (<FormControl> this.myFormSimApn.controls["wwan0Apn"])
             .setValue(wwan0ApnProfiles["apn"], { onlySelf: true }); 
        (<FormControl> this.myFormSimApn.controls["wwan0Pin"])
             .setValue(wwan0ApnProfiles["pin"], { onlySelf: true });          
       (<FormControl> this.myFormSimApn.controls["wwan1Apn"])
             .setValue(wwan1ApnProfiles["apn"], { onlySelf: true }); 
        (<FormControl> this.myFormSimApn.controls["wwan1Pin"])
             .setValue(wwan1ApnProfiles["pin"], { onlySelf: true });          
         this.step5Validition=true;

      (<FormControl> this.myFormRadio.controls["network"])
             .setValue(radioDetailsProfiles["network"], { onlySelf: true }); 
        (<FormControl> this.myFormRadio.controls["ssid"])
             .setValue(radioDetailsProfiles["ssid"], { onlySelf: true });          
       (<FormControl> this.myFormRadio.controls["device"])
             .setValue(radioDetailsProfiles["device"], { onlySelf: true }); 
        (<FormControl> this.myFormRadio.controls["htmode"])
             .setValue(radioDetailsProfiles["htmode"], { onlySelf: true });           
     (<FormControl> this.myFormRadio.controls["hwmode"])
             .setValue(radioDetailsProfiles["hwmode"], { onlySelf: true }); 
        (<FormControl> this.myFormRadio.controls["mode"])
             .setValue(radioDetailsProfiles["mode"], { onlySelf: true });          
       (<FormControl> this.myFormRadio.controls["channel"])
             .setValue(radioDetailsProfiles["channel"], { onlySelf: true }); 
        (<FormControl> this.myFormRadio.controls["authenticationType"])
             .setValue(radioDetailsProfiles["authenticationType"], { onlySelf: true });   
      
    let authType =radioDetailsProfiles["authenticationType"];
         authType.trim();
       if(authType=='psk')
       {  
          this.authenticationStatus='psk';
         if(!this.myFormRadio.contains("key"))
          {
            this.key= new FormControl('',[]);
            this.myFormRadio.addControl("key",this.key);
          }  

            (<FormControl> this.myFormRadio.controls["key"])
             .setValue(radioDetailsProfiles["key"], { onlySelf: true }); 
        }
        else{
             if(this.myFormRadio.contains("key"))
            this.myFormRadio.removeControl("key");
        }
          this.step6Validition=true;
                 
       (<FormControl> this.myFormCaptive.controls["portalIP"])
             .setValue(captiveProfiles["portalIP"], { onlySelf: true }); 
        (<FormControl> this.myFormCaptive.controls["redirectUrl"])
             .setValue(captiveProfiles["redirectUrl"], { onlySelf: true });          
       (<FormControl> this.myFormCaptive.controls["nasIntf"])
             .setValue(captiveProfiles["nasIntf"], { onlySelf: true }); 
        (<FormControl> this.myFormCaptive.controls["portalPort"])
             .setValue(captiveProfiles["portalPort"], { onlySelf: true });          
         this.step7Validition=true;

       (<FormControl> this.myFormVpn.controls["vpnServer"])
             .setValue(vpnProfiles["VPNSERVER"], { onlySelf: true }); 
        (<FormControl> this.myFormVpn.controls["vpnExtIp"])
             .setValue(vpnProfiles["VPNEXTIP"], { onlySelf: true });          
       (<FormControl> this.myFormVpn.controls["netmask"])
             .setValue(vpnProfiles["NETMASK"], { onlySelf: true }); 
        (<FormControl> this.myFormVpn.controls["lanIP"])
             .setValue(vpnProfiles["LANIP"], { onlySelf: true });          
         this.step8Validition=true;

       (<FormControl> this.myFormNtp.controls["enableServer"])
             .setValue(ntpProfiles["enableServer"], { onlySelf: true }); 
        (<FormControl> this.myFormNtp.controls["ntpStatus"])
             .setValue(ntpProfiles["enabled"], { onlySelf: true });    

         this.allNtpListProfiles=ntpProfiles["serverList"]
         this.step9Validition=true;

       (<FormControl> this.myFormSnmp.controls["privateGroup"])
             .setValue(privateV2cProfiles["group"], { onlySelf: true }); 
        (<FormControl> this.myFormSnmp.controls["privateSecName"])
             .setValue(privateV2cProfiles["secName"], { onlySelf: true });    
      (<FormControl> this.myFormSnmp.controls["privateVersion"])
             .setValue(privateV2cProfiles["version"], { onlySelf: true }); 
        (<FormControl> this.myFormSnmp.controls["publicGroup"])
             .setValue(publicV2cProfiles["group"], { onlySelf: true });    
       (<FormControl> this.myFormSnmp.controls["publicSecName"])
             .setValue(publicV2cProfiles["secName"], { onlySelf: true }); 
        (<FormControl> this.myFormSnmp.controls["publicVersion"])
             .setValue(publicV2cProfiles["version"], { onlySelf: true });                
         this.step10Validition=true;

        (<FormControl> this.myFormHostname.controls["hostname"])
             .setValue(this.hostname, { onlySelf: true });                
         this.step11Validition=true;         
        }
    }
    		ngAfterViewInit		(){
      }
    subcribeToFormChanges() {
      this.myFormDhcp.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });

     this.myFormDns.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
          });
    this.myFormLanInterface.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step3Validition=true;
          else
            this.step3Validition=false;
          });          
    this.myFormWanInterface.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step4Validition=true;
          else
            this.step4Validition=false;
          });            
 
   this.myFormSimApn.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step5Validition=true;
          else
            this.step5Validition=false;
          });    
    this.myFormRadio.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step6Validition=true;
          else
            this.step6Validition=false;
          });           
    this.myFormCaptive.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step7Validition=true;
          else
            this.step7Validition=false;
          });                  
    this.myFormVpn.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step8Validition=true;
          else
            this.step8Validition=false;
          });  
   this.myFormNtp.statusChanges.subscribe(x =>{
        //console.log(x);
  /*       if((String(x)=="VALID")||(String(x)=="valid"))
            this.step9Validition=true;
          else
            this.step9Validition=false;*/
          });  

   this.myFormSnmp.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step10Validition=true;
          else
            this.step10Validition=false;
          });  
   this.myFormHostname.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step11Validition=true;
          else
            this.step11Validition=false;
          });  

     }
  gotoFinalSubmit(val:any)
  {
     console.log("Final Submit in add-wizard....");
     console.log(val);

   
let myFormDhcpData=this.myFormDhcp.value;
let myFormDnsData=this.myFormDns.value;
let myFormInterfaceData=this.myFormLanInterface.value;
let myFormWanInterfaceData=this.myFormWanInterface.value;
let myFormSimApnData=this.myFormSimApn.value;
let myFormRadioData=this.myFormRadio.value;
let myFormCaptiveData=this.myFormCaptive.value;
let myFormVpnData=this.myFormVpn.value;
let myFormNtpData=this.myFormNtp.value;
let myFormSnmpData=this.myFormSnmp.value;
let myFormHostnameData=this.myFormHostname.value;


var dhcpProfile={};
var dhcpLanProfile={};
var dnsTempProfile={};

var getallTempProfile={};
var globalTempProfile={};
//dhcp Lan   
          dhcpLanProfile["interface"]=myFormDhcpData.interfaceName;
          dhcpLanProfile["start"]=myFormDhcpData.startAddress;
          dhcpLanProfile["limit"]=myFormDhcpData.limitAddresses;
          dhcpLanProfile["leaseTime"]=myFormDhcpData.leaseTime;
//dns      
          dnsTempProfile["domain"]=myFormDnsData.domain;
          dnsTempProfile["authoritative"]=myFormDnsData.authoritative;
          dnsTempProfile["bogusPriv"]=myFormDnsData.bogusPriv;
          dnsTempProfile["domainNeeded"]=myFormDnsData.domainNeeded;
          dnsTempProfile["expandHosts"]=myFormDnsData.expandHosts;
          dnsTempProfile["filterwin2k"]=myFormDnsData.filterwin2k;
          dnsTempProfile["localService"]=myFormDnsData.localService;
          dnsTempProfile["localiseQueries"]=myFormDnsData.localiseQueries;
          dnsTempProfile["noNegativeCache"]=myFormDnsData.noNegativeCache;
          dnsTempProfile["readEthers"]=myFormDnsData.readEthers;
          dnsTempProfile["rebindLocalHost"]=myFormDnsData.rebindLocalHost;
          dnsTempProfile["rebindProtection"]=myFormDnsData.rebindProtection;

          dhcpProfile["lan"]=dhcpLanProfile;
          dhcpProfile["dnsmasq"]=dnsTempProfile;
          
globalTempProfile["dhcp"]=dhcpProfile;

//LanInterface
   var lanIntProfile={};

          lanIntProfile["ifName"]=myFormInterfaceData.lanIfName;
          lanIntProfile["ipAddress"]=myFormInterfaceData.lanAddress;
          lanIntProfile["protoType"]=myFormInterfaceData.lanProtoType;
          lanIntProfile["subnet"]=myFormInterfaceData.subnet;

var interfaceProfile={};

interfaceProfile["LAN"]=lanIntProfile;
getallTempProfile["interfaces"]=interfaceProfile;

//Wan Interface
  var wanIntProfile={};
  var wwan0IntProfile={};
  var wwan1IntProfile={};

          wanIntProfile["ifName"]=myFormWanInterfaceData.wanIntName;
          wanIntProfile["protoType"]=myFormWanInterfaceData.wanProtoType;
          wwan0IntProfile["ifName"]=myFormWanInterfaceData.wwan0IntName;
          wwan0IntProfile["protoType"]=myFormWanInterfaceData.wwan0ProtoType;
          wwan0IntProfile["device"]=myFormWanInterfaceData.wwan0DeviceType;
          wwan1IntProfile["ifName"]=myFormWanInterfaceData.wwan1IntName;
          wwan1IntProfile["protoType"]=myFormWanInterfaceData.wwan1ProtoType;
          wwan1IntProfile["device"]=myFormWanInterfaceData.wwan1DeviceType;

interfaceProfile["WAN"]=wanIntProfile;
interfaceProfile["WWAN0"]=wwan0IntProfile;
interfaceProfile["WWAN1"]=wwan1IntProfile;

//SimApn
 var wwan0ApnProfile={};
  var wwan1ApnProfile={};
  var simApnProfile={};

          wwan0ApnProfile["apn"]=myFormSimApnData.wwan0Apn;
          wwan0ApnProfile["pin"]=myFormSimApnData.wwan0Pin;
          wwan1ApnProfile["apn"]=myFormSimApnData.wwan1Apn;
          wwan1ApnProfile["pin"]=myFormSimApnData.wwan1Pin;
  
simApnProfile["wwan0"]=wwan0ApnProfile;
simApnProfile["wwan1"]=wwan1ApnProfile;
          
globalTempProfile["simApnDetails"]=simApnProfile;

//radio

var radioProfile={};
var wlanProfile={};

          radioProfile["network"]=myFormRadioData.network;
          radioProfile["ssid"]=myFormRadioData.ssid;
          radioProfile["device"]=myFormRadioData.device;
          radioProfile["htmode"]=myFormRadioData.htmode;
          radioProfile["hwmode"]=myFormRadioData.hwmode;
          radioProfile["mode"]=myFormRadioData.mode;
          radioProfile["channel"]=myFormRadioData.channel;
          radioProfile["authenticationType"]=myFormRadioData.authenticationType;
        if(this.authenticationStatus=="psk")
          {
            radioProfile["key"]=myFormRadioData.key;
          }
            else        
            radioProfile["key"]="";

wlanProfile["radioDetails"]=radioProfile;
getallTempProfile["WLAN"]=wlanProfile;

//Captive Portal
var portalProfile={};

          portalProfile["nasIntf"]=myFormCaptiveData.nasIntf;
          portalProfile["portalIP"]=myFormCaptiveData.portalIP;
          portalProfile["portalPort"]=myFormCaptiveData.portalPort;
          portalProfile["redirectUrl"]=myFormCaptiveData.redirectUrl;

getallTempProfile["captivePortal"]=portalProfile;

//Vpn
var vpnProfile={};

          vpnProfile["VPNSERVER"]=myFormVpnData.vpnServer;
          vpnProfile["VPNEXTIP"]=myFormVpnData.vpnExtIp;
          vpnProfile["NETMASK"]=myFormVpnData.netmask;
          vpnProfile["LANIP"]=myFormVpnData.lanIP;

getallTempProfile["VPN"]=vpnProfile;

//Ntp
 var ntpProfile={};

          ntpProfile["enableServer"]=myFormNtpData.enableServer;
          ntpProfile["enabled"]=myFormNtpData.ntpStatus;
          ntpProfile["serverList"]=this.allNtpListProfiles
        
globalTempProfile["ntp"]=ntpProfile;
getallTempProfile["global"]=globalTempProfile;

//Snmp
var snmpProfile={};
var publicV2cProfile={};
var privateV2cProfile={};

          privateV2cProfile["group"]=myFormSnmpData.privateGroup;
          privateV2cProfile["secName"]=myFormSnmpData.privateSecName;
          privateV2cProfile["version"]=myFormSnmpData.privateVersion;
          publicV2cProfile["group"]=myFormSnmpData.publicGroup;
          publicV2cProfile["secName"]=myFormSnmpData.publicSecName;
          publicV2cProfile["version"]=myFormSnmpData.publicVersion;

          snmpProfile["privateV2c"]=privateV2cProfile;
          snmpProfile["publicV2c"]=publicV2cProfile;
         
getallTempProfile["SNMP"]=snmpProfile;

//hostname
getallTempProfile["hostname"]=myFormHostnameData.hostname;;




    let finalData = jQuery.extend(getallTempProfile,{"date":new Date().toISOString()});
console.log('/....finalData......');
console.log(finalData);
 //   let finalData = jQuery.extend(this.myForm.value,this.myFormIpv4.value,this.myFormIpv6.value,this.myFormImage.value,{"date":new Date().toISOString()});
 this.finalSubmitData.emit(finalData);
 this.closeModal.emit("yes");
 this.closeModalWizard.emit(val);
  }
}
