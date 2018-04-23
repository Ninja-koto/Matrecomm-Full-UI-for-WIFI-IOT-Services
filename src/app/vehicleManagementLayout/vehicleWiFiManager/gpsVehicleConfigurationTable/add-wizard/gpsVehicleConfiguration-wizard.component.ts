import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {SessionStorageService} from "ngx-webstorage";
import {Logger} from "../../../../commonServices/logger";

@Component({
  selector: 'gpsVehicleConfiguration-add-wizard',
  templateUrl: './gpsVehicleConfiguration-wizard.component.html',
  styleUrls: ['./gpsVehicleConfiguration-wizard.component.css'],
  providers:[RPCService]
})
export class GPSVehicleConfigurationAddWizardComponent implements OnInit {
    public myFormAddress: FormGroup;
     public myFormPolicies: FormGroup;
      public myFormLayoutDetails: FormGroup;
      public myFormGPSVehicleDetails: FormGroup;

    public submitted: boolean;
    public events: any[] = [];

  step1Validition:boolean=false;
  step2Validition:boolean=false;
  step3Validition:boolean=false;
  step4Validition:boolean=false;



   public continentNames = [
    { value: '', display: 'Select One' },
    { value: 'Asia', display: 'Asia' },
    { value: 'Africa', display: 'Africa' },
    { value: 'North America', display: 'North America' },
    { value: 'South America', display: 'South America' },
    { value: 'Antarctica', display: 'Antarctica' },
    { value: 'Europe', display: 'Europe' },
    { value: 'Australia', display: 'Australia' },

  ]
public accessPoints = ['avc'];
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
modifyOriginalAssetMAC:string="";

showIPTableErrorMsg:string = "none";
addIPAddressStatus:String="Disable";
ipAddress:FormControl;
ipAddressSelectedRowsForDeletion=[];
allIPAddressProfiles:any[]=[];
//countriesData:any;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
    @Input() unAssignedAssets:any=[];
  @Input() portalPolicy:any=[];
  @Input() busPolicy:any=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;


 public countries=[];

    constructor(private _fb: FormBuilder,private storage:SessionStorageService, private clientRpc: RPCService, private http:Http) {

     }


getCountries(event)
{
  console.log("Countries Type...");
  console.log(event.target.value);
  this.addCountriesToSelect(event.target.value);
  (<FormControl>this.myFormAddress.controls.Country).setValue("",{onlySelf:true});
  this.step1Validition=false;
}
addCountriesToSelect(continent:string)
{

 if(String(continent)=="Antarctica")
{
this.countries= ['Antarctica'];
}
  else if(String(continent)=="Asia")
  {
    this.countries= ['Afghanistan','Armenia','Azerbaijan','Bahrain',
'Bangladesh','Bhutan','Brunei','Burma (Myanmar)','Cambodia','China','Cyprus',
 'East Timor','Georgia','India','Indonesia','Iran', 'Iraq','Israel', 'Japan', 'Jordan', 'Kazakhstan','Kuwait', 'Kyrgyzstan','Laos','Lebanon',          'Malaysia','Maldives', 'Mongolia','Nepal',
'North Korea','Oman','Pakistan','Palestine','	Philippines','Qatar','Russia','Saudi Arabia','Singapore', 'Srilanka',
'South Korea', 'Syria','Taiwan','Tajikistan','Thailand','Turkey',
'Turkmenistan','United Arab Emirates','Uzbekistan', 'Vietnam',  'Yemen']
}
 else if(String(continent)=="Africa")
  {
    this.countries= ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',' Cameroon','Cape Verde','Central African Republic','Chad', 'Comoros', 'Democratic Republic of the Congo','Djibouti','Egypt','Equatorial Guinea',' Eritrea','Ethiopia','Gabon',' Gambia','Ghana',            'Guinea','Guinea-Bissau	',
'Ivory Coast','Kenya','Lesotho','Liberia','Libya', 'Madagascar', 'Malawi', 'Mali','Mauritania','Mauritius',' Mayotte  (France)', 'Morocco','Mozambique','Namibia','Niger','Nigeria',
 'Republic of the Congo', ' Rwanda',' Réunion (France)',
'Saint Helena,                        Ascension and Tristan da Cunha (UK)','Senegal','Seychelles', 'Sierra Leone','Somalia',' South Africa','South Sudan','Sudan','Swaziland','São Tomé and Príncipe',' Tanzania','Togo', 'Tunisia', 'Uganda',
 'Western Sahara','Zambia',' Zimbabwe']
}

else if(String(continent)=="Australia")
  {
    this.countries= ['Australia','Flores','Lombok','Melanesia',
'New Caledonia','New Guinea',
'New Zealand','Sulawesi','Sumbawa','Tasmania','Timor']
}

else if(String(continent)=="Europe")
  {
    this.countries= ['Albania', 'Andorra',' Armenia',' Austria','Azerbaijan','Belarus',' Belgium',
'Bosnia and Herzegovina','Bulgaria',' Croatia', 'Cyprus','Czech Republic',' Denmark','Estonia','Faroe Islands (Denmark)',' Finland','France','Georgia',' Germany','Gibraltar (UK)','Greece', 'Guernsey (UK)','Hungary',' Iceland',' Ireland',' Isle of Man (UK)','Italy','Jersey (UK)','Kazakhstan','Kosovo',' Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia','Malta','Moldova','Monaco', ' Montenegro',' Netherlands',' Norway',' Poland','Portugal','Romania',' Russia', 'San Marino', 'Serbia','Slovakia','Slovenia', 'Spain','Svalbard and Jan Mayen (Norway)','Sweden','Switzerland','Turkey','Ukraine',' United Kingdom', 'Vatican City','Åland Islands (Finland)']
}
else if(String(continent)=="North America")
{
this.countries= ['Antigua and Barbuda','Bahamas','Barbados','Belize','Canada','Costa Rica','Cuba','Dominica','Dominican Republic', 'El Salvador','Grenada','Guatemala','Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','St. Kitts and Nevis','St. Lucia','St. Vincent and The Grenadines','Trinidad and Tobago','USA (United States of America)'];
}
else if(String(continent)=="South America")
{
this.countries= ['Argentina','Bolivia','Brazil','Chile','Colombia','Ecuador','Guyana','Paraguay','Peru','Suriname', 'Uruguay','Venezuela'];
}
  else
  {
    this.countries = []
  }
  console.log("countries..");
  console.log(this.countries);
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

