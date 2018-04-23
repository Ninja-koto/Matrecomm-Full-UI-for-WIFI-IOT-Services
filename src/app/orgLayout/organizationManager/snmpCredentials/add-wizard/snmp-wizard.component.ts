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
  selector: 'snmp-add-wizard',
  templateUrl: './snmp-wizard.component.html',
  styleUrls: ['./snmp-wizard.component.css'],
  providers:[RPCService]
})

export class SNMPAddWizardComponent implements OnInit {
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


    constructor(private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {

     }

    ngOnInit() {

        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm = this._fb.group({
              readCommunityString: ['', [Validators.required]],
              writeCommunityString: ['', [Validators.required]],
        });

        this.subcribeToFormChanges();

        if(this.operation=="Add")
        {

        }

        if(this.operation=="Modify")
        {
            var temp={
              readCommunityString: this.data.readCommunityString,
              writeCommunityString: this.data.writeCommunityString,
            };
            console.log("temp");
            console.log(temp);
           (<FormGroup>this.myForm)
             .setValue(temp, { onlySelf: true });
          this.step1Validition=true;
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
   this.clientRpc.orgRPCCall(op,"orgManagerCredentialsSNMPMethod",finalData)
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
            log.storeSuccessNotification("In Organization SNMP "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Organization SNMP "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Organization SNMP "+this.operation+" Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
    this.myForm.reset();
  }
}
