import { Component,Input,Output,EventEmitter } from '@angular/core';
import { Routes } from '@angular/router';
//import { BaMenuService } from '../theme';
import {AggrQueryService} from "../../commonServices/pipeLine_AggrQueries";
import {BaThemeSpinner} from "../../theme/services";
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'dashboard',
  templateUrl:'dashboard.component.html' ,
  styleUrls:['dashboard.component.scss'],
})
export class ServiceProviderDashboard {
    currentLocation:string="India";
    currentLocationType:string="Country";

    mainTab:string = "AccesspointTab";
    innerTab:string="ApInventoryTab";
    @Input() currentOrgName:string="";
    @Input() currentOrgUUID:string="";
aggrQuery:AggrQueryService;
  constructor( private _spinner:BaThemeSpinner, private storage:SessionStorageService) {
    this._spinner.show();
this.aggrQuery=new AggrQueryService();
}
ngAfterViewInit(){
    console.log("In ngAfterViewInit...");
  this._spinner.hide();
}
  ngOnInit() {

  }


wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

getNameSpace(e)
{
  let ns= this.storage.retrieve("productMgrName")+"."+this.currentOrgUUID+"."+e;
  //console.log("Current NS : "+ns);
  //this.clientRadStatView = clientRadStatView
  return ns;
}
getClientRadiusStatsQuery(){
  let range = this.aggrQuery.getDataRange();
  let matchObj={};
  if(range["$gte"]==undefined && range["$lte"]==undefined)
    matchObj={};
  else
    {
      matchObj["lastUpdateTime"]=range;
    }
let pipeline= [
          {"$match":matchObj},
          { $sort: { lastUpdateTime: 1 } },
          {$group:{_id: {apMAC:"$apMAC",userName:"$userName"},series: { $push:  { "name": "$lastUpdateTime", "value":{"$sum":{"$divide":[ {"$add":["$inputOctets","$outputOctets"]},1024*1024] }} } }}},
          {
          $lookup:
              {
              from: this.getNameSpace("FloorAssignedAssets"),
              localField: "_id.apMAC",
              foreignField: "macAddress",
              as: "details"
              }
      },
      {"$unwind":"$details"},
      {"$project": {"Building":"$details.Building","City" : "$details.City","Continent" : "$details.Continent","Country" : "$details.Country","Floor" : "$details.Floor",macAddress:"$_id.apMAC" ,name:"$_id.userName", _id:"$_id",series:"$series"}}
      ];
return pipeline;
}
getDateRangeForRadiusData(type:any){
  let pipeline=[];
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

    //console.log(macObj);
  temp["$match"] = matchObj;
  pipeline.push(temp);
  return pipeline;

}



}
