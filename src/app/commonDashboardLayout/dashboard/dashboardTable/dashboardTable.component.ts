import { Component, OnInit, Input, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'db-table',
  templateUrl: './dashboardTable.component.html',
  providers:	[CollectionTableDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class DashboardTable implements OnInit {

      tableData :any=[];
    columns= [
      {
        key: 'macAddress',
        label: 'MAC Address'
      },
      {
        key: 'Building',
        label: 'Building'
      },
      {
        key: 'City',
        label: 'City'
      },
      {
        key: 'Country',
        label: 'Country'
      }
      ];

@ViewChild('modal')
@Input() locationType:string;
@Input() locationName:string;

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
    storedData:any[]=[];
    finalParsedData:any[]=[];

    constructor(private storage:SessionStorageService, private tableDataCollectService:CollectionTableDataCollectorService
, vcRef: ViewContainerRef) {
      this.lastUpdatedTime = new Date().getTime();
    }

  ngOnInit() {
      this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("FloorAssignedAssets");
      console.log("NameSpace : "+this.namespace);
      try{
        var paramsForData={};
        let query={};
            paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;

          paramsForData["limit"]=1000;

          //this.tableDataCollectService.getData(paramsForData);
          //this.tableDataCollectService.project.subscribe(result => {
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                  var res = result;//json();
                  //console.log(res);
                  //this.tableData= res.data;
                  this.storeData(res.data);
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
      this.startInterval();
}

storeData(temp:any[])
{
  this.storedData=temp;
  this.filterDataForCharts();
}
filterDataForCharts()
{
  //Filter data according to locs
    var temp=[];
    let locType = this.locationType;
    let loc = this.locationName;
    var filteredData = this.storedData.reduce(function(buckets,item){
                  if(String(item[locType])===String(loc))
                    temp.push(item);
              return temp;
          },{});
    /*console.log("Filtered data...");
    console.log(filteredData);*/

    //this.finalParsedData= filteredData;
    this.tableData = temp;
  /*if(this.showChart==false)
  {
    this.showChart=true;
  } */
}
refreshData(event)
  {
    console.log("Data Table Refreshing...");

    this.filterDataForCharts();
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
              paramsForData["limit"]=1000;

          /*this.tableDataCollectService.getData(paramsForData)
          this.tableDataCollectService.project.subscribe(result => {*/
          this.tableDataCollectService.getPostData(paramsForData)
              .subscribe(result => {
            var res = result;//.json();
            //console.log(res);
                //this.tableData= res.data;
                this.storeData(res.data);
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
selectedRowData(e)
{
  console.log("selectedRowData");
}
selectedWizardOperation(e)
{
  console.log("selectedWizardOperation");
}


}

