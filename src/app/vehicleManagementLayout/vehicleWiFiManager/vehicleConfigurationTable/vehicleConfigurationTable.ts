import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {AddWizardComponent} from "./add-wizard/add-wizard.component";
import {SessionStorage} from "../../../commonServices/sessionStorage";
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'vehicleConfiguration-details',
  templateUrl: './vehicleConfigurationTable.html',
  styleUrls: ['./vehicleConfigurationTable.scss'],
  providers:	[CollectionTableDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class VehicleConfigurationComponent implements OnInit {
    tableData :any[];
    columns= [
      {
        "key":"busRouteNumber",
        "label":"Vehicle Route Number"
      },
      {
        "key":"accessPointMac",
        "label":"AccessPoint MAC Address"},
      {
        "key":"ssid",
        "label":"SSID"}
      ];

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
    rowsOnEachPage=5;
    replaceWithNewData=false;

   // eraseModal:boolean = false;
    interValID:any;
    lastUpdatedTime:number;
    deleteParamForSelected:any;

    nsObj: NameSpaceUtil;
    namespace:string="";
    unAssignedAssets:any=[];
    portalPolicy:any=[];
    busPolicy:any=[]
    assignedAssets:any=[];
    constructor(private storage:SessionStorageService, private tableDataCollectService:CollectionTableDataCollectorService
, vcRef: ViewContainerRef) {
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
      this.currWizardData=val;
      let tempMac = this.currWizardData.accessPointMac;
      let mac = tempMac.substring(tempMac.indexOf("( ")+2,tempMac.indexOf(" )"))
      this.deleteParamForSelected={"uuid":this.currWizardData.uuid,
                                    "macAddress":mac,
                                    'assignTo':"None",
                                    'toSetAssigned':"",'toSetUnAssigned':tempMac
                                  };
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
      //this.eraseModal=true;
      console.log("Event caught to replace Table data....");
      this.replaceWithNewData=true;
      if (this.interValID) {
            clearInterval(this.interValID);
        }
        this.startInterval();
      this.resetClock();
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
      this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("BusConfiguration");
      this.getAllUnAssignedAssets();
      this.getBusPolicies();
      this.getPortalPolicies();
      this.getAllAssignedAssets();
      console.log("NameSpace : "+this.namespace);
      try{
        var paramsForData={};
        let query={};
            paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        if(String(this.tableData)!="undefined")//Get Only limited Data on start
        {
          if(this.replaceWithNewData==true)
            {
            paramsForData["limit"]=this.rowsOnEachPage;
          }
          else
          {
              if(this.tableData.length>0)//If already have data, WORKS WHEN SOME EVENT HAPPENs
                {
                  paramsForData["date"]=this.tableData[this.tableData.length-1].date;
                }
              else
                paramsForData["limit"]=this.rowsOnEachPage;
            }

        }
        else
        {
          paramsForData["limit"]=this.rowsOnEachPage;
        }
          /*this.tableDataCollectService.getData(paramsForData);
          this.tableDataCollectService.project.subscribe(result => {*/
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                  var res = result;//.json();
                  if(this.replaceWithNewData==true)
                  {
                    this.tableData= res.data;
                    this.replaceWithNewData=false;
                  }
                  else
                  {
                    if(res.data!=undefined)
                    if(res.data.length>0)
                    {
                      if(String(res.fromDate)!="undefined")
                      {
                          if(res.fromDate==this.tableData[this.tableData.length-1].date)
                            this.tableData= this.tableData.concat(res.data);
                          else
                            this.tableData= res.data;
                      }
                      else
                      {
                        this.tableData= res.data;
                      }
                    }
                  }
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
      this.startInterval();
}
getAllUnAssignedAssets(){
      let ns = this.nsObj.getNameSpace("FloorUnAssignedAssets");
      try{
        var paramsForData1={};
        let query={};
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {
                  console.log("All Locations1 : ");
                  this.unAssignedAssets=result.data;
                  //console.log(this.allLocations);
          });
      }
      catch(e)
      {
        console.log("getAllLocations Data load Failed... ");
      }
}
getAllAssignedAssets(){
      let ns = this.nsObj.getNameSpace("FloorAssignedAssets");
      try{
        var paramsForData1={};
        let query={};
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {
                  console.log("All Locations1 : ");
                  this.assignedAssets=result.data;
                  //console.log(this.allLocations);
          });
      }
      catch(e)
      {
        console.log("getAllLocations Data load Failed... ");
      }
}
getBusPolicies(){
      let ns = this.nsObj.getNameSpace("BusPolicy");
      try{
        var paramsForData1={};
        let query={};
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {
                  console.log("All Locations1 : ");
                  this.busPolicy=result.data;
                  //console.log(this.allLocations);
          });
      }
      catch(e)
      {
        console.log("getAllLocations Data load Failed... ");
      }
}
getPortalPolicies(){
      let ns = this.nsObj.getNameSpace("CcpLoginDetails");
      try{
        var paramsForData1={};
        let query={};
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {
                  console.log("All Locations1 : ");
                  this.portalPolicy=result.data;
                  //console.log(this.allLocations);
          });
      }
      catch(e)
      {
        console.log("getAllLocations Data load Failed... ");
      }
}



