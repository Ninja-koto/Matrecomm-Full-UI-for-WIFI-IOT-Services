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
  selector: 'locationManagement-add-wizard',
  templateUrl: './locationManagement-wizard.component.html',
  styleUrls: ['./locationManagement-wizard.component.scss'],
  providers:[RPCService]
})

export class LocationManagementAddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public myFormIpv4: FormGroup;
    public myFormIpv6: FormGroup;
    public myFormImage: FormGroup;

    public submitted: boolean;
    public events: any[] = [];
  //step1Validition:boolean=false;
    step1Validition:boolean=true;

  //step2Validition:boolean=false;
  step2Validition:boolean=true;
  step3Validition:boolean=true;
  step4Validition:boolean=false;

 assetsMode:boolean=true;
 locationMode:boolean=true;
floorMapMode:boolean=true;

allIpv4Profiles:any[]=[];
allIpv6Profiles:any[]=[];

showIpv4TableErrorMsg:string = "none";
showIpv6TableErrorMsg:string = "none";

ipv4SelectedRowsForDeletion=[];
ipv6SelectedRowsForDeletion=[];

  selectIPV6address:string="NoIPV6";
  locationType:string="nonMovable";
  floorMapType = "NoFloorMap";

 ipv4Id:number=0;
 ipv6Id:number=0;

IPv6:FormControl;
vehicleID:FormControl;
Floor:FormControl;

vehicleFileType:FormControl;
defaultInterFloorAttenuation:FormControl;
choosePropagationModel:FormControl;
defaultLevelAttenuation:FormControl;
ImageProfilename:FormControl;
FloorImage:FormControl;

fr :FileReader;
disableLoadButton:boolean=true;
showFloorMap:boolean=false;
  configFileStr:any;
floorMapImageURL:string;

vehiclefr :FileReader;
disableVehicleLoadButton:boolean=true;
showVehicleFloorMap:boolean=false;
  vehicleFileStr:any;
vehicleFloorMapImageURL:string;


//Modify
  enableFloorImageDetailsType='NoFloorMap';

  public propagationTypes = [
    { value: '', display: 'Select One' },
    { value: 'Radio', display: 'Radio' },
    { value: 'Ground', display: 'Ground' },
    { value: 'Air', display: 'Air' },
  ]

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


//countriesData:any;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;


 public countries=[];

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {

     }

