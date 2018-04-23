import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../commonServices/RPC.service";
import {CustomValidator} from "../../../commonServices/customValidator.service";
//import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from '../../../commonModules/multiSelect/types';

import {ARUBASETJSON} from "./arubaSetJson"

@Component({
 selector: 'aruba-APIN0205',
  templateUrl: './aruba_APIN0205.component.html',
  styleUrls: ['./aruba_APIN0205.component.scss'],
  providers:[RPCService]
})

export class ArubaConfigurationAddWizardComponent implements OnInit {
    public myFormDHCPPool      :FormGroup;
    public myFormRadius        :FormGroup;
    public myFormCaptive       :FormGroup;
    public myFormVPN           :FormGroup;
    public myFormRoutes        :FormGroup;
    public myFormRadio         :FormGroup;
    public myFormWlan          :FormGroup;
    public myFormSNMPCommunity :FormGroup;
    public myFormSNMPHost      :FormGroup;

    public submitted           :boolean;
    public events              :any[] = [];

    preemptionType             :string ="disable";
    userFailoverType           :string="disable";
    rfType                     :string="disable";
    radiusAccountingType       :string="Disabled";

    public captivePortalNames  = [];
    public authNames           = [];

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



authOptions: IMultiSelectOption[] = [];
 authData:any;

