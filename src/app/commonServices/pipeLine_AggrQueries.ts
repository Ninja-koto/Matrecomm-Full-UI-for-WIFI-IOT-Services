import { Injectable } from '@angular/core';
import {NameSpaceUtil} from "./nameSpaceUtil";
import {SessionStorageService} from "ngx-webstorage";
import { Component, } from '@angular/core';
//import * as config from "../../../configParams"


export class AggrQueryService {
nsObj:NameSpaceUtil;
aggregateQueries:any={};
private storage:SessionStorageService
config:any={};
dataRange={};
generalMatchObj={};
interValID:any;
 constructor() {
     this.storage=new SessionStorageService();
     this.config = this.storage.retrieve("configParams");
     console.log("CONFIG>>>>>");
     console.log(this.config);
     this.nsObj=new NameSpaceUtil(this.storage);
     let dateRange={};
     if(this.config.showDataType=="day")
     {
     dateRange = {"$gte":String(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString()),"$lte":String(new Date().toISOString()) };
     console.log("For Current DAY.....");

        var paramsForData={};
        console.log("In start Interval...");
     console.log(dateRange);
     }
     else if(this.config.showDataType=="range")
     {
     dateRange = {"$gte": eval(this.config.showDataStartTime) ,"$lte": eval(this.config.showDataEndTime)};
     console.log("NOT Current DAY.....");
     console.log(dateRange);
     }
     else
     {
         dateRange={};
     }
     this.dataRange= dateRange;
     console.log("DATE RANGE");
     console.log(dateRange);




    let generalMatchObj={};
    if(dateRange["$gte"]==undefined && dateRange["$lte"]==undefined)
        generalMatchObj={};
    else
        generalMatchObj["date"]=dateRange;
    this.interValID = setInterval(() => {
        console.log("PIPELINE INTERVAL...");
        if(this.config.showDataType=="day")
            {
            let datRange = {"$gte":String(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString()),"$lte":String(new Date().toISOString()) };
            this.dataRange= datRange;
            if(dateRange["$gte"]==undefined && dateRange["$lte"]==undefined)
                generalMatchObj={};
            else
                generalMatchObj["date"]=datRange;
        }
        console.log(JSON.stringify(this.dataRange));
    }, 30000);
    this.generalMatchObj = generalMatchObj;
    console.log("GENERAL MATCH");
    console.log(JSON.stringify(generalMatchObj));
    console.log(JSON.stringify(dateRange));
  }

  ngOnDestroy() {
    if (this.interValID) {
      console.log("In Piple_AggrQuery Component Destroying Set Interval...");
      clearInterval(this.interValID);
    }
  }

  /*getAggrQuery(){
      return this.aggregateQueries;
  }*/
  getDataRange(){
      return this.dataRange;
  }

  getClientRadiusQueryPipeLine(){
    let clientRadMatchObj={};
    if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
       clientRadMatchObj={};
    else
       clientRadMatchObj["lastUpdateTime"]=this.dataRange;
        /*{"lastUpdateTime":{"$gte":String(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString()),"$lte":String(new Date().toISOString()) } }*/
        return  [
                    {"$match":clientRadMatchObj},
                    { $sort: { lastUpdateTime: 1 } },
                    {$group:{_id: {apMAC:"$apMAC",userName:"$userName"},series: { $push:  { "name": "$lastUpdateTime", "value":{"$sum":{"$divide":[ {"$add":["$inputOctets","$outputOctets"]},1024*1024] }} } }}},
                    {
                    $lookup:
                        {
                        from: this.nsObj.getNameSpace("FloorAssignedAssets"),
                        localField: "_id.apMAC",
                        foreignField: "macAddress",
                        as: "details"
                        }
                },
                {"$unwind":"$details"},
                {"$project": {"Building":"$details.Building","City" : "$details.City","Continent" : "$details.Continent","Country" : "$details.Country","Floor" : "$details.Floor",macAddress:"$_id.apMAC" ,name:"$_id.userName", _id:"$_id",series:"$series"}}
                ];

  }

