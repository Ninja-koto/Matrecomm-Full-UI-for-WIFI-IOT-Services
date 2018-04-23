import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";
//import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import {IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts} from "../../../../commonModules/multiSelect/types";

@Component({
  selector: 'organization-add-wizard',
  templateUrl: './add-wizard.component.html',
  styleUrls: ['./add-wizard.component.scss'],
  providers:[RPCService]
})

export class ProductManagerOrganizationWizardComponent implements OnInit {
    public myForm1: FormGroup;
    public myForm2: FormGroup;
    public myForm3: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  step2Validition:boolean=false;
  step3Validition:boolean=false;
  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() dataCentersData:any[]=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

  public orgTypes = [
    { value: '', display: 'Select One' },
    { value: 'Enterprise', display: 'Enterprise' },
    { value: 'Hotel', display: 'Hotel' },
    { value: 'Hospital', display: 'Hospital' },
    { value: 'College/ School', display: 'College/ School' }];
  public continentNames = [
    { value: '', display: 'Select One' },
    { value: 'Asia', display: 'Asia' },
    { value: 'Africa', display: 'Africa' },
    { value: 'North America', display: 'North America' },
    { value: 'South America', display: 'South America' },
    { value: 'Antarctica', display: 'Antarctica' },
    { value: 'Europe', display: 'Europe' },
    { value: 'Australia', display: 'Australia' }];

    public continentNames1= this.continentNames;
   public countries=[];
   public countries1=[];

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

dcOptions: IMultiSelectOption[] = [];

startTimeValue:string="";
endTimeValue:string="";
showTimeErrorMsg:string="none";
timeErrMsg:string="";

    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http){

     }

getCountries(event)
{
  console.log("Countries Type...");
  console.log(event.target.value);
  this.addCountriesToSelect(event.target.value);
  (<FormControl>this.myForm1.controls.orgCountry).setValue("",{onlySelf:true});
  this.step1Validition=false;
}
getCountries1(event)
{
  this.addCountriesToSelect1(event.target.value);
  (<FormControl>this.myForm3.controls.country).setValue("",{onlySelf:true});
  this.step3Validition=false;
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
  /*console.log("countries..");
  console.log(this.countries);*/
}
addCountriesToSelect1(continent:string)
{

 if(String(continent)=="Antarctica")
{
this.countries1= ['Antarctica'];
}
  else if(String(continent)=="Asia")
  {
    this.countries1= ['Afghanistan','Armenia','Azerbaijan','Bahrain',
'Bangladesh','Bhutan','Brunei','Burma (Myanmar)','Cambodia','China','Cyprus',
 'East Timor','Georgia','India','Indonesia','Iran', 'Iraq','Israel', 'Japan', 'Jordan', 'Kazakhstan','Kuwait', 'Kyrgyzstan','Laos','Lebanon',          'Malaysia','Maldives', 'Mongolia','Nepal',
'North Korea','Oman','Pakistan','Palestine','	Philippines','Qatar','Russia','Saudi Arabia','Singapore', 'Srilanka',
'South Korea', 'Syria','Taiwan','Tajikistan','Thailand','Turkey',
'Turkmenistan','United Arab Emirates','Uzbekistan', 'Vietnam',  'Yemen']
}
 else if(String(continent)=="Africa")
  {
    this.countries1= ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',' Cameroon','Cape Verde','Central African Republic','Chad', 'Comoros', 'Democratic Republic of the Congo','Djibouti','Egypt','Equatorial Guinea',' Eritrea','Ethiopia','Gabon',' Gambia','Ghana',            'Guinea','Guinea-Bissau	',
'Ivory Coast','Kenya','Lesotho','Liberia','Libya', 'Madagascar', 'Malawi', 'Mali','Mauritania','Mauritius',' Mayotte  (France)', 'Morocco','Mozambique','Namibia','Niger','Nigeria',
 'Republic of the Congo', ' Rwanda',' Réunion (France)',
'Saint Helena,                        Ascension and Tristan da Cunha (UK)','Senegal','Seychelles', 'Sierra Leone','Somalia',' South Africa','South Sudan','Sudan','Swaziland','São Tomé and Príncipe',' Tanzania','Togo', 'Tunisia', 'Uganda',
 'Western Sahara','Zambia',' Zimbabwe']
}

else if(String(continent)=="Australia")
  {
    this.countries1= ['Australia','Flores','Lombok','Melanesia',
'New Caledonia','New Guinea',
'New Zealand','Sulawesi','Sumbawa','Tasmania','Timor']
}