   step1Validition:boolean=true;
   step2Validition:boolean=true;
   step3Validition:boolean=true;
   step4Validition:boolean=false;
   step5Validition:boolean=false;
   step6Validition:boolean=false;
   step7Validition:boolean=false;
   step8Validition:boolean=true;


//Dhcp pool Details
poolName:FormControl;
network:FormControl;
subnet:FormControl;
gateway:FormControl;
poolType:FormControl;
vlan:FormControl;
excludeAddress:FormControl;
dnsServer:FormControl;
domainName:FormControl;
leaseTime:FormControl;

//Radius Details
radiusTemplate:FormControl;
sharedKey:FormControl;
authPort:FormControl;
acctPort:FormControl;
serverIP:FormControl;

//Captive Details
portalName:FormControl;
serverAddress:FormControl;
portalUrl:FormControl;
port:FormControl;
disableAutoWhitelist:FormControl;
useHTTPs:FormControl;

//vpn
vpnHoldTime:FormControl;
reconnectTimeOnFailover:FormControl;

//Routing Profile
destinationIP:FormControl;

//Radio
legacyMode:FormControl;
frequencyType:FormControl;
interferenceImmunityLevel:FormControl;
RF:FormControl;
spectrumMonitor:FormControl;
beaconPeriod:FormControl;

//Wlan
accessType:FormControl;
accountingInterval:FormControl;
assetSSID:FormControl;
captivePortalType:FormControl;
dtimInterval:FormControl;
inactivityTimeout:FormControl;
maxClientsThreshold:FormControl;
radiusAccounting:FormControl;
wlanStatus:FormControl;
bandType:FormControl;
broadcastSSID:FormControl;
accountingMode:FormControl;
authServer:FormControl;

//Snmp
readCommunity:FormControl;
snmpHostAddress:FormControl;
snmpVersion:FormControl;
snmpName:FormControl;


public poolTypes=['Local'];
public interferenceImmunityLevels=['0','1','2','3','4','5'];
public frequencyTypes=['2.4GHz','5GHz'];
public accessTypes=['guest'];
public bandTypes=['2.4','5.0','all'];
public dtimIntervals=['1','2','3','4','5','6','7','8','9','10'];

public captivePortalTypes=['external'];
public accountingModeTypes=['user-association','user-authentication'];
public snmpVersions = ['1','2c','3'];

showDhcpPoolTableErrorMsg:string = "none";
addDhcpPoolStatus:String="Disable";
dhcpPoolSelectedRowsForDeletion=[];
allDhcpPoolProfiles:any[]=[];

showRadiusTemplateTableErrorMsg:string = "none";
addRadiusTemplateStatus:String="Disable";
radiusTemplateSelectedRowsForDeletion=[];
allRadiusTemplateProfiles:any[]=[];

showCaptivePortalTableErrorMsg:string = "none";
addCaptivePortalStatus:String="Disable";
captivePortalSelectedRowsForDeletion=[];
allCaptivePortalProfiles:any[]=[];

showRoutingTableErrorMsg:string = "none";
addRoutingProfileStatus:String="Disable";
routingProfileSelectedRowsForDeletion=[];
allRoutingProfiles:any[]=[];

showRadioTableErrorMsg:string = "none";
addRadioProfileStatus:String="Disable";
radioProfileSelectedRowsForDeletion=[];
allRadioProfiles:any[]=[];

showWlanTableErrorMsg:string = "none";
addWlanProfileStatus:String="Disable";
wlanProfileSelectedRowsForDeletion=[];
allWlanProfiles:any[]=[];

showSnmpCommunityTableErrorMsg:string = "none";
addSnmpCommunityStatus:String="Disable";
snmpCommunitySelectedRowsForDeletion=[];
allSnmpCommunityProfiles:any[]=[];

showSNMPHostTableErrorMsg:string = "none";
addSNMPHostStatus:String="Disable";
snmpHostSelectedRowsForDeletion=[];
allSNMPHostProfiles:any[]=[];


  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  @Output() finalSubmitData= new EventEmitter<Object>();
  headers:Headers;

//testing............
dhcp:any = [];
radius:any = [];
route:any = [];
portal:any = [];
radio:any = [];
serviceSet:any=[];
snmpHost:any = [];
snmpComm:any = [];

primaryServerVpn;
backupServerVpn; 
ikepskVpn; 
userNameVpn; 
passwordVpn; 
fastFailoverVpn; 
preemptionVpn; 
holdTimeVpn; 
reconnectUserOnFailoverVpn; 
reconnectTimeOnFailoverVpn; 
monitorPktLostCntVpn; 
monitorPktSendFreqVpn; 

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {
 
     }

dhcpPoolAddProfiles(e){
  e.preventDefault();
  
      this.addDhcpPoolStatus=e.target.value;
      if(!this.myFormDHCPPool.contains("poolName"))
        {
          this.poolName= new FormControl('',[]);
          this.myFormDHCPPool.addControl("poolName",this.poolName);
        }  
     if(!this.myFormDHCPPool.contains("network"))
        {
          this.network= new FormControl('',[CustomValidator.ipv4AddressValidation]);
          this.myFormDHCPPool.addControl("network",this.network);
        }  
     if(!this.myFormDHCPPool.contains("subnet"))
        {
          this.subnet= new FormControl('',[CustomValidator.subnetValidation]);
          this.myFormDHCPPool.addControl("subnet",this.subnet);
        }  
    if(!this.myFormDHCPPool.contains("gateway"))
        {
          this.gateway= new FormControl('',[CustomValidator.ipv4AddressValidation]);
          this.myFormDHCPPool.addControl("gateway",this.gateway);
        }  
  if(!this.myFormDHCPPool.contains("poolType"))
        {
          this.poolType= new FormControl('',[]);
          this.myFormDHCPPool.addControl("poolType",this.poolType);
        }  
  if(!this.myFormDHCPPool.contains("vlan"))
        {
          this.vlan= new FormControl('',[]);
          this.myFormDHCPPool.addControl("vlan",this.vlan);
        }  
 if(!this.myFormDHCPPool.contains("excludeAddress"))
        {
          this.excludeAddress= new FormControl('',[CustomValidator.ipv4AddressValidation]);
          this.myFormDHCPPool.addControl("excludeAddress",this.excludeAddress);
        }  
  if(!this.myFormDHCPPool.contains("dnsServer"))
        {
          this.dnsServer= new FormControl('',[CustomValidator.ipv4AddressValidation]);
          this.myFormDHCPPool.addControl("dnsServer",this.dnsServer);
        }  

   if(!this.myFormDHCPPool.contains("domainName"))
        {
          this.domainName= new FormControl('',[]);
          this.myFormDHCPPool.addControl("domainName",this.domainName);
        }  
 if(!this.myFormDHCPPool.contains("leaseTime"))
        {
          this.leaseTime= new FormControl('',[CustomValidator.arubaLeaseTimeValidation]);
          this.myFormDHCPPool.addControl("leaseTime",this.leaseTime);
        }  

     if(this.allDhcpPoolProfiles.length>0)
     this.step1Validition=true;
     else
     this.step1Validition=false;

}   

radiusTemplateAddProfiles(e){
  e.preventDefault();
  this.addRadiusTemplateStatus=e.target.value;

      if(!this.myFormRadius.contains("radiusTemplate"))
        {
          this.radiusTemplate= new FormControl('',[]);
          this.myFormRadius.addControl("radiusTemplate",this.radiusTemplate);
        }  
     if(!this.myFormRadius.contains("serverIP"))
        {
          this.serverIP= new FormControl('',[CustomValidator.ipv4AddressValidation]);
          this.myFormRadius.addControl("serverIP",this.serverIP);
        }  
     if(!this.myFormRadius.contains("authPort"))
        {
          this.authPort= new FormControl('',[CustomValidator.motoAAAPortValidation]);
          this.myFormRadius.addControl("authPort",this.authPort);
        }  
    if(!this.myFormRadius.contains("acctPort"))
        {
          this.acctPort= new FormControl('',[CustomValidator.motoAAAPortValidation]);
          this.myFormRadius.addControl("acctPort",this.acctPort);
        }  
  if(!this.myFormRadius.contains("sharedKey"))
        {
          this.sharedKey= new FormControl('',[]);
          this.myFormRadius.addControl("sharedKey",this.sharedKey);
        }  
 if(this.allRadiusTemplateProfiles.length>0)
    this.step2Validition=true;
  else
    this.step2Validition=false;


}   


captivePortalAddProfiles(e){
  e.preventDefault();
  this.addCaptivePortalStatus=e.target.value;

      if(!this.myFormCaptive.contains("portalName"))
        {
          this.portalName= new FormControl('',[]);
          this.myFormCaptive.addControl("portalName",this.portalName);
        }  
     if(!this.myFormCaptive.contains("serverAddress"))
        {
          this.serverAddress= new FormControl('',[CustomValidator.ipv4AddressValidation]);
          this.myFormCaptive.addControl("serverAddress",this.serverAddress);
        }  
     if(!this.myFormCaptive.contains("port"))
        {
          this.port= new FormControl('',[CustomValidator.motoAAAPortValidation]);
          this.myFormCaptive.addControl("port",this.port);
        }  
    if(!this.myFormCaptive.contains("portalUrl"))
        {
          this.portalUrl= new FormControl('',[]);
          this.myFormCaptive.addControl("portalUrl",this.portalUrl);
        }  
  if(!this.myFormCaptive.contains("disableAutoWhitelist"))
        {
          this.disableAutoWhitelist= new FormControl('disable',[]);
          this.myFormCaptive.addControl("disableAutoWhitelist",this.disableAutoWhitelist);
        }  
  if(!this.myFormCaptive.contains("useHTTPs"))
        {
          this.useHTTPs= new FormControl('disable',[]);
          this.myFormCaptive.addControl("useHTTPs",this.useHTTPs);
        }        

 if(this.allCaptivePortalProfiles.length>0)
    this.step3Validition=true;
  else
    this.step3Validition=false;

}   

routingAddProfiles(e){
  e.preventDefault();
  console.log(e);
  console.log("in routingAddProfiles");
  console.log(this.allRoutingProfiles);
  this.addRoutingProfileStatus=e.target.value;

      if(!this.myFormRoutes.contains("destinationIP"))
        {
          this.destinationIP= new FormControl('',[CustomValidator.ipv4AddressValidation]);
          this.myFormRoutes.addControl("destinationIP",this.destinationIP);
        }  
     if(!this.myFormRoutes.contains("subnet"))
        {
          this.subnet= new FormControl('',[CustomValidator.subnetValidation]);
          this.myFormRoutes.addControl("subnet",this.subnet);
        }  
     if(!this.myFormRoutes.contains("gateway"))
        {
          this.gateway= new FormControl('',[CustomValidator.ipv4AddressValidation]);
          this.myFormRoutes.addControl("gateway",this.gateway);
        }  

    if(this.allRoutingProfiles.length>0)
     this.step5Validition=true;
    else
     this.step5Validition=false;     
}   

radioAddProfiles(e){
  e.preventDefault();
  console.log(e);
  console.log("in radioAddProfiles");
  console.log(this.allRadioProfiles);
  this.addRadioProfileStatus=e.target.value;

      if(!this.myFormRadio.contains("beaconPeriod"))
        {
          this.beaconPeriod= new FormControl('',[CustomValidator.arubaBeaconValidation]);
          this.myFormRadio.addControl("beaconPeriod",this.beaconPeriod);
        }  
     if(!this.myFormRadio.contains("interferenceImmunityLevel"))
        {
          this.interferenceImmunityLevel= new FormControl('',[]);
          this.myFormRadio.addControl("interferenceImmunityLevel",this.interferenceImmunityLevel);
        }  
     if(!this.myFormRadio.contains("frequencyType"))
        {
          this.frequencyType= new FormControl('',[]);
          this.myFormRadio.addControl("frequencyType",this.frequencyType);
        } 

    if(!this.myFormRadio.contains("legacyMode"))
        {
          this.legacyMode= new FormControl('disable',[]);
          this.myFormRadio.addControl("legacyMode",this.legacyMode);
        } 
     if(!this.myFormRadio.contains("spectrumMonitor"))
        {
          this.spectrumMonitor= new FormControl('disable',[]);
          this.myFormRadio.addControl("spectrumMonitor",this.spectrumMonitor);
        } 
    if(!this.myFormRadio.contains("RF"))
        {
          this.RF= new FormControl('disable',[]);
          this.myFormRadio.addControl("RF",this.RF);
        } 
  
    if(this.allRadioProfiles.length>0)
      this.step6Validition=true;
    else
      this.step6Validition=false;           
       
}  

wlanAddProfiles(e){
  e.preventDefault();
  this.addWlanProfileStatus=e.target.value;

      if(!this.myFormWlan.contains("wlanStatus"))
        {
          this.wlanStatus= new FormControl('Disabled',[]);
          this.myFormWlan.addControl("wlanStatus",this.wlanStatus);
        }  
   if(!this.myFormWlan.contains("broadcastSSID"))
        {
          this.broadcastSSID= new FormControl('Disabled',[]);
          this.myFormWlan.addControl("broadcastSSID",this.broadcastSSID);
        }          
     if(!this.myFormWlan.contains("assetSSID"))
        {
          this.assetSSID= new FormControl('',[]);
          this.myFormWlan.addControl("assetSSID",this.assetSSID);
        }  
     if(!this.myFormWlan.contains("accessType"))
        {
          this.accessType= new FormControl('',[]);
          this.myFormWlan.addControl("accessType",this.accessType);
        }  

     if(!this.myFormWlan.contains("bandType"))
        {
          this.bandType= new FormControl('',[]);
          this.myFormWlan.addControl("bandType",this.bandType);
        }  
    if(!this.myFormWlan.contains("inactivityTimeout"))
        {
          this.inactivityTimeout= new FormControl('',[CustomValidator.arubaInactivityValidation]);
          this.myFormWlan.addControl("inactivityTimeout",this.inactivityTimeout);
        }  
    if(!this.myFormWlan.contains("dtimInterval"))
        {
          this.dtimInterval= new FormControl('',[]);
          this.myFormWlan.addControl("dtimInterval",this.dtimInterval);
        }  
    if(!this.myFormWlan.contains("maxClientsThreshold"))
        {
          this.maxClientsThreshold= new FormControl('',[CustomValidator.arubaMaxClientsValidation]);
          this.myFormWlan.addControl("maxClientsThreshold",this.maxClientsThreshold);
        }  
 if(!this.myFormWlan.contains("vlan"))
        {
          this.vlan= new FormControl('',[]);
          this.myFormWlan.addControl("vlan",this.vlan);
        } 
 if(!this.myFormWlan.contains("captivePortalType"))
        {
          this.captivePortalType= new FormControl('',[]);
          this.myFormWlan.addControl("captivePortalType",this.captivePortalType);
        } 
 if(!this.myFormWlan.contains("portalName"))
        {
          this.portalName= new FormControl('',[]);
          this.myFormWlan.addControl("portalName",this.portalName);
        } 
 if(!this.myFormWlan.contains("radiusAccounting"))
        {
          this.radiusAccounting= new FormControl('Disabled',[]);
          this.myFormWlan.addControl("radiusAccounting",this.radiusAccounting);
        } 
 if(!this.myFormWlan.contains("accountingMode"))
        {
          this.accountingMode= new FormControl('',[]);
          this.myFormWlan.addControl("accountingMode",this.accountingMode);
        } 
 if(!this.myFormWlan.contains("accountingInterval"))
        {
          this.accountingInterval= new FormControl('',[CustomValidator.arubaAccountingIntervalValidation]);
          this.myFormWlan.addControl("accountingInterval",this.accountingInterval);
        }
   if(!this.myFormWlan.contains("radiusTemplate"))
        {
          this.radiusTemplate= new FormControl([],[]);
          this.myFormWlan.addControl("radiusTemplate",this.radiusTemplate);
        }        

   if(this.allWlanProfiles.length>0)
      this.step7Validition=true;
    else
      this.step7Validition=false;     

}   

snmpCommunityAddProfiles(e){
  e.preventDefault();
  this.addSnmpCommunityStatus=e.target.value;

      if(!this.myFormSNMPCommunity.contains("readCommunity"))
        {
          this.readCommunity= new FormControl('',[]);
          this.myFormSNMPCommunity.addControl("readCommunity",this.readCommunity);
        }  
}    

snmpHostAddProfiles(e){
  e.preventDefault();
  this.addSNMPHostStatus=e.target.value;

      if(!this.myFormSNMPHost.contains("snmpHostAddress"))
        {
          this.snmpHostAddress= new FormControl('',[]);
          this.myFormSNMPHost.addControl("snmpHostAddress",this.snmpHostAddress);
        }  
      if(!this.myFormSNMPHost.contains("snmpVersion"))
        {
          this.snmpVersion= new FormControl('',[]);
          this.myFormSNMPHost.addControl("snmpVersion",this.snmpVersion);
        }  
      if(!this.myFormSNMPHost.contains("snmpName"))
        {
          this.snmpName= new FormControl('',[]);
          this.myFormSNMPHost.addControl("snmpName",this.snmpName);
        }  
}   



cancelDhcpPoolProfiles(e){
  e.preventDefault();
   
    this.addDhcpPoolStatus=e.target.value;
    if(this.myFormDHCPPool.contains("poolName"))
        this.myFormDHCPPool.removeControl("poolName");
    if(this.myFormDHCPPool.contains("poolType"))
        this.myFormDHCPPool.removeControl("poolType");
    if(this.myFormDHCPPool.contains("vlan"))
        this.myFormDHCPPool.removeControl("vlan");
    if(this.myFormDHCPPool.contains("subnet"))
        this.myFormDHCPPool.removeControl("subnet");
    if(this.myFormDHCPPool.contains("network"))
        this.myFormDHCPPool.removeControl("network");
    if(this.myFormDHCPPool.contains("excludeAddress"))
        this.myFormDHCPPool.removeControl("excludeAddress");
   if(this.myFormDHCPPool.contains("gateway"))
        this.myFormDHCPPool.removeControl("gateway");
     if(this.myFormDHCPPool.contains("dnsServer"))
        this.myFormDHCPPool.removeControl("dnsServer");
      if(this.myFormDHCPPool.contains("domainName"))
        this.myFormDHCPPool.removeControl("domainName");         
   if(this.myFormDHCPPool.contains("leaseTime"))
        this.myFormDHCPPool.removeControl("leaseTime");

    this.showDhcpPoolTableErrorMsg="none";

     if(this.allDhcpPoolProfiles.length>0)
     this.step1Validition=true;
     else
     this.step1Validition=false;
}

cancelRadiusTemplateProfiles(e){
  e.preventDefault();
  this.addRadiusTemplateStatus=e.target.value;

    if(this.myFormRadius.contains("radiusTemplate"))
        this.myFormRadius.removeControl("radiusTemplate");
    if(this.myFormRadius.contains("sharedKey"))
        this.myFormRadius.removeControl("sharedKey");
    if(this.myFormRadius.contains("authPort"))
        this.myFormRadius.removeControl("authPort");
    if(this.myFormRadius.contains("acctPort"))
        this.myFormRadius.removeControl("acctPort");
    if(this.myFormRadius.contains("serverIP"))
        this.myFormRadius.removeControl("serverIP");   

    this.showRadiusTemplateTableErrorMsg="none";

    if(this.allRadiusTemplateProfiles.length>0)
       this.step2Validition=true;
    else
       this.step2Validition=false;

}


cancelCaptivePortalProfiles(e){
  e.preventDefault();
  this.addCaptivePortalStatus=e.target.value;

    if(this.myFormCaptive.contains("portalName"))
        this.myFormCaptive.removeControl("portalName");
    if(this.myFormCaptive.contains("serverAddress"))
        this.myFormCaptive.removeControl("serverAddress");
    if(this.myFormCaptive.contains("portalUrl"))
        this.myFormCaptive.removeControl("portalUrl");
    if(this.myFormCaptive.contains("port"))
        this.myFormCaptive.removeControl("port");
    if(this.myFormCaptive.contains("disableAutoWhitelist"))
        this.myFormCaptive.removeControl("disableAutoWhitelist");   
    if(this.myFormCaptive.contains("useHTTPs"))
        this.myFormCaptive.removeControl("useHTTPs");  

    this.showCaptivePortalTableErrorMsg="none";

     if(this.allCaptivePortalProfiles.length>0)
     this.step3Validition=true;
     else
     this.step3Validition=false;

}


cancelRoutingProfiles(e){
  e.preventDefault();
  this.addRoutingProfileStatus=e.target.value;

    if(this.myFormRoutes.contains("destinationIP"))
        this.myFormRoutes.removeControl("destinationIP");
    if(this.myFormRoutes.contains("subnet"))
        this.myFormRoutes.removeControl("subnet");
    if(this.myFormRoutes.contains("gateway"))
        this.myFormRoutes.removeControl("gateway");
   
    this.showRoutingTableErrorMsg="none";

     if(this.allRoutingProfiles.length>0)
      this.step5Validition=true;
     else
      this.step5Validition=false;

}
cancelRadioProfiles(e){
  e.preventDefault();
  this.addRadioProfileStatus=e.target.value;

    if(this.myFormRadio.contains("legacyMode"))
        this.myFormRadio.removeControl("legacyMode");
    if(this.myFormRadio.contains("frequencyType"))
        this.myFormRadio.removeControl("frequencyType");
    if(this.myFormRadio.contains("interferenceImmunityLevel"))
        this.myFormRadio.removeControl("interferenceImmunityLevel");
    if(this.myFormRadio.contains("RF"))
        this.myFormRadio.removeControl("RF");
    if(this.myFormRadio.contains("beaconPeriod"))
        this.myFormRadio.removeControl("beaconPeriod");
    if(this.myFormRadio.contains("spectrumMonitor"))
        this.myFormRadio.removeControl("spectrumMonitor");

    this.showRadioTableErrorMsg="none";

    if(this.allRadioProfiles.length>0)
      this.step6Validition=true;
     else
      this.step6Validition=false;

}

cancelWlanProfiles(e){
  e.preventDefault();
  this.addWlanProfileStatus=e.target.value;

    if(this.myFormWlan.contains("accessType"))
        this.myFormWlan.removeControl("accessType");
    if(this.myFormWlan.contains("accountingInterval"))
        this.myFormWlan.removeControl("accountingInterval");
    if(this.myFormWlan.contains("assetSSID"))
        this.myFormWlan.removeControl("assetSSID");
    if(this.myFormWlan.contains("captivePortalType"))
        this.myFormWlan.removeControl("captivePortalType");
    if(this.myFormWlan.contains("dtimInterval"))
        this.myFormWlan.removeControl("dtimInterval");
    if(this.myFormWlan.contains("inactivityTimeout"))
        this.myFormWlan.removeControl("inactivityTimeout");
    if(this.myFormWlan.contains("maxClientsThreshold"))
        this.myFormWlan.removeControl("maxClientsThreshold");
    if(this.myFormWlan.contains("portalName"))
        this.myFormWlan.removeControl("portalName");
    if(this.myFormWlan.contains("radiusAccounting"))
        this.myFormWlan.removeControl("radiusAccounting");
    if(this.myFormWlan.contains("wlanStatus"))
        this.myFormWlan.removeControl("wlanStatus");
    if(this.myFormWlan.contains("vlan"))
        this.myFormWlan.removeControl("vlan");
    if(this.myFormWlan.contains("bandType"))
        this.myFormWlan.removeControl("bandType");
    if(this.myFormWlan.contains("broadcastSSID"))
        this.myFormWlan.removeControl("broadcastSSID");
    if(this.myFormWlan.contains("accountingMode"))
        this.myFormWlan.removeControl("accountingMode");

  if(this.myFormWlan.contains("radiusTemplate"))
        this.myFormWlan.removeControl("radiusTemplate");

    this.showWlanTableErrorMsg="none";

    if(this.allWlanProfiles.length>0)
      this.step7Validition=true;
     else
      this.step7Validition=false;
    

}

cancelSnmpCommunity(e){
  e.preventDefault();
  this.addSnmpCommunityStatus=e.target.value;

    if(this.myFormSNMPCommunity.contains("readCommunity"))
        this.myFormSNMPCommunity.removeControl("readCommunity");
  
    this.showSnmpCommunityTableErrorMsg="none";
}

cancelSNMPHostProfiles(e){
  e.preventDefault();
  this.addSNMPHostStatus=e.target.value;

    if(this.myFormSNMPHost.contains("snmpHostAddress"))
        this.myFormSNMPHost.removeControl("snmpHostAddress");
     if(this.myFormSNMPHost.contains("snmpName"))
        this.myFormSNMPHost.removeControl("snmpName");
   if(this.myFormSNMPHost.contains("snmpVersion"))
        this.myFormSNMPHost.removeControl("snmpVersion");

    this.showSNMPHostTableErrorMsg="none";
}

submitDhcpPoolProfiles(e)
{
//  console.log(e);
  e.preventDefault();
   let poolName = this.myFormDHCPPool.controls.poolName.value;
   let network = this.myFormDHCPPool.controls.network.value;
   let subnet = this.myFormDHCPPool.controls.subnet.value;
   let gateway = this.myFormDHCPPool.controls.gateway.value;
   let poolType = this.myFormDHCPPool.controls.poolType.value;
   let vlan = this.myFormDHCPPool.controls.vlan.value;
 //  let excludeAddress = this.myFormDHCPPool.controls.excludeAddress.value;
   let dnsServer = this.myFormDHCPPool.controls.dnsServer.value;
   let domainName = this.myFormDHCPPool.controls.domainName.value;
//   let leaseTime = this.myFormDHCPPool.controls.leaseTime.value;

  if((String(poolName).length>0)&&(String(network).length>0)&&(String(subnet).length>0)&&
     (String(gateway).length>0)&&(String(poolType).length>0)&&(String(vlan).length>0)
     &&(String(dnsServer).length>0)&&(String(domainName).length>0))
  {
    this.showDhcpPoolTableErrorMsg="none";
     if((this.myFormDHCPPool.controls.poolName.errors==null)&&
        (this.myFormDHCPPool.controls.network.errors==null)&&
        (this.myFormDHCPPool.controls.subnet.errors==null)&&
        (this.myFormDHCPPool.controls.gateway.errors==null)&&
        (this.myFormDHCPPool.controls.poolType.errors==null)&&
        (this.myFormDHCPPool.controls.vlan.errors==null)&&
        (this.myFormDHCPPool.controls.dnsServer.errors==null)&&       
        (this.myFormDHCPPool.controls.domainName.errors==null))
        {
        this.allDhcpPoolProfiles.push({
                  "id": new Date().getTime(), 
                 "poolName" : this.myFormDHCPPool.controls.poolName.value,
                 "network" : this.myFormDHCPPool.controls.network.value,
                 "subnet" : this.myFormDHCPPool.controls.subnet.value,
                 "gateway" : this.myFormDHCPPool.controls.gateway.value,
                 "poolType" : this.myFormDHCPPool.controls.poolType.value,
                 "vlan" : this.myFormDHCPPool.controls.vlan.value,
                 "excludeAddress" : this.myFormDHCPPool.controls.excludeAddress.value,
                 "dnsServer" : this.myFormDHCPPool.controls.dnsServer.value,     
                 "domainName" : this.myFormDHCPPool.controls.domainName.value,
                 "leaseTime" : this.myFormDHCPPool.controls.leaseTime.value,

                        });
    this.myFormDHCPPool.controls.poolName.setValue([]);
    this.myFormDHCPPool.controls.network.setValue([]);
    this.myFormDHCPPool.controls.subnet.setValue([]);
    this.myFormDHCPPool.controls.gateway.setValue([]);
    this.myFormDHCPPool.controls.poolType.setValue([]);
    this.myFormDHCPPool.controls.vlan.setValue([]);
    this.myFormDHCPPool.controls.excludeAddress.setValue([]);
    this.myFormDHCPPool.controls.dnsServer.setValue([]); 
    this.myFormDHCPPool.controls.domainName.setValue([]);
    this.myFormDHCPPool.controls.leaseTime.setValue([]);
  
    this.addDhcpPoolStatus="Disable";
  }
  }
  else
  {
    //show error msg
    this.showDhcpPoolTableErrorMsg="block";
//    console.log(this.showPortalTableErrorMsg);
  }
  if(this.allDhcpPoolProfiles.length>0)
    this.step1Validition=true;
  else
    this.step1Validition=false;

}

submitRadiusTemplateProfiles(e)
{
  e.preventDefault();
   let radiusTemplate = this.myFormRadius.controls.radiusTemplate.value;
   let sharedKey = this.myFormRadius.controls.sharedKey.value;
   let authPort = this.myFormRadius.controls.authPort.value;
   let acctPort = this.myFormRadius.controls.acctPort.value;
   let serverIP = this.myFormRadius.controls.serverIP.value;
  
  if((String(radiusTemplate).length>0)&&(String(sharedKey).length>0)&&(String(authPort).length>0)&&
     (String(acctPort).length>0)&&(String(serverIP).length>0))
  {
    this.showRadiusTemplateTableErrorMsg="none";
     if((this.myFormRadius.controls.radiusTemplate.errors==null)&&
        (this.myFormRadius.controls.sharedKey.errors==null)&&
        (this.myFormRadius.controls.authPort.errors==null)&&
        (this.myFormRadius.controls.acctPort.errors==null)&&
        (this.myFormRadius.controls.serverIP.errors==null))
        {
        this.allRadiusTemplateProfiles.push({
                  "id": new Date().getTime(), 
                 "radiusTemplate" : this.myFormRadius.controls.radiusTemplate.value,
                 "sharedKey" : this.myFormRadius.controls.sharedKey.value,
                 "authPort" : this.myFormRadius.controls.authPort.value,
                 "acctPort" : this.myFormRadius.controls.acctPort.value,
                 "serverIP" : this.myFormRadius.controls.serverIP.value
                        });
    this.myFormRadius.controls.radiusTemplate.setValue([]);
    this.myFormRadius.controls.sharedKey.setValue([]);
    this.myFormRadius.controls.authPort.setValue([]);
    this.myFormRadius.controls.acctPort.setValue([]);
    this.myFormRadius.controls.serverIP.setValue([]);
  
    this.addRadiusTemplateStatus="Disable";
  }
  }
  else
  {
    this.showRadiusTemplateTableErrorMsg="block";
  }
  if(this.allRadiusTemplateProfiles.length>0)
    this.step2Validition=true;
  else
    this.step2Validition=false;
}

submitCaptivePortalProfiles(e)
{
  e.preventDefault();
   let portalName = this.myFormCaptive.controls.portalName.value;
   let port = this.myFormCaptive.controls.port.value;
   let serverAddress = this.myFormCaptive.controls.serverAddress.value;
   let portalUrl = this.myFormCaptive.controls.portalUrl.value;
   let useHTTPs = this.myFormCaptive.controls.useHTTPs.value;
   let disableAutoWhitelist = this.myFormCaptive.controls.disableAutoWhitelist.value;


  if((String(portalName).length>0)&&(String(port).length>0)&&(String(serverAddress).length>0)&&
     (String(portalUrl).length>0)&&(String(useHTTPs).length>0)&&(String(disableAutoWhitelist).length>0))
  {
    this.showCaptivePortalTableErrorMsg="none";
     if((this.myFormCaptive.controls.portalName.errors==null)&&
        (this.myFormCaptive.controls.port.errors==null)&&
        (this.myFormCaptive.controls.serverAddress.errors==null)&&
        (this.myFormCaptive.controls.portalUrl.errors==null)&&
        (this.myFormCaptive.controls.useHTTPs.errors==null)&&        
        (this.myFormCaptive.controls.disableAutoWhitelist.errors==null))
        {
        this.allCaptivePortalProfiles.push({
                  "id": new Date().getTime(), 
                 "portalName" : this.myFormCaptive.controls.portalName.value,
                 "port" : this.myFormCaptive.controls.port.value,
                 "serverAddress" : this.myFormCaptive.controls.serverAddress.value,
                 "portalUrl" : this.myFormCaptive.controls.portalUrl.value,
                 "useHTTPs" : this.myFormCaptive.controls.useHTTPs.value,                 
                 "disableAutoWhitelist" : this.myFormCaptive.controls.disableAutoWhitelist.value
                        });
    this.myFormCaptive.controls.portalName.setValue([]);
    this.myFormCaptive.controls.port.setValue([]);
    this.myFormCaptive.controls.serverAddress.setValue([]);
    this.myFormCaptive.controls.portalUrl.setValue([]);
    this.myFormCaptive.controls.useHTTPs.setValue([]);
    this.myFormCaptive.controls.disableAutoWhitelist.setValue([]);
 
    this.addCaptivePortalStatus="Disable";
  }
  }
  else
  {
    this.showCaptivePortalTableErrorMsg="block";
  }
  if(this.allCaptivePortalProfiles.length>0)
    this.step3Validition=true;
  else
    this.step3Validition=false;
}

submitRoutingProfiles(e)
{
  e.preventDefault();
   let destinationIP = this.myFormRoutes.controls.destinationIP.value;
   let subnet = this.myFormRoutes.controls.subnet.value;
   let gateway = this.myFormRoutes.controls.gateway.value;
  
  
  if((String(destinationIP).length>0)&&(String(subnet).length>0)&&(String(gateway).length>0))
  {
    this.showRoutingTableErrorMsg="none";
     if((this.myFormRoutes.controls.destinationIP.errors==null)&&
        (this.myFormRoutes.controls.subnet.errors==null)&&
        (this.myFormRoutes.controls.gateway.errors==null))
        {
        this.allRoutingProfiles.push({
                  "id": new Date().getTime(), 
                 "destinationIP" : this.myFormRoutes.controls.destinationIP.value,
                 "subnet" : this.myFormRoutes.controls.subnet.value,
                 "gateway" : this.myFormRoutes.controls.gateway.value
                        });
    this.myFormRoutes.controls.destinationIP.setValue([]);
    this.myFormRoutes.controls.subnet.setValue([]);
    this.myFormRoutes.controls.gateway.setValue([]);
  
    this.addRoutingProfileStatus="Disable";
  }
  }
  else
  {
    this.showRoutingTableErrorMsg="block";
  }
  if(this.allRoutingProfiles.length>0)
    this.step5Validition=true;
  else
    this.step5Validition=false;
}

submitRadioProfiles(e)
{
//  console.log(e);
  e.preventDefault();
   let legacyMode = this.myFormRadio.controls.legacyMode.value;
   let frequencyType = this.myFormRadio.controls.frequencyType.value;
   let interferenceImmunityLevel = this.myFormRadio.controls.interferenceImmunityLevel.value;
   let RF = this.myFormRadio.controls.RF.value;
   let beaconPeriod = this.myFormRadio.controls.beaconPeriod.value;
   let spectrumMonitor = this.myFormRadio.controls.spectrumMonitor.value;
 

  if((String(legacyMode).length>0)&&(String(frequencyType).length>0)&&(String(interferenceImmunityLevel).length>0)&&
     (String(RF).length>0)&&(String(beaconPeriod).length>0)&&(String(spectrumMonitor).length>0))
  {
    this.showRadioTableErrorMsg="none";
     if((this.myFormRadio.controls.legacyMode.errors==null)&&
        (this.myFormRadio.controls.frequencyType.errors==null)&&
        (this.myFormRadio.controls.interferenceImmunityLevel.errors==null)&&
        (this.myFormRadio.controls.RF.errors==null)&&
        (this.myFormRadio.controls.beaconPeriod.errors==null)&&
        (this.myFormRadio.controls.spectrumMonitor.errors==null))
        {
        this.allRadioProfiles.push({
                  "id": new Date().getTime(), 
                 "legacyMode" : this.myFormRadio.controls.legacyMode.value,
                 "frequencyType" : this.myFormRadio.controls.frequencyType.value,
                 "interferenceImmunityLevel" : this.myFormRadio.controls.interferenceImmunityLevel.value,
                 "RF" : this.myFormRadio.controls.RF.value,
                 "beaconPeriod" : this.myFormRadio.controls.beaconPeriod.value,
                 "spectrumMonitor" : this.myFormRadio.controls.spectrumMonitor.value,
   
                        });
    this.myFormRadio.controls.legacyMode.setValue([]);
    this.myFormRadio.controls.frequencyType.setValue([]);
    this.myFormRadio.controls.interferenceImmunityLevel.setValue([]);
    this.myFormRadio.controls.RF.setValue([]);
    this.myFormRadio.controls.beaconPeriod.setValue([]);
    this.myFormRadio.controls.spectrumMonitor.setValue([]);
   
  
    this.addRadioProfileStatus="Disable";
  }
  }
  else
  {
    //show error msg
    this.showRadioTableErrorMsg="block";
//    console.log(this.showPortalTableErrorMsg);
  }
  if(this.allRadioProfiles.length>0)
    this.step6Validition=true;
  else
    this.step6Validition=false;
}


submitWlanProfiles(e)
{
//  console.log(e);
  e.preventDefault();
   let wlanStatus = this.myFormWlan.controls.wlanStatus.value;
   let broadcastSSID = this.myFormWlan.controls.broadcastSSID.value;
   let assetSSID = this.myFormWlan.controls.assetSSID.value;
   let accessType = this.myFormWlan.controls.accessType.value;
   let bandType = this.myFormWlan.controls.bandType.value;
   let inactivityTimeout = this.myFormWlan.controls.inactivityTimeout.value;
   let dtimInterval = this.myFormWlan.controls.dtimInterval.value;
   let maxClientsThreshold = this.myFormWlan.controls.maxClientsThreshold.value;
   let vlan = this.myFormWlan.controls.vlan.value;
   let captivePortalType = this.myFormWlan.controls.captivePortalType.value;
   let portalName = this.myFormWlan.controls.portalName.value;
   let radiusAccounting = this.myFormWlan.controls.radiusAccounting.value;
    let accountingMode = this.myFormWlan.controls.accountingMode.value;
   let accountingInterval = this.myFormWlan.controls.accountingInterval.value;


let authFullData = this.authData.filter(val => this.myFormWlan.controls.radiusTemplate.value.includes(val.id));;
    let auths=[]
          authFullData.forEach(ele => {
            auths.push({"radiusTemplate" : ele.radiusTemplate});
          });


  if((String(wlanStatus).length>0)&&(String(broadcastSSID).length>0)&&(String(assetSSID).length>0)&&
     (String(accessType).length>0)&&(String(bandType).length>0)&&(String(inactivityTimeout).length>0)
     &&(String(dtimInterval).length>0)&&(String(maxClientsThreshold).length>0)&&(String(vlan).length>0)&&(String(captivePortalType).length>0)
     &&(String(portalName).length>0)&&(String(radiusAccounting).length>0)&&(String(accountingMode).length>0)&&(String(accountingInterval).length>0))
  {
    this.showWlanTableErrorMsg="none";
     if((this.myFormWlan.controls.wlanStatus.errors==null)&&
        (this.myFormWlan.controls.broadcastSSID.errors==null)&&
        (this.myFormWlan.controls.assetSSID.errors==null)&&
        (this.myFormWlan.controls.accessType.errors==null)&&
        (this.myFormWlan.controls.bandType.errors==null)&&
        (this.myFormWlan.controls.inactivityTimeout.errors==null)&&
        (this.myFormWlan.controls.dtimInterval.errors==null)&&
        (this.myFormWlan.controls.maxClientsThreshold.errors==null)&&
        (this.myFormWlan.controls.vlan.errors==null)&&
        (this.myFormWlan.controls.captivePortalType.errors==null)&&
        (this.myFormWlan.controls.portalName.errors==null)&&
        (this.myFormWlan.controls.radiusAccounting.errors==null)&&
        (this.myFormWlan.controls.accountingMode.errors==null)&&
        (this.myFormWlan.controls.accountingInterval.errors==null))
        {
        this.allWlanProfiles.push({
                  "id": new Date().getTime(), 
                 "wlanStatus" : this.myFormWlan.controls.wlanStatus.value,
                 "broadcastSSID" : this.myFormWlan.controls.broadcastSSID.value,
                  "assetSSID" : this.myFormWlan.controls.assetSSID.value,
                 "accessType" : this.myFormWlan.controls.accessType.value,
                 "bandType" : this.myFormWlan.controls.bandType.value,
                 "inactivityTimeout" : this.myFormWlan.controls.inactivityTimeout.value,
                 "dtimInterval" : this.myFormWlan.controls.dtimInterval.value,
                 "maxClientsThreshold" : this.myFormWlan.controls.maxClientsThreshold.value,
                 "vlan" : this.myFormWlan.controls.vlan.value,
                 "captivePortalType" : this.myFormWlan.controls.captivePortalType.value,
                 "portalName" : this.myFormWlan.controls.portalName.value,
                 "radiusAccounting" : this.myFormWlan.controls.radiusAccounting.value,
                 "accountingMode" : this.myFormWlan.controls.accountingMode.value,
                 "accountingInterval" : this.myFormWlan.controls.accountingInterval.value,
                  "authServers" : auths,

                        });
    this.myFormWlan.controls.wlanStatus.setValue([]);
    this.myFormWlan.controls.broadcastSSID.setValue([]);
    this.myFormWlan.controls.assetSSID.setValue([]);    
    this.myFormWlan.controls.accessType.setValue([]);
    this.myFormWlan.controls.bandType.setValue([]);
    this.myFormWlan.controls.inactivityTimeout.setValue([]);
    this.myFormWlan.controls.maxClientsThreshold.setValue([]);
    this.myFormWlan.controls.dtimInterval.setValue([]);
    this.myFormWlan.controls.vlan.setValue([]);
    this.myFormWlan.controls.captivePortalType.setValue([]);
    this.myFormWlan.controls.portalName.setValue([]);
    this.myFormWlan.controls.radiusAccounting.setValue([]);
    this.myFormWlan.controls.accountingMode.setValue([]);
    this.myFormWlan.controls.accountingInterval.setValue([]);
     this.myFormWlan.controls.radiusTemplate.setValue([]);
 
  
    this.addWlanProfileStatus="Disable";
  }
  }
  else
  {
    //show error msg
    this.showWlanTableErrorMsg="block";
//    console.log(this.showPortalTableErrorMsg);
  }
  if(this.allWlanProfiles.length>0)
    this.step7Validition=true;
  else
    this.step7Validition=false;

}

submitSNMPHostProfiles(e)
{
//  console.log(e);
  e.preventDefault();
   let snmpHostAddress = this.myFormSNMPHost.controls.snmpHostAddress.value;
   let snmpName = this.myFormSNMPHost.controls.snmpName.value;
   let snmpVersion = this.myFormSNMPHost.controls.snmpVersion.value;



  if((String(snmpHostAddress).length>0)&&(String(snmpName).length>0)&&(String(snmpVersion).length>0))
  {
    this.showSNMPHostTableErrorMsg="none";
     if((this.myFormSNMPHost.controls.snmpHostAddress.errors==null)&&
        (this.myFormSNMPHost.controls.snmpName.errors==null)&&
        (this.myFormSNMPHost.controls.snmpVersion.errors==null))
        {
        this.allSNMPHostProfiles.push({
                  "id": new Date().getTime(), 
                 "snmpHostAddress" : this.myFormSNMPHost.controls.snmpHostAddress.value, 
                 "snmpVersion" : this.myFormSNMPHost.controls.snmpVersion.value, 
                 "snmpName" : this.myFormSNMPHost.controls.snmpName.value, 

                        });
    this.myFormSNMPHost.controls.snmpHostAddress.setValue([]);
      this.myFormSNMPHost.controls.snmpVersion.setValue([]);
    this.myFormSNMPHost.controls.snmpName.setValue([]);

    this.addSNMPHostStatus="Disable";
  }
  }
  else
  {
    this.showSNMPHostTableErrorMsg="block";
  }
  if(this.allSNMPHostProfiles.length>0 && this.allSnmpCommunityProfiles.length>0)
    this.step8Validition=true;
}


submitSnmpCommunity(e)
{
//  console.log(e);
  e.preventDefault();
   let readCommunity = this.myFormSNMPCommunity.controls.readCommunity.value;
    
  if((String(readCommunity).length>0))
  {
    this.showSnmpCommunityTableErrorMsg="none";
     if((this.myFormSNMPCommunity.controls.readCommunity.errors==null))
        {
        this.allSnmpCommunityProfiles.push({
                  "id": new Date().getTime(), 
                 "readCommunity" : this.myFormSNMPCommunity.controls.readCommunity.value,   
                        });
    this.myFormSNMPCommunity.controls.readCommunity.setValue([]);
  
    this.addSnmpCommunityStatus="Disable";
  }
  }
  else
  {
    this.showSnmpCommunityTableErrorMsg="block";
  }
  if(this.allSnmpCommunityProfiles.length>0 && this.allSNMPHostProfiles.length>0)
    this.step8Validition=true;
}



maintainDhcpPoolSelectedData(e,val)
{
 
  if(e.target.checked)
  {
    if(this.dhcpPoolSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.dhcpPoolSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.dhcpPoolSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.dhcpPoolSelectedRowsForDeletion.splice(index,1);
  }
}

maintainRadiusTemplateSelectedData(e,val)
{
  
  if(e.target.checked)
  {
    if(this.radiusTemplateSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.radiusTemplateSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.radiusTemplateSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.radiusTemplateSelectedRowsForDeletion.splice(index,1);
  }
}
maintainCaptivePortalSelectedData(e,val)
{
  
  if(e.target.checked)
  {
    if(this.captivePortalSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.captivePortalSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.captivePortalSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.captivePortalSelectedRowsForDeletion.splice(index,1);
  }
}
maintainRoutingSelectedData(e,val)
{
 
  if(e.target.checked)
  {
    if(this.routingProfileSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.routingProfileSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.routingProfileSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.routingProfileSelectedRowsForDeletion.splice(index,1);
  }
}

maintainRadioSelectedData(e,val)
{
  if(e.target.checked)
  {
    if(this.radioProfileSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.radioProfileSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.radioProfileSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.radioProfileSelectedRowsForDeletion.splice(index,1);
  }
}

maintainWlanSelectedData(e,val)
{
  if(e.target.checked)
  {
    if(this.wlanProfileSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.wlanProfileSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.wlanProfileSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.wlanProfileSelectedRowsForDeletion.splice(index,1);
  }
}

maintainSnmpCommunitySelectedData(e,val)
{
  if(e.target.checked)
  {
    if(this.snmpCommunitySelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.snmpCommunitySelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.snmpCommunitySelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.snmpCommunitySelectedRowsForDeletion.splice(index,1);
  }
}

maintainSNMPHostSelectedData(e,val)
{
  if(e.target.checked)
  {
    if(this.snmpHostSelectedRowsForDeletion.findIndex(ele =>ele.id==val.id)<0)
      this.snmpHostSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.snmpHostSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.snmpHostSelectedRowsForDeletion.splice(index,1);
  }
}


deleteDhcpPoolSelectedProfiles(e)
{
  e.preventDefault();
   this.dhcpPoolSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allDhcpPoolProfiles.findIndex(val => val.id==ele.id);
    this.allDhcpPoolProfiles.splice(index,1);
  })
  this.dhcpPoolSelectedRowsForDeletion=[];
  if(this.dhcpPoolSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }
    if(this.allDhcpPoolProfiles.length>0)
    this.step1Validition=true;
  else
    this.step1Validition=false;

}

deleteRadiusTemplateSelectedProfiles(e)
{
  e.preventDefault();
   this.radiusTemplateSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allRadiusTemplateProfiles.findIndex(val => val.id==ele.id);
    this.allRadiusTemplateProfiles.splice(index,1);
  })
  this.radiusTemplateSelectedRowsForDeletion=[];
  if(this.radiusTemplateSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }

  if(this.allRadiusTemplateProfiles.length>0)
    this.step2Validition=true;
  else
    this.step2Validition=false; 

}

deleteCaptivePortalSelectedProfiles(e)
{
  e.preventDefault();
   this.captivePortalSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allCaptivePortalProfiles.findIndex(val => val.id==ele.id);
    this.allCaptivePortalProfiles.splice(index,1);
  })
  this.captivePortalSelectedRowsForDeletion=[];
  if(this.captivePortalSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }
   if(this.allCaptivePortalProfiles.length>0)
    this.step3Validition=true;
  else
    this.step3Validition=false;   
}

deleteRoutingProfileSelectedProfiles(e)
{
  e.preventDefault();
   this.routingProfileSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allRoutingProfiles.findIndex(val => val.id==ele.id);
    this.allRoutingProfiles.splice(index,1);
  })
  this.routingProfileSelectedRowsForDeletion=[];
  if(this.routingProfileSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }
   if(this.allRoutingProfiles.length>0)
    this.step5Validition=true;
  else
    this.step5Validition=false;   

  
}