  getClientRadiusStatsPipeLineForTable(){
    return [
        {"$match":this.generalMatchObj},
        {"$sort":{"lastUpdateTime":1}},
        {$project: {"lastUpdateTime":1,"sessionID":1,apMAC:1,inputOctets:1,outputOctets:1,userName:1,accessTime:1,userIPAddress:1}},
        {
            "$group":{
                        "_id":"$sessionID",
                        "value":{$max:{
                        "$sum":{"$divide":[{"$add":["$inputOctets","$outputOctets"]},1048576]}
                        }},
                        lastUpdateTime : {$first:"$lastUpdateTime"},
                        apMAC:{$first:"$apMAC"},
                        userName:{$first:"$userName"},
                        accessTime:{$first:"$accessTime"},
                        userIPAddress: {$first:"$userIPAddress"}
                    }
        },
        {$addFields:{"usedData":{ $concat:[{"$substr":["$value",0,-1]}," MB"] } }}
    ];
  }

  getAssetRadiusStatsPipelineForTable(){
      return [
        {"$match":this.generalMatchObj},
        {"$sort":{"lastUpdateTime":1}},
        {$project: {"lastUpdateTime":1,"sessionID":1,apMAC:1,inputOctets:1,outputOctets:1}},
        {"$group":{"_id":{"apMAC":"$apMAC","sessionID":"$sessionID"},"value":{$max:{"$sum":{"$divide":[{"$add":["$inputOctets","$outputOctets"]},1048576]}}}}},
        {"$group":{"_id":"$_id.apMAC","value":{ $sum:"$value"}}},
        {$addFields:{ "apMAC":"$_id", "usedData":{ $concat:[{"$substr":["$value",0,-1]}," MB"] } }}
      ];
  }

  getInventoryWireBackHaulPipeline(){
    let inventoryWireBackHaulMatchObj={};
    /*if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
        inventoryWireBackHaulMatchObj={};
    else
        inventoryWireBackHaulMatchObj["date"]=this.dataRange;*/
    inventoryWireBackHaulMatchObj["apType"]="Wired";

    return [
        //{ $match : { apType : "Wired","date":dateRange} },
        {$match: inventoryWireBackHaulMatchObj},
        { $sort: { date: 1 } },
        {
            $group:{
                _id: {model:"$model",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},
                value: { $sum: 1 },
                name:{$first:"$model"},
                Country:{$first:"$Country"},
                Continent:{$first:"$Continent"},
                City:{$first:"$City"},
                Building:{$first:"$Building"}
            }
        }
    ];
  }

  getInventoryWirelessBackHaulPipeline(){
    let inventoryWirelessBackHaulMatchObj={};
    /*if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
        inventoryWirelessBackHaulMatchObj={};
    else
        inventoryWirelessBackHaulMatchObj["date"]=this.dataRange;*/
    inventoryWirelessBackHaulMatchObj["apType"]="Wireless";
    return [
        //{ $match : { apType : "Wireless","date":dateRange} },
        {$match: inventoryWirelessBackHaulMatchObj},
        { $sort: { date: 1 } },
        {
            $group:{
                _id: {model:"$model",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},
                value: { $sum: 1 },
                name:{$first:"$model"},
                Country:{$first:"$Country"},
                Continent:{$first:"$Continent"},
                City:{$first:"$City"},
                Building:{$first:"$Building"}
            }
        }
    ];
  }

  getInventoryByVendorPipeline(){

    return [
        //{"$match":{"date":dateRange }},
        //{$match:this.generalMatchObj},
        {$match:{}},
        { $sort: { date: 1 } },
        {
            $group:{
                _id: {vendor:"$vendor",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},
                value: { $sum: 1 },
                name:{$first:"$vendor"},
                Country:{$first:"$Country"},
                Continent:{$first:"$Continent"},
                City:{$first:"$City"},
                Building:{$first:"$Building"}
            }
        }
    ];
  }

  getInventoryByModelPipeline(){

    return[
        //{"$match":{"date":dateRange }},
        //{$match:this.generalMatchObj},
        {$match:{}},
        { $sort: { date: 1 } },
        {
            $group:{
                _id: {model:"$model",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},
                value: { $sum: 1 },
                name:{$first:"$model"},
                Country:{$first:"$Country"},
                Continent:{$first:"$Continent"},
                City:{$first:"$City"},
                Building:{$first:"$Building"}
            }
        }
    ];
  }

