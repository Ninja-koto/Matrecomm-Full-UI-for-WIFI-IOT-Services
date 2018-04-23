import { Component, } from '@angular/core';
import { Routes } from '@angular/router';
import { TreeMenuService } from './sidebar/treeMenu/treeMenu.service';
//import { BaMenuService } from '../theme';
import { DASHBOARDLAYOUT_MENU } from './dashboardLayout.menu';
import {AggrQueryService} from "../commonServices/pipeLine_AggrQueries";

import {DashboardDataService} from "./dashboardLayout.service";
import {BaThemeSpinner} from "../theme/services";
import {SessionStorageService} from "ngx-webstorage";

@Component({
  selector: 'dashboardLayout',
  templateUrl:'dashboardLayout.component.html' ,
  styleUrls:['dashboardLayout.component.scss'],
  providers:[DashboardDataService]
})
export class ServiceProviderDashboardLayout {
    currentLocation:string="India";
    currentLocationType:string="Country";
    showServiceProviderDashboard:boolean=true;
    mainTab:string = "AccesspointTab";
    innerTab:string="ApInventoryTab";
    currentOrgName:string="";
    currentOrgUUID:string="";
    currentOrgType:string="";
    currentOrgCity:string="";
    currentOrgCountry:string="";
    orgSelectionErrMsg:string="";
    aggrQuery: AggrQueryService;
  constructor(private _menuService: TreeMenuService, private _spinner:BaThemeSpinner, private storage:SessionStorageService) {
    this._spinner.show();
    this.aggrQuery=new AggrQueryService();
}
ngAfterViewInit(){
  this._spinner.hide();
}
  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>DASHBOARDLAYOUT_MENU);
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
showSdb(e)
{
  console.log("In showSdb");
  this.showServiceProviderDashboard=true;
  this.currentOrgName="";
  this.currentOrgUUID="";
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
        buttons[i].click();
    }
    //$('#snrRefresh').click();
    //$('#nofRefresh').click();
  }.bind(this),200);
}

getNameSpace(e)
{
  let ns= this.storage.retrieve("productMgrName")+"."/*+this.currentOrgUUID*/+"b9a49492204411e79954b4b52f34dbc7."+e;
  //console.log("Current NS : "+ns);
  //this.clientRadStatView = clientRadStatView
  return ns;
}
getServiceProviderNameSpace(e)
{
  let ns= this.storage.retrieve("productMgrName")+"."+e;
  return ns;
}
  //for testing tree
  public sidebar:any;
  Click(event:any):void{
    console.log(event);
    var orgUUID= event.node.data.orgUUID;
    var orgName= event.node.data.key;
    console.log("Org Name : ",orgName);
    console.log("Org UUID : ",orgUUID);
    this.orgSelectionErrMsg ="";
    if(orgUUID==undefined)
      this.orgSelectionErrMsg = "Please select an Organization";
    if((this.currentOrgUUID!=orgUUID)&&(orgUUID!=undefined)&&(orgUUID!=""))
    {
      this.showServiceProviderDashboard=false;
      this.currentOrgUUID=orgUUID;
      this.currentOrgName=orgName;
      this.currentOrgCity=event.node.data.city;
      this.currentOrgCountry=event.node.data.country;
      this.currentOrgType=event.node.data.type;
      //console.log("Org Name : ",orgName);
      //console.log("Org UUID : ",orgUUID);
      if((this.currentOrgUUID!="")&&(this.currentOrgUUID!=undefined))
        this._spinner.show();
      this.currentOrgName="";
      this.currentOrgUUID="";
      setTimeout(function(){
        this.currentOrgUUID= orgUUID;
        this.currentOrgName= orgName;
      }.bind(this),500);
    }
    else
    {
      //console.log("Trying for Same Org...");
    }

}

getServiceProviderUserCountQuery(){
let pipeline=[];
let range = this.aggrQuery.getDataRange();
let matchObj={};
if(range["$gte"]==undefined && range["$lte"]==undefined)
  matchObj={};
else
  matchObj["date"]=range;
let temp={};

temp["$match"] = matchObj;
pipeline.push(temp);
return pipeline;
}

}