deleteRadioProfileSelectedProfiles(e)
{
  e.preventDefault();
   this.radioProfileSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allRadioProfiles.findIndex(val => val.id==ele.id);
    this.allRadioProfiles.splice(index,1);
  })
  this.radioProfileSelectedRowsForDeletion=[];
  if(this.radioProfileSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }

   if(this.allRadioProfiles.length>0)
    this.step6Validition=true;
  else
    this.step6Validition=false;  
}

deleteWlanProfileSelectedProfiles(e)
{
  e.preventDefault();
   this.wlanProfileSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allWlanProfiles.findIndex(val => val.id==ele.id);
    this.allWlanProfiles.splice(index,1);
  })
  this.wlanProfileSelectedRowsForDeletion=[];
  if(this.wlanProfileSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }

   if(this.allWlanProfiles.length>0)
    this.step7Validition=true;
  else
    this.step7Validition=false;
 
}

deleteSnmpCommunitySelectedProfiles(e)
{
  e.preventDefault();
   this.snmpCommunitySelectedRowsForDeletion.forEach(ele=>{
    let index = this.allSnmpCommunityProfiles.findIndex(val => val.id==ele.id);
    this.allSnmpCommunityProfiles.splice(index,1);
  })
  this.snmpCommunitySelectedRowsForDeletion=[];
  if(this.snmpCommunitySelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }
}