else if(String(continent)=="Europe")
  {
    this.countries1= ['Albania', 'Andorra',' Armenia',' Austria','Azerbaijan','Belarus',' Belgium',
'Bosnia and Herzegovina','Bulgaria',' Croatia', 'Cyprus','Czech Republic',' Denmark','Estonia','Faroe Islands (Denmark)',' Finland','France','Georgia',' Germany','Gibraltar (UK)','Greece', 'Guernsey (UK)','Hungary',' Iceland',' Ireland',' Isle of Man (UK)','Italy','Jersey (UK)','Kazakhstan','Kosovo',' Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia','Malta','Moldova','Monaco', ' Montenegro',' Netherlands',' Norway',' Poland','Portugal','Romania',' Russia', 'San Marino', 'Serbia','Slovakia','Slovenia', 'Spain','Svalbard and Jan Mayen (Norway)','Sweden','Switzerland','Turkey','Ukraine',' United Kingdom', 'Vatican City','Åland Islands (Finland)']
}
else if(String(continent)=="North America")
{
this.countries1= ['Antigua and Barbuda','Bahamas','Barbados','Belize','Canada','Costa Rica','Cuba','Dominica','Dominican Republic', 'El Salvador','Grenada','Guatemala','Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','St. Kitts and Nevis','St. Lucia','St. Vincent and The Grenadines','Trinidad and Tobago','USA (United States of America)'];
}
else if(String(continent)=="South America")
{
this.countries1= ['Argentina','Bolivia','Brazil','Chile','Colombia','Ecuador','Guyana','Paraguay','Peru','Suriname', 'Uruguay','Venezuela'];
}
  else
  {
    this.countries1 = []
  }
  /*console.log("countries..");
  console.log(this.countries);*/
}

    ngOnInit() {

        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm1 = this._fb.group({
            orgType:['',[Validators.required]],
            organizationName:['',[Validators.required]],
            alertIncidentPrefix:['',[Validators.required]],
            orgAddress: ['', [Validators.required]],
            orgContinent: ['', [Validators.required]],
            orgCountry: ['', [Validators.required,CustomValidator.selectFromSelectBox]],
            orgCity: ['', [Validators.required]],
            orgZipcode: ['', [Validators.required,Validators.minLength(6)]],
          });

        this.myForm2 = this._fb.group({
            dataCenters: [[],[Validators.required]],
            startTime:["",[]],
            endTime:["",[]]
        });

        this.myForm3 = this._fb.group({
              firstName: ['', [Validators.required]],
              middleName: ['', []],
              lastName: ['', [Validators.required]],
              userName: ['', [Validators.required,Validators.minLength(5)]],
              password: ['', [Validators.required,Validators.minLength(8)]],
              address: ['', [Validators.required]],
              continent: ['', [Validators.required]],
              country: ['', [Validators.required,CustomValidator.selectFromSelectBox]],
              city: ['', [Validators.required]],
              email: ['', [Validators.required,CustomValidator.isValidMailFormat]],
              officePhone: ['', []],
              mobilePhone: ['', [Validators.required,Validators.maxLength(10),CustomValidator.mobileNumberValidation]],
          });
        this.dataCentersData.forEach(loc => {
          loc["id"]=loc.uuid;
          loc["name"] = loc.dataCenterName+"("+loc.country+"->"+loc.city+")";
        });
        this.dataCentersData.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.dcOptions = this.dataCentersData;

        this.subcribeToFormChanges();

        if(this.operation=="Add")
        {

        }

        // Update single value
        /*(<FormControl>this.myForm.controls['address'])
            .setValue("Hyderabad",{onlySelf: true });*/
        if(this.operation=="Modify")
        {
           var temp1={
               orgType:this.data.orgType,
              alertIncidentPrefix:this.data.alertIncidentPrefix,
              organizationName:this.data.organizationName,
              orgAddress: this.data.orgAddress,
              orgContinent: this.data.orgContinent,
              orgCountry:this.data.orgCountry,
              orgCity: this.data.orgCity,
              orgZipcode: this.data.orgZipcode
            };

           (<FormGroup>this.myForm1)
             .setValue(temp1, { onlySelf: true });
          this.addCountriesToSelect(this.data.orgContinent);
          this.step1Validition=true;

          let tempUUID=[];
            this.data.assignDataCenters.forEach(element => {
                tempUUID.push(element.uuid);
            });
           (<FormControl> this.myForm2.controls["dataCenters"])
             .setValue(tempUUID, { onlySelf: true });
         let ctrl = this.myForm2.controls["startTime"];
            //ctrl.setValue(new Date(this.data.startTime));
            this.startTimeValue = String(new Date(this.data.startTime));
            ctrl = this.myForm2.controls["endTime"];
            //ctrl.setValue(new Date(this.data.endTime));
            this.endTimeValue = String(new Date(this.data.endTime));

            this.step2Validition=true;
        let temp3={
            firstName: this.data.firstName,
              middleName:this.data.middleName,
              lastName: this.data.lastName,
              userName: this.data.userName,
              password: this.data.password,
              address: this.data.address,
              continent: this.data.continent,
              country: this.data.country,
              city: this.data.city,
              email: this.data.email,
              officePhone: this.data.officePhone,
              mobilePhone: this.data.mobilePhone
        };
          (<FormGroup>this.myForm3)
             .setValue(temp3, { onlySelf: true });
          this.addCountriesToSelect1(this.data.continent);
          this.step3Validition=true;
        }


    }
    		ngAfterViewInit		(){

      }
    subcribeToFormChanges() {
      this.myForm1.statusChanges.subscribe(x =>{
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
        this.myForm3.statusChanges.subscribe(x =>{
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step3Validition=true;
          else
            this.step3Validition=false;
          });
      /*this.myForm2.statusChanges.subscribe(x =>{
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
          });
      */
        //const myFormStatusChanges$ = this.myForm.statusChanges;
        //const myFormValueChanges$ = this.myForm.valueChanges;
        //myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        //myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }

    /*save(model: User, isValid: boolean) {
        this.submitted = true;
        console.log(model, isValid);
    }*/
startAndEndTimeChanged(e,origin:string)
  {
    this.step2Validition=false;
      /*console.log("In startAndEndTimeChanged");
      console.log(e);*/
      let st = this.myForm2.controls["startTime"].value;
      let et = this.myForm2.controls["endTime"].value;
      let dc= this.myForm2.controls["dataCenters"].value;
      if(origin=="fromStart")
          st=e;
      else
        et=e;
      console.log("ST : "+st);
      console.log("ET : "+et);
      if((String(et)!="null")&&(String(et)!="")&&(String(st)!="null")&&(String(st)!=""))
      {
        let tempSt = new Date(st);
        let tempEt = new Date(et);
        console.log(tempEt.getTime()-tempSt.getTime());
        if((tempEt.getTime()-tempSt.getTime())<0)
        {
          if(origin=="fromStart")
          {
            //console.log("Please select Start time Smaller..");
            this.myForm2.controls["startTime"].setValue("");
            this.startTimeValue="";
            //this.myForm2.controls["startTime"].setErrors({"stSTet":true});
            this.showTimeErrorMsg="block";
            this.timeErrMsg="Please select Start time Smaller End Time";
          }
          else if(origin=="fromEnd")
          {
            //console.log("Please select End time Greater..");
            this.myForm2.controls["endTime"].setValue("");
            this.endTimeValue="";
            //this.myForm2.controls["endTime"].setErrors({"etGTst":true});
            this.showTimeErrorMsg="block";
            this.timeErrMsg="Please select End time greaterthan Start Time";
          }
        }
        else
        {
            this.showTimeErrorMsg="none";
            this.timeErrMsg="";
        }

      }
      st = this.myForm2.controls["startTime"].value;
      et = this.myForm2.controls["endTime"].value;
      if((String(st)!="null")&&(String(st)!="")&&(String(et)!="null")&&(String(et)!="")&&(dc.length>0))
        this.step2Validition=true;
      else
        this.step2Validition=false;
        console.log(this.myForm2.value);
  }
  onDcChange(e)
  {
      /*console.log("In onDcChange...");
      console.log(e);*/
      let st = this.myForm2.controls["startTime"].value;
      let et = this.myForm2.controls["endTime"].value;
      let dc= this.myForm2.controls["dataCenters"].value;
      if((String(st)!="null")&&(String(st)!="")&&(String(et)!="null")&&(String(et)!="")&&(dc.length>0))
        this.step2Validition=true;
      else
        this.step2Validition=false;
  }
  gotoFinalSubmit(val:any)
  {

console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step
    /*console.log(this.myForm1.value);
    console.log(this.myForm2.value);
    console.log(this.myForm3.value);
    console.log(this.startTimeValue);
    console.log(this.endTimeValue);*/

    let finalData = jQuery.extend(this.myForm1.value,this.myForm2.value,this.myForm3.value,{"date":new Date().toISOString()});
    finalData["startTime"]=new Date(this.startTimeValue).toISOString();
    finalData["endTime"]=new Date(this.endTimeValue).toISOString();

    let selectedDCData = this.dataCentersData.filter(val => finalData.dataCenters.includes(val.uuid));
    console.log("selectedDCData");
    console.log(selectedDCData);
    let DCs=[]
          selectedDCData.forEach(ele => {
            DCs.push({
                "dataCenterName" : ele.dataCenterName,
                "ipv4address" : ele.ipv4Address,
                "servicePortNumbers" : ele.servicePortNumbers,
                "uuid" : ele.uuid
            });
          });

    finalData["assignDataCenters"]= DCs;
    finalData["licenseDuration"]=finalData.startTime+" - "+finalData.endTime;
    finalData["licenses"]= [];
    delete finalData.dataCenters;

console.log(finalData);
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  this.clientRpc.serviceProviderRPCCall(op,"productManagerOrganizationMethod",finalData)
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
            log.storeSuccessNotification("In ServiceProvider Organization "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In ServiceProvider Organization "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In ServiceProvider Organization "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
