import { Component, } from '@angular/core';
import { Routes } from '@angular/router';
import { TreeMenuService } from './sidebar/treeMenu/treeMenu.service';
//import { BaMenuService } from '../theme';
import { COMMONDASHBOARDLAYOUT_MENU } from './commonDashboardLayout.menu';

import {CommonDashboardDataService} from "./commonDashboardLayout.service";
import { CollectionTableDataCollectorService } from '../commonServices/tableDataCollector.service';
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import {BaThemeSpinner} from "../theme/services";

import {AggrQueryService} from "../commonServices/pipeLine_AggrQueries";

@Component({
  selector: 'commonDashboardLayout',
  templateUrl:'commonDashboardLayout.component.html' ,
  styleUrls:['commonDashboardLayout.component.scss'],
  providers:[CommonDashboardDataService,CollectionTableDataCollectorService,AggrQueryService]
})
export class CommonDashboardLayout {
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

    assetTableColumns= [
      {
        key: 'macAddress',
        label: 'Asset ID'
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
      },
      {
        key:"usedData",
        label:"Used Data"
      }
      ]



    currentLocation:string="India";
    currentLocationType:string="Country";

    mainTab:string = "clientStatsTab";
    innerTab:string="ApInventoryTab";
    currentUserCount:number=0;
    currentUsersUsedData:string="0 KB";
    totalAssetCount:number=0;
    onlineAssetCount:number=0;
    offlineAssetCount:number=0;

    data1:any[]
data2:any[]
interValID:any;
    lastUpdatedTime:number;
    assetsData:any=[];

    nsObj: NameSpaceUtil;
    namespace:string="";
    assetDataGathered:Boolean=false;
    assetMACs:any=[];
    clientRadiusStatsPipeLine:any=[];
    assetRadiusStatsPipeLine:any=[];
    userRadiusStatsPipeLineForTable:any=[];
    assetRadiusStatsPipelineForTable:any=[];
    rogueAssetByVendorAndModelPipeLineQuery:any=[];
    onlineOfflineData:any=[];
    radiusAcctCollNS:string="";
    assetStatsFromRadiusDataCollNS:string="";
    firstRender:boolean=true;

  constructor(private _menuService: TreeMenuService,private storage:SessionStorageService,
   private tableDataCollectService:CollectionTableDataCollectorService,private _spinner: BaThemeSpinner,
  private aggrQuery:AggrQueryService) {
    this._spinner.show();
    this.nsObj = new NameSpaceUtil(this.storage);
    this.radiusAcctCollNS =  this.getNameSpace('radiusAcctActiveSessions')
    this.assetStatsFromRadiusDataCollNS = this.getNameSpace('assetStatsFromRadiusData');

this.lastUpdatedTime = new Date().getTime();
    this.firstRender=true;

}
  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>COMMONDASHBOARDLAYOUT_MENU);
      this.namespace = this.nsObj.getNameSpace("FloorAssignedAssets");
      console.log("NameSpace : "+this.namespace);
      this.collectData();
      this.startInterval();
      this.getOnlineOfflineAssets();
  }
  getNameSpace(coll:string){
    return this.nsObj.getNameSpace(coll);
  }
  ngAfterViewInit(){
  this._spinner.hide();
}

