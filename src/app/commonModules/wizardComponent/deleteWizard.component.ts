import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';
import * as jQuery from "jquery";
import {RPCService} from "../../commonServices/RPC.service";
import {Logger} from"../../commonServices/logger";
//import * as config from "../../../../configParams";
import {NotificationsService} from "angular2-notifications";
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'default-delete-wizard',
  template:
  `<div class="card">
    <div class="card-header">

    </div>
    <div class="card-block">
      <ng-content></ng-content>
    </div>
    <div class="card-footer">
    <!--<div class="card-footer" [hidden]="isCompleted">-->
        <button type="button" class="btn btn-secondary float-right" (click)="clickedNO($event)" >No</button>
        <button type="button" class="btn btn-secondary float-right" (click)="clickedYES($event)" >Yes</button>
    </div>
  </div>`
  ,
  styles: [
    '.card { margin-bottom: -10px; height: 100%;-webkit-box-shadow: 0 5px 15px rgba(0,0,0,0);-moz-box-shadow: 0 5px 15px rgba(0,0,0,0);-o-box-shadow: 0 5px 15px rgba(0,0,0,0);box-shadow: 0 5px 15px rgba(0,0,0,0); }',
    '.spanCls {display:inline-block;white-space: nowrap;overflow:hidden !important;text-overflow: ellipsis;}',
    '.card-header { background-color: #fff; padding: 0; "}',
    '.card-block { height: 100px; overflow: hidden; }',
    '.card-block:hover { overflow-y:auto; }',
    '.card-footer { background-color: #fff; border-top: 0 none; bottom: 0; left: 0; }'
  ],
  providers:[RPCService]
})
export class DeleteWizardComponent implements OnInit {

  @Input() rpcMethod:string ="";
  @Input() deleteParams:any={};
  @Input() context:string="";
  @Output() closeModal = new EventEmitter<string>();
  @Output() closeModalWizard = new EventEmitter<string>();
  config:any={};
  constructor(private clientRpc: RPCService, private _service:NotificationsService, private storage:SessionStorageService) {
    this.config = this.storage.retrieve("configParams");
   }

  ngOnInit() {
  }
  clickedNO(event)
  {
      event.preventDefault();
      this.closeModal.emit("yes");
      this.closeModalWizard.emit("yes");
  }
  clickedYES(event)
  {
      event.preventDefault();
      console.log("Method : "+this.rpcMethod);
      console.log(this.deleteParams);
      this.clientRpc.orgRPCCall("delete",this.rpcMethod,this.deleteParams)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        let log = new Logger();
        let status="success";
        if(String(res.type)=="undefined")
        {
          //log.storeFailNotification("Modify in UserRegistration Failed");
          try{
            if((res.result.status=="Success")||(res.result.Status=="Success"))
            {
              status="success";
              //console.log("Trigger reload Event....");
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
          log.storeSuccessNotification("In "+this.context+" Delete Succeeded");
          this._service.create("In "+this.context,"Delete Succeeded","success",this.config.notificationConfig);
        }
        else{
          log.storeFailNotification("In "+this.context+" Delete Failed");
          this._service.create("In "+this.context,"Delete Failed","error",this.config.notificationConfig);
        }
      });
      this.closeModal.emit("yes");
      this.closeModalWizard.emit("yes");

  }

}