getCountries(event)
{
  try{
  console.log("Countries Type...");
  console.log(event.target.value);
  this.addCountriesToSelect(event.target.value);
  (<FormControl>this.myForm.controls.Country).setValue("",{onlySelf:true});
  this.step1Validition=false;
}
catch(e){
  console.log('Error in Location ManagementWizard');
  console.log(e);
}
}
addCountriesToSelect(continent:string)
{
  console.log("IN "+continent);
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

selectIpv6Type(event)
{
  console.log("Mode Type...");
  console.log(event);
    console.log("Mode .......Type...");

  console.log(event.target.value);
  this.selectIPV6address=event.target.value;
  this.add_removeIpv6FormControls();

}
selectLocationType(event)
{
  console.log("Mode Type...");
  console.log(event);
    console.log("Mode .......Type...");
  console.log(event.target.value);
   this.locationType=event.target.value;
  this.add_removeLocationFormControls();


}

selectFloorMapType(event)
{
  console.log("Mode Type...");
  console.log(event);
    console.log("Mode .......Type...");
  console.log(event.target.value);
     this.floorMapType=event.target.value;
    this.add_removeFloorMapFormControls();

}

addIpv4Profiles(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();
  let startip = this.myFormIpv4.controls.startIPv4.value;
  let endip = this.myFormIpv4.controls.endIPv4.value;
  console.log(startip);
  console.log(endip);
  if((startip.length>0)&&(endip.length>0))
  {
    this.showIpv4TableErrorMsg="none";
 this.ipv4Id=this.ipv4Id+1
    this.allIpv4Profiles.push({ "startIPv4" : this.myFormIpv4.controls.startIPv4.value,
                  "id": this.ipv4Id,
              "endIPv4" : this.myFormIpv4.controls.endIPv4.value});
    console.log("All Ipv4 Profiles...");
    console.log(this.allIpv4Profiles);
    this.myFormIpv4.controls.startIPv4.setValue([]);
    this.myFormIpv4.controls.endIPv4.setValue([]);
  }
  else
  {
    ///show error msg
    this.showIpv4TableErrorMsg="block";
  }
  if(this.allIpv4Profiles.length>0)
    this.step2Validition=true;
}
addIpv6Profiles(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();
  let ipv6Address = this.myFormIpv6.controls.IPv6.value;
  console.log(ipv6Address);
  if(ipv6Address.length>0)
  {
    this.showIpv6TableErrorMsg="none";
 this.ipv6Id=this.ipv6Id+1
    this.allIpv6Profiles.push({ "IPv6" : this.myFormIpv6.controls.IPv6.value,
                  "id": this.ipv6Id});
    console.log("All Ipv6 Profiles...");
    console.log(this.allIpv6Profiles);
    this.myFormIpv6.controls.IPv6.setValue([]);
  }
  else
  {
    ///show error msg
    this.showIpv6TableErrorMsg="block";
  }
  if(this.allIpv6Profiles.length>0)
    this.step3Validition=true;
}
maintainIpv4SelectedData(e,val)
{
  console.log("In maintainSelectedData");
  console.log(e.target.checked);
    console.log(val);
  if(e.target.checked)
  {
    if(this.ipv4SelectedRowsForDeletion.findIndex(ele => ele.id==val.id)<0)
      this.ipv4SelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.ipv4SelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.ipv4SelectedRowsForDeletion.splice(index,1);
  }
  console.log("All selected...");
  console.log(this.ipv4SelectedRowsForDeletion);
}
maintainIpv6SelectedData(e,val)
{
  console.log("In maintainIpv6SelectedData");
  console.log(e.target.checked);
    console.log(val);
  if(e.target.checked)
  {
    if(this.ipv6SelectedRowsForDeletion.findIndex(ele => ele.id==val.id)<0)
      this.ipv6SelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.ipv6SelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.ipv6SelectedRowsForDeletion.splice(index,1);
  }
  console.log("All selected...");
  console.log(this.ipv6SelectedRowsForDeletion);
}
deleteIpv4SelectedProfiles(e)
{
  e.preventDefault();
  console.log("Before Delete All Profiles");
  console.log(this.allIpv4Profiles);
  this.ipv4SelectedRowsForDeletion.forEach(ele=>{
    let index = this.allIpv4Profiles.findIndex(val => val.id==ele.id);
    this.allIpv4Profiles.splice(index,1);
    this.ipv4Id=this.ipv4Id-1
  })
  console.log("After Delete All Profiles");
  console.log(this.allIpv4Profiles);
  if(this.allIpv4Profiles.length<=0)
  {
    this.step2Validition=false;
    e.target.disabled=true;
  }
}
deleteIpv6SelectedProfiles(e)
{
  e.preventDefault();
  console.log("Before Delete All Profiles");
  console.log(this.allIpv6Profiles);
  this.ipv6SelectedRowsForDeletion.forEach(ele=>{
    let index = this.allIpv6Profiles.findIndex(val => val.id==ele.id);
    this.allIpv6Profiles.splice(index,1);
    this.ipv6Id=this.ipv6Id-1
  })
  console.log("After Delete All  Ipv6 Profiles");
  console.log(this.allIpv6Profiles);
  if(this.allIpv6Profiles.length<=0)
  {
    this.step3Validition=false;
    e.target.disabled=true;
  }
}

 add_removeIpv6FormControls()
 {
    if(String(this.selectIPV6address)=="NoIPV6")
    {
      this.showIpv6TableErrorMsg="none";
      if(this.myFormIpv6.contains("IPv6"))
        this.myFormIpv6.removeControl("IPv6");
    }
    else if(String(this.selectIPV6address)=="IPV6")
    {
      console.log("in selectIPV6address");
      this.step3Validition=false;
      if(!this.myFormIpv6.contains("IPv6"))
        {
          this.IPv6= new FormControl([],[CustomValidator.ipv6AddressValidation]);
          this.myFormIpv6.addControl("IPv6",this.IPv6);
        }

    }
    console.log(this.selectIPV6address)
  }

   add_removeLocationFormControls()
 {
    if(String(this.locationType)=="nonMovable")
    {
        if(this.myFormImage.contains("vehicleID"))
        this.myFormImage.removeControl("vehicleID");
        if(this.myFormImage.contains("vehicleFileType"))
        this.myFormImage.removeControl("vehicleFileType");
        this.showVehicleFloorMap=false;
       if(!this.myFormImage.contains("Floor"))
        {
          this.Floor= new FormControl([],[Validators.required]);
          this.myFormImage.addControl("Floor",this.Floor);
        }
        if(!this.myFormImage.contains("FloorImage"))
        {
          this.FloorImage= new FormControl([],[Validators.required]);
          this.myFormImage.addControl("FloorImage",this.FloorImage);
        }

    }
    else if(String(this.locationType)=="movable")
    {
      this.step4Validition=false;
        if(this.myFormImage.contains("Floor"))
        this.myFormImage.removeControl("Floor");
         if(this.myFormImage.contains("FloorImage"))
        this.myFormImage.removeControl("FloorImage");
        this.showFloorMap=false;
      if(!this.myFormImage.contains("vehicleID"))
        {
          this.vehicleID= new FormControl([],[Validators.required]);
          this.myFormImage.addControl("vehicleID",this.vehicleID);
        }
        if(!this.myFormImage.contains("vehicleFileType"))
        {
          this.vehicleFileType= new FormControl([],[Validators.required]);
          this.myFormImage.addControl("vehicleFileType",this.vehicleFileType);
        }
    }

  }
   add_removeFloorMapFormControls()
 {
    if(String(this.floorMapType)=="NoFloorMap")
    {
       if(this.myFormImage.contains("ImageProfilename"))
        this.myFormImage.removeControl("ImageProfilename");

       if(String(this.locationType)=="movable")
        {
         if(this.myFormImage.contains("FloorImage"))
        this.myFormImage.removeControl("FloorImage");
        }
      else if(String(this.locationType)=="nonMovable")
      {
        if(this.myFormImage.contains("vehicleFileType"))
        this.myFormImage.removeControl("vehicleFileType");
      }
         if(this.myFormImage.contains("defaultInterFloorAttenuation"))
        this.myFormImage.removeControl("defaultInterFloorAttenuation");
         if(this.myFormImage.contains("defaultLevelAttenuation"))
        this.myFormImage.removeControl("defaultLevelAttenuation");
        if(this.myFormImage.contains("choosePropagationModel"))
        this.myFormImage.removeControl("choosePropagationModel");
    }
    else if(String(this.floorMapType)=="FloorMap")
    {this.step4Validition=false;
        if(!this.myFormImage.contains("ImageProfilename"))
        {
          this.ImageProfilename= new FormControl([],[Validators.required]);
          this.myFormImage.addControl("ImageProfilename",this.ImageProfilename);
        }

       if(String(this.locationType)=="nonMovable")
        {
       if(!this.myFormImage.contains("FloorImage"))
        {
          this.FloorImage= new FormControl([],[]);
          this.myFormImage.addControl("FloorImage",this.FloorImage);
        }
      }
      else
      {
      if(!this.myFormImage.contains("vehicleFileType"))
        {
          this.vehicleFileType= new FormControl([],[]);
          this.myFormImage.addControl("vehicleFileType",this.vehicleFileType);
        }
      }
     if(!this.myFormImage.contains("defaultInterFloorAttenuation"))
        {
          this.defaultInterFloorAttenuation= new FormControl([],[Validators.required]);
          this.myFormImage.addControl("defaultInterFloorAttenuation",this.defaultInterFloorAttenuation);
        }
     if(!this.myFormImage.contains("defaultLevelAttenuation"))
        {
          this.defaultLevelAttenuation= new FormControl([],[Validators.required]);
          this.myFormImage.addControl("defaultLevelAttenuation",this.defaultLevelAttenuation);
        }
     if(!this.myFormImage.contains("choosePropagationModel"))
        {
          this.choosePropagationModel= new FormControl([],[Validators.required]);
          this.myFormImage.addControl("choosePropagationModel",this.choosePropagationModel);
        }
    }
  }
  processFile(e){
    this.configFileStr =String(e.target.result);
    this.floorMapImageURL = this.configFileStr
    console.log('cccccc//ccc');
    console.log(this.configFileStr);
  }

  onFloorFileChange(e){
      //    console.log(e);
    try{
      var file=e.target.files[0];
      this.fr = new FileReader();
      this.fr.onload = this.processFile.bind(this);
      this.disableLoadButton=false;
      this.fr.readAsDataURL(file);

    }
    catch(e)
    {
      //THIS EXCEPTION COMES WHEN USER DO NOT SELECT ANY FILE (CANCEL SELECTION)
      console.log("On File Change Error...");
   //   this.myFormImage.controls.fileType.setErrors({"selectConfigFile":true});
      this.disableLoadButton=true;//DISABLING LOAD BUTTON ON FILE CHANGE FAILURE
   //   console.log(e);
    }
  }

floorLoadInitiated(e)
  {
    e.preventDefault();
    //console.log("Load Initiated...");
        this.disableLoadButton=true;
        this.showFloorMap=true;
  }

closeImage(e){
console.log('fdddffdf....')
console.log(e)
this.showFloorMap=false;
this.configFileStr="";
this.floorMapImageURL="";

//this.disableLoadButton=false;

}



  vehicleProcessFile(e){
    this.vehicleFileStr =String(e.target.result);
    this.vehicleFloorMapImageURL = this.vehicleFileStr
    console.log('cccccc//ccc');
    console.log(this.vehicleFileStr);
  }



  onVehicleFileChange(e){
      //    console.log(e);
    try{
      var file=e.target.files[0];
      this.vehiclefr = new FileReader();
      this.vehiclefr.onload = this.vehicleProcessFile.bind(this);
      this.disableVehicleLoadButton=false;
      this.vehiclefr.readAsDataURL(file);

    }
    catch(e)
    {
      //THIS EXCEPTION COMES WHEN USER DO NOT SELECT ANY FILE (CANCEL SELECTION)
      console.log("On File Change Error...");
   //   this.myFormImage.controls.fileType.setErrors({"selectConfigFile":true});
      this.disableVehicleLoadButton=true;//DISABLING LOAD BUTTON ON FILE CHANGE FAILURE
   //   console.log(e);
    }
  }

vehicleLoadInitiated(e)
  {
    e.preventDefault();
    //console.log("Load Initiated...");
        this.disableVehicleLoadButton=true;
        this.showVehicleFloorMap=true;

  }

closeVehicleImage(e){
console.log('fdddffdf....')
console.log(e)
this.showVehicleFloorMap=false;
this.vehicleFileStr="";
this.vehicleFloorMapImageURL="";

}

onStepLoad(e)
{
  console.log("In onStepLoad...");
  console.log(e);
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
            address: ['', [Validators.required]],
            Building: ['', [Validators.required]],
            Continent: ['', [Validators.required]],
            Country: ['', [Validators.required,CustomValidator.selectFromSelectBox]],
            City: ['', [Validators.required]],
            email: ['', [Validators.required,CustomValidator.isValidMailFormat]],
            officePhone: ['', []],
            zipcode: ['', [Validators.required]],
            });
            this.myFormIpv4 = this._fb.group({
            startIPv4: ['', [CustomValidator.ipv4AddressValidation]],
            endIPv4: ['', [CustomValidator.ipv4AddressValidation]],

          });
            this.myFormIpv6 = this._fb.group({
            selectIPV6address: ['NoIPV6', []],

          });
             this.myFormImage = this._fb.group({
            Floor: ['', [Validators.required]],
            connectionTimeout: ['', [Validators.required]],
            locationType: ['nonMovable', []],
            enableFloorImageDetails: ['NoFloorMap', []],


            });

        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {
            var temp={
              address: this.data.address,
              Building: this.data.Building,
              City:this.data.City,
              Continent: this.data.Continent,
              Country: this.data.Country,
              zipcode:this.data.zipcode,
              officePhone:this.data.officePhone,
              email:this.data.email

            };
            console.log("temp");
            console.log(temp);

         (<FormGroup>this.myForm)
             .setValue(temp, { onlySelf: true });


          this.addCountriesToSelect(this.data.Continent);
          this.step1Validition=true;

          this.allIpv4Profiles= this.data.IPv4Details;
           this.step2Validition=true;
        (<FormControl>this.myFormIpv6.controls['selectIPV6address'])
              .setValue(this.data.selectIPV6address, { onlySelf: true });
          this.selectIPV6address = this.data.selectIPV6address;
          console.log("In Modify .. "+this.selectIPV6address);
           this.add_removeIpv6FormControls();
          if(this.selectIPV6address=="IPV6")
         {
          this.allIpv6Profiles= this.data.IPv6Details;
         }
         else
         {

         }
               this.step3Validition=true;
          (<FormControl>this.myFormImage.controls['locationType'])
              .setValue(this.data.locationType, { onlySelf: true });
          this.add_removeLocationFormControls();
     //     this.add_removeFloorMapFormControls();
         if(this.locationType=="nonMovable")
          {
              (<FormControl> this.myFormImage.controls['Floor'])
             .setValue(this.data.Floor, { onlySelf: true });
             this.configFileStr= this.data.FloorImage;

          }
         else if(this.locationType=="movable")
         {
             (<FormControl> this.myFormImage.controls['vehicleID'])
             .setValue(this.data.vehicleID, { onlySelf: true });

         }
        (<FormControl> this.myFormImage.controls['connectionTimeout'])
             .setValue(this.data.connectionTimeout, { onlySelf: true });

         (<FormControl>this.myFormImage.controls['enableFloorImageDetails'])
              .setValue(this.data.enableFloorImageDetails, { onlySelf: true });
          this.floorMapType = this.data.enableFloorImageDetails;

          this.add_removeFloorMapFormControls();
         if(this.floorMapType=='NoFloorMap')
          {

          }
         else if(this.floorMapType=='FloorMap')
         {
             (<FormControl> this.myFormImage.controls["ImageProfilename"])
             .setValue(this.data.ImageProfilename, { onlySelf: true });

                if(this.locationType=="nonMovable")
          {
              this.floorMapImageURL = this.data.FloorImage;
               this.showFloorMap=true;
          }
          else  if(this.locationType=="movable")
          {
            this.vehicleFloorMapImageURL = this.data.vehicleLayoutImage;
               this.showVehicleFloorMap=true;

          }
           (<FormControl> this.myFormImage.controls["defaultInterFloorAttenuation"])
             .setValue(this.data.defaultInterFloorAttenuation, { onlySelf: true });

             (<FormControl> this.myFormImage.controls["defaultLevelAttenuation"])
             .setValue(this.data.defaultLevelAttenuation, { onlySelf: true });

          (<FormControl> this.myFormImage.controls["choosePropagationModel"])
             .setValue(this.data.choosePropagationModel, { onlySelf: true });

         }
          this.step4Validition=true;

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

      this.myFormIpv4.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
      });
     this.myFormIpv6.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step3Validition=true;
          else
            this.step3Validition=false;
      });
      this.myFormImage.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step4Validition=true;
          else
            this.step4Validition=false;
      });

     }
  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

    console.log(this.myForm.value);
    console.log('myFormIpv4......')
    console.log(this.myFormIpv4.value);
    console.log(this.myFormIpv6.value);
    console.log(this.myFormImage.value);