collectData(){
  try{

    var paramsForData={};
    let query={}, projectQuery={};
    query["assignedTo"]="Location";
    projectQuery["uuid"]=1;
    projectQuery["date"]=1;
    projectQuery["City"]=1;
    projectQuery["floorUUID"]=1;
    projectQuery["Continent"]=1;
    projectQuery["Country"]=1;
    projectQuery["Building"]=1;
    projectQuery["macAddress"]=1;
    projectQuery["assignedTo"]=1;
    paramsForData["projectQuery"]=projectQuery;
    paramsForData["dataQuery"]= query;
    paramsForData["namespace"]= this.namespace;
    paramsForData["limit"]=10000;


      //this.tableDataCollectService.getData(paramsForData);
      //this.tableDataCollectService.project.subscribe(result => {
        this.tableDataCollectService.getPostData(paramsForData)
            .subscribe(result => {
              var res = result;//json();
              /*console.log("Assigned Assets");
              console.log(res);*/
              this.assetsData= res.data;
              console.log("SHOWING CHARTS.....");
              let macs=[];
              this.assetsData.forEach(asset => {
                macs.push(asset.macAddress);
              });
              this.assetMACs = macs;
              this.clientRadiusStatsPipeLine =  this.getClientRadiusStatsQuery();
              this.assetRadiusStatsPipeLine = this.getAssetRadiusStatsQuery();
              this.userRadiusStatsPipeLineForTable = this.getUserRadiusStatsPipeLineForTable();
              this.assetRadiusStatsPipelineForTable = this.getAssetRadiusStatsPipelineForTable();
              this.rogueAssetByVendorAndModelPipeLineQuery = this.getRogueAssetByVendorAndModelQuery();
              this.getUsersUsedData();

              this.assetDataGathered= true;
              if(this.firstRender)
              {//console.log("FIRST TIME SKIPPING REFRESH.....");
                this.firstRender=false;
              }
              else
              {//console.log("SECOND TIME ONWARDS REFRESH.....");
                this.refreshAllCharts();
              }
      });
  }
  catch(e)
  {
    console.log("Initial Data load Failed... ");
  }
}
ngOnDestroy() {
  if (this.interValID) {
    clearInterval(this.interValID);
  }
}
startInterval(){
  console.log("In start Interval...");
  this.interValID = setInterval(() => {

      let currTime = new Date().getTime();
      //if(((currTime-this.lastUpdatedTime)/1000)<30)
        //  {
             this.collectData();
        /*}
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }*/
    }, 30000);
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
    for (var i = 0; i < buttons.length; i++) {
        let clses;
        try{
        /*clses = buttons[i].className;
        if(clses.indexOf("chartRefreshButton")>=0)
          buttons[i].click();*/
        if(buttons[i].classList.contains("chartRefreshButton"))
          buttons[i].click();
        }
        catch(e){console.log("Exception");console.log(e)}
    }
    //$('#snrRefresh').click();
    //$('#nofRefresh').click();
  }.bind(this),200);
}

filterAllCharts()
{
  console.log("Refreshing Chart...");
  setTimeout(function(){
    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        let clses;
        try{
        /*clses = buttons[i].className;
        if(clses.indexOf("chartRefreshButton")>=0)
          buttons[i].click();*/
        if(buttons[i].classList.contains("chartFilterButton"))
          buttons[i].click();
        }
        catch(e){console.log("Exception");console.log(e)}
    }
    //$('#snrRefresh').click();
    //$('#nofRefresh').click();
  }.bind(this),200);
}


  //for testing tree
  public sidebar:any;
  Click(event:any):void{
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

    if(proceed)
    {
      this.currentLocation = loc;
      console.log(this.currentLocationType);
      console.log(this.currentLocation);
      this.filterAllCharts();
    }
    else
    {
      console.log("Not allowed...");
      console.log(this.currentLocationType);
      console.log(this.currentLocation);
    }
  //this.sidebar=message;
}

getUsersUsedData(){
  var paramsForData={};
      paramsForData["limit"]=-1;
      let query={};
      paramsForData["namespace"]= this.getNameSpace("radiusAcctActiveSessions");
      let tempObj=[
        {"$match":{}},
        {"$sort":{"lastUpdateTime":1}},
        {$project: {"sessionID":1,inputOctets:1,outputOctets:1,docs:'local'}},
        {
            "$group":{
                        "_id":"$sessionID",
                        "value":{$max:{
                        "$sum":{"$divide":[{"$add":["$inputOctets","$outputOctets"]},1048576]}
                        }},
                        docs:{$first:"$docs"},
                    }
        },
        {"$group":{"_id":"$docs","value":{ $sum:"$value"},count:{$sum:1} }},
        {$addFields:{"usedData":{ $concat:[{"$substr":["$value",0,-1]}," MB"] } }}
    ];

    paramsForData["dataQuery"]= tempObj;
    this.tableDataCollectService.getAggregatedData(paramsForData)
      .subscribe(result => {
        var res = result;//.json();
        console.log("getUsersUsedData");
        console.log(res.data);
        res=res.data;
        if(res==undefined)
          res=[];
        if(res.length>0&& Array.isArray(res))
        {
          this.currentUserCount = res[0].count;
          let data = res[0].value;
          this.currentUsersUsedData = this.convertBytesToMegaBytes(data);
        }
      
  });
}

