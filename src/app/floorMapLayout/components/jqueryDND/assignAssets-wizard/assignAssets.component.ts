import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers} from "@angular/http";
import {RPCService} from "../../../../commonServices/RPC.service";
import {BaThemeSpinner} from "../../../../theme/services";
@Component({
  selector: 'assignAssets-wizard',
  templateUrl: './assignAssets.component.html',
  styleUrls: ['./assignAssets.component.scss'],
  providers:[RPCService]
})

export class AssignAssetsWizardComponent implements OnInit {
    public myForm1: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() locationStruct:any={};
  @Input() floorUUID:string="";
  @Input() xPos:string="";
  @Input() yPos:string="";


  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;
    constructor(private _fb: FormBuilder,private clientRpc: RPCService,private http:Http, private _spinner: BaThemeSpinner) {

     }

    ngOnInit() {
      this.myForm1 = this._fb.group({
            unassignedDevice:['',[Validators.required]],
        });
      this.subcribeToFormChanges();
    }
    		ngAfterViewInit		(){
      //console.log("on wizard Init");
      //console.log(this.data);
    }

    subcribeToFormChanges() {
      this.myForm1.statusChanges.subscribe(x =>{
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
      }
    gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(this.myForm1.value);
    let formData = this.myForm1.value;
    let selectedAssetToAssign = this.data.filter(val => val.uuid==formData.unassignedDevice);
    console.log("Curr Loc Struct ");
    console.log(this.locationStruct);
    console.log("selectedAssetToAssign");
    console.log(selectedAssetToAssign);

    let finalData = jQuery.extend(
                  selectedAssetToAssign[0],
                  this.locationStruct,
                  {
                    "date":new Date().toISOString(),
                    "xcoordinate":this.xPos,
                    "ycoordinate":this.yPos,
                    "portalType":"",
                    'assignedTo':'Location',
                    "floorName":this.locationStruct.Floor,
                    "floorUUID":this.floorUUID
                  });
    console.log("Final Data");
    console.log(finalData);
    this._spinner.show();
  this.clientRpc.orgRPCCall("create","orgManagerFloorMapAssignedAssetsMethod",finalData)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        
        //this._spinner.hide();
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
    
  }
}
