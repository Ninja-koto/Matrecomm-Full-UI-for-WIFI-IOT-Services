import { Component, } from '@angular/core';
import { Routes } from '@angular/router';
import { TreeMenuService } from './sidebar/treeMenu/treeMenu.service';
//import { BaMenuService } from '../theme';
import { DASHBOARDLAYOUT_MENU } from './vehicleManagementdashboardLayout.menu';

import {VehicleDashboardDataService} from "./vehicleManagementdashboardLayout.service";
import { CollectionTableDataCollectorService } from '../commonServices/tableDataCollector.service';
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import {BaThemeSpinner} from "../theme/services";

import {AggrQueryService} from "../commonServices/pipeLine_AggrQueries";

@Component({
  selector: 'vehicleManagementdashboardLayout',
  templateUrl:'vehicleManagementdashboardLayout.component.html' ,
  styleUrls:['vehicleManagementdashboardLayout.component.scss'],
  providers:[VehicleDashboardDataService,CollectionTableDataCollectorService]
})
export class VehicleManagementdashboardLayout {

  columns= [
      {
        key: 'userName',
        label: 'UserName'
      },
      {
          key:'location',
          label:'Location'
      },
      {
        key:'usedData',
        label:'Used Data'
      },
      {
          key:'accessTime',
          label:'Access Time'
      },
      {
          key:'lastUpdateTime',
          label:'Last Updated Time'
      }
      ];

    currentLocation:string="India";
    currentLocationType:string="Country";
    deviceID:string="";
    selectedLocation:string="";
    activeUserCount:number=0;
    activeUserCountFromActHist:number=0;
    activeUserCountFromActSess:number=0;

    activeRouteCount:number=0;
    activeRouteCountFromActHist:number=0;
    activeRouteCountFromActSess:number=0;

    userUsedData:string="0 MB";
    userUsedData_AcctSess =0;
    userUsedData_HistLogs =0;

    mainTab:string = "clientStatsTab";
    innerTab:string="ApInventoryTab";
    data1:any[]
data2:any[]
interValID:any;
    lastUpdatedTime:number;
    assetsData:any=[];

    nsObj: NameSpaceUtil;
    namespace:string="";
    aggrQuery:AggrQueryService;
    assetMACs:any=[];
    assetDataCollected:Boolean=false;

    clientRadiusStatsPipeline:any=[];
    assetRadiusStatsPipeline:any=[];
    clientCountStatsPipeline:any=[];
    dateMatchObjForTable:any={};