getOnlineOfflineAssets(){
  var paramsForData={};
  console.log("In start Interval...");
      paramsForData["limit"]=-1;
      let query={};
            paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.getNameSpace("DashboardAssetData");
      let tempObj=[
            {"$match":{}},
            {"$group":{"_id":"$macAddress","value":{$sum:1},}},
            //{$addFields:{"macs":"$_id" }}
          ];

    paramsForData["dataQuery"]= tempObj;
    this.tableDataCollectService.getAggregatedData(paramsForData)
      .subscribe(result => {
        var res = result;//.json();
        console.log("ONLINE OFFLINE");
        console.log(res.data);
        let output=res.data;
        if(output===undefined)
          output=[];
        let macs=[];
        output.forEach(element => {
          macs.push(element._id);
        });
        console.log(macs);
        let forOnline={}, forOffline={};
        forOnline["limit"]=-1;
        forOnline["namespace"]= this.getNameSpace("FloorAssignedAssets");
        forOffline["limit"]=-1;
        forOffline["namespace"]= this.getNameSpace("FloorAssignedAssets");
        let tempObj=[
              {"$match":{"macAddress":{"$in":macs}}},
              {
                $group:{
                    _id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},
                    value: { $sum: 1 },
                    Country:{$first:"$Country"},
                    Continent:{$first:"$Continent"},
                    City:{$first:"$City"},
                    macAddress:{$first:"$macAddress"},
                    Building:{$first:"$Building"}
                }
            },
            {$addFields:{"name":"online"}}
            ];
        let tempObj1=[
              {"$match":{"macAddress": {"$not":{"$in":macs}}}},
              {
                $group:{
                    _id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},
                    value: { $sum: 1 },
                    Country:{$first:"$Country"},
                    Continent:{$first:"$Continent"},
                    City:{$first:"$City"},
                    macAddress:{$first:"$macAddress"},
                    Building:{$first:"$Building"}
                }
            },
            {$addFields:{"name":"offline"}}
            ];
            console.log(tempObj);
        //tempObj[0]["$match"]["macAddress"]={"$in":macs};
        forOnline["dataQuery"]= tempObj;
        //tempObj[0]["$match"]["macAddress"]={"$not":{"$in":macs}};
        forOffline["dataQuery"]= tempObj1;

        this.tableDataCollectService.getOnlineOfflineAssetCount(forOnline,forOffline)
        .subscribe(result => {
            console.log("FINAL RESULT");
            console.log(result);
            if(result==undefined)
              result=[];
            this.onlineAssetCount=0;
            this.offlineAssetCount=0;
            result.forEach(element => {
              console.log(element)
              if(element.name=="online")
                this.onlineAssetCount++;
              else if(element.name=="offline")
                this.offlineAssetCount++;  
            });
            this.totalAssetCount = this.onlineAssetCount+this.offlineAssetCount;
            this.onlineOfflineData = result;
          });
        //pipeline[0]["$match"]["apMAC"]={"$in":this.assetMACs};


  });


}




getClientRadiusStatsQuery(){
//let pipeline= this.aggrQuery.getAggrQuery()["clientRadiusStats"];
let pipeline = this.aggrQuery.getClientRadiusQueryPipeLine();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
/*let macs=[];
console.log(this.assetDataGathered);
console.log(this.assetsData);
this.assetsData.forEach(asset => {
  macs.push(asset.macAddress);
});*/
pipeline[0]["$match"]["apMAC"]={"$in":this.assetMACs};
//console.log("PIPELINE>>>>>>");
//console.log(JSON.stringify(pipeline));
/*console.log("Pipeline : ");
console.log(JSON.stringify(pipeline));*/
return pipeline;
}

getUserRadiusStatsPipeLineForTable(){
  let pipeline= this.aggrQuery.getClientRadiusStatsPipeLineForTable();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];

pipeline[0]["$match"]["apMAC"]={"$in":this.assetMACs};
return pipeline;
}