        this.myFormAddress = this._fb.group({
            address: ['', [Validators.required]],
            Continent: ['', [Validators.required]],
            Country: ['', [Validators.required,CustomValidator.selectFromSelectBox]],
            City: ['', [Validators.required]],
            zipCode: ['', []],
          });

       this.myFormGPSVehicleDetails = this._fb.group({
            busRegNumber: ['', [Validators.required]],
            rfidMac: ['', []],
            accessPointMac: ['', [Validators.required]],
            driverName: ['', [Validators.required]],
            speedLimit:['',[Validators.required]]

          });
       this.myFormPolicies = this._fb.group({
            busPolicyName: ['', [Validators.required]],
            portalPolicyName: ['', [Validators.required]],
            billingPolicyName: ['', []],
          });
      this.myFormLayoutDetails = this._fb.group({
            layoutImage: ['', []],
            sim_1_Number: ['', []],
            sim_2_Number: ['', []],
          });


        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {
          let tempMac = this.data.accessPointMac;
          let tempMacObj={};
          tempMacObj["macAddress"] = tempMac.substring(tempMac.indexOf("( ")+2,tempMac.indexOf(" )"));
          this.modifyOriginalAssetMAC = this.data.accessPointMac;
          tempMacObj["model"] = tempMac.substring(0,tempMac.indexOf("( "))
          this.unAssignedAssets.push(tempMacObj);

            var temp={
              address: this.data.address,
              Continent: this.data.Continent,
              Country:this.data.Country,
              City: this.data.City,
              zipCode: this.data.zipCode
            };

           var temp2={
              busRegNumber: this.data.busRegNumber,
            rfidMac:this.data.rfidMac,
            accessPointMac: this.data.accessPointMac,
            driverName: this.data.driverName,
            speedLimit:this.data.speedLimit
          };
          var temp3={
              busPolicyName: this.data.busPolicyName,
            portalPolicyName: this.data.portalPolicyName,
            billingPolicyName:this.data.billingPolicyName
            };
            var temp4={
            sim_1_Number: this.data.sim_1_Number,
            sim_2_Number: this.data.sim_2_Number,
            layoutImage:""
          };

          if((this.data.layoutImage!=undefined)&&(this.data.layoutImage!=""))
          {
            this.imageLayoutStr = this.data.layoutImage;
            this.imageLayoutURL = this.data.layoutImage;
            this.showImageLayout = true;
          }
          else
            this.imageLayoutStr = "";
          this.allIPAddressProfiles = this.data.ipAddresses;

           (<FormGroup>this.myFormAddress)
             .setValue(temp, { onlySelf: true });
          this.addCountriesToSelect(this.data.Continent);
          this.step1Validition=true;
             (<FormGroup>this.myFormGPSVehicleDetails)
             .setValue(temp2, { onlySelf: true });
                 this.step2Validition=true;
          (<FormGroup>this.myFormPolicies)
             .setValue(temp3, { onlySelf: true });
          this.step3Validition = true;

            (<FormGroup>this.myFormLayoutDetails)
             .setValue(temp4, { onlySelf: true });
          this.step4Validition=true;

        }
    }
    		ngAfterViewInit		(){
      }
      check(e,sim)
      {
        let Mobile_REGEXP =/^(\+\d{1,3}[- ]?)?\d{10}$/;
        if(sim=="sim1")
        {
          if(String(e)=="")
          {this.myFormLayoutDetails.controls.sim_1_Number.setErrors(null);
            return true;}
          if (!Mobile_REGEXP.test(e)) {
            this.myFormLayoutDetails.controls.sim_1_Number.setErrors({ "mobile": true });
            return false;
          }
          this.myFormLayoutDetails.controls.sim_1_Number.setErrors(null);
          return true;
        }
        else
        {
          this.myFormLayoutDetails.controls.sim_2_Number.setErrors(null);
          if(String(e)=="")
          {this.myFormLayoutDetails.controls.sim_1_Number.setErrors(null);
            return true;}
          if (!Mobile_REGEXP.test(e)) {
            this.myFormLayoutDetails.controls.sim_2_Number.setErrors({ "mobile": true });
            return false;
          }
          this.myFormLayoutDetails.controls.sim_1_Number.setErrors(null);
          return true;
        }
      }
