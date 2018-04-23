import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";

@Component({
  selector: 'email-add-wizard',
  templateUrl: './email-wizard.component.html',
  styleUrls: ['./email-wizard.component.scss'],
  providers:[RPCService]
})

export class EmailAddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public myForm1: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  step2Validition:boolean=false;
  public sessionTypes = [
    { value: '', display: 'Select One' },
    { value: 'AUTH_NONE', display: 'AUTH_NONE' },
    { value: "AUTH_CRAM_MD5", display: "AUTH_CRAM_MD5" },
    { value: 'AUTH_CRAM_SHA1', display: 'AUTH_CRAM_SHA1' },
    { value: 'AUTH_LOGIN', display: 'AUTH_LOGIN' },
    { value: 'AUTH_PLAIN', display: 'AUTH_PLAIN' }
  ]
  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;


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
        this.myForm1 = this._fb.group({
              mailHost: ['', [Validators.required, CustomValidator.ipv4AddressValidation]],
              mailPort: ['', [Validators.required, Validators.minLength(3), CustomValidator.portValidation]],
              mailSessionType: ['', [Validators.required/*,CustomValidator.selectFromSelectBox*/]],
              mailUserName: ['', [Validators.required, Validators.minLength(5)]],
              mailPassword: ['', [Validators.required, Validators.minLength(5)]],
              mailSender: ['', [Validators.required, Validators.minLength(5)]]

          });
        this.subcribeToFormChanges();

        if(this.operation=="Add")
        {

        }

        if(this.operation=="Modify")
        {

            var temp2={
              mailHost: this.data.mailHost,
              mailPort: this.data.mailPort,
              mailSessionType: this.data.mailSessionType,
              mailUserName: this.data.mailUserName,
              mailPassword: this.data.mailPassword,
              mailSender:this.data.mailSender
            };
           (<FormGroup>this.myForm1)
             .setValue(temp2, { onlySelf: true });
          this.step2Validition=true;
        }


    }
    		ngAfterViewInit		(){

      }

    subcribeToFormChanges() {
      this.myForm1.statusChanges.subscribe(x=>{
        if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;
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

    let finalData = jQuery.extend(this.myForm1.value,{"date":new Date().toISOString()});
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  //this.clientRpc.orgRPCCall(op,"orgManagerLDAPSMTPMethod",finalData);
  this.clientRpc.serviceProviderRPCCall(op,"productManagerSmtpMethod",finalData)
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
            log.storeSuccessNotification("In ServiceProvider E-Mail "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In ServiceProvider E-Mail "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In ServiceProvider E-Mail "+this.operation+" Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
