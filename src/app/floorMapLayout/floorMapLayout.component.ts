import { Component, } from '@angular/core';
import { Routes } from '@angular/router';
import { TreeMenuService } from './sidebar/treeMenu/treeMenu.service';
//import { BaMenuService } from '../theme';
import { FLOORMAPLAYOUT_MENU } from './floorMapLayout.menu';
import { CollectionTableDataCollectorService } from '../commonServices/tableDataCollector.service';
import {RPCService} from "../commonServices/RPC.service";
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import {BaThemeSpinner} from "../theme/services";

@Component({
  selector: 'floorMapLayout',
  templateUrl:'floorMapLayout.component.html' ,
  styleUrls:['floorMapLayout.component.scss'],
  providers:[CollectionTableDataCollectorService,RPCService]
})
export class FloorMapLayout {
  locType:string="";
  locName:string="";

  locStruct:any={};
  fUUID:string="";
  fImage:string="";
  fMapErrMsg:string="";
  showFloorMap:boolean=false;
  assignedAssetData:any[]=[];
  storedAssignedAssetData:any[]=[];
  assignAssetDataCollected:boolean=false;
  orgLocationsData:any[]=[];
  storedOrgLocationsData:any[]=[];
  unAssignedAssetData:any[]=[];
  storedAccessPoints:any[]=[];
  currLocationName:string="";

  interValID:any;
    lastUpdatedTime:number;
    nsObj: NameSpaceUtil;
    namespace:string="";
    namespace1:string="";
    namespace2:string="";
    rowsOnEachPage:Number=1000;

    mainTab:string = "floorMapTab";

  constructor(private _menuService: TreeMenuService,private clientRpc: RPCService, private _spinner: BaThemeSpinner,
  private storage:SessionStorageService, private tableDataCollectService:CollectionTableDataCollectorService) {
    this.lastUpdatedTime = new Date().getTime();
  }
  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>FLOORMAPLAYOUT_MENU);
    this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("FloorAssignedAssets");
      this.namespace1 = this.nsObj.getNameSpace("FloorUnAssignedAssets");
      this.namespace2 = this.nsObj.getNameSpace("CraftAirOrgLocation");
      this.getAssignedAssetsData();
      this.getUnAssignedAssetsData();
      this.getOrgLocationsData();
      this.getAllAccessPointsData();
      this.startInterval();
      this.funF();
}

mainTabChanged(e)
  {
    this.mainTab = String(e.tabID);
  }

funF(){
  if(this.assignAssetDataCollected)
  {
    console.log("DAta COllected and refreshing...");
    if(this.storedAssignedAssetData.length>0)
    {
      this.filterAssignedData();
      this.refreshFloorMap();
    }
    else
      this.showFloorMap=false;
    return;
  }
  else
  {
    console.log("DAta not COllected...");
    setTimeout(function(){
      this.funF();
    }.bind(this),3000);
  }
}