mobileNumberValidation(e,context)
    {
      let sim1 = this.myFormLayoutDetails.controls.sim_1_Number.value;
      let sim2 = this.myFormLayoutDetails.controls.sim_2_Number.value;
      if(context=="sim1")
        sim1 = e.target.value;
      else
        sim2 = e.target.value;

      if (this.check(sim1,"sim1")&&this.check(sim2,"sim2")&&(this.allIPAddressProfiles.length>0)) {
          this.step4Validition=true;
        }
        else
          this.step4Validition = false;
    }

getMacName(accessPoint)
{
  return accessPoint.model+"( "+accessPoint.macAddress+" )";
}

imageLayoutProcessFile(e){
    this.imageLayoutStr="";
    this.imageLayoutURL="";
    this.imageLayoutStr =String(e.target.result);
    this.imageLayoutURL = this.imageLayoutStr
    console.log('cccccc//ccc');
    console.log(this.imageLayoutStr);
  }
  onImageLayoutChange(e){
      //    console.log(e);

    try{
      var file=e.target.files[0];
   //  this.imageFile=e.target.files[0];
      this.layoutfr = new FileReader();
      this.layoutfr.onload = this.imageLayoutProcessFile.bind(this);
      this.disableImageLayoutLoadButton=false;
      this.layoutfr.readAsDataURL(file);

    }
    catch(e)
    {
      //THIS EXCEPTION COMES WHEN USER DO NOT SELECT ANY FILE (CANCEL SELECTION)
      console.log("On File Change Error...");
      this.disableImageLayoutLoadButton=true;//DISABLING LOAD BUTTON ON FILE CHANGE FAILURE
   //   console.log(e);
    }
  }

layoutLoadInitiated(e)
  {
    e.preventDefault();
    //console.log("Load Initiated...");
        this.disableImageLayoutLoadButton=true;
        this.showImageLayout=true;

  }
closeImage(e){
console.log('fdddffdf....')
console.log(e)
this.showImageLayout=false;
         $('#fileSelect').val("");
         $('#imageUrl').attr("src","");
this.imageLayoutStr="";
this.imageLayoutURL="";
}

ipAddressAddProfiles(e){
  e.preventDefault();
//  console.log(e)
  this.addIPAddressStatus=e.target.value;
 // console.log(this.addIPAddressStatus);

    if(!this.myFormLayoutDetails.contains("ipAddress"))
        {
          this.ipAddress= new FormControl([],[]);
          this.myFormLayoutDetails.addControl("ipAddress",this.ipAddress);
        }
}

deleteIPAddressSelectedProfiles(e)
{
  e.preventDefault();
//  console.log(this.allWlanIntProfiles);
  this.ipAddressSelectedRowsForDeletion.forEach(ele=>{
    let index = this.allIPAddressProfiles.findIndex(val => val.id==ele.id);
    this.allIPAddressProfiles.splice(index,1);
  })
  this.ipAddressSelectedRowsForDeletion=[];
  if(this.ipAddressSelectedRowsForDeletion.length<=0)
  {
//    this.step2Validition=false;
    e.target.disabled=true;
  }
}




