import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";
//import * as config from "../../../../../../configParams";
import {SessionStorageService} from "ngx-webstorage";
import {NotificationsService} from "angular2-notifications";
@Component({
  selector: 'ssh-add-wizard',
  templateUrl: './ssh-wizard.component.html',
  styleUrls: ['./ssh-wizard.component.css'],
  providers:[RPCService]
})

export class SSHAddWizardComponent implements OnInit {
  config:any={};
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


    constructor(private _fb: FormBuilder, private notifService:NotificationsService,
       private clientRpc: RPCService, private http:Http, private storage:SessionStorageService) {
        this.config = this.storage.retrieve("configParams");
     }

    ngOnInit() {

        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm = this._fb.group({
              username: ['', [Validators.required]],
              password: ['', [Validators.required]],
              enablePassword: ['', [Validators.required]],
        });

        this.subcribeToFormChanges();

        if(this.operation=="Add")
        {

        }

        if(this.operation=="Modify")
        {
            var temp={
              username: this.data.username,
              password: this.data.password,
              enablePassword: this.data.enablePassword,

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
   this.clientRpc.orgRPCCall(op,"orgManagerCredentialsSSHMethod",finalData)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        let log = new Logger();
        let status = "failed";
        if(String(res.type)=="undefined")
        {
          //log.storeFailNotification("Modify in UserRegistration Failed");
          try{
          if((res.result.status=="Success")||(res.result.Status=="Success"))
          {
            //console.log("Trigger reload Event....");
            status="success";
          }
          else
          {
            status="failed";
            //console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            status="failed";
          }
        }
        if(status=="success"){
          log.storeSuccessNotification("In Organization SSH "+this.operation+" Succeeded");
          this.notifService.create('Organization SSH',this.operation+" Succeeded","success",this.config.notificationConfig);
        }
        else{
          log.storeFailNotification("In Organization SSH "+this.operation+" Failed");
          this.notifService.create('Organization SSH',this.operation+" Failed","error",this.config.notificationConfig)
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
    this.myForm.reset();
  }
}