  getInventoryAssetTypesPipeline(){
    return[
        //{"$match":{"date":dateRange }},
        //{$match:this.generalMatchObj},
        {$match:{}},
        {
            $group:{
                _id: {apType:"$apType",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},
                value: { $sum: 1 },
                name:{$first:"$apType"},
                Country:{$first:"$Country"},
                Continent:{$first:"$Continent"},
                City:{$first:"$City"},
                Building:{$first:"$Building"}
            }
        }
    ];
  }

  getRogueAssetByVendorAndModelPipeLine(){
      return [
        {$match:{}},
        {$project: {"vendor":1,"model":1}},
        {
            "$group":{
                        "_id":{model:"$model",vendor:"$vendor"},
                        "value":{$sum:1},
                    }
        },
        {$addFields:{"name":{ $concat:["$_id.vendor",", ","$_id.model"] } }}
    ]
  }


  getFaultRadioTrFailFramesPipeline(){
    return[
        //{"$match":{"date":dateRange }},
        {$match:this.generalMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$radioStats.transmittedFailureFrames" } }}},
        {
            $addFields: { name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
    ];
  }

  getFaultRadioAuthFailPipeline(){
    return[
        //{"$match":{"date":dateRange }},
        {$match:this.generalMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$radioStats.authenticationFailures" } }}},
        {
            $addFields: { name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
    ];
  }

  getFaultRadioTrBytesPipeline(){
    return[
        //{"$match":{"date":dateRange }},
        {$match:this.generalMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$radioStats.transmitBytes" } }}},
        {
            $addFields: { name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
    ];
  }

  getFaultRadioReceiveBytesPipeline(){
    return[
        //{"$match":{"date":dateRange }},
        {$match:this.generalMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$radioStats.receivedBytes" } }}},
        {
            $addFields: { name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
    ];
  }

  getPerformanceSNRPipeline(){
    return[
        //{"$match":{"date":dateRange }},
        {$match:this.generalMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$apSNR" } }}},
        {
            $addFields: {name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
    ];
  }

  getPerformanceConnectedClientsPipeline(){
    return[
        //{"$match":{"date":dateRange }},
        {$match:this.generalMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$clientDetails.noOfClients" } }}},
        {
            $addFields: { name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
    ];
  }

  getDashboardNewAlertsPipeline(){
    let dashboardNewAlertsMatchObj={};
    if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
         dashboardNewAlertsMatchObj={};
    else
         dashboardNewAlertsMatchObj["date"]=this.dataRange;
    dashboardNewAlertsMatchObj["currentstatus"]="New";

    return[
       //{"$match":{ currentstatus : "New","date":dateRange}},
       {"$match":dashboardNewAlertsMatchObj},
       { $sort: { date: 1 } },
       {$group:{_id: {currentstatus:"$currentstatus"},series: { $push:  { name: "$createdTime", value:{ $sum: 1 } } }}},
       {
       $addFields: { name:"$_id.currentstatus"}
       }
   ];
  }

  getDashboardProgressAlertsPipeline(){
    let dashboardProgressAlertsMatchObj={};
    if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
          dashboardProgressAlertsMatchObj={};
    else
          dashboardProgressAlertsMatchObj["date"]=this.dataRange;
    dashboardProgressAlertsMatchObj["currentstatus"]="In Progress";
    return[
       //{"$match":{currentstatus : "In Progress","date":dateRange}},
       {$match:dashboardProgressAlertsMatchObj},
       { $sort: { date: 1 } },
       {$group:{_id: {currentstatus:"$currentstatus"},series: { $push:  { name: "$inProgressCreatedTime", value:{ $sum: 1 } } }}},
       {
       $addFields: { name:"$_id.currentstatus"}
       }
   ];
  }

  getDashboardClosedAlertsPipeline(){
    let dashboardClosedAlertsMatchObj={};
    if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
       dashboardClosedAlertsMatchObj={};
    else
       dashboardClosedAlertsMatchObj["date"]=this.dataRange;
    dashboardClosedAlertsMatchObj["currentstatus"]="Closed";

    return[
        //{"$match":{currentstatus : "Closed","date":dateRange}},
        {$match: dashboardClosedAlertsMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {currentstatus:"$currentstatus"},series: { $push:  { name: "$closedTime", value:{ $sum: 1 } } }}},
        {
        $addFields: { name:"$_id.currentstatus"}
        }
    ];
  }

  getDashboardCriticalAlertsPipeline(){
    let dashboardCriticalAlertsMatchObj={};
    if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
       dashboardCriticalAlertsMatchObj={};
    else
       dashboardCriticalAlertsMatchObj["date"]=this.dataRange;
    dashboardCriticalAlertsMatchObj["severity"]="Critical";

    return[
         //{"$match":{severity : "Critical","date":dateRange}},
         {$match:dashboardCriticalAlertsMatchObj},
         { $sort: { date: 1 } },
         {$group:{_id: {severity:"$severity"},series: { $push:  { name: "$createdTime", value:{ $sum: 1 } } }}},
         {
         $addFields: { name:"$_id.severity"}
         }
     ];
  }

  getDashboardFatalAlertsPipeline(){
    let dashboardFatalAlertsMatchObj={};
    if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
      dashboardFatalAlertsMatchObj={};
    else
      dashboardFatalAlertsMatchObj["date"]=this.dataRange;
    dashboardFatalAlertsMatchObj["severity"]="Fatal";

    return[
       //{"$match":{severity : "Fatal","date":dateRange}},
       {$match:dashboardFatalAlertsMatchObj},
       { $sort: { date: 1 } },
       {$group:{_id: {severity:"$severity"},series: { $push:  { name: "$createdTime", value:{ $sum: 1 } } }}},
       {
       $addFields: { name:"$_id.severity"}
       }
   ];
  }

  getDashboardWarningAlertsPipeline(){
    let dashboardWarningAlertsMatchObj={};
    if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
       dashboardWarningAlertsMatchObj={};
    else
       dashboardWarningAlertsMatchObj["date"]=this.dataRange;
    dashboardWarningAlertsMatchObj["severity"]="Warning";

    return[
        //{"$match":{severity : "Warning","date":dateRange}},
        {$match:dashboardWarningAlertsMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {severity:"$severity"},series: { $push:  { name: "$createdTime", value:{ $sum: 1 } } }}},
        {
        $addFields: { name:"$_id.severity"}
        }
    ];

  }
  getDashboardErrorAlertsPipeline(){
    let dashboardErrorAlertsMatchObj={};
    if(this.dataRange["$gte"]==undefined && this.dataRange["$lte"]==undefined)
       dashboardErrorAlertsMatchObj={};
    else
       dashboardErrorAlertsMatchObj["date"]=this.dataRange;
    dashboardErrorAlertsMatchObj["severity"]="Error";

    return[
        //{"$match":{severity : "Error","date":dateRange}},
        {$match:dashboardErrorAlertsMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {severity:"$severity"},series: { $push:  { name: "$createdTime", value:{ $sum: 1 } } }}},
        {
        $addFields: { name:"$_id.severity"}
        }
    ];
  }

  getDashboardRSSIPipeLine(){
      return [
        {$match:this.generalMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$lteInfo.RSSI" } }}},
        {
            $addFields: { name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
        ];
  }

  getDashboardSINRPipeLine(){
    return [
      {$match:this.generalMatchObj},
      { $sort: { date: 1 } },
      {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$lteInfo.SINR" } }}},
      {
          $addFields: {name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
      }
      ];
}

getDashboardRSRPPipeLine(){
    return [
      {$match:this.generalMatchObj},
      { $sort: { date: 1 } },
      {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: "$date", value: "$lteInfo.RSRP" } }}},
      {
          $addFields: { name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
      }
      ];
}

getDashboardUpTimePipeLine(){
    return [
        {$match:this.generalMatchObj},
        { $sort: { date: 1 } },
        {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:"$date" }}},
        {
            $addFields: {name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
        ];
}

getDashboardTXTHRPipeLine(){
return [
    {$match:this.generalMatchObj},
    { $sort: { date: 1 } },
    {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { "name": "$date", "value":{"$sum":{"$divide":[ "$lteInfo.TXTHR",1024*1024] }} } }}},
    {
        $addFields: { name: { $concat: [ "Tx THR(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
    }
    ]
}

getDashboardRXTHRPipeLine(){
return [
    {$match:this.generalMatchObj},
    { $sort: { date: 1 } },
    {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { "name": "$date", "value":{"$sum":{"$divide":[ "$lteInfo.RXTHR",1024*1024] }} } }}},
    {
        $addFields: { name: { $concat: [ "Rx THR(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
    }
    ]
}

getDashboardTrDataPipeLine(){
return [
    {$match:this.generalMatchObj},
    { $sort: { date: 1 } },
    {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { "name": "$date", "value":{"$sum":{"$divide":[ "$trBytes",1024*1024] }} } }}},
    {
        $addFields: { name: { $concat: [ "Transmitted Data(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
    }
    ]
}
getDashboardRvDataPipeLine(){
return [
    {$match:this.generalMatchObj},
    { $sort: { date: 1 } },
    {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { "name": "$date", "value":{"$sum":{"$divide":[ "$rvBytes",1024*1024] }} } }}},
    {
        $addFields: { name: { $concat: [ "Recived Data(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
    }
    ]
}
getDashboardTotalDataPipeLine(){
return [
    {$match:this.generalMatchObj},
    { $sort: { date: 1 } },
    {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { "name": "$date", "value":{"$sum":{"$divide":[ {$add:["$trBytes","$rvBytes"]},1024*1024] }} } }}},
    {
        $addFields: { name: { $concat: [ "Total Data(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
    }
    ]
}
getDashboardTxDeltaUsedDataPipeLine(){
    return [
        {$match:this.generalMatchObj},
        {$project: {"macAddress":1,"Country":1,"Continent":1,"City":1,"Building":1,"date":1,"rvBytes":1,"trBytes":1}},
        // Add all data to one array.
        {$group: {_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"}, all: {$push: "$$ROOT"}}},
        // Create an array of (element, array index) pairs.
        {$addFields: {allWithIndex: {$zip: {inputs: ["$all", {$range: [0, {$size: "$all"}]}]}}}},
        {$addFields: {allData: {$zip: {inputs: ["$all", {$range: [1, {$size: "$all"}]}]}}}},
        // Create an array of {current: <element>, previous: <previous element>} pairs.
        {$project: {pairs: {$map: {input: "$allWithIndex",in : {current: {$arrayElemAt: ["$$this", 0]},prev: {$arrayElemAt: ["$allData",/* Set prev == current for the first element.*/{$max: [0, {$subtract: [{$arrayElemAt: ["$$this", 1]}, 1]}]}]}}}}}},
        // Compute the deltas.
        {$unwind: "$pairs"},
        {"$project":{"pairs":1,"prevOld":{$arrayElemAt:["$pairs.prev",0]}}},
        {$group: {_id: "$_id",
            series: {
                $push:  {
                    "name": "$pairs.current.date",
                    /*"value1":"$pairs.current.rvBytes","oldDate":"$prevOld.date","value2": "$prevOld.rvBytes,"*/
                    "value":{
                                $cond: {
                                        if: { $gte: [ {"$subtract":[ "$pairs.current.trBytes","$prevOld.trBytes"]}, 0 ] },
                                        then: {"$divide":[ {"$subtract":[ "$pairs.current.trBytes","$prevOld.trBytes"]},1024*1024]} ,
                                        else: 0
                                    }
                            }
                    }
                }
            }
        },
        {
            $addFields: { name: { $concat: [ "Tx Data(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
    ]
}

getDashboardRxDeltaUsedDataPipeLine(){
    return [
        {$match:this.generalMatchObj},
        {$project: {"macAddress":1,"Country":1,"Continent":1,"City":1,"Building":1,"date":1,"rvBytes":1,"trBytes":1}},
        // Add all data to one array.
        {$group: {_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"}, all: {$push: "$$ROOT"}}},
        // Create an array of (element, array index) pairs.
        {$addFields: {allWithIndex: {$zip: {inputs: ["$all", {$range: [0, {$size: "$all"}]}]}}}},
        {$addFields: {allData: {$zip: {inputs: ["$all", {$range: [1, {$size: "$all"}]}]}}}},
        // Create an array of {current: <element>, previous: <previous element>} pairs.
        {$project: {pairs: {$map: {input: "$allWithIndex",in : {current: {$arrayElemAt: ["$$this", 0]},prev: {$arrayElemAt: ["$allData",/* Set prev == current for the first element.*/{$max: [0, {$subtract: [{$arrayElemAt: ["$$this", 1]}, 1]}]}]}}}}}},
        // Compute the deltas.
        {$unwind: "$pairs"},
        {"$project":{"pairs":1,"prevOld":{$arrayElemAt:["$pairs.prev",0]}}},
        {$group: {_id: "$_id",
            series: {
                $push:  {
                    "name": "$pairs.current.date",
                    /*"value1":"$pairs.current.rvBytes","oldDate":"$prevOld.date","value2": "$prevOld.rvBytes,"*/
                    "value":{
                                $cond: {
                                        if: { $gte: [ {"$subtract":[ "$pairs.current.rvBytes","$prevOld.rvBytes"]}, 0 ] },
                                        then: {"$divide":[ {"$subtract":[ "$pairs.current.rvBytes","$prevOld.rvBytes"]},1024*1024]} ,
                                        else: 0
                                    }
                            }
                    }
                }
            }
        },
        {
            $addFields: { name: { $concat: [ "Rx Data(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
        }
    ]
}
getAssetInfoWithPingStatusPipeLine(){
    /*return [
        { $sort: { date: 1 } },
        { "$lookup": {
        "localField": "macAddress",
        "from": this.nsObj.getNameSpace("assetPingStatus"),
        "foreignField": "macAddress",
        "as": "assetInfo"
      } },
      { "$unwind": "$assetInfo" },
      { "$project": {"macAddress": 1,"Building":1,"City" : 1,"Continent" : 1,"Country" : 1,"Floor" : 1,"date":1,"uuid":1,"floorUUID": 1,"assignedTo":1,"status":"$assetInfo.status"} }
    ];*/
    return [
        { $sort: { date: 1 } },
      { "$project": {"macAddress": 1,"Building":1,"City" : 1,"Continent" : 1,"Country" : 1,"Floor" : 1,"date":1,"uuid":1,"floorUUID": 1,"assignedTo":1} }
    ];
}

getDashboardAssetInfoPipeLine(){
    return [
        //{$match:this.generalMatchObj},
        {$match:{}},
        { $sort: {date: 1 } },
        {
            $group:
            {
                _id: "$macAddress",
                date: { $last: "$date" },
                macAddress : {$last:"$macAddress"},
                lteInfo : {$last:"$lteInfo"},
                apnInfo : {$last:"$apnSettings"},
                apnWanInfo : {$last:"$apnWanInfo"},
                lanInfo : {$last:"$lanInfo"},
                wanInfo : {$last:"$wanInfo"},
                adminApnInfo:{$last:"$adminApnSettings"},
                deviceInfo : {$last:"$deviceInfo"},
                trBytes : {$first:"$trBytes"},
                rvBytes : {$first:"$rvBytes"}
            }
        }
    ];
}

/*
JOIN
db["CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.FloorAssignedAssets"].aggregate([
    { $sort: { date: 1 } },
    { "$lookup": {
    "localField": "macAddress",
    "from": "CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.assetStatus",
    "foreignField": "macAddress",
    "as": "userinfo"
  } },
  { "$unwind": "$userinfo" },
  { "$project": {
    "macAddress": 1,
    "floorUUID": 1,
    "userinfo.status": 1
  } }
])

db["CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.DashboardAssetData"].aggregate([
{ $sort: { date: 1 } },
{$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { "name": "$date", "value":{"$sum":{"$divide":[ "$lteInfo.TXTHR",1024*1024] }} } }}},
{
    $addFields: { name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
}
])
*/


///DATE OBJECT TO STRING QUERY WITH AGGREGATION
/*db["CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.DashboardAssetData"].aggregate([
    { $sort: { date: 1 } },
    {$group:{_id: {macAddress:"$macAddress",Country:"$Country",Continent:"$Continent",City:"$City",Building:"$Building"},series: { $push:  { name: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S:%L", date: "$date" } }, value: "$lteInfo.SINR" } }}},
    {
        $addFields: {name: { $concat: [ "$_id.Building", "(", "$_id.macAddress",")" ] },Country:"$_id.Country",Continent:"$_id.Continent",City:"$_id.City",Building:"$_id.Building",macAddress:"$_id.macAddress"}
    }
    ])*/

/*
///DOUBLE AGGREGATION EXAMPLE
db["CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.TempDashboardAssetData"].aggregate([
  {
    "$project":
    {
      "date":1,
      "y":{"$year":"$date"},
      "m":{"$month":"$date"},
      "d":{"$dayOfMonth":"$date"},
      "w":{"$dayOfWeek":"$date"},
      "h":{"$hour":"$date"}
    }
  },
  {
    "$group":
    {
      "_id":
      {
        "day": "$d",
        "month":"$m",
        "hour": "$h"
      },
      "value": { $sum: 1 },
      "date":{$last:"$date"}
    }
  },
  {
    "$group":
    {
      "_id": {"day":"$_id.day","month":"$_id.month"},
      "series":
      {
        "$push":
        {
          "name": "$_id.hour",
          "value": "$value"
        }
      }
    }
  },
  {
      $addFields:{"name":{ $concat:[ {"$substr":["$_id.month",0,-1]} ,"_",{"$substr":["$_id.day",0,-1]}] } }
  }
])


///DOUBLE AGGREGATION EXAMPLE
db["CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.TempDashboardAssetData"].aggregate([
  {
    "$project":
    {
      "date": 1,
      "H": { $floor: { $divide: [ { $hour: "$date" }, 2 ] } }
    }
  },
  {
    "$group":
    {
      "_id":
      {
        "day": { $dayOfYear: "$date" },
        "H": "$H"
      },
      "value": { $sum: 1 }
    }
  },
  {
    "$group":
    {
      "_id": "$_id.H",
      "name":
      {
        "$push":
        {
          "name": "$_id.day",
          "value": "$value"
        }
      }
    }
  }
])


///GROUP BY HOUR
db["CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.TempDashboardAssetData"].aggregate(
 { "$project": {
      "y":{"$year":"$date"},
      "m":{"$month":"$date"},
      "d":{"$dayOfMonth":"$date"},
      "h":{"$hour":Date("$date")}
      }
 },
 { "$group":{
       "_id": {"hour":"$h"},
       value: { $sum: 1 },
   }
 })


///GROUP BY WEEK
 db["CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.TempDashboardAssetData"].aggregate([
 { "$project": {
      "y":{"$year":"$date"},
      "m":{"$month":"$date"},
      "d":{"$dayOfMonth":"$date"},
      "w":{"$dayOfWeek":"$date"},
      "h":{"$hour":"$date"}
      }
 },
 { "$group":{
       "_id": {"week":"$w"},
       value: { $sum: 1 },
   }
 },
 {
      $addFields:{"name":"$_id.week" }
  }
])

///GROUP BY DAY
 db["CraftAirProdMgr.b9a49492204411e79954b4b52f34dbc7.TempDashboardAssetData"].aggregate([
 { "$project": {
      "y":{"$year":"$date"},
      "m":{"$month":"$date"},
      "d":{"$dayOfMonth":"$date"},
      "w":{"$dayOfWeek":"$date"},
      "h":{"$hour":"$date"}
      }
 },
 { "$group":{
       _id: {year:"$y",month:"$m",day:"$d"},
       value: { $sum: 1 },
   }
 },
 {
            $addFields: {month:"$_id.month",day:"$_id.day"}
    }
 ])


    */

}