deleteSNMPHostSelectedProfiles(e)
{
  e.preventDefault();
   this.snmpHostSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allSNMPHostProfiles.findIndex(val => val.id==ele.id);
    this.allSNMPHostProfiles.splice(index,1);
  })
  this.snmpHostSelectedRowsForDeletion=[];
  if(this.snmpHostSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }
}



wlanPageLoaded(e)
{
  console.log("In pageLoaded");
  console.log(e);
  if(e=="WLAN")
    {
      console.log("Wlan Details ");
     console.log(this.allCaptivePortalProfiles);
     this.captivePortalNames=this.allCaptivePortalProfiles;
   
this.authNames=this.allRadiusTemplateProfiles;
this.authData=this.authNames;
              this.authData.forEach(auth => {
                auth["id"]=auth.id;
                auth["name"] = auth.radiusTemplate;
              });

              this.authData.sort(function(a, b) {
                  var textA = a.name.toUpperCase();
                  var textB = b.name.toUpperCase();
                  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
              });
       this.authOptions=this.authData;  
    }  
}

selectPreemptionType(event)
{
  
  console.log(event.target.value);
   this.preemptionType=event.target.value;
  this.add_removePreemptionFormControls();
}

selectUserFailoverType(event)
{
  
  console.log(event.target.value);
   this.userFailoverType=event.target.value;
  this.add_removeUserFailoverFormControls();
}

 add_removePreemptionFormControls()
 {
    if(String(this.preemptionType)=="disable")
    {
      if(this.myFormVPN.contains("vpnHoldTime"))
        this.myFormVPN.removeControl("vpnHoldTime");
    }
    else if(String(this.preemptionType)=="enable")
    {
      if(!this.myFormVPN.contains("vpnHoldTime"))
        {
          this.vpnHoldTime= new FormControl('',[CustomValidator.arubaHoldTimeValidation]);
          this.myFormVPN.addControl("vpnHoldTime",this.vpnHoldTime);
        }
    }
  }
 add_removeUserFailoverFormControls()
 {
    if(String(this.userFailoverType)=="disable")
    {
      if(this.myFormVPN.contains("reconnectTimeOnFailover"))
        this.myFormVPN.removeControl("reconnectTimeOnFailover");
    }
    else if(String(this.userFailoverType)=="enable")
    {
      if(!this.myFormVPN.contains("reconnectTimeOnFailover"))
        {
          this.reconnectTimeOnFailover= new FormControl('',[CustomValidator.arubaReconnectTimeValidation]);
          this.myFormVPN.addControl("reconnectTimeOnFailover",this.reconnectTimeOnFailover);
        }
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
        
    
            this.myFormDHCPPool = this._fb.group({
         
           });
     //       this.step1Validition=true;       
            this.myFormRadius = this._fb.group({
         
           });
   //         this.step2Validition=true;    

           this.myFormCaptive = this._fb.group({
         
           });
   //         this.step3Validition=true;                         
       
          this.myFormVPN = this._fb.group({
       
             vpnPrimaryServer: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
             vpnBackupServer: ['', [CustomValidator.ipv4AddressValidation]],
             vpnIkepsk: ['', []],
             vpnUserName: ['', []],
             vpnPassword: ['', []],
             vpnPreemption: ['disable', []],
             reconnectUserOnFailover: ['disable', []],
             vpnMonitorPktLostCnt: ['', [CustomValidator.arubavpnPktLostCntValidation]],
             vpnMonitorPktSendFreq: ['', [CustomValidator.arubavpnPktSendFreqValidation]],
             vpnFastFailover: ['disable', []],
             
           });
       //     this.step4Validition=true;   

           this.myFormRoutes = this._fb.group({
         
           });
   //         this.step5Validition=true;    

          this.myFormRadio = this._fb.group({
         
           });
  //          this.step6Validition=true;    

           this.myFormWlan = this._fb.group({
         
           });
      //     this.step7Validition=true;   

          this.myFormSNMPCommunity = this._fb.group({
         
           });
      
          this.myFormSNMPHost = this._fb.group({
         
           });

var gbProfile={};
var dhcpProfile={};
var radiusProfile={};
var routeProfile={};
var captiveProfile={};
var vpnProfile={};
var wlanProfile={};
var radioProfile={};
var serviceProfile={};
var snmpProfile={};
 
if(String(this.data["global"])!="undefined")
  gbProfile = this.data["global"];
else
  gbProfile ={};
if(String(this.data["captivePortal"])!="undefined")
captiveProfile = this.data["captivePortal"];
else
  captiveProfile ={};

if(String(this.data["VPN"])!="undefined")
vpnProfile = this.data["VPN"];
else
  vpnProfile ={};

if(String(this.data["WLAN"])!="undefined")
wlanProfile = this.data["WLAN"];
else
  wlanProfile ={};

if(String(this.data["SNMP"])!="undefined")
snmpProfile = this.data["SNMP"];
else
  snmpProfile ={};

dhcpProfile=gbProfile["dhcp"];
if(dhcpProfile===undefined)
    this.dhcp=[];
else
    this.dhcp=dhcpProfile["pools"]

radiusProfile=gbProfile["radiusTemplate"];
if(radiusProfile===undefined)
    this.radius=[];
else
    this.radius=radiusProfile["radiusTemplates"]

routeProfile=gbProfile["routes"];
if(routeProfile===undefined)
  this.route=[];
else
  this.route=routeProfile["routes"]

this.portal=captiveProfile["captivePortals"]

radioProfile=wlanProfile["radioProfiles"];
this.radio=radioProfile["radioDetails"]

serviceProfile=wlanProfile["serviceSetProfiles"];
this.serviceSet=serviceProfile["profileList"]

this.snmpHost=snmpProfile["snmpHostList"]
this.snmpComm=snmpProfile["snmpCommunityList"]



this.primaryServerVpn=vpnProfile["vpnPrimaryServer"]
this.backupServerVpn=vpnProfile["vpnBackupServer"]
this.ikepskVpn=vpnProfile["vpnIkepsk"]
this.userNameVpn=vpnProfile["vpnUserName"]
this.passwordVpn=vpnProfile["vpnPassword"]
this.fastFailoverVpn=vpnProfile["vpnFastFailover"]
this.preemptionVpn=vpnProfile["vpnPreemption"]
this.holdTimeVpn=vpnProfile["vpnHoldTime"]
this.reconnectUserOnFailoverVpn=vpnProfile["reconnectUserOnFailover"]
this.reconnectTimeOnFailoverVpn=vpnProfile["reconnectTimeOnFailover"]
this.monitorPktLostCntVpn=vpnProfile["vpnMonitorPktLostCnt"]
this.monitorPktSendFreqVpn=vpnProfile["vpnMonitorPktSendFreq"]



        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {
          
        }
        if(this.operation=="Modify")
        {
            
         this.allDhcpPoolProfiles=this.dhcp;
         this.step1Validition=true;

         this.allRadiusTemplateProfiles=this.radius;
         this.step2Validition=true;

         this.allCaptivePortalProfiles=this.portal;
         this.step3Validition=true;

         (<FormControl> this.myFormVPN.controls["vpnPrimaryServer"])
             .setValue(this.primaryServerVpn, { onlySelf: true }); 

        (<FormControl> this.myFormVPN.controls["vpnBackupServer"])
             .setValue(this.backupServerVpn, { onlySelf: true }); 

        (<FormControl> this.myFormVPN.controls["vpnIkepsk"])
             .setValue(this.ikepskVpn, { onlySelf: true }); 

        (<FormControl> this.myFormVPN.controls["vpnUserName"])
          .setValue(this.userNameVpn, { onlySelf: true }); 

        (<FormControl> this.myFormVPN.controls["vpnPassword"])
          .setValue(this.passwordVpn, { onlySelf: true }); 

        (<FormControl> this.myFormVPN.controls["vpnFastFailover"])
          .setValue(this.fastFailoverVpn, { onlySelf: true }); 

        (<FormControl> this.myFormVPN.controls["vpnPreemption"])
          .setValue(this.preemptionVpn, { onlySelf: true }); 
          
           let enablePreemption =this.preemptionVpn;
         enablePreemption.trim();
       if(enablePreemption=='enable')
       {  
          this.preemptionType='enable';
          this.add_removePreemptionFormControls();
          (<FormControl> this.myFormVPN.controls["vpnHoldTime"])
          .setValue(this.holdTimeVpn, { onlySelf: true }); 
       }

        (<FormControl> this.myFormVPN.controls["reconnectUserOnFailover"])
          .setValue(this.reconnectUserOnFailoverVpn, { onlySelf: true }); 

          let enableUserFailover =this.reconnectUserOnFailoverVpn;
     
         enableUserFailover.trim();
      if(enableUserFailover=='enable')
      {
            this.userFailoverType='enable';
            this.add_removeUserFailoverFormControls();
        (<FormControl> this.myFormVPN.controls["reconnectTimeOnFailover"])
          .setValue(this.reconnectTimeOnFailoverVpn, { onlySelf: true }); 
      }
       (<FormControl> this.myFormVPN.controls["vpnMonitorPktLostCnt"])
          .setValue(this.monitorPktLostCntVpn, { onlySelf: true }); 

        (<FormControl> this.myFormVPN.controls["vpnMonitorPktSendFreq"])
          .setValue(this.monitorPktSendFreqVpn, { onlySelf: true }); 
                      
          this.step4Validition=true;

         this.allRoutingProfiles=this.route;
          this.step5Validition=true;

        this.allRadioProfiles=this.radio;
          this.step6Validition=true;

        this.allWlanProfiles=this.serviceSet;
          this.step7Validition=true;

        this.allSnmpCommunityProfiles=this.snmpComm;
         this.allSNMPHostProfiles=this.snmpHost;
          this.step8Validition=true;




        }
    }
    		ngAfterViewInit		(){
      }
    subcribeToFormChanges() {
 
      this.myFormDHCPPool.statusChanges.subscribe(x =>{
        //console.log(x);
  //        if((String(x)=="VALID")||(String(x)=="valid"))
    //        this.step1Validition=true;
  //        else
    //        this.step1Validition=false; 
          });       

      this.myFormRadius.statusChanges.subscribe(x =>{
        //console.log(x);
  //        if((String(x)=="VALID")||(String(x)=="valid"))
   //         this.step2Validition=true;
  //        else
  //          this.step2Validition=false; 
          });                     

     this.myFormCaptive.statusChanges.subscribe(x =>{
        //console.log(x);
  /*        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step3Validition=true;
          else
            this.step3Validition=false; 
   */
         });  
    this.myFormVPN.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step4Validition=true;
          else
            this.step4Validition=false; 
          });  

   this.myFormRoutes.statusChanges.subscribe(x =>{
        //console.log(x);
  /*        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step5Validition=true;
          else
            this.step5Validition=false; */
          });  

   this.myFormRadio.statusChanges.subscribe(x =>{
        //console.log(x);
  /*        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step6Validition=true;
          else
            this.step6Validition=false; */
          }); 

  this.myFormWlan.statusChanges.subscribe(x =>{
        //console.log(x);
  /*        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step7Validition=true;
          else
            this.step7Validition=false; */
          }); 