startInterval(){
  var paramsForData={};
  console.log("In start Interval...");
  this.interValID = setInterval(() => {
      paramsForData["limit"]=-1;
      let query={};
            paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.namespace;
      let currTime = new Date().getTime();
      if(((currTime-this.lastUpdatedTime)/1000)<30)
          {
            if(String(this.tableData)!="undefined")//Get Only limited Data on start
            {
              if(this.replaceWithNewData==true)
              {
                paramsForData["limit"]=this.rowsOnEachPage;
              }
              else
              {
                  if(this.tableData.length>0)
                  {
                    paramsForData["date"]=this.tableData[this.tableData.length-1].date;
                  }
              }
            }
            else
              paramsForData["limit"]=this.rowsOnEachPage;

          /*this.tableDataCollectService.getData(paramsForData)
          this.tableDataCollectService.project.subscribe(result => {*/
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
            var res = result;//.json();
            if(this.replaceWithNewData==true)
              {
                this.tableData= res.data;
                this.replaceWithNewData=false;
              }
              else
              {
                if(res.data!=undefined)
                if(res.data.length>0)
                {
                    this.tableData= this.tableData.concat(res.data);
                }
              }
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
















/*startInterval(){
  console.log("Starting Interval...");
          var paramsForData={};
      if(String(this.tableData)!="undefined")//Get Only limited Data on start
      {
        if(this.replaceWithNewData==true)
          {console.log("GOing for New Data...");
          paramsForData["limit"]=this.rowsOnEachPage;
        }
        else
        {
            if(this.tableData.length>0)//If already have data, WORKS WHEN SOME EVENT HAPPENs
              {
                console.log("DAte : ");
                paramsForData["date"]=this.tableData[this.tableData.length-1].date;
                console.log(this.tableData[this.tableData.length-1].date);
              }
            else
              paramsForData["limit"]=this.rowsOnEachPage;
          }

      }
      else
      {
        paramsForData["limit"]=this.rowsOnEachPage;
      }
        this.userService.getData(paramsForData);
        this.userService.project.subscribe(result => {
                //console.log('Subscription Streaming:', result.json());
                var res = result.json();
                console.log(res);
                if(this.replaceWithNewData==true)
                {
                  console.log("Replacing with New Data...");
                  this.tableData= res.data;
                  this.replaceWithNewData=false;
                }
                else
                {
                  if(res.data.length>0)
                  {
                    if(String(res.fromDate)!="undefined")
                    {

                        if(res.fromDate==this.tableData[this.tableData.length-1].date)
                          this.tableData= this.tableData.concat(res.data);
                        else
                          this.tableData= res.data;
                    }
                    else
                    {
                      this.tableData= res.data;
                    }
                  }
                }
        });

  this.interValID = setInterval(() => {
      paramsForData["limit"]=-1;
      let currTime = new Date().getTime();
      if(((currTime-this.lastUpdatedTime)/1000)<30)
          {
            console.log("Getting DAta : "+(currTime-this.lastUpdatedTime)/1000);
            if(this.replaceWithNewData==true)
            {
              console.log("GOing for New Data...");
              paramsForData["limit"]=this.rowsOnEachPage;
            }
            else
            {
                if(this.tableData.length>0)
                {
                  console.log("DAte : ");
                  paramsForData["date"]=this.tableData[this.tableData.length-1].date;
                  console.log(this.tableData[this.tableData.length-1].date);
                }
            }
          this.userService.getData(paramsForData)
          this.userService.project.subscribe(result => {
            var res = result.json();
            if(this.replaceWithNewData==true)
              {console.log("Replacing with New Data 2...");
                this.tableData= res.data;
                this.replaceWithNewData=false;
              }
              else
              {
                if(res.data.length>0)
                {
                    this.tableData= this.tableData.concat(res.data);
                }
                else
                {
                  console.log("Empty data 2....");
                }
              }
            console.log(res);
          });
        }
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }
    }, 10000);
}*/