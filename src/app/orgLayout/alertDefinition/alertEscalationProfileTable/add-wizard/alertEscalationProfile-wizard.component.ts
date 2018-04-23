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
  selector: 'alertEscalation-add-wizard',
  templateUrl: './alertEscalationProfile-wizard.component.html',
  styleUrls: ['./alertEscalationProfile-wizard.component.scss'],
  providers:[RPCService]
})

export class AlertEscalationAddWizardComponent implements OnInit {  
    public myFormAddEscalation: FormGroup;
    
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  

   public severityNames = [
    { value: '', display: 'Select One' },
    { value: 'Fatal (High Priority)', display: 'Fatal (High Priority)' },
    { value: 'Critical', display: 'Critical' },
    { value: 'Error', display: 'Error' },
    { value: 'Warning', display: 'Warning' },
    { value: 'Notice', display: 'Notice' },
    { value: 'Debug', display: 'Debug' },
    { value: 'Trace (Low Priority)', display: 'Trace (Low Priority)' },
  ]
  
  public teams = [ ]
//countriesData:any;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() allTeams:any=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

 public countries=[];

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
        this.myFormAddEscalation = this._fb.group({
              severity: ['', [Validators.required]],
              times: ['', [Validators.required]],
              team: ['', [Validators.required]]
        });
      
        this.subcribeToFormChanges();
        if(this.operation=="Add")
        {
          
        }
        if(this.operation=="Modify")
        {
            var temp={
              severity: this.data.severity,
              times: this.data.times,
              team: this.data.team.uuid,  
            };
            console.log("temp");
            console.log(temp);
            /*(<FormControl> this.myFormAddEscalation.controls["severity"])
             .setValue( this.data.severity, { onlySelf: true });
            (<FormControl> this.myFormAddEscalation.controls["times"])
             .setValue( this.data.times, { onlySelf: true });
            (<FormControl> this.myFormAddEscalation.controls["times"])
             .setValue( this.data.times, { onlySelf: true });*/

           (<FormGroup>this.myFormAddEscalation)
             .setValue(temp, { onlySelf: true });
           
          this.step1Validition=true;
         
        }
    }
    		ngAfterViewInit		(){
      }


    subcribeToFormChanges() {
      this.myFormAddEscalation.statusChanges.subscribe(x =>{
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
    
    console.log(this.myFormAddEscalation.value);

    let finalData = jQuery.extend(this.myFormAddEscalation.value,{"date":new Date().toISOString()});

    let selectedTeamsData = this.allTeams.filter(val => val.uuid==finalData.team);
   console.log(selectedTeamsData)
    let teamData={}
          selectedTeamsData.forEach(ele => {
            teamData["teamName"]=ele.teamName;
            teamData["uuid"]=ele.uuid;
            
          });
    finalData["team"]=teamData;

  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  console.log("finalData");
  console.log(finalData);
  
  this.clientRpc.orgRPCCall(op,"alertManagerEscalationMethod",finalData)
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
            log.storeSuccessNotification("In Alert Escalation "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Alert Escalation "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Alert Escalation "+this.operation+" Failed");
          }
        }
      });
      
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