getOrgLocationsData(){
  try{
      var paramsForData={};
      let query={};
            paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.namespace2;
      paramsForData["limit"]=this.rowsOnEachPage;
      this.tableDataCollectService.getPostData(paramsForData)
            .subscribe(result => {
              var res = result;//.json();
              //this.assignAssetDataCollected=true;
                this.storeOrgLocData(res.data);
                //this.drawHeatMaps();
        });
    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}
storeOrgLocData(data:any[])
{
  this.storedOrgLocationsData=data;
}

getAssignedAssetsData(){
  try{
      var paramsForData={};
      let query={};
      query["assignedTo"]="Location";
            paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.namespace;
      paramsForData["limit"]=this.rowsOnEachPage;
      this.tableDataCollectService.getPostData(paramsForData)
            .subscribe(result => {
              var res = result;//.json();
              this.assignAssetDataCollected=true;
                this.storeAssignedData(res.data);
                //this.drawHeatMaps();
        });
    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

getUnAssignedAssetsData(){
  try{
        var paramsForData={};
        let query={};
            paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace1;
        paramsForData["limit"]=this.rowsOnEachPage;
        this.tableDataCollectService.getPostData(paramsForData)
              .subscribe(result => {
                var res = result;
                this.storeUnAssignedData(res.data);
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
}

getAllAccessPointsData(){
  try{
        var paramsForData={};
        let query={};
            paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= "CraftAirAccessPoints";
        paramsForData["limit"]=this.rowsOnEachPage;
        this.tableDataCollectService.getPostData(paramsForData)
              .subscribe(result => {
                var res = result;
                this.storeAccessPointsData(res.data);
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
}

startInterval(){
  var paramsForData={};
  console.log("In start Interval...");
  this.interValID = setInterval(() => {
     this.getAssignedAssetsData();
     this.getUnAssignedAssetsData();
     this.getAllAccessPointsData();
    }, 10000);
}
ngOnDestroy() {
  if (this.interValID) {
    clearInterval(this.interValID);
  }
}

storeAccessPointsData(data:any[])
{
    this.storedAccessPoints=data;
}
storeAssignedData(data:any[])
{
    this.storedAssignedAssetData=data;
    //this.filterAssignedData();
    //this.refreshFloorMap();
}

storeUnAssignedData(data:any[])
{
    this.unAssignedAssetData =data;
    /*if(this.assignedAssetData.length>0)
      this.refreshFloorMap();*/
}

filterAssignedData()
{
  //filter by locs
  if(String(this.locType)=="floor")
  {
    let locsFullData = this.storedAssignedAssetData.filter(val => val.floorUUID==this.fUUID);
    console.log("Filtered Locs...");
    console.log(locsFullData);
    this.assignedAssetData=locsFullData;
  }
  else if(this.storedAssignedAssetData.length>0)
  {
    let temp = this.storedAssignedAssetData[0];

    this.assignedAssetData= this.storedAssignedAssetData.filter(val => val.City==temp.City&&val.Building==temp.Building&&val.Floor==temp.Floor);

    this.locStruct["Building"]= this.assignedAssetData[0].Building;
    this.locStruct["City"]=this.assignedAssetData[0].City;
    this.locStruct["Country"]=this.assignedAssetData[0].Country;
    this.locStruct["Continent"]=this.assignedAssetData[0].Continent;
    this.locStruct["Floor"]=this.assignedAssetData[0].Floor;
    this.currLocationName = "City : "+this.assignedAssetData[0].City+", Building : "+this.assignedAssetData[0].Building+", Floor Name : "+this.assignedAssetData[0].Floor;
    //this.fUUID=this.assignedAssetData[0].floorUUID;

    let currLocs = this.storedOrgLocationsData.filter(val => val.City==temp.City&&val.Building==temp.Building&&val.Floor==temp.Floor);
    if(currLocs.length>0)
    {
      let temp1 = currLocs[0];
      if(String(temp1.FloorImage)!="undefined")
        this.fImage = temp1.FloorImage;
      else
        this.fImage = "";
      if(String(temp1.uuid)!="undefined")
        this.fUUID = temp1.uuid;
      else
        this.fUUID = "";
    }
    else
      this.fImage = "";

    console.log("filterAssignedData");
    console.log(this.assignedAssetData);
  }
  else if(this.storedAssignedAssetData.length<=0)
  {
    this.assignedAssetData=[];
  }
  //this.assignedAssetData=this.storedAssignedAssetData;
}
  //for testing tree
  public sidebar:any;
  Click(event:any):void{
    console.log(event);
    console.log(this.mainTab);
    if(this.mainTab == "floorMapTab")
    {
      var locType= event.node.data.locType;
      var loc= event.node.data.key;
      if(locType=="floor")
      {
        this.fUUID= event.node.data.floorUUID;
        let city= event.node.parent.parent.data.key;
        let building= event.node.parent.data.key;
        let country= event.node.parent.parent.parent.data.key;
        let continent = event.node.parent.parent.parent.parent.data.key;
        this.locStruct["Building"]= building;
        this.locStruct["City"]=city;
        this.locStruct["Country"]=country;
        this.locStruct["Continent"]=continent;
        this.locStruct["Floor"]=loc;

        this.currLocationName = "City : "+city+", Building : "+building+", Floor Name : "+loc;

        let currLocs = this.storedOrgLocationsData.filter(val => val.City==city&&val.Building==building&&val.Floor==loc);
        if(currLocs.length>0)
        {
          let temp1 = currLocs[0];
          if(String(temp1.FloorImage)!="undefined")
          {
            this.fImage = temp1.FloorImage;
          }
          else
            this.fImage = "";
        }
        else
          this.fImage = "";

      }

  this.locType = locType;
  this.locName=loc;

  this.filterAssignedData();//FILTER DATE WITH LOCATION TYPE AND LOCATION

  if(String(this.locType)!="floor")
      this.fMapErrMsg="Please Select Floor";
  else
  {

    this.fMapErrMsg="";
    this.refreshFloorMap();//REFRESHING MAP
  }
}
}

refreshFloorMap()
{
  console.log("Refreshing FloorMap...");
  this.showFloorMap=false;//TO REMOVE FLOORMAP COMPONENT
  setTimeout(function(){
    this.showFloorMap=true;//TO DISPLAY FLOORMAP COMPONENT
  }.bind(this),500);
}

updateFloorMap(e){
  console.log("In updateFloorMap");
  //INITIATE DATA UPDATE QUERY INTERVAL FOR ASSIGNED AND UNASSIGNED
  setTimeout(function(){
    this.filterAssignedData();
    this.refreshFloorMap();
    this._spinner.hide();
  }.bind(this),10000);
}


deleteAssignedAsset(e)
{
  console.log("in deleteAssignedAsset");
  console.log(e);
  this._spinner.show();
  //var id=e.target.id;
  var mac=e;//id.substring(9);
  var params={};
  var assignedAssetData = this.storedAssignedAssetData.filter(asset=>asset.macAddress==mac);
  var floorUUID="";
  var vendor="";
  var model="";
  console.log(assignedAssetData);
  if(assignedAssetData.length>0)
  {
    var uuid=assignedAssetData[0].uuid;
    model = assignedAssetData[0].model;
    vendor = assignedAssetData[0].vendor;
    floorUUID = assignedAssetData[0].floorUUID;
    console.log(uuid);

    var craftAirAPs = this.storedAccessPoints.filter(ap=>ap.accesspointMac==mac);

      var toSetAssigned='', toSetUnAssigned=model+"( "+mac+" )", assignTo="None";
      console.log("UUID : "+uuid);

      params["uuid"]=uuid;
      params["model"]=model;
      params["vendor"]=vendor;
      params["floorUUID"]=floorUUID;
      params["macAddress"]=mac;
      params["apUuid"]=craftAirAPs[0].uuid;
      params['assignTo']=assignTo;
      params['toSetAssigned']=toSetAssigned;
      params['toSetUnAssigned']=toSetUnAssigned;
  this.clientRpc.orgRPCCall("delete","deleteHeatMapIcons",params)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        setTimeout(function(){
          this._spinner.hide();
          this.filterAssignedData();
          this.refreshFloorMap();
        }.bind(this),10000);
      });

  }
  console.log("Params....");
  console.log(params);
}

}
