import { Component,trigger, state, style, transition, animate, ViewChild, ViewContainerRef, AfterViewChecked,ViewEncapsulation } from '@angular/core';
import { Routes } from '@angular/router';
import { TreeMenuService } from './sidebar/treeMenu/treeMenu.service';
//import { BaMenuService } from '../theme';
import { ASSETCONFIGURATIONMANAGERLAYOUT_MENU } from './assetConfigurationManager.menu';
import { CollectionTableDataCollectorService } from '../commonServices/tableDataCollector.service';
import {ViewDataCollectorService} from "../commonServices/viewDataCollector.service";
import {RPCService} from "../commonServices/RPC.service";
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import {BaThemeSpinner} from "../theme/services";
import {NotificationsService} from "angular2-notifications";

@Component({
  selector: 'assetConfigurationManager',
  templateUrl:'assetConfigurationManager.component.html' ,
  styleUrls:['assetConfigurationManager.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)',
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)',
        background: "#ffffff",
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ],
  providers:[CollectionTableDataCollectorService,RPCService, ViewDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class AssetConfigurationManagerLayout {
  @ViewChild('modal')
  modal: ModalComponent;


  menuState:string = 'out';
  taskItems:any=[];
  config={};
  oldNotifications={};
  interValID:any;
  currentTask:any={};

    animation: boolean = true;
    keyboard: boolean = false;
    backdrop: string | boolean = 'static';
    selected: string;
    output: string;

  locType:string="";
  locName:string="";

  locStruct:any={};
  fUUID:string="";
  fMapErrMsg:string="";
  assetTreeErrMsg="";
  assetID:string="";
  currentAssignedAsset:any[]=[];
  currAssetData:Object={};
  currLocationName:string="";

  currFloorAssetTreeData:any=[];

    nsObj: NameSpaceUtil;
    namespace:string="";
    rowsOnEachPage:Number=1;
    currentAssetVendor:string="";
    currentAssetModel:string="";
    currentAssetOSVersion:string="";
  constructor(private _menuService: TreeMenuService,private clientRpc: RPCService,private storage:SessionStorageService,
   private tableDataCollectService:CollectionTableDataCollectorService, private _service:NotificationsService,
   private viewDataCollectService:ViewDataCollectorService, private _spinner: BaThemeSpinner) {

  }
  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>ASSETCONFIGURATIONMANAGERLAYOUT_MENU);
    this.nsObj = new NameSpaceUtil(this.storage);
    this.config = this.storage.retrieve("configParams");

    if(this.config["showInventoryStatus"])
    {
      this.initiateConfigStatusDataCollection();
      this.startInterval();
    }
}


ngOnDestroy() {
  if (this.interValID) {
    clearInterval(this.interValID);
  }
}
taskSelected(item)
{
  //console.log("Selected Task");
  //console.log(item);
  this.currentTask = item;
  this._spinner.show();
  jQuery('#modalButton').click();
  this._spinner.hide();
}
showHideTasks(e)
{
  //console.log("In showHideTasks");
  //console.log(e);
  // 1-line if statement that toggles the value:
  this.menuState = this.menuState === 'out' ? 'in' : 'out';
}
clickDetectedInMain(e)
{
  //console.log(e);
  //console.log(this.menuState);
  let clsList = e.target.classList.value;
  if((clsList.indexOf("taskMenuLItem")==-1)&&(clsList.indexOf("taskMenuList")==-1)
    &&(clsList.indexOf("taskMenuChildItem")==-1))
    this.menuState = 'out';
  //else
   // this.menuState = 'in';
}
initiateConfigStatusDataCollection(){

        try{

          var paramsForData={};
          let query={}, projectQuery={};
          let time = new Date().getTime();//current time
          let oldTime = time-300000;///5 Mins back time

          let selectRange = {
            "$gte":String(new Date(oldTime).toISOString())//,
            //"$lte":String(new Date().toISOString())
          };
          query["date"] = selectRange;
          //paramsForData["match"]
          projectQuery["date"]=1;
          projectQuery["description"]=1;
          projectQuery["name"]=1;
          projectQuery["percentage"]=1;
          projectQuery["status"]=1;
          projectQuery["uuid"]=1;
          paramsForData["dataQuery"]= query;
          paramsForData["projectQuery"] = projectQuery;
          paramsForData["namespace"]= this.nsObj.getNameSpace("InventoryStatus");
          paramsForData["limit"]=1000;
         // console.log(selectRange);
          //console.log(paramsForData);
              this.viewDataCollectService.getPostDataForApStats(paramsForData)
                .subscribe(result => {
                  var res = result;//.json();
                  //this.tableData= res.data;
                  //this.showChart=true;
                  //console.log(res.data);
                  if(res.data===undefined)
                    res.data=[];
                  this.taskItems = res.data;
                  this.taskItems.forEach(task => {
                    let show=false;
                    if(String(this.oldNotifications[task.uuid])=="undefined")
                      show = true;
                    else if(new Date(String(this.oldNotifications[task.uuid])).getTime()< new Date(String(task.date)).getTime())
                      show = true;
                    if(show)
                      {
                        console.log("SHOW IN NOTIFICATIONS.....");
                        this.oldNotifications[task.uuid]=task.date;
                        if(String(task.status)=="failed")
                          this._service.create("In Inventory "+task.name,task.description,"error",this.config["notificationConfig"]);
                        else
                          this._service.create("In Inventory "+task.name,task.description,"success",this.config["notificationConfig"]);
                      }
                      else
                        {
                          console.log("SKIPPING NOTIFICATIONS.....");
                        }
                  });
                  //this.storeData(res.data);
              });

              let keys = Object.keys(this.oldNotifications);
              //console.log("LEN : ");
              if(keys===undefined)
                keys=[];
              //console.log(keys.length);
              keys.forEach(element => {
                let oldDate = this.oldNotifications[element];
                //console.log((new Date().getTime())- (new Date(oldDate).getTime()) );
                if( ( (new Date().getTime())- (new Date(oldDate).getTime()) )> 86400000)
                  delete this.oldNotifications[element];
              });

        }
        catch(e)
        {
          console.log("Initial Data load Failed... ");
        }

    }

    startInterval(){
      var paramsForData={};
      //console.log("In start Interval...");
      this.interValID = setInterval(() => {
       // console.log("GETTING TASK DATA....");
        this.initiateConfigStatusDataCollection();
        }, 10000);
    }

assetTreeSelectionChanged(e)
{
  /*console.log("in assetTreeSelectionChanged....");
  console.log(e);
  console.log(e.node.data.type);*/
  try{
  if(String(e.node.data.type)=="asset")
  {
    this._spinner.show();
    this.assetTreeErrMsg="";
    this.assetID=e.node.data.key;
    this.getAssignedAsset(this.assetID);
  }
  else
  {
    this.assetTreeErrMsg="Please select Asset";
    this.currentAssignedAsset=[];
  }
}
catch(e)
{
  console.log("Exception in assetTreeSelectionChanged");
  this.assetTreeErrMsg="Please select Asset";
  this.currentAssignedAsset=[];
}
}

getAssignedAsset(assetID:string)
{
  try{
      var paramsForData={};
      let query={"macAddress":assetID};
      paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.nsObj.getNameSpace("FloorAssignedAssets");
      paramsForData["limit"]= this.rowsOnEachPage;
      //console.log(paramsForData);
      this.tableDataCollectService.getPostData(paramsForData)
            .subscribe(result => {
              var res = result;//.json();
              //console.log(result);
              try{
              if(String(result.type)!="error")
              {
                this.currentAssignedAsset=res.data;
                /*console.log("Selected Assign Asset....");
                console.log(this.currentAssignedAsset);*/
                this._spinner.hide();
                if(this.currentAssignedAsset.length>0)
                {
                  if(String(this.currentAssignedAsset[0].model)!="undefined")
                    this.currentAssetModel= this.currentAssignedAsset[0].model;
                  else
                    this.currentAssetModel= "";
                  if(String(this.currentAssignedAsset[0].vendor)!="undefined")
                    this.currentAssetVendor= this.currentAssignedAsset[0].vendor;
                  else
                    this.currentAssetVendor= "";
                  if(String(this.currentAssignedAsset[0].OSVersion)!="undefined")
                    this.currentAssetOSVersion= this.currentAssignedAsset[0].OSVersion;
                  else
                    this.currentAssetOSVersion= "";
                  this.currAssetData = this.currentAssignedAsset[0];
                  console.log(this.currentAssetModel);
                  console.log(this.currentAssetVendor);
                  console.log(this.currentAssetOSVersion);
                }
              }
              else
              {
                this.currentAssignedAsset=[];
                this._spinner.hide();
              }
            }
            catch(e)
            {
              console.log("Exception in getAssignedAsset");
              this.currentAssignedAsset=[];
              this._spinner.hide();
            }

        });
    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

getFloorAssetTreeData(floorUUID:string)
{
  try{
    var paramsForData={};
    let query={"floorUUID":floorUUID};
        paramsForData["dataQuery"]= query;
    paramsForData["namespace"]= this.nsObj.getNameSpace("FloorAssetTree");
    paramsForData["limit"]=this.rowsOnEachPage;
        this.tableDataCollectService.getPostData(paramsForData)
            .subscribe(result => {
              var res = result;//.json();
              //console.log(result);
              try{
              if(String(result.type)!="error")
              {
                this._spinner.hide();
                this.currFloorAssetTreeData = result.data;
              }
              else
              {
                this.currFloorAssetTreeData=[];
                this._spinner.hide();
              }
            }
            catch(e)
            {
              console.log("Exception in getFloorAssetTreeData");
              this.currFloorAssetTreeData=[];
              this._spinner.hide();
            }

      });
  }
  catch(e)
  {
    console.log("Initial Data load Failed... ");
  }
}

  Click(event:any):void{
    console.log(event);
      var locType= event.node.data.locType;
      var loc= event.node.data.key;
      try{
      if(locType=="floor")
      {
        this._spinner.show();
        this.currentAssignedAsset=[];
        this.fUUID= event.node.data.floorUUID;
        let city= event.node.parent.parent.parent.data.key;
        let building= event.node.parent.data.key;
        let country= event.node.parent.parent.parent.parent.data.key;
        let continent = event.node.parent.parent.parent.parent.parent.data.key;
        this.locStruct["Building"]= building;
        this.locStruct["City"]=city;
        this.locStruct["Country"]=country;
        this.locStruct["Continent"]=continent;
        this.locStruct["Floor"]=loc;
        this.currLocationName = "City : "+city+", Building : "+building+", Floor Name : "+loc;
        this.getFloorAssetTreeData(this.fUUID);
      }
      else if(locType=="vehicle")
      {
        this._spinner.show();
        //this.fUUID= event.node.data.floorUUID;
        this.fUUID="";
        var deviceID= event.node.data.macAddress;
        let city= event.node.parent.parent.data.key;
        let country= event.node.parent.parent.parent.data.key;
        let continent = event.node.parent.parent.parent.parent.data.key;
        this.locStruct["City"]=city;
        this.locStruct["Country"]=country;
        this.locStruct["Continent"]=continent;
        this.locStruct["macAddress"]=deviceID;
        this.assetID=deviceID;
        this.currLocationName = "City : "+city+", Route : "+loc;
        this.getAssignedAsset(this.assetID);
      }
    }
    catch(e)
    {
      this.locType = "";
      this.locName="";
    }

  this.locType = locType;
  this.locName=loc;

  if((String(this.locType)!="floor")&&(String(this.locType)!="vehicle"))
  {
      let locType = String(event.node.data.locType);
      console.log(locType);
      if(locType=="undefined")
        locType="Tree";
      else if(locType=="continent")
        locType="Continent";
      else if(locType=="country")
        locType="Country";
      else if(locType=="city")
        locType="City";
      else if(locType=="building")
        locType="Building";
      else if(locType=="buildingHolder")
        locType="Building Holder";
      else if(locType=="vehicleHolder")
        locType="Vehicle Holder";
      this.fMapErrMsg= "Selected item is : "+locType+" --> Please Select Floor/ Vehicle-Route";
      this.currFloorAssetTreeData=[];
      this.currentAssignedAsset=[];
      this.currLocationName="";
  }
  else
  {
    this.fMapErrMsg="";
  }
}

closed() {
      console.log("Trying to close...");
        //this.output = '(closed) ' + this.selected;
    }
    close1(){
      console.log("Event caught to replace Table data....");
      console.log("In close1...");
    }
    dismissed() {
      console.log("dismissed...");
        this.output = '(dismissed)';
    }
    opened() {
        this.output = '(opened)';
    }
configureDevice(data)
{
  console.log("Config Data...");
  console.log(data);
  let params={};
  params["macAddress"]=this.currentAssignedAsset[0].macAddress;
  params["MACAddress"]=this.currentAssignedAsset[0].macAddress;
  params["taskType"]="configTask";
  params["configStruct"]=data;
  this.clientRpc.orgRPCCall("update","DeviceConfiguration",params)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        if(res.result.status=="Success")
        {
          console.log("Trigger reload Event....");
        }
        else
        {
          console.log("Do Nothing....");
        }
      });
}

}