//let myFormIpv4Data=this.myFormIpv4.value;
var ipv4TempProfile={};
ipv4TempProfile["IPv4Details"]=this.allIpv4Profiles;
let myFormIpv6Data=this.myFormIpv6.value;
var ipv6TempProfile={};
 if(myFormIpv6Data.selectIPV6address=='IPV6')
        {
          ipv6TempProfile["selectIPV6address"]=myFormIpv6Data.selectIPV6address;
          ipv6TempProfile["IPv6Details"]=this.allIpv6Profiles;
        }
 else if(myFormIpv6Data.selectIPV6address=='NoIPV6')
 {
          ipv6TempProfile["selectIPV6address"]=myFormIpv6Data.selectIPV6address;
 }
let myFormImageData=this.myFormImage.value;
var imgageTempProfile={};

if(myFormImageData.locationType=='nonMovable')
        {
          imgageTempProfile["Floor"]=myFormImageData.Floor;
          imgageTempProfile["FloorImage"]=this.configFileStr;

        }
else if(myFormImageData.locationType=='movable')
        {
          imgageTempProfile["vehicleID"]=myFormImageData.vehicleID;
          imgageTempProfile["vehicleLayoutImage"]=this.vehicleFileStr;

        }
          imgageTempProfile["locationType"]=myFormImageData.locationType;
          imgageTempProfile["connectionTimeout"]=myFormImageData.connectionTimeout;
