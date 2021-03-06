import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'asset-inventory',
  templateUrl: './assetInventoryTable.html',
  styleUrls: ['./assetInventoryTable.scss'],
  providers:	[CollectionTableDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class AssetInventoryTable implements OnInit {

      tableData :any;
    columns= [
      {
        key: 'inventoryProfileName',
        label: 'Profile Name'
      },
      {
        key:"selectSchedule",
        label:"Schedule Type",
        fn:function(value,object){
          var locStr=value;
          if(locStr=="immediately")
            locStr="Immediate";
          else if(locStr=="addTaskForDailyExecution")
            locStr="Daily Task";
          else if(locStr=="addTaskForDailyUntilExecution")
            locStr="Daily Task With Expire Data";
          else if(locStr=="addTaskForSelectedWeekDaysUntilExecution")
            locStr="Daily Task On Selected Days";
          return locStr;
          }
      }
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

    allLocations:any=[];
    configTemplates:any=[];
    regProfiles:any=[];

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
      this.deleteParamForSelected={"uuid":this.currWizardData.uuid,"selectSchedule":this.currWizardData.selectSchedule};
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
      this.getAllLocations();
      //this.getTemp();
      //this.getAllConfigTemplates();
      this.getAllRegProfiles();
      this.namespace = this.nsObj.getNameSpace("InventoryProfile");
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
          //this.tableDataCollectService.getData(paramsForData);
          //this.tableDataCollectService.project.subscribe(result => {
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                  var res = result;//json();
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

getTemp(){
  var paramsForData1={};
  this.tableDataCollectService.createView(paramsForData1)
            .subscribe(result => {
                  console.log("In Get Temp : ");
                  console.log(result);
                  //console.log(this.allLocations);
          });
}
getAllLocations(){
      let ns = this.nsObj.getNameSpace("CraftAirOrgLocation");
      try{
        var paramsForData1={};
        let query={};
        let projectQuery={};
        projectQuery["uuid"]=1;
        projectQuery["date"]=1;
        projectQuery["City"]=1;
        projectQuery["Continent"]=1;
        projectQuery["Country"]=1;
        projectQuery["Building"]=1;
        projectQuery["Floor"]=1;
        projectQuery["IPv4Details"]=1;
        paramsForData1["projectQuery"]=projectQuery;
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {
                  console.log("All Locations1 : ");
                  this.allLocations=result.data;
                  //console.log(this.allLocations);
          });
      }
      catch(e)
      {
        console.log("getAllLocations Data load Failed... ");
      }
}
getAllConfigTemplates(){
  let ns = this.nsObj.getNameSpace("AssetCfgTemplate");
      try{
        var paramsForData1={};
        let query={};
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {
                  console.log("All Config Templates : ");
                  this.configTemplates =result.data;
                  console.log(this.configTemplates);
          });
      }
      catch(e)
      {
        console.log("getAllConfigTemplates Data load Failed... ");
      }
}
getAllRegProfiles(){
      let ns = this.nsObj.getNameSpace("AssetRegProfile");
      try{
        var paramsForData1={};
        let query={};
            paramsForData1["dataQuery"]= query;
        paramsForData1["namespace"]= ns;
        paramsForData1["limit"]=100;
          this.tableDataCollectService.getPostData(paramsForData1)
            .subscribe(result => {
                  console.log("All Reg Profiles : ");
                  this.regProfiles=result.data;
                  console.log(this.regProfiles);
          });
      }
      catch(e)
      {
        console.log("getAllProfiles Data load Failed... ");
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