  constructor(private _menuService: TreeMenuService,private storage:SessionStorageService,
  private vehicleData:VehicleDashboardDataService,
   private tableDataCollectService:CollectionTableDataCollectorService,private _spinner: BaThemeSpinner) {
    this._spinner.show();
this.lastUpdatedTime = new Date().getTime();
  this.aggrQuery=new AggrQueryService();
}
  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>DASHBOARDLAYOUT_MENU);
    this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("FloorAssignedAssets");
      console.log("NameSpace : "+this.namespace);
      this.collectData();
      this.getCount("userName");
      this.getCount("apMAC");
      this.getUsedData();
      setTimeout(function(){
          this.getUserCount();
          this.getRoutesCount();
          this.getUsersUsedData();
      }.bind(this),5000);
      this.startInterval();
  }
  getChartQueries(){
    let pipeline= this.aggrQuery.getClientRadiusQueryPipeLine();//getAggrQuery()["clientRadiusStats"];
    pipeline[0]["$match"]["apMAC"]={"$in":this.assetMACs};
    this.clientRadiusStatsPipeline = pipeline;

    let pipeline1=[];
    let range = this.aggrQuery.getDataRange();
    let matchObj={};
    if(range["$gte"]==undefined && range["$lte"]==undefined)
      matchObj={};
    else
      matchObj["lastUpdateTime"]=range;
    this.dateMatchObjForTable=matchObj;

    let matchObj1={};
    if(range["$gte"]==undefined && range["$lte"]==undefined)
      matchObj1={};
    else
      matchObj1["date"]=range;

    let temp={};
    matchObj1["macAddress"]={"$in":this.assetMACs};
    temp["$match"] = matchObj1;
    pipeline1.push(temp);
    this.clientCountStatsPipeline = pipeline1;
    this.assetRadiusStatsPipeline = pipeline1;
}

  collectData(){
    try{
        var paramsForData={};
        let query={};
        let projectQuery={};
        query["assignedTo"]="Vehicle";
        projectQuery["uuid"]=1;
        projectQuery["date"]=1;
        projectQuery["City"]=1;
        projectQuery["Continent"]=1;
        projectQuery["Country"]=1;
        projectQuery["Building"]=1;
        projectQuery["macAddress"]=1;
        projectQuery["assignedTo"]=1;
        paramsForData["projectQuery"]=projectQuery;
        paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=10000;
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                  try{
                    var res = result;//json();
                    /*console.log("FloorAssignedAssets");
                    console.log(res);*/
                    this.assetsData= res.data;
                    let macs=[];
                    this.assetsData.forEach(asset => {
                      macs.push(asset.macAddress);
                    });
                    this.assetMACs = macs;
                    this.getChartQueries();
                    this.assetDataCollected=true;
                    this._spinner.hide();
                  }
                  catch(e)
                  {
                    this.assetMACs = [];
                    this.assetDataCollected=true;
                    this._spinner.hide();
                  }
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
  }

startInterval(){
  console.log("In start Interval...");
  this.interValID = setInterval(() => {
    /*this.getUserCount();
    this.getRoutesCount();
    this.getUsersUsedData();*/
    this.getCount("userName");
    this.getCount("apMAC");
    this.getUsedData();
    setTimeout(function(){
        this.getUserCount();
        this.getRoutesCount();
        this.getUsersUsedData();
    }.bind(this),2000);

      let currTime = new Date().getTime();
      /*if(((currTime-this.lastUpdatedTime)/1000)<90)
          {*/
            this.collectData();
        /*}
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }*/
    }, 10000);
}

  getUserCount(){
    this.activeUserCount = this.activeUserCountFromActHist+this.activeUserCountFromActSess;
    //GET UNIQUE USERS
  }
  getRoutesCount(){
    this.activeRouteCount = this.activeRouteCountFromActHist+this.activeRouteCountFromActSess;
    //GET UNIQUE ROUTES
  }
  getUsersUsedData(){
    let data = this.userUsedData_AcctSess+this.userUsedData_HistLogs;
    let ext=" MB";
      if(data>=1024)
      {
        data = data/1024;
        ext=" GB";
      }
    this.userUsedData = String(data.toFixed(3))+ext;
  }
  getCount(key:string){
      try{
        /*let macs=[];
        this.assetsData.forEach(asset => {
          macs.push(asset.macAddress);
        });*/
        console.log("IN getCount");
        var paramsForData={};
        let query={};
        let range = this.aggrQuery.getDataRange();
        if(range["$gte"]==undefined && range["$lte"]==undefined)
          query={};
        else
          query["lastUpdateTime"]=range;
        query["apMAC"]={"$in":this.assetMACs};
        console.log(query);
        paramsForData["distinctKey"]= key;
        paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.nsObj.getNameSpace("radiusAcctActiveSessions");
          this.vehicleData.getCountData(paramsForData)
                .subscribe(result => {
                  var res = result;
                  let data = res.data;
                  /*console.log("For Acct Sess..");
                  console.log(data);*/
                  if(key=="userName")
                    this.activeUserCountFromActSess = data.length;
                  else
                    this.activeRouteCountFromActSess = data.length;
          });
          paramsForData["namespace"]= this.nsObj.getNameSpace("radiusAcctHistoricalLogs");
          this.vehicleData.getCountData(paramsForData)
                .subscribe(result => {
                  var res = result;
                  let data = res.data;
                  /*console.log("For Hist Sess..");
                  console.log(data);*/
                  if(key=="userName")
                    this.activeUserCountFromActHist = data.length;
                  else
                    this.activeRouteCountFromActHist = data.length;
          });
      }
      catch(e)
      {
        console.log("getUserCount Failed... ");
      }
  }

  getUsedData(){
      try{
        /*let macs=[];
        this.assetsData.forEach(asset => {
          macs.push(asset.macAddress);
        });*/
        var paramsForData={};
        let query={};
        let range = this.aggrQuery.getDataRange();
        if(range["$gte"]==undefined && range["$lte"]==undefined)
          query={};
        else
          query["lastUpdateTime"]=range;
        query["apMAC"]={"$in":this.assetMACs};
        paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.nsObj.getNameSpace("radiusAcctActiveSessions");
          this.vehicleData.getAggrData(paramsForData)
                .subscribe(result => {
                  var res = result;
                  let data = 0;
                  res.forEach(docs => {
                    data = data+Number(docs.value);
                  });
                  this.userUsedData_AcctSess = data;
          });
        paramsForData["namespace"]= this.nsObj.getNameSpace("radiusAcctHistoricalLogs");
          this.vehicleData.getAggrData(paramsForData)
                .subscribe(result => {
                  var res = result;
                  let data = 0;
                  res.forEach(docs => {
                    data = data+Number(docs.value);
                  });
                  this.userUsedData_HistLogs = data;
          });
      }
      catch(e)
      {
        console.log("getUsedData Failed... ");
      }
  }

  getNameSpace(coll:string){
    return this.nsObj.getNameSpace(coll);
  }
  ngAfterViewInit(){
  this._spinner.hide();
}


wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
mainTabChanged(e)
{
  /*console.log("Tab Changed...");
  console.log(e);
  console.log(e.tabID);*/
  this.mainTab = String(e.tabID);
  if(this.mainTab=="AccesspointTab")
    this.innerTab="ApInventoryTab"
  else if(this.mainTab=="SwitchTab")
    this.innerTab="SwitchInventoryTab"
}
innerTabChanged(e)
{
  /*console.log("Inner Tab Changed...");
  console.log(e);
  console.log(e.tabID);*/
  this.innerTab = String(e.tabID);
}

refreshAllCharts()
{
  console.log("Refreshing Chart...");
  setTimeout(function(){
    var buttons = document.getElementsByTagName('button');
    //var buttons = document.getElementById("chartRefreshButton");
    //var buttons = document.getElementsByClassName("chartRefreshButton");
    for (var i = 0; i < buttons.length; i++) {
      if(buttons[i].classList.contains("chartRefreshButton"))
        buttons[i].click();
    }
    //$('#snrRefresh').click();
    //$('#nofRefresh').click();
  }.bind(this),200);
}


  //for testing tree
  public sidebar:any;
  Click(event:any):void{
    console.log("Tree Clicked...");
    console.log(event);
    var locType= event.node.data.locType;
    var loc= event.node.data.key;
    let proceed=false;
    if(String(locType)=="city")
    {
      this.currentLocationType= "City";
      proceed=true;
    }
    if(String(locType)=="country")
    {
      this.currentLocationType= "Country";
      proceed=true;
    }
    if(String(locType)=="continent")
    {
      this.currentLocationType= "Continent";
      proceed=true;
    }
    if(String(locType)=="building")
    {
      this.currentLocationType= "Building";
      proceed=true;
    }
    if(String(locType)=="vehicle")
    {
      this.currentLocationType= "vehicle";
      this.deviceID = event.node.data.macAddress;
      proceed=true;
    }

    if(proceed)
    {
      this.currentLocation = loc;
      this.selectedLocation = loc;
      console.log(this.currentLocationType);
      console.log(this.currentLocation);
      this.refreshAllCharts();
    }
    else
    {
      console.log("Not allowed...");
      console.log(this.currentLocationType);
      console.log(this.currentLocation);
    }
  //this.sidebar=message;
}


getClientRadiusStatsQuery(){
  /*let pipeline= this.aggrQuery.getClientRadiusQueryPipeLine();
  pipeline[0]["$match"]["apMAC"]={"$in":this.assetMACs};
  return pipeline;*/
  return this.clientRadiusStatsPipeline;
  }
  getAssetRadiusStatsQuery(){
    /*let pipeline=[];
    let range = this.aggrQuery.getDataRange();
    let matchObj={};
    if(range["$gte"]==undefined && range["$lte"]==undefined)
      matchObj={};
    else
      matchObj["date"]=range;

    let temp={};
    matchObj["macAddress"]={"$in":this.assetMACs};
    temp["$match"] = matchObj;
    pipeline.push(temp);
    return pipeline;*/
    return this.assetRadiusStatsPipeline;
  }
  getUserCountStatsQuery(){
    /*let pipeline=[];
    let range = this.aggrQuery.getDataRange();
    let matchObj={};
    if(range["$gte"]==undefined && range["$lte"]==undefined)
      matchObj={};
    else
      matchObj["date"]=range;
    let temp={};
    matchObj["macAddress"]={"$in":this.assetMACs};
    temp["$match"] = matchObj;
    pipeline.push(temp);
    return pipeline;*/
    return this.clientCountStatsPipeline;
  }
  getDateRange(){
    /*let range = this.aggrQuery.getDataRange();
    let matchObj={};
    if(range["$gte"]==undefined && range["$lte"]==undefined)
      matchObj={};
    else
      matchObj["lastUpdateTime"]=range;
    return matchObj;*/
    return this.dateMatchObjForTable;
  }

}