this.myFormSNMPCommunity.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step8Validition=true;
          else
            this.step8Validition=false; 
          }); 

 this.myFormSNMPHost.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step8Validition=true;
          else
            this.step8Validition=false; 
          }); 



     } 
  gotoFinalSubmit(val:any)
  {
     console.log("Final Submit in add-wizard....");
     console.log(val);
  

var getallTempProfile={};
var globalTempProfile={};


//Dhcp Pool
var dhcpDetailsProfile={};
dhcpDetailsProfile["pools"]=this.allDhcpPoolProfiles;

//Radius
var radiusDetailsProfile={};
radiusDetailsProfile["radiusTemplates"]=this.allRadiusTemplateProfiles;

//Captive
var portalDetailsProfile={};
portalDetailsProfile["captivePortals"]=this.allCaptivePortalProfiles;

//VPN
let myFormVPNData=this.myFormVPN.value;
var vpnProfile={};

     vpnProfile["vpnPrimaryServer"]=myFormVPNData.vpnPrimaryServer;
     vpnProfile["vpnBackupServer"]=myFormVPNData.vpnBackupServer;
     vpnProfile["vpnIkepsk"]=myFormVPNData.vpnIkepsk;
     vpnProfile["vpnUserName"]=myFormVPNData.vpnUserName;
     vpnProfile["vpnPassword"]=myFormVPNData.vpnPassword;
     vpnProfile["vpnFastFailover"]=myFormVPNData.vpnFastFailover;
     vpnProfile["vpnPreemption"]=myFormVPNData.vpnPreemption;
     if(this.preemptionType=='enable')
      vpnProfile["vpnHoldTime"]=myFormVPNData.vpnHoldTime;
     else
     vpnProfile["vpnHoldTime"]=""; 

     vpnProfile["reconnectUserOnFailover"]=myFormVPNData.reconnectUserOnFailover;
     if(this.userFailoverType=='enable')
      vpnProfile["reconnectTimeOnFailover"]=myFormVPNData.reconnectTimeOnFailover;
     else
      vpnProfile["reconnectTimeOnFailover"]="";
     
      vpnProfile["vpnMonitorPktLostCnt"]=myFormVPNData.vpnMonitorPktLostCnt;
      vpnProfile["vpnMonitorPktSendFreq"]=myFormVPNData.vpnMonitorPktSendFreq;

//Routes
var routeDetailsProfile={};
routeDetailsProfile["routes"]=this.allRoutingProfiles;

//Radio
var radioDetailsProfile={};
radioDetailsProfile["radioDetails"]=this.allRadioProfiles;
//ServiceSet
var serviceSetProfile={};
serviceSetProfile["profileList"]=this.allWlanProfiles;


//wlan
var wlanProfile={};
wlanProfile["radioProfiles"]=radioDetailsProfile;
wlanProfile["serviceSetProfiles"]=serviceSetProfile;

//SNMP
var snmpProfile={};
snmpProfile["snmpHostList"]=this.allSNMPHostProfiles;
snmpProfile["snmpCommunityList"]=this.allSnmpCommunityProfiles;

globalTempProfile["dhcp"]=dhcpDetailsProfile;
globalTempProfile["radiusTemplate"]=radiusDetailsProfile;
globalTempProfile["routes"]=routeDetailsProfile;

getallTempProfile["global"]=globalTempProfile;
getallTempProfile["captivePortal"]=portalDetailsProfile;
getallTempProfile["VPN"]=vpnProfile;
getallTempProfile["WLAN"]=wlanProfile;
getallTempProfile["SNMP"]=snmpProfile;


    let finalData = jQuery.extend(getallTempProfile,{"date":new Date().toISOString()});
console.log('/....finalData......');
console.log(finalData);
 
  this.finalSubmitData.emit(finalData);
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);


  }
}