submitIPAddressProfiles(e)
{
//  console.log(e);
  e.preventDefault();
  let ipAddress = this.myFormLayoutDetails.controls.ipAddress.value;

 // console.log(ipAddress);

  if((ipAddress.length>0))
  {
    this.showIPTableErrorMsg="none";
    this.allIPAddressProfiles.push({ "ipAddress" : this.myFormLayoutDetails.controls.ipAddress.value,
                  "id":  new Date().getTime(),
          });
  //  console.log(this.allWlanIntProfiles);
    this.myFormLayoutDetails.controls.ipAddress.setValue([]);

    this.addIPAddressStatus="Disable";
  }
  else
  {
    //show error msg
    this.showIPTableErrorMsg="block";
//    console.log(this.showWlanTableErrorMsg);
  }
    if (this.check(this.myFormLayoutDetails.controls.sim_1_Number.value,"sim1")&&this.check(this.myFormLayoutDetails.controls.sim_2_Number.value,"sim2")&&(this.allIPAddressProfiles.length>0)) {
        this.step4Validition=true;
      }
      else
        this.step4Validition = false;

  /*if(this.allIPAddressProfiles.length>0)
    this.step4Validition=true;
    else
    this.step4Validition=false;*/
}


cancelIPAddressProfiles(e){
  e.preventDefault();
 // console.log(e)
  this.addIPAddressStatus=e.target.value;
    if(this.myFormLayoutDetails.contains("ipAddress"))
        this.myFormLayoutDetails.removeControl("ipAddress");
    this.showIPTableErrorMsg="none";

  //    this.step2Validition=true;

}


maintainIPSelectedData(e,val)
{
//  console.log(e.target.checked);
  //  console.log(val);
  if(e.target.checked)
  {
    if(this.ipAddressSelectedRowsForDeletion.findIndex(ele => ele.id==val.id)<0)
      this.ipAddressSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.ipAddressSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.ipAddressSelectedRowsForDeletion.splice(index,1);
  }
//  console.log(this.ipAddressSelectedRowsForDeletion);
}


    subcribeToFormChanges() {
      this.myFormAddress.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
     this.myFormGPSVehicleDetails.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))

          this.step2Validition=true;

          else
            this.step2Validition=false;
         });
      this.myFormPolicies.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step3Validition=true;
          else
            this.step3Validition=false;
          });
      this.myFormLayoutDetails.statusChanges.subscribe(x =>{
        //console.log(x);
          /*if((String(x)=="VALID")||(String(x)=="valid"))
            this.step4Validition=true;
          else
            this.step4Validition=false;*/
          });

     }
  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

    console.log(this.myFormAddress.value);

    let finalData = jQuery.extend(this.myFormAddress.value,
                                  this.myFormGPSVehicleDetails.value,
                                  this.myFormPolicies.value,
                                  this.myFormLayoutDetails.value,
                                  {"date":new Date().toISOString()});

    finalData["layoutImage"]=this.imageLayoutStr;
    finalData["ipAddresses"]=this.allIPAddressProfiles;

    let toSetAssigned='', toSetUnAssigned='', assignTo="Vehicle";
		finalData["portalType"]="";
    finalData["deviceConfigNeeded"]="false";
    finalData["deviceType"]="AccessPoint";
    finalData["busRouteNumber"]="abc";
		if(this.operation=="Add")
		{
      finalData["deviceConfigNeeded"]="false";
			toSetAssigned = finalData["accessPointMac"];
			finalData['assignTo']=assignTo;
      finalData['toSetAssigned']=toSetAssigned;
      finalData['toSetUnAssigned']=toSetUnAssigned,
      finalData['usedInInventory']="false"
		}
    else
    {
      if( this.modifyOriginalAssetMAC!=finalData.accessPointMac)
      {
        finalData["deviceConfigNeeded"]="true";
        toSetAssigned = finalData.accessPointMac
				toSetUnAssigned = this.modifyOriginalAssetMAC;
      }
      finalData['toSetAssigned']=toSetAssigned;
      finalData['toSetUnAssigned']=toSetUnAssigned,
      finalData['assignTo']=this.data.assignTo;
      finalData['usedInInventory']=this.data.usedInInventory;
      finalData["uuid"]=this.data.uuid;
    }

    console.log('finalData');
    console.log(finalData);

  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  this.clientRpc.orgRPCCall(op,"orgManagerGpsBusConfigurationMethod",finalData)
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
            log.storeSuccessNotification("In GPS Vehicle Configuration "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In GPS Vehicle Configuration "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In GPS Vehicle Configuration "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
