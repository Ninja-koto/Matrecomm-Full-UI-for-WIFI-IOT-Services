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
  selector: 'userManagement-modify-wizard',
  templateUrl: './userManagement-modifywizard.component.html',
  styleUrls: ['./userManagement-modifywizard.component.scss'],
  providers:[RPCService]
})
export class UserManagementModifyWizardComponent implements OnInit {
    public myFormManual: FormGroup;

    public submitted: boolean;
    public events: any[] = [];
    step1Validition:boolean=true;


//countriesData:any;

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
        
        this.myFormManual = this._fb.group({
              userName: [this.data.userName, []],
              mobileNumber: [this.data.mobileNumber, [Validators.maxLength(10),CustomValidator.mobileNumberValidation]]
            });
        

        this.subcribeToFormChanges();
        
    }


    		ngAfterViewInit		(){
      }


    subcribeToFormChanges() {
      this.myFormManual.statusChanges.subscribe(x =>{
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

    console.log(this.myFormManual.value);

    let finalData = {}
    
    finalData["users"]=[{"userName":this.myFormManual.value.userName,
                        "mobileNumber":this.myFormManual.value.mobileNumber,
                        "date":new Date().toISOString(),
                        "uuid":this.data.uuid}];
    console.log("finalData");
    console.log(finalData);
  var op="update";
  this.clientRpc.orgRPCCall(op,"orgManagerUserRegistrationMethod",finalData)
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
            log.storeSuccessNotification("In UserRegistration "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In UserRegistration "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In UserRegistration "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