getAssetRadiusStatsPipelineForTable(){
  let pipeline= this.aggrQuery.getAssetRadiusStatsPipelineForTable();
  if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  return [];

  pipeline[0]["$match"]["apMAC"]={"$in":this.assetMACs};
  return pipeline;
}

getAssetRadiusStatsQuery(){
  let pipeline=[], macs=[];
  /*this.assetsData.forEach(asset => {
    macs.push(asset.macAddress);
  });*/
  let range = this.aggrQuery.getDataRange();
  let matchObj={};
  if(range["$gte"]==undefined && range["$lte"]==undefined)
    matchObj={};
  else
    matchObj["date"]=range;
  let temp={};
  matchObj["macAddress"]={"$in":this.assetMACs};
    //console.log(macObj);
  temp["$match"] = matchObj;
  pipeline.push(temp);
  return pipeline;
}


getInventoryWiredBackHaulQuery(){
let pipeline = this.aggrQuery.getInventoryWireBackHaulPipeline(); //this.aggrQuery.getAggrQuery()["inventoryWireBackHaul"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}

getInventoryWirelessBackHaulQuery(){
let pipeline =  this.aggrQuery.getInventoryWirelessBackHaulPipeline(); //this.aggrQuery.getAggrQuery()["inventoryWirelessBackHaul"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getInventoryByVendorQuery(){
  let pipeline = this.aggrQuery.getInventoryByVendorPipeline(); //this.aggrQuery.getAggrQuery()["inventoryByVendor"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getInventoryByModelQuery(){
  let pipeline = this.aggrQuery.getInventoryByModelPipeline(); //this.aggrQuery.getAggrQuery()["inventoryByModel"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getInventoryAssetTypesQuery(){
  let pipeline = this.aggrQuery.getInventoryAssetTypesPipeline(); //this.aggrQuery.getAggrQuery()["inventoryAssetTypes"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}

getRogueAssetByVendorAndModelQuery(){
  let pipeline = this.aggrQuery.getRogueAssetByVendorAndModelPipeLine();
  if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  return [];
  return pipeline;
}



getFaultRadioTrFailFramesQuery(){
  let pipeline = this.aggrQuery.getFaultRadioTrFailFramesPipeline(); //getAggrQuery()["faultRadioTrFailFrames"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getFaultRadioAuthFailQuery(){
  let pipeline = this.aggrQuery.getFaultRadioAuthFailPipeline();//getAggrQuery()["faultRadioAuthFail"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getFaultRadioTrBytesQuery(){
  let pipeline = this.aggrQuery.getFaultRadioTrBytesPipeline();//getAggrQuery()["faultRadioTrBytes"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getFaultRadioReceiveBytesQuery(){
  let pipeline = this.aggrQuery.getFaultRadioReceiveBytesPipeline();//getAggrQuery()["faultRadioReceiveBytes"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getPerformanceSNRQuery(){
  let pipeline = this.aggrQuery.getPerformanceSNRPipeline();//getAggrQuery()["performanceSNR"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getPerformanceConnectedClientsQuery(){
  let pipeline = this.aggrQuery.getPerformanceConnectedClientsPipeline();//getAggrQuery()["performanceConnectedClients"];
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
return pipeline;
}
getDateRangeForRadiusData(type:any){
  /*console.log("IN getDataRange");
  console.log("TYPE : ")
  console.log(type);*/
  let range = this.aggrQuery.getDataRange();
  let matchObj={};
  if(range["$gte"]==undefined && range["$lte"]==undefined)
    matchObj={};
  else
    {
      if(type=="radius")
      matchObj["lastUpdateTime"]=range;
      else
      matchObj["date"]=range;
    }
  //console.log(matchObj);
  return matchObj;
}

convertBytesToMegaBytes(data:any)
{
  console.log(data)
  if(data!=undefined)
  {
    console.log("IN IF");
    var ext="";
    ext=" MB";
    var dataStr = data.toFixed(3);
    if( (ext==" MB")&&(data>1024) )
    {
        data = data/1024; //MB
        dataStr = data.toFixed(3);
        ext=" GB";
    }
    return String(dataStr)+ext;
  }
  else
    return "0 KB";
}

}
