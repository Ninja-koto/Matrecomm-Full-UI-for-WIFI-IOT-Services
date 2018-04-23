import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";

@Component({
  selector: 'dataCenter-add-wizard',
  templateUrl: './add-wizard.component.html',
  styleUrls: ['./add-wizard.component.scss'],
  providers:[RPCService]
})

export class DataCenterWizardComponent implements OnInit {
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
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

  public continentNames = [
    { value: '', display: 'Select One' },
    { value: 'Asia', display: 'Asia' },
    { value: 'Africa', display: 'Africa' },
    { value: 'North America', display: 'North America' },
    { value: 'South America', display: 'South America' },
    { value: 'Antarctica', display: 'Antarctica' },
    { value: 'Europe', display: 'Europe' },
    { value: 'Australia', display: 'Australia' }];
   public countries=[];
    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http){
    
     }

getCountries(event)
{
  console.log("Countries Type...");
  console.log(event.target.value);
  this.addCountriesToSelect(event.target.value);
  (<FormControl>this.myForm1.controls.country).setValue("",{onlySelf:true});
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

        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm1 = this._fb.group({
            dataCenterName:['',[Validators.required]],
            address: ['', [Validators.required]],
            continent: ['', [Validators.required]],
            country: ['', [Validators.required,CustomValidator.selectFromSelectBox]],
            city: ['', [Validators.required]],
            zipcode: ['', [Validators.required]],
          });
        this.myForm2 = this._fb.group({
              serverName: ['', [Validators.required]],
              description: ['', [Validators.required]],
              ipv4Address: ['', [Validators.required,CustomValidator.ipv4AddressValidation]],
              ipv6Address: ['', [Validators.required,CustomValidator.ipv6AddressValidation]],
              servicePortNumbers: ['', [Validators.required,CustomValidator.portValidation]]
          });
        this.myForm3 = this._fb.group({
              firstName: ['', [Validators.required]],
              middleName: ['', []],
              lastName: ['', [Validators.required]],
              companyName: ['', [Validators.required]],
              email: ['', [Validators.required,CustomValidator.isValidMailFormat]],
              officePhone: ['', []],
              mobilePhone: ['', [Validators.required,CustomValidator.mobileNumberValidation]]
          });

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
             dataCenterName:this.data.dataCenterName,
              address: this.data.address,
              continent: this.data.continent,
              country:this.data.country,
              city: this.data.city,
              zipcode: this.data.zipcode
            };
            var temp2={
             serverName:this.data.serverName,
              description: this.data.description,
              ipv4Address: this.data.ipv4Address,
              ipv6Address:this.data.ipv6Address,
              servicePortNumbers: this.data.servicePortNumbers
            };
            var temp3={
                firstName: this.data.firstName,
              middleName: this.data.middleName,
              lastName: this.data.lastName,
              companyName: this.data.companyName,
              email: this.data.email,
              officePhone: this.data.officePhone,
              mobilePhone: this.data.mobilePhone
            };

           (<FormGroup>this.myForm1)
             .setValue(temp1, { onlySelf: true });
          this.addCountriesToSelect(this.data.continent);
          this.step1Validition=true;
          (<FormGroup>this.myForm2)
             .setValue(temp2, { onlySelf: true });
            this.step2Validition=true;
          (<FormGroup>this.myForm3)
             .setValue(temp3, { onlySelf: true });
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
      this.myForm2.statusChanges.subscribe(x =>{
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
          });
      this.myForm3.statusChanges.subscribe(x =>{
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step3Validition=true;
          else
            this.step3Validition=false;
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
    console.log(this.myForm1.value);

    let finalData = jQuery.extend(this.myForm1.value,this.myForm2.value,this.myForm3.value,{"date":new Date().toISOString()});
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  this.clientRpc.serviceProviderRPCCall(op,"productManagerDataCenterMethod",finalData)
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
            log.storeSuccessNotification("In ServiceProvider DataCenter "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In ServiceProvider DataCenter "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In ServiceProvider DataCenter "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
