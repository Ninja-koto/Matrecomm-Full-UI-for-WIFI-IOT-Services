import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from"../../../../commonServices/logger";
@Component({
  selector: 'radius-add-wizard',
  templateUrl: './radiusServer-wizard.component.html',
  styleUrls: ['./radiusServer-wizard.component.css'],
  providers:[RPCService]
})

export class RadiusAddWizardComponent implements OnInit {
radioSelect: string ;
CraftAir:boolean;
external :boolean;
showCraftAir:boolean=true;

    public myForm: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;
  radiusSharedSecret:FormControl;
  radiusIPAddress:FormControl;
  radiusPortNumber:FormControl;

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
        this.myForm = this._fb.group({
          radiusType:['CraftAir', [Validators.required]],
          radiusSharedSecret:['',[Validators.required, Validators.minLength(5)]]
        });


        this.subcribeToFormChanges();

        if(this.operation=="Add")
        {

        }

        if(this.operation=="Modify")
        {
          var temp={};
          if(String(this.data.radiusType)=="CraftAir")
          {
            $('#craftAirRadius').click();
            temp["radiusType"]=this.data.radiusType;
            temp["radiusSharedSecret"]=this.data.radiusSharedSecret;
          }
          else
          {
            $('#externalRadius').click();
            temp["radiusType"]=this.data.radiusType;
            temp["radiusSharedSecret"]=this.data.radiusSharedSecret;
              temp["radiusIPAddress"]=this.data.radiusIPAddress;
            temp["radiusPortNumber"]=this.data.radiusPortNumber;
          }
            console.log("temp");
            console.log(temp);
           (<FormGroup>this.myForm)
             .setValue(temp, { onlySelf: true });
          this.step1Validition=true;
        }

    }
    		ngAfterViewInit	(){

      }
radiusType(event)
{
  console.log("Radius Type...");
  console.log(event.target.value);
  if(String(event.target.value)=="CraftAir")
  {
    //this.radiusSharedSecret= new FormControl('',[Validators.required, Validators.minLength(5)]);
    //this.myForm.addControl("radiusSharedSecret",this.radiusSharedSecret);

    if(this.myForm.contains("radiusIPAddress"))
      this.myForm.removeControl("radiusIPAddress");
    if(this.myForm.contains("radiusPortNumber"))
      this.myForm.removeControl("radiusPortNumber");
    this.showCraftAir=true;
  }
  else
  {
    //this.radiusSharedSecret= new FormControl('',[Validators.required, Validators.minLength(5)]);
    this.radiusIPAddress= new FormControl('',[Validators.required, CustomValidator.ipv4AddressValidation]);
    this.radiusPortNumber= new FormControl('',[Validators.required, Validators.minLength(3), CustomValidator.portValidation]);
    //this.myForm.addControl("radiusSharedSecret",this.radiusSharedSecret);
    this.myForm.addControl("radiusIPAddress",this.radiusIPAddress);
    this.myForm.addControl("radiusPortNumber",this.radiusPortNumber);
    this.showCraftAir=false;
  }
}




    subcribeToFormChanges() {
      this.myForm.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
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

    console.log(this.myForm.value);


    let finalData = jQuery.extend(this.myForm.value,{"date":new Date().toISOString()});
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }

  this.clientRpc.orgRPCCall(op,"orgManagerRADIUSServerMethod",finalData)
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
            log.storeSuccessNotification("In Organization Radius "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Organization Radius "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Organization Radius "+this.operation+" Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
    this.myForm.reset();
  }
}
