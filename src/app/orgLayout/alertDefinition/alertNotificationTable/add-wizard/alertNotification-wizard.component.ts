import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
//import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from  "../../../../commonModules/multiSelect/types";

@Component({
  selector: 'alertNotification-add-wizard',
  templateUrl: './alertNotification-wizard.component.html',
  styleUrls: ['./alertNotification-wizard.component.scss'],
  providers:[RPCService]
})

export class AlertNotificationAddWizardComponent implements OnInit {
   public myFormEventDefinition: FormGroup;

    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=true;


  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() allTeams:any=[];
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

teamOptions: IMultiSelectOption[] = [];


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

        this.myFormEventDefinition = this._fb.group({
            alertUniqueID: [{'value':"",disabled:true}, []],
            severity: [{'value':"",disabled:true}, []],
            description: [{'value':"",disabled:true}, []],
            smsEvent: [true, []],
            emailEvent: [false, []],
            logEvent: [false, []],
            teamOptions: [[], []],

       });

        this.subcribeToFormChanges();
        this.allTeams.forEach(team => {
                team["id"]=team.uuid;
                team["name"] = team.teamName;
              });
        this.allTeams.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.teamOptions = this.allTeams;

        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {

            (<FormControl> this.myFormEventDefinition.controls["alertUniqueID"])
             .setValue(this.data.alertUniqueID, { onlySelf: true });
           (<FormControl> this.myFormEventDefinition.controls["severity"])
             .setValue(this.data.severity, { onlySelf: true });
          (<FormControl> this.myFormEventDefinition.controls["description"])
             .setValue(this.data.description, { onlySelf: true });

           (<FormControl> this.myFormEventDefinition.controls["smsEvent"])
             .setValue(true, { onlySelf: true });

             (<FormControl> this.myFormEventDefinition.controls["emailEvent"])
             .setValue(true, { onlySelf: true });

            (<FormControl> this.myFormEventDefinition.controls["logEvent"])
             .setValue(true, { onlySelf: true });

          this.step1Validition=true;
        }
    }
    		ngAfterViewInit		(){
      }


selectAlertActionEventType(e)
{
    console.log("in selectAlertActionEventType");
    console.log(e.target.id)
    let smsAct=false
    let emailAct=false;
    let logAct=false;
    if(String(e.target.id)=="eventActionSMS")
    {
      smsAct=e.target.checked;
      emailAct=this.myFormEventDefinition.controls.emailEvent.value;
      logAct= this.myFormEventDefinition.controls.logEvent.value;
    }
    else if(String(e.target.id)=="eventActionEmail")
    {
      emailAct=e.target.checked;
      smsAct=this.myFormEventDefinition.controls.smsEvent.value;
      logAct= this.myFormEventDefinition.controls.logEvent.value;

    }
    else
    {
      logAct=e.target.checked;
      smsAct=this.myFormEventDefinition.controls.smsEvent.value;
      emailAct=this.myFormEventDefinition.controls.emailEvent.value;

    }
    if(smsAct||emailAct||logAct)
      this.step1Validition=true;
    else
      this.step1Validition=false;
}


    subcribeToFormChanges() {

     this.myFormEventDefinition.statusChanges.subscribe(x=>{
        /*if((String(x)=="VALID")||(String(x)=="valid"))
            this.step2Validition=true;
          else
            this.step2Validition=false;*/
      });

     }
  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step
    console.log('this.myFormEventDefinition.value');
    console.log(this.myFormEventDefinition.value);


    let finalData = jQuery.extend(this.myFormEventDefinition.value,{"date":new Date().toISOString()});
   let selectedTeamsData = this.allTeams.filter(val => finalData.teamOptions.includes(val.uuid));
   console.log(selectedTeamsData)
    let teams=[]
          selectedTeamsData.forEach(ele => {
            teams.push({"teamName" : ele.teamName,
            "uuid" : ele.uuid});
          });
  finalData["teams"]=teams;
  console.log("finalData");
  console.log(finalData);

  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  /*this.clientRpc.orgRPCCall(op,"alertManagerEventsDefinitionMethod",finalData)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        if(res.result.status=="Success")
        {
          console.log("Trigger reload Event....");
        }
        else
        {
          console.log("Do Nothing....");
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);*/
  }
}