if(myFormImageData.enableFloorImageDetails=='FloorMap')
        {
          imgageTempProfile["enableFloorImageDetails"]=myFormImageData.enableFloorImageDetails;
          imgageTempProfile["ImageProfilename"]=myFormImageData.ImageProfilename;
          imgageTempProfile["defaultInterFloorAttenuation"]=myFormImageData.defaultInterFloorAttenuation;
          imgageTempProfile["defaultLevelAttenuation"]=myFormImageData.defaultLevelAttenuation;
          imgageTempProfile["choosePropagationModel"]=myFormImageData.choosePropagationModel;
        }
else if(myFormImageData.enableFloorImageDetails=='NoFloorMap')
        {
          imgageTempProfile["enableFloorImageDetails"]=myFormImageData.enableFloorImageDetails;
        }
          imgageTempProfile["usedInInventory"]=false;


    let finalData = jQuery.extend(this.myForm.value,ipv4TempProfile,ipv6TempProfile,imgageTempProfile,{"date":new Date().toISOString()});

console.log('/....finalData......');
console.log(finalData);
 //   let finalData = jQuery.extend(this.myForm.value,this.myFormIpv4.value,this.myFormIpv6.value,this.myFormImage.value,{"date":new Date().toISOString()});
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  this.clientRpc.orgRPCCall(op,"orgManagerLocationMethod",finalData)
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
            log.storeSuccessNotification("In Location Management "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Location Management "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Location Management "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
