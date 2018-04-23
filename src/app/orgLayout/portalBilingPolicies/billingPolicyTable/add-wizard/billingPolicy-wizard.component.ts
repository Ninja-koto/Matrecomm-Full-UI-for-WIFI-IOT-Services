import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../../commonServices/RPC.service";
import {CustomValidator} from "../../../../commonServices/customValidator.service";

@Component({
  selector: 'billingPolicy-add-wizard',
  templateUrl: './billingPolicy-wizard.component.html',
  styleUrls: ['./billingPolicy-wizard.component.scss'],
  providers:[RPCService]
})

export class BillingPolicyAddWizardComponent implements OnInit {  
    public myFormBillingOptions: FormGroup;
    
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=true; 

showBillingOptionTableErrorMsg:string = "none";

allBillingOptionProfiles:any[]=[];
billingOptionSelectedRowsForDeletion=[];


  public user: any;

  @Input() operation:string;
  @Input() data:any;
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
        this.myFormBillingOptions = this._fb.group({
              billingPlanName: ['', []],
              option1Name: ['', []],
              option1Value: ['', []],
              
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
              team: this.data.team,
              
            };
            console.log("temp");
            console.log(temp);
 
           (<FormGroup>this.myFormBillingOptions)
             .setValue(temp, { onlySelf: true });
           
          this.step1Validition=true;
         
        }
    }
    		ngAfterViewInit		(){
      }

 
addBillingOptionProfiles(e)
{
  /*console.log("In addProfiles");
  console.log(e);*/
  e.preventDefault();
  let option1Name = this.myFormBillingOptions.controls.option1Name.value;
  let option1Value = this.myFormBillingOptions.controls.option1Value.value;
  console.log(option1Name);
  console.log(option1Value);
  if((option1Name.length>0)&&(option1Value.length>0))
  {
    this.showBillingOptionTableErrorMsg="none";

    this.allBillingOptionProfiles.push({ "option1Name" : this.myFormBillingOptions.controls.option1Name.value, 
                   "id":  new Date().getTime(),  
              "option1Value" : this.myFormBillingOptions.controls.option1Value.value});
    console.log("All BillingOptionProfiles...");
    console.log(this.allBillingOptionProfiles);
    this.myFormBillingOptions.controls.option1Name.setValue([]);
    this.myFormBillingOptions.controls.option1Value.setValue([]);
  }
  else
  {
    ///show error msg
    this.showBillingOptionTableErrorMsg="block";
  }
  if(this.allBillingOptionProfiles.length>0)
    this.step1Validition=true;
}
  
maintainBillingOptionSelectedData(e,val)
{
//  console.log(e.target.checked);
  //  console.log(val);
  if(e.target.checked)
  {
    if(this.billingOptionSelectedRowsForDeletion.findIndex(ele => ele.id==val.id)<0)
      this.billingOptionSelectedRowsForDeletion.push(val);
  }
  else
  {
    let index = this.billingOptionSelectedRowsForDeletion.findIndex(ele => ele.id==val.id);
    this.billingOptionSelectedRowsForDeletion.splice(index,1);
  }
    console.log('this.billingOptionSelectedRowsForDeletion');

  console.log(this.billingOptionSelectedRowsForDeletion);
}
deleteBillingOptionSelectedProfiles(e)
{
  e.preventDefault();
 // console.log(e);
 
  let tableData=this.allBillingOptionProfiles;
  console.log('tableData.length')
  console.log(tableData.length)
    console.log(tableData)

    for(let i=0;i<tableData.length;i++)
    {
      let temp=this.billingOptionSelectedRowsForDeletion.filter(ele=> ele.id==tableData[i].id);
 console.log('temp.length')
      console.log(temp.length)
      console.log(temp)

      if(temp.length>0)
      {
        this.allBillingOptionProfiles.splice(i,1);
        this.billingOptionSelectedRowsForDeletion.splice(i,1);
      }
    }
  if(this.billingOptionSelectedRowsForDeletion.length<=0)
  {
    e.target.disabled=true;
  }
}

    subcribeToFormChanges() {
      this.myFormBillingOptions.statusChanges.subscribe(x =>{
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
    
    console.log(this.myFormBillingOptions.value);

    let finalData = jQuery.extend(this.myFormBillingOptions.value,{"date":new Date().toISOString()});
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }/*
  this.clientRpc.clientRPCCall(op,"providerManagerAdminMethod",finalData)
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
    this.closeModalWizard.emit(val);
    this.myFormBasic.reset();*/
  }
}
