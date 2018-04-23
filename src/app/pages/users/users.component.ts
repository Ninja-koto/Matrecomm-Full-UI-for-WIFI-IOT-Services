import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import {  UsersService } from './users.service';
import {  User } from './user';
//import { AddPerson } from '../add/add-person';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {AddWizardComponent} from "./add-wizard/add-wizard.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers:	[	{	provide:	UsersService,	useClass:	UsersService	}	],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
    tableData :any;
    columns= [
      {
        "key":"AuthCode",
        "label":"AuthCode"
      },
      {
        "key":"MobileNumber",
        "label":"MobileNumber"},
      {
        "key":"RegisteredTime",
        "label":"RegisteredTime"}/*,
      {
        "key":"_id",
        "label":"ID"
      }*/];


@ViewChild('modal')
    modal: ModalComponent;
    //model: AddPerson = new AddPerson();

     index: number = 0;
    backdropOptions = [true, false, 'static'];
    cssClass: string = '';

    animation: boolean = true;
    keyboard: boolean = false;
    backdrop: string | boolean = 'static';
    css: boolean = false;

    selected: string;
    output: string;

    currWizardOp:string;
    currWizardData:any;
    addWizard:boolean=false;
    modifyWizard:boolean=false;

    eraseModal:boolean = false;
    interValID:any;
    lastUpdatedTime:number;
    constructor(private userService:UsersService, vcRef: ViewContainerRef) { 
      this.lastUpdatedTime = new Date().getTime();
    }


    clickedWizardButtonID(val :string)
    {
      console.log("Clicked Wizard Operation ID...");
      console.log(val);
    }
    selectedRowData(val:any)
    {
      console.log("selectedRowData...");
      console.log(val);
      this.resetClock()
      val = {
         	name: 'Jane123',
         	address: {
         		street: 'High street',
         		postcode: '94043'
         	}
         }
      this.currWizardData=val;
    }
    selectedWizardOperation(val:string)
    {
      console.log("selectedWizardOperation...");
      console.log(val);
      this.currWizardOp=val;
      if(val=="Add")
      {
        this.addWizard=true;
        this.modifyWizard=false;
      }
      else if(val=="Modify")
      {
        this.addWizard=false;
        this.modifyWizard=true;
      }
      else
      {
        this.addWizard=false;
        this.modifyWizard=false;
      }
    }

    closed() {
      console.log("Trying to close...");
        //this.output = '(closed) ' + this.selected;
    }
    close1(){
      this.eraseModal=true;
      this.currWizardOp="";
      this.addWizard=false;
      this.modifyWizard=false;
      this.currWizardData={};
        console.log("In close1...");
    }
    dismissed() {
      console.log("dismissed...");
      this.currWizardOp="";
      this.addWizard=false;
      this.modifyWizard=false;
      this.currWizardData={};
        this.output = '(dismissed)';
    }
    opened() {
        this.output = '(opened)';
    }

    open() {
        //this.modal.open();
    }
    
  ngOnInit() {
    /*this.userService.getUsers()
        .subscribe(users =>{
        this.tableData = users;
        console.log("In GetUsers...");
        //console.log(JSON.stringify(this.tableData));
      });*/

      this.startInterval();
}
startInterval(){
  console.log("Starting Interval...");
          /*this.userService.getUsers();
          this.userService.project.subscribe(result => {*/
            this.userService.getUsers()
            .subscribe(result => {
            //console.log('Subscription Streaming:', result.json());
            this.tableData = result;//.json();
          });
  this.interValID = setInterval(() => {
      let currTime = new Date().getTime();
      if(((currTime-this.lastUpdatedTime)/1000)<30)
          {
            console.log("Getting DAta : "+(currTime-this.lastUpdatedTime)/1000);
          /*this.userService.getUsers();
          this.userService.project.subscribe(result => {*/
            this.userService.getUsers()
            .subscribe(result => {
            this.tableData = result;//.json();
          });
        }
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }
    }, 10000);
}
ngOnDestroy() {
  if (this.interValID) {
    console.log("In User Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}
resetClock(){
  if ((this.interValID)&&(this.interValID!="undefined")) {
    console.log("REsetting to zero....");
    this.lastUpdatedTime = new Date().getTime();
  }
  else
  {
    console.log("Creating New Interval");
    this.startInterval();
    this.lastUpdatedTime = new Date().getTime();
  }
}




}
