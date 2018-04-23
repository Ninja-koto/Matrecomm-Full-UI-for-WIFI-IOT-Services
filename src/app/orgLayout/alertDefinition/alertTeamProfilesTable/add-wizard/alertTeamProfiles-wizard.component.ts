import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";
import {Logger} from "../../../../commonServices/logger";
//import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from  "../../../../commonModules/multiSelect/types";

@Component({
  selector: 'alertTeamProfiles-add-wizard',
  templateUrl: './alertTeamProfiles-wizard.component.html',
  styleUrls: ['./alertTeamProfiles-wizard.component.scss'],
  providers:[RPCService]
})

export class AlertTeamProfilesAddWizardComponent implements OnInit {
    public myFormAddTeamDefinition: FormGroup;
    public myFormAddTeamAction: FormGroup;

    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  step2Validition:boolean=true;

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() alertMgrUsers:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

userOptions: IMultiSelectOption[] = [];


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
        this.myFormAddTeamDefinition = this._fb.group({
             teamName: ['', [Validators.required]],
              selectUsers: ['alertUserGroup', [Validators.required]],
              userOptions: [[], []],

        });
        this.myFormAddTeamAction = this._fb.group({
            smsEvent: [true, []],
            emailEvent: [false, []],
       });

        this.subcribeToFormChanges();
        this.alertMgrUsers.forEach(user => {
                user["id"]=user.uuid;
                user["name"] = user.firstName+" "+user.lastName;
              });
        this.alertMgrUsers.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.userOptions = this.alertMgrUsers;

        if(this.operation=="Add")
        {

        }
        if(this.operation=="Modify")
        {

            (<FormControl> this.myFormAddTeamDefinition.controls["teamName"])
             .setValue(this.data.teamName, { onlySelf: true });

           (<FormControl> this.myFormAddTeamDefinition.controls["selectUsers"])
             .setValue(this.data.selectUsers, { onlySelf: true });

             let tempUUID=[],users=[];
                users=this.data.users;
                users.forEach(element => {
                  tempUUID.push(element.uuid);
                });
           (<FormControl> this.myFormAddTeamDefinition.controls["userOptions"])
             .setValue(tempUUID, { onlySelf: true });

           let sms = false,email=false;;
           if(String(this.data.smsEvent)=="true")
            sms=true;
           if(String(this.data.emailEvent)=="true")
            email=true;
           (<FormControl> this.myFormAddTeamAction.controls["smsEvent"])
             .setValue( sms, { onlySelf: true });

             (<FormControl> this.myFormAddTeamAction.controls["emailEvent"])
             .setValue(email, { onlySelf: true });

          this.step1Validition=true;
          this.step2Validition=true;
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
    if(String(e.target.id)=="eventActionSMS")
    {
      smsAct=e.target.checked;
      emailAct=this.myFormAddTeamAction.controls.emailEvent.value;
    }
    else if(String(e.target.id)=="eventActionEmail")
    {
      emailAct=e.target.checked;
      smsAct=this.myFormAddTeamAction.controls.smsEvent.value;
    }
    if(smsAct||emailAct)
      this.step2Validition=true;
    else
      this.step2Validition=false;
}


    subcribeToFormChanges() {

      this.myFormAddTeamDefinition.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
     this.myFormAddTeamAction.statusChanges.subscribe(x=>{
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
    console.log('this.myFormAddTeamDefinition.value');
    console.log(this.myFormAddTeamDefinition.value);
    console.log('this.myFormAddTeamAction.value');
    console.log(this.myFormAddTeamAction.value);


    let finalData = jQuery.extend(this.myFormAddTeamDefinition.value,this.myFormAddTeamAction.value,{"date":new Date().toISOString()});

   let selectedUsersData = this.alertMgrUsers.filter(val => finalData.userOptions.includes(val.uuid));
   console.log(selectedUsersData)
    let users=[]
          selectedUsersData.forEach(ele => {
            users.push({"firstName" : ele.firstName,
            "email" : ele.email,
            "mobilePhone" : ele.mobilePhone,
            "uuid" : ele.uuid});
          });
  finalData["users"]=users;
  delete finalData.userOptions;
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

  this.clientRpc.orgRPCCall(op,"alertManagerTeamDefinitionMethod",finalData)
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
            log.storeSuccessNotification("In Alert TeamProfiles "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Alert TeamProfiles "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Alert TeamProfiles "+this.operation+" Failed");
          }
        }
      });

    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
  }
}
