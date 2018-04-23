import { Component, OnInit,Input, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import * as jQuery from "jquery";
import {SessionStorageService} from "ngx-webstorage"
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {AggrQueryService} from "../../../commonServices/pipeLine_AggrQueries";
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';

@Component({
  selector: 'alert-tab',
  templateUrl: './alertTab.component.html',
  providers:	[CollectionTableDataCollectorService,AggrQueryService],
  styleUrls:['./alertTab.component.scss']
})



export class AlertTabComponent implements OnInit{
  tableData :any;
    columns= [
      {
        key: 'currentstatus',
        label: 'Current Status'
      },
      {
        key: 'location',
        label: 'Location'
      },
      {
        key: 'severity',
        label: 'Severity'
      }
      ];


    locationType:string="Country";
    locationName:string="India";

    rowsOnEachPage=5;
    replaceWithNewData=false;
    interValID:any;
    lastUpdatedTime:number;
    deleteParamForSelected:any;

    nsObj: NameSpaceUtil;
    namespace:string="";
    storedData:any[]=[];
    finalParsedData:any[]=[];
    constructor(private storage:SessionStorageService, private aggrQuery:AggrQueryService,
      private tableDataCollectService:CollectionTableDataCollectorService) {
    this.lastUpdatedTime = new Date().getTime();
  }
    ngOnInit() {
      this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("AlertIncidentList");
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
                  console.log(res);
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
getNameSpace(coll:string){
    return this.nsObj.getNameSpace(coll);
  }
storeData(temp:any[])
{
  this.storedData=temp;
  this.tableData = temp;
  //this.filterDataForCharts();
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
    this.tableData = filteredData;
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
                this.tableData= res.data;
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
getDashboardNewAlertsQuery(){
  let pipeline = this.aggrQuery.getDashboardNewAlertsPipeline();//getAggrQuery()["dashboardNewAlerts"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getDashboardProgressAlertsQuery(){
  let pipeline = this.aggrQuery.getDashboardProgressAlertsPipeline();//getAggrQuery()["dashboardProgressAlerts"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getDashboardClosedAlertsQuery(){
  let pipeline = this.aggrQuery.getDashboardClosedAlertsPipeline();//getAggrQuery()["dashboardClosedAlerts"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getDashboardCriticalAlertsQuery(){
  let pipeline = this.aggrQuery.getDashboardCriticalAlertsPipeline();//getAggrQuery()["dashboardCriticalAlerts"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getDashboardFatalAlertsQuery(){
  let pipeline = this.aggrQuery.getDashboardFatalAlertsPipeline();//getAggrQuery()["dashboardFatalAlerts"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getDashboardWarningAlertsQuery(){
  let pipeline = this.aggrQuery.getDashboardWarningAlertsPipeline();//getAggrQuery()["dashboardWarningAlerts"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getDashboardErrorAlertsQuery(){
  let pipeline = this.aggrQuery.getDashboardErrorAlertsPipeline();//getAggrQuery()["dashboardErrorAlerts"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}


}
