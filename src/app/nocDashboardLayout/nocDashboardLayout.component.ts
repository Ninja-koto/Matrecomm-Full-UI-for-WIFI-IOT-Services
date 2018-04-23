
import { Pipe,PipeTransform, Component, OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { Routes } from '@angular/router';
import {FormGroup,FormBuilder,Validators} from "@angular/forms"
import { TreeMenuService } from './sidebar/treeMenu/treeMenu.service';
//import { BaMenuService } from '../theme';
import { NOCDASHBOARDLAYOUT_MENU } from './nocDashboardLayout.menu';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import { CollectionTableDataCollectorService } from '../commonServices/tableDataCollector.service';
import {ViewDataCollectorService} from "../commonServices/viewDataCollector.service";
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import {BaThemeSpinner} from "../theme/services";
import {} from "@agm/core"

import {AggrQueryService} from "../commonServices/pipeLine_AggrQueries";
import {NgxChartsModule} from '@swimlane/ngx-charts';

/*@Pipe({ name: 'pairs' })
export class PairsPipe implements PipeTransform {
  transform(value:any) {
    return value.filter((v,i) => i%2==0).map((v,i) => [value[i*2], value[i*2+1]])
  }
}*/

@Component({
  selector: 'nocDashboardLayout',
  templateUrl:'nocDashboardLayout.component.html' ,
  styleUrls:['nocDashboardLayout.component.scss'],
  providers:[CollectionTableDataCollectorService,AggrQueryService,ViewDataCollectorService],
  encapsulation: ViewEncapsulation.None
})

export class NocDashboardLayout {
  @ViewChild('validationModal')
  modal: ModalComponent;
  animation: boolean = true;
  keyboard: boolean = false;

  columns= [
    {
      key: 'SerialNumber',
      label: 'Serial Number',
    },
    {
      key: 'Building',
      label: 'Address',
      fn:function(value,object){
        var locStr = object.Building+', '+object.City;//+'<br><b>Country:</b>'+object.Country;
        return locStr;
      }
    },
    {
      key: 'status',
      label: 'Status',
      fn: function(value, object){
        var status = object.status;
        var image="";
        if(status!=undefined)
        {
          if(status=="UP")
            image=image+"<img width='25px'  height='20px' src='assets/img/greenDot.png'alt='embedded icon'>";
          else
          image=image+"<img width='25px'  height='20px' src='assets/img/redDot.png'alt='embedded icon'>";
        }
        else
        {
          image=image+"<img width='25px'  height='20px' src='assets/img/redDot.png'alt='embedded icon'>";
        }
        return image;
      }
    },
    {
      key:'DownTime',
      label:'DownTime',
      fn:function(value,object){
        var status = object.status;
        if(status!=undefined)
        {
          if(status=="DOWN")
          {
            //console.log("IN DOWN");
            let lastTime=object.lastUpdatedTime;
            //console.log(lastTime);
            if(lastTime!=undefined)
            {
              let downTime=new Date().getTime()-new Date(lastTime).getTime(); //MilliSecs
              //console.log("DOWNTIME: ")
             // console.log(downTime);
              downTime=downTime/1000;///Secs
              let retStr;
              try{
              if(downTime<60)
              return  String(downTime)+" Secs";
              downTime = Math.floor(downTime/60); ///MINTUES

              let minExt="mins", hrExt="hr";
              if(downTime<=60)
                retStr = String(downTime)+minExt;
              else
              {
                let hrs=Math.floor(downTime/60);
                let mins= Math.floor(downTime%60);
                if(hrs<24)
                  retStr = String(hrs)+" "+hrExt+", "+String(mins)+" "+minExt;
                else
                {
                  let days=Math.floor(hrs/24);
                  hrs = hrs%24;
                  retStr = String(days)+" Day(s), "+String(hrs)+" "+hrExt+", "+String(mins)+" "+minExt;
                }
              }
              }catch(e){retStr="~~o~~"}
              return retStr;
            }
            else
            {
              return "--o--";
            }



          }
          else
          {
            return "0 Secs";
          }
        }
        else
        return "~~o~~";
      }
    },
    {
      key: 'upTime',
      label: 'Up Time',
      fn: function(value, object){
        let retStr="";
        if(object.upTime!=undefined)
        {
          try{
          var time = Number(object.upTime); //SECONDS
          if(time<60)
          return  String(time)+" Secs";
          time = Math.floor(time/60); ///MINTUES

          let minExt="mins", hrExt="hr";
          if(time<=60)
            retStr = String(Math.floor(time))+minExt;
          else
          {
            let hrs=Math.floor(time/60);
            let mins= Math.floor(time%60);
            if(hrs<24)
              retStr = String(hrs)+" "+hrExt+", "+String(mins)+" "+minExt;
            else
            {
              let days=Math.floor(hrs/24);
              hrs = hrs%24;
              retStr = String(days)+" Day(s), "+String(hrs)+" "+hrExt+", "+String(mins)+" "+minExt;
            }
          }
          }catch(e){retStr="~~o~~"}
        }
        else
        {
          retStr = "--o--"
        }
        return retStr;
      }
    },
    /*{
      key:'',
      label:'Used Data',
      fn:function(value,object){
        //console.log(object);
        if((object.rvBytes!=undefined)&&(object.trBytes!=undefined))
        {
          let packetCount = Number(object.rvBytes)+Number(object.trBytes);
          var ext="";
          var data = (packetCount)/1024; //KB
          ext=" KB";
          //console.log("Data : "+data);
          data = Math.round(data);
          var dataStr="0";
          if( (ext==" KB")&&(data>1024) )
          {
              data = data/1024; //MB
              //data = Math.round(data);
              dataStr= data.toFixed(3);
              ext=" MB";
          }
          else
          {
            dataStr= data.toFixed(3);
            ext=" KB";
          }
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
    },
    {
       key: 'PCI',
       label: 'PCI'
    },
    {
      key: 'GCI',
      label: 'GCI'
   },*/
   {
     key:'lastUpdatedTime',
     label:'Last Updated Time',
     fn:function(value,object){
       if(value!=undefined)
       return String(new Date(value).toLocaleDateString())+" "+String(new Date(value).toLocaleTimeString());
       else
       return "";
     }
   }/*,
     {
      key: 'City',
      label: 'City'
     }*/
     ];
    currentLocation:string="India";
    currentLocationType:string="Country";

    mainTab:string = "snir";
    dataDisplayTab:string="deviceInfo";
    innerTab:string="ApInventoryTab";
    data1:any[]
data2:any[]
interValID:any;
    lastUpdatedTime:number;
    assetsData:any=[];
    assetsStatu_Uptime:any={};

    nsObj: NameSpaceUtil;
    namespace:string="";
    assetDataGathered:Boolean=false;
    assetMACs:any=[];
    floorUUID:any="";
    deviceID:any="";
    assetFilterQuery={};
    rsrpPipeLineQuery:any=[];
    rssiPipeLineQuery:any=[];
    sinrPipeLineQuery:any=[];
    txthrPipeLineQuery:any=[];
    rxthrPipeLineQuery:any=[];
    upTimePipeLineQuery:any=[];
    dashboardNS:any="";
    showTable:Boolean=false;
    assetsOnline:any=[];
    showCharts:Boolean=false;

    selectedAssetMAC:any="";
    selectedAssetLastUpdatedTime:any="";
    lteInfoOfSelectedAsset:any={};
    apnInfoOfSelectedAsset:any={};
    adminApnInfoOfSelectedAsset:any={};

    apnWanInfoOfSelectedAsset:any={};
    wanInfoOfSelectedAsset:any={};
    lanInfoOfSelectedAsset:any={};

    lteInfoCollected:Boolean=false;
    deviceInfoOfSelectedAsset:any={};
    deviceInfoCollected:Boolean=false;

    currentSelectedApnUserInfo:any=[];
    currentSelectedApnUserDataCollected:Boolean=false;

    roundChartsDate:Boolean=false;
    lat: number = 51.678418;
    lng: number = 7.809007;
    view: any[] = [700, 400];

    uptimeData:any=[];
    upDataModified:Boolean=false;
    stopUpdating:Boolean=false;
    /*colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };*/
    guageData=[
      {
        "name": "Warnings",
        "value": 75
      },
      {
        "name": "Errors",
        "value": 55
      },
      {
        "name": "Fatal",
        "value": 10
      }
    ];
    multi1:any=[];
    weekData:any=[];
    multi:any=[
      {
        "name": "Germany",
        "series": [
          {
            "name": "2010",
            "value": 7300000
          },
          {
            "name": "2011",
            "value": 8940000
          }
        ]
      },

      {
        "name": "USA",
        "series": [
          {
            "name": "2010",
            "value": 7870000
          },
          {
            "name": "2011",
            "value": 8270000
          }
        ]
      },

      {
        "name": "France",
        "series": [
          {
            "name": "2010",
            "value": 5000002
          },
          {
            "name": "2011",
            "value": 5800000
          }
        ]
      }
    ];
    config:any={};

            public daterange: any = {};

            // see original project for full list of options
            // can also be setup using the config service to apply to multiple pickers
            public options: any = {
                locale: { format: 'YYYY-MM-DD' },
                alwaysShowCalendars: false,
            };
    startDate:any="";
    endDate:any="";
    customDateUsed:Boolean=false;
    customStartDate:any="";
    customEndDate:any="";

    rxDataReceived:Boolean=true;
    rxData:any=[];
    txDataReceived:Boolean=true;
    txData:any=[];
    trBytes:string="";
    rvBytes:string="";

    totalData:any=[];

    pastMonthInterval:any={};

    private myForm: FormGroup;
  constructor(private _menuService: TreeMenuService,private storage:SessionStorageService,
   private tableDataCollectService:CollectionTableDataCollectorService,
   private viewDataCollectService:ViewDataCollectorService, private _spinner: BaThemeSpinner,
  private aggrQuery:AggrQueryService, private formBuilder: FormBuilder) {
    this._spinner.show();
    this.lastUpdatedTime = (new Date().getTime()-30000);
    this.assetFilterQuery[this.currentLocationType]=this.currentLocation;
    this.config = this.storage.retrieve("configParams");
    this.roundChartsDate =this.config.roundChartsDate;
    let range = this.aggrQuery.getDataRange();
    this.pastMonthInterval ={
      "$gte":new Date(this.lastUpdatedTime-(86400000*15)).toISOString()
    }
    console.log("PAST MONTH...");
    console.log(JSON.stringify(this.pastMonthInterval));

    if(range["$gte"]==undefined && range["$lte"]==undefined)
    {
      this.startDate= String(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString());
      this.endDate= String(new Date().toISOString());
    }
    else
    {
     this.startDate=range["$gte"];
     this.endDate=range["$lte"];
    }
    /*console.log("CHECKI?NG INTEVAL");
    console.log(this.config.dataCheckInterval);*/
    this.nsObj = new NameSpaceUtil(this.storage);
    this.namespace = this.nsObj.getNameSpace("FloorAssignedAssets");
    this.dashboardNS = this.nsObj.getNameSpace("DashboardAssetData");
    console.log("NameSpace : "+this.namespace);
    this.collectDashBoardData();


    //this.collectStackedChartData();
    //this.collectWeekDayChartData();
}

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>NOCDASHBOARDLAYOUT_MENU);
    this.startInterval();
  }
  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;
    console.log(value.start.toISOString());
    console.log(value.end.toISOString());

    // or manupulat your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
}
opened() {
  console.log("Trying to Open...");
}
closed() {
  console.log("Trying to close...");
}
close1(){
  console.log("In close1...");
}
dismissed() {
  this.currentSelectedApnUserDataCollected=false;
console.log("dismissed...");
}
calendarApplied(e)
{
  console.log("CALENDER APPLIED");
  console.log(e);
  console.log(e.picker.startDate.toISOString());
  console.log(e.picker.endDate.toISOString());
  this.customStartDate=e.picker.startDate.toISOString();
  this.customEndDate = e.picker.endDate.toISOString();
  if((new Date(this.customEndDate).getTime()-new Date(this.customStartDate).getTime())<=172800000)
  {
    this.customDateUsed=true;
    this.lastUpdatedTime=new Date().getTime();
    this.startDate=this.customStartDate;
    this.endDate=this.customEndDate;
    let currDate = new Date();
    let tempEnd = new Date(this.endDate);
    if( (currDate.getFullYear()==tempEnd.getFullYear())&&
        (currDate.getMonth()==tempEnd.getMonth())&&
        (currDate.getDate()==tempEnd.getDate()) )
    {
      this.stopUpdating=false;
      console.log("STOP UPDATING ");console.log(this.stopUpdating);
    }
    else
    {
      this.stopUpdating=true;
      console.log("STOP UPDATING ");console.log(this.stopUpdating);
    }
    this._spinner.show();
    this.initiateDataCollection();
  }
  else
  {
    this.customStartDate=this.startDate;
    this.customEndDate = this.endDate;
    $('#alertModalButton').click();
  }

  /*this._spinner.show();
  this.initiateDataCollection();*/
}

  ngOnDestroy() {
    if (this.interValID) {
      console.log("In CommonDashboard Destroying Set Interval...");
      clearInterval(this.interValID);
    }
  }
  getNameSpace(coll:string){
    return this.nsObj.getNameSpace(coll);
  }
  ngAfterViewInit(){
  this._spinner.hide();
}
onSelect(e){
  console.log(e);
}

collectStackedChartData(){
  console.log("In collectStackedChartData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempDashboardAssetData");
      paramsForData["limit"]=-1;
      let pipeLine = [
        {"$project":{"date":1,"y":{"$year":"$date"},"m":{"$month":"$date"},"d":{"$dayOfMonth":"$date"},"w":{"$dayOfWeek":"$date"},"h":{"$hour":"$date"}}},
        { "$group": {"_id": { "day": "$d",  "month":"$m","hour": "$h" },"value": { $sum: 1 },"date":{$last:"$date"}}},
        { "$group": { "_id": {"day":"$_id.day","month":"$_id.month"},"series": { "$push": { "name": "$_id.hour",  "value": "$value"}  }  }},
        {$addFields:{"name":{ $concat:[ {"$substr":["$_id.month",0,-1]} ,"_",{"$substr":["$_id.day",0,-1]}] } }}
      ];
      let tempObj= pipeLine;

        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("TEST DATA...");
            console.log(JSON.stringify(res));
            let tempObj=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            res.forEach(function(element) {
              let name = String(element.name);
              let month= name.substring(0,name.indexOf("_"));
              let dat= name.substring(name.indexOf("_")+1);
              console.log(month);
              console.log(dat);
              element.name= String(tempObj[Number(month)])+" "+String(dat);

          });
            this.multi1=res;
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

collectWeekDayChartData(){
  console.log("In collectWeekDayChartData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempDashboardAssetData");
      paramsForData["limit"]=-1;
      let pipeLine = [
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
       ];
      let tempObj= pipeLine;

        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("WEEK DATA...");
            console.log(JSON.stringify(res));
            let tempObj=["","Sunday","Monday","Tueday","Wednesday","Thursday","Friday","Saturday"];
            res.forEach(function(element) {
              let name = String(element.name);
              element.name= String(tempObj[Number(name)]);
          });
            this.weekData=res;
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

collectDashBoardData(){
  console.log("In collectDashBoardData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.dashboardNS;
      paramsForData["limit"]=-1;
      let pipeLine = this.aggrQuery.getDashboardAssetInfoPipeLine();
      this.pastMonthInterval ={
        "$gte":new Date(this.lastUpdatedTime-(86400000*15)).toISOString()
      }
      console.log(this.pastMonthInterval);
      pipeLine[0]["$match"]["date"]=this.pastMonthInterval;
      let tempObj= pipeLine;
      console.log(JSON.stringify(pipeLine));
        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("DAsh AGGR");
            console.log(res);
            if(res==undefined)
            res=[];
            res.forEach(element => {
              try{
                this.assetsStatu_Uptime[element.macAddress] = element;
              }
              catch(e){console.log(e);}
            });
            this.initiateDataCollection();
            /*console.log("assetsStatu_Uptime");
            console.log(this.assetsStatu_Uptime);*/
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

initiateDataCollection(){
  console.log("In initiateDataCollection");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.namespace;
      paramsForData["limit"]=-1;
      let pipeLine = this.aggrQuery.getAssetInfoWithPingStatusPipeLine();
      let tempObj= [];
      let obj ={};
      obj["$match"]=this.assetFilterQuery;
      tempObj.push(obj);
      tempObj = tempObj.concat(pipeLine);
      console.log("PIPELINE");
      console.log(JSON.stringify(tempObj));
        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result;//json();
            /*console.log("Assigned Assets");
            console.log(res);*/
            this.assetsData= res.data;
            this.assetDataGathered= true;
            let macs=[];
            this.assetsData.forEach(asset => {
              macs.push(asset.macAddress);
              //console.log("IN FOREACH");
              if(this.assetsStatu_Uptime[asset.macAddress]!=undefined)
                {//console.log("MAC FOUND...");
                  let data = this.assetsStatu_Uptime[asset.macAddress];
                  let dtTime = new Date(data.date).getTime();
                  console.log((new Date().getTime())-dtTime);
                  if((new Date().getTime())-dtTime>this.config.assetDownStatusConfirmTime)
                    asset["status"]="DOWN";
                  else
                    asset["status"]="UP";
                  if(data.deviceInfo!=undefined)
                  {
                    asset["upTime"]=data.deviceInfo.Uptime;
                    asset["SerialNumber"]=data.deviceInfo.SerialNumber;
                  }
                  else
                  {
                  asset["upTime"]= -1;
                  asset["SerialNumber"]="#####";
                  }

                  if(data.lteInfo!=undefined)
                  {
                    asset["GCI"]=data.lteInfo.GCI;
                    asset["PCI"]=data.lteInfo.PCI;
                  }
                  else
                  {
                    asset["GCI"]="";
                    asset["PCI"]="";
                  }
                  asset["lastUpdatedTime"]=data.date;
                  asset["lteInfo"]=data.lteInfo;
                  asset["apnInfo"]=data.apnInfo;
                  asset["deviceInfo"]=data.deviceInfo;
                  asset["apnWanInfo"]= data.apnWanInfo;
                  asset["adminApnInfo"]=data.adminApnInfo;
                  asset["lanInfo"]=data.lanInfo;
                  asset["wanInfo"]=data.wanInfo;
                  asset["rvBytes"]=data.rvBytes;
                  asset["trBytes"]=data.trBytes;
                }
              else
              {console.log("")
              asset["status"]="DOWN";
              }
            });
            //this.assetMACs = macs;
            /*this.rsrpPipeLineQuery = this.getDashboardRSRPPipeLineQuery();
            this.rssiPipeLineQuery = this.getDashboardRSSIPipeLineQuery();
            this.sinrPipeLineQuery = this.getDashboardSINRPipeLineQuery();
            this.refreshAllCharts();*/
            //this._spinner.hide();
            //console.log(macs);
            if(this.lteInfoCollected&&this.deviceInfoCollected)
            {
              console.log("<<<<<<<<<<<<<<<<<<<<UPDATING LTE INFO>>>>>>>>>>>>>>>>>>>>>>>>>");
                this.updateAssetInfo(this.selectedAssetMAC);
            }
            //this._spinner.hide();
            console.log("ASSET DATA");
            console.log(this.assetsData);
      });

    }
    catch(e)
    {
      this._spinner.hide();
      console.log("Initial Data load Failed... ");
    }

}
startInterval(){
  console.log("In start Interval...");
  this.interValID = setInterval(() => {

      if( (!this.stopUpdating)&&((new Date().getTime()-this.lastUpdatedTime)>=60000))
      {
        console.log("UPDATIONG CONTINUD.....");
        console.log(new Date().getTime()-this.lastUpdatedTime);
        console.log(this.stopUpdating);
        let currTime = new Date().getTime();
        this.setStartAndEndDate();

        /*if(((currTime-this.lastUpdatedTime)/1000)<30)
            {*/
              this.collectDashBoardData();
              //this.initiateDataCollection();
          /*}
          else
          {
            console.log("Not in Focus...");
            clearInterval(this.interValID);
            this.interValID="undefined";
          }*/
      }
      else
      {
        console.log("UPDATIONG SKIPPED.....");
        console.log(new Date().getTime()-this.lastUpdatedTime);
        console.log(this.stopUpdating);
      }
  }, /*60000*/this.config.dataCheckInterval);
}

setStartAndEndDate(){
  let range = this.aggrQuery.getDataRange();
  let matchObj={};
  if(this.customDateUsed)
  {
    console.log("CUSTOM DATE USED");
    this.startDate=this.customStartDate;
    this.endDate=this.customEndDate;
  }
  else if(range["$gte"]==undefined || range["$lte"]==undefined)
  {
    console.log("**********************88ONE OF RANGE NOT FOUND***************************");
    this.startDate= this.customStartDate=String(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString());
    this.endDate= this.customEndDate=String(new Date().toISOString());
  }
  else
  {
   console.log("USING DEFAULT RANGE");
   this.startDate = this.customStartDate = range["$gte"];
   this.endDate = this.customEndDate = range["$lte"];
  }

}
selectedRowData(e)
{
  console.log("SlectedRowData");
  let mac =e.macAddress;
  let selectedOne;
  this.selectedAssetMAC=mac;
  this._spinner.show();
  this.lastUpdatedTime=new Date().getTime();
  this.updateAssetInfo(mac);
  //console.log(macs);

}
dataDisplayTabChanged(e)
{
  console.log("MAIN Tab Changed...");
  console.log(e);
  this.dataDisplayTab = String(e.tabID);
}
tabChanged(e)
{
  console.log("MAIN Tab Changed...");
  console.log(e);
  console.log(e.tabID);
  console.log("BEFORE...");
  console.log(this.startDate);
  console.log(this.endDate);
  /*this.setStartAndEndDate();
  console.log("AFTER");
  console.log(this.startDate);
  console.log(this.endDate);*/
  this.rsrpPipeLineQuery = this.getDashboardRSRPPipeLineQuery();
  this.rssiPipeLineQuery = this.getDashboardRSSIPipeLineQuery();
  this.sinrPipeLineQuery = this.getDashboardSINRPipeLineQuery();
  this.mainTab = String(e.tabID);
  setTimeout(function() {
    //this.refreshAllCharts();
  }.bind(this), 100);
}

updateAssetInfo(mac)
{
  try{
    this.assetsData.forEach(element => {
     if(element.macAddress==mac)
     {

      this.trBytes = element.trBytes;
      if(this.trBytes==undefined)
        this.trBytes="";
      this.rvBytes = element.rvBytes;
      if(this.rvBytes==undefined)
        this.rvBytes="";
      if(element.lastUpdatedTime!=undefined)
        this.selectedAssetLastUpdatedTime= String(new Date(element.lastUpdatedTime).toLocaleDateString())+" "+String(new Date(element.lastUpdatedTime).toLocaleTimeString());
      else
        this.selectedAssetLastUpdatedTime="--o--";

      this.apnWanInfoOfSelectedAsset=element.apnWanInfo
      if(this.apnWanInfoOfSelectedAsset!=undefined)
      {
        if(this.apnWanInfoOfSelectedAsset["WANIPV43"]==undefined)
          this.apnWanInfoOfSelectedAsset["WANIPV43"]=" ";
        if(this.apnWanInfoOfSelectedAsset["NetMask3"]==undefined)
          this.apnWanInfoOfSelectedAsset["NetMask3"]=" ";
        if(this.apnWanInfoOfSelectedAsset["Gateway3"]==undefined)
          this.apnWanInfoOfSelectedAsset["Gateway3"]=" ";
        if(this.apnWanInfoOfSelectedAsset["PriDNSV43"]==undefined)
          this.apnWanInfoOfSelectedAsset["PriDNSV43"]=" ";
        if(this.apnWanInfoOfSelectedAsset["SecDNSV43"]==undefined)
          this.apnWanInfoOfSelectedAsset["SecDNSV43"]=" ";
      }
      else
      {
        this.apnWanInfoOfSelectedAsset={};
        this.apnWanInfoOfSelectedAsset["WANIPV43"]=" ";
        this.apnWanInfoOfSelectedAsset["NetMask3"]=" ";
        this.apnWanInfoOfSelectedAsset["Gateway3"]=" ";
        this.apnWanInfoOfSelectedAsset["PriDNSV43"]=" ";
        this.apnWanInfoOfSelectedAsset["SecDNSV43"]=" ";
      }

      this.wanInfoOfSelectedAsset=element.wanInfo
      if(this.wanInfoOfSelectedAsset!=undefined)
      {
        if(this.wanInfoOfSelectedAsset["WANIPV41"]==undefined)
          this.wanInfoOfSelectedAsset["WANIPV41"]=" ";
        if(this.wanInfoOfSelectedAsset["NetMask1"]==undefined)
          this.wanInfoOfSelectedAsset["NetMask1"]=" ";
        if(this.wanInfoOfSelectedAsset["Gateway1"]==undefined)
          this.wanInfoOfSelectedAsset["Gateway1"]=" ";
        if(this.wanInfoOfSelectedAsset["PriDNSV41"]==undefined)
          this.wanInfoOfSelectedAsset["PriDNSV41"]=" ";
        if(this.wanInfoOfSelectedAsset["SecDNSV41"]==undefined)
          this.wanInfoOfSelectedAsset["SecDNSV41"]=" ";
      }
      else
      {
        this.wanInfoOfSelectedAsset={};
        this.wanInfoOfSelectedAsset["WANIPV41"]=" ";
        this.wanInfoOfSelectedAsset["NetMask1"]=" ";
        this.wanInfoOfSelectedAsset["Gateway1"]=" ";
        this.wanInfoOfSelectedAsset["PriDNSV41"]=" ";
        this.wanInfoOfSelectedAsset["SecDNSV41"]=" ";
      }

      this.lanInfoOfSelectedAsset=element.lanInfo
      if(this.lanInfoOfSelectedAsset!=undefined)
      {
        if(this.lanInfoOfSelectedAsset["IP"]==undefined)
          this.lanInfoOfSelectedAsset["IP"]=" ";
        if(this.lanInfoOfSelectedAsset["SubMask"]==undefined)
          this.lanInfoOfSelectedAsset["SubMask"]=" ";
        if(this.lanInfoOfSelectedAsset["DHCPType"]==undefined)
          this.lanInfoOfSelectedAsset["DHCPType"]=" ";
        if(this.lanInfoOfSelectedAsset["DHCPStart"]==undefined)
          this.lanInfoOfSelectedAsset["DHCPStart"]=" ";
        if(this.lanInfoOfSelectedAsset["DHCPEnd"]==undefined)
          this.lanInfoOfSelectedAsset["DHCPEnd"]=" ";
        if(this.lanInfoOfSelectedAsset["LANMAC"]==undefined)
          this.lanInfoOfSelectedAsset["LANMAC"]=" ";
      }
      else
      {
        this.lanInfoOfSelectedAsset={};
        this.lanInfoOfSelectedAsset["IP"]=" ";
        this.lanInfoOfSelectedAsset["SubMask"]=" ";
        this.lanInfoOfSelectedAsset["DHCPType"]=" ";
        this.lanInfoOfSelectedAsset["DHCPStart"]=" ";
        this.lanInfoOfSelectedAsset["DHCPEnd"]=" ";
        this.lanInfoOfSelectedAsset["LANMAC"]=" ";
      }



      this.apnInfoOfSelectedAsset=element.apnInfo;
      if(this.apnInfoOfSelectedAsset!=undefined)
      {
        if(this.apnInfoOfSelectedAsset["APNName"]==undefined)
          this.apnInfoOfSelectedAsset["APNName"]=" ";
        if(this.apnInfoOfSelectedAsset["AuthHost"]==undefined)
          this.apnInfoOfSelectedAsset["AuthHost"]=" ";
        if(this.apnInfoOfSelectedAsset["AuthName"]==undefined)
          this.apnInfoOfSelectedAsset["AuthName"]=" ";
        if(this.apnInfoOfSelectedAsset["AuthType"]==undefined)
          this.apnInfoOfSelectedAsset["AuthType"]=" ";
        if(this.apnInfoOfSelectedAsset["AuthPasswd"]==undefined)
          this.apnInfoOfSelectedAsset["AuthPasswd"]=" ";

      }
      else
      {
        this.apnInfoOfSelectedAsset={};
        this.apnInfoOfSelectedAsset["APNName"]=" ";
        this.apnInfoOfSelectedAsset["AuthHost"]=" ";
        this.apnInfoOfSelectedAsset["AuthName"]=" ";
        this.apnInfoOfSelectedAsset["AuthType"]=" ";
        this.apnInfoOfSelectedAsset["AuthPasswd"]=" ";
      }
      this.adminApnInfoOfSelectedAsset=element.adminApnInfo
      if(this.adminApnInfoOfSelectedAsset!=undefined)
      {
        if(this.adminApnInfoOfSelectedAsset["APNName"]==undefined)
          this.adminApnInfoOfSelectedAsset["APNName"]=" ";
        if(this.adminApnInfoOfSelectedAsset["AuthHost"]==undefined)
          this.adminApnInfoOfSelectedAsset["AuthHost"]=" ";
        if(this.adminApnInfoOfSelectedAsset["AuthName"]==undefined)
          this.adminApnInfoOfSelectedAsset["AuthName"]=" ";
        if(this.adminApnInfoOfSelectedAsset["AuthType"]==undefined)
          this.adminApnInfoOfSelectedAsset["AuthType"]=" ";
        if(this.adminApnInfoOfSelectedAsset["AuthPasswd"]==undefined)
          this.adminApnInfoOfSelectedAsset["AuthPasswd"]=" ";
      }
      else
      {
        this.adminApnInfoOfSelectedAsset={};
        this.adminApnInfoOfSelectedAsset["APNName"]=" ";
        this.adminApnInfoOfSelectedAsset["AuthHost"]=" ";
        this.adminApnInfoOfSelectedAsset["AuthName"]=" ";
        this.adminApnInfoOfSelectedAsset["AuthType"]=" ";
        this.adminApnInfoOfSelectedAsset["AuthPasswd"]=" ";
      }

       this.lteInfoOfSelectedAsset=element.lteInfo;
       this.deviceInfoOfSelectedAsset=element.deviceInfo;
       if(this.lteInfoOfSelectedAsset!=undefined)
       {
       if(this.lteInfoOfSelectedAsset["BandWidth"]==undefined)
         this.lteInfoOfSelectedAsset["BandWidth"]=" ";
       if(this.lteInfoOfSelectedAsset["GCI"]==undefined)
         this.lteInfoOfSelectedAsset["GCI"]=" ";
       if(this.lteInfoOfSelectedAsset["ICCID"]==undefined)
         this.lteInfoOfSelectedAsset["ICCID"]=" ";
       if(this.lteInfoOfSelectedAsset["IMEI"]==undefined)
         this.lteInfoOfSelectedAsset["IMEI"]=" ";
       if(this.lteInfoOfSelectedAsset["IMSI"]==undefined)
         this.lteInfoOfSelectedAsset["IMSI"]=" ";
       if(this.lteInfoOfSelectedAsset["PCI"]==undefined)
         this.lteInfoOfSelectedAsset["PCI"]=" ";
       if(this.lteInfoOfSelectedAsset["RSRP"]==undefined)
         this.lteInfoOfSelectedAsset["RSRP"]=-1;
       if(this.lteInfoOfSelectedAsset["RSRQ"]==undefined)
         this.lteInfoOfSelectedAsset["RSRQ"]=-1;
       if(this.lteInfoOfSelectedAsset["RSSI"]==undefined)
         this.lteInfoOfSelectedAsset["RSSI"]=-1;
       if(this.lteInfoOfSelectedAsset["SINR"]==undefined)
         this.lteInfoOfSelectedAsset["SINR"]=-1;

         if(this.lteInfoOfSelectedAsset["PLMN"]==undefined)
         this.lteInfoOfSelectedAsset["PLMN"]="";
         if(this.lteInfoOfSelectedAsset["RXTHR"]==undefined)
         this.lteInfoOfSelectedAsset["RXTHR"]=-1;
         if(this.lteInfoOfSelectedAsset["TXTHR"]==undefined)
         this.lteInfoOfSelectedAsset["TXTHR"]=-1;
         if(this.lteInfoOfSelectedAsset["TransMode"]==undefined)
         this.lteInfoOfSelectedAsset["TransMode"]="";
         if(this.lteInfoOfSelectedAsset["USIMExtST"]==undefined)
          this.lteInfoOfSelectedAsset["USIMExtST"]="";
         if(this.lteInfoOfSelectedAsset["USIMStatus"]==undefined)
         this.lteInfoOfSelectedAsset["USIMStatus"]="";
         if(this.lteInfoOfSelectedAsset["WorkMode"]==undefined)
         this.lteInfoOfSelectedAsset["WorkMode"]="";

       }
       else
       {
         this.lteInfoOfSelectedAsset={};
         this.lteInfoOfSelectedAsset["BandWidth"]=" ";
         this.lteInfoOfSelectedAsset["GCI"]=" ";
         this.lteInfoOfSelectedAsset["ICCID"]=" ";
         this.lteInfoOfSelectedAsset["IMEI"]=" ";
         this.lteInfoOfSelectedAsset["IMSI"]=" ";
         this.lteInfoOfSelectedAsset["PCI"]=" ";
         this.lteInfoOfSelectedAsset["RSRP"]=-1;
         this.lteInfoOfSelectedAsset["RSRQ"]=-1;
         this.lteInfoOfSelectedAsset["RSSI"]=-1;
         this.lteInfoOfSelectedAsset["SINR"]=-1;
         this.lteInfoOfSelectedAsset["PLMN"]="";
         this.lteInfoOfSelectedAsset["RXTHR"]=-1;
         this.lteInfoOfSelectedAsset["TXTHR"]=-1;
         this.lteInfoOfSelectedAsset["TransMode"]="";
          this.lteInfoOfSelectedAsset["USIMExtST"]="";
         this.lteInfoOfSelectedAsset["USIMStatus"]="";
         this.lteInfoOfSelectedAsset["WorkMode"]="";
       }
       if(this.deviceInfoOfSelectedAsset!=undefined)
       {
       if(this.deviceInfoOfSelectedAsset["BootVer"]==undefined)
         this.deviceInfoOfSelectedAsset["BootVer"]=" ";
       if(this.deviceInfoOfSelectedAsset["DTBHardwareType"]==undefined)
         this.deviceInfoOfSelectedAsset["DTBHardwareType"]=" ";
       if(this.deviceInfoOfSelectedAsset["DTBVersion"]==undefined)
         this.deviceInfoOfSelectedAsset["DTBVersion"]=" ";
       if(this.deviceInfoOfSelectedAsset["HardwareModel"]==undefined)
         this.deviceInfoOfSelectedAsset["HardwareModel"]=" ";
       if(this.deviceInfoOfSelectedAsset["LTEMAC"]==undefined)
         this.deviceInfoOfSelectedAsset["LTEMAC"]=" ";
       if(this.deviceInfoOfSelectedAsset["SerialNumber"]==undefined)
         this.deviceInfoOfSelectedAsset["SerialNumber"]=" ";
       if(this.deviceInfoOfSelectedAsset["SoftwareVer"]==undefined)
         this.deviceInfoOfSelectedAsset["SoftwareVer"]=" ";
       if(this.deviceInfoOfSelectedAsset["USB0HostMAC"]==undefined)
         this.deviceInfoOfSelectedAsset["USB0HostMAC"]=" ";
       if(this.deviceInfoOfSelectedAsset["USB0LocalMAC"]==undefined)
         this.deviceInfoOfSelectedAsset["USB0LocalMAC"]=" ";
       if(this.deviceInfoOfSelectedAsset["Uptime"]==undefined)
         this.deviceInfoOfSelectedAsset["Uptime"]=" ";
       if(this.deviceInfoOfSelectedAsset["WiFiMAC"]==undefined)
         this.deviceInfoOfSelectedAsset["WiFiMAC"]=" ";
       }
       else
       {
         this.deviceInfoOfSelectedAsset={};
         this.deviceInfoOfSelectedAsset["BootVer"]=" ";
         this.deviceInfoOfSelectedAsset["DTBHardwareType"]=" ";
         this.deviceInfoOfSelectedAsset["DTBVersion"]=" ";
         this.deviceInfoOfSelectedAsset["HardwareModel"]=" ";
         this.deviceInfoOfSelectedAsset["LTEMAC"]=" ";
         this.deviceInfoOfSelectedAsset["SerialNumber"]=" ";
         this.deviceInfoOfSelectedAsset["SoftwareVer"]=" ";
         this.deviceInfoOfSelectedAsset["USB0HostMAC"]=" ";
         this.deviceInfoOfSelectedAsset["USB0LocalMAC"]=" ";
         this.deviceInfoOfSelectedAsset["Uptime"]=" ";
         this.deviceInfoOfSelectedAsset["WiFiMAC"]=" ";
       }
       this.lteInfoCollected=true;
       this.deviceInfoCollected=true;
     }
   });
 }catch(e)
 {console.log(e);}
   console.log(this.lteInfoOfSelectedAsset);
   console.log(this.deviceInfoOfSelectedAsset);
   this.assetMACs = [mac];
   this.rsrpPipeLineQuery = this.getDashboardRSRPPipeLineQuery();
   this.rssiPipeLineQuery = this.getDashboardRSSIPipeLineQuery();
   this.sinrPipeLineQuery = this.getDashboardSINRPipeLineQuery();
   this.upTimePipeLineQuery = this.getDashboardUpTimePipeLineQuery();
   this.txthrPipeLineQuery = this.getDashboardTxDeltaDataPipeLineQuery();
   this.rxthrPipeLineQuery = this.getDashboardRxDeltaDataPipeLineQuery();

   this.txDataReceived=false;
   this.rxDataReceived=false;

   this.rxData=[];
   this.totalData=[];

   //this.getDataForTX_RX_Chart();
   //this.getDataForUpTime();
   if(this.showCharts)
   {
   this.refreshAllCharts();
   }
   else
   {
     console.log("SHOWING CHARTS");
   this.showCharts=true;
   }
   setTimeout(function() {
    this._spinner.hide();
   }.bind(this), 2000);


}



getDataForTX_RX_Chart(){

  var paramsForData={};
  paramsForData["namespace"]= this.dashboardNS;
  paramsForData["limit"]=-1;
  paramsForData["dataQuery"]= this.getDashboardTXTHRPipeLineQuery();
  this.getDataForTX_RX(paramsForData,"tx");

  paramsForData["dataQuery"]= this.getDashboardRXTHRPipeLineQuery();
  this.getDataForTX_RX(paramsForData,"rx");
  //this.checkTX_RX_DataGathered();

  /*paramsForData["dataQuery"]= this.getDashboardTrDataPipeLineQuery();
  this.getUsedDataForTr_Rv(paramsForData);
  paramsForData["dataQuery"]= this.getDashboardRvDataPipeLineQuery();
  this.getUsedDataForTr_Rv(paramsForData);
  paramsForData["dataQuery"]= this.getDashboardTotalDataPipeLineQuery();
  this.getUsedDataForTr_Rv(paramsForData);
  this._spinner.hide();
  this.showCharts=true;*/
}

checkTX_RX_DataGathered(){
  console.log("in checkTX_RX_DataGathered");
  if(this.txDataReceived&&this.rxDataReceived)
  {
    console.log("ALL DATA RECEIVED");
    this.rxData=this.rxData.concat(this.txData);
    console.log(this.rxData);
    if(this.showCharts)
    {
    this.refreshAllCharts();
    }
    else
    {
      console.log("SHOWING CHARTS");
    this.showCharts=true;
    }
    this._spinner.hide();
  }
  else
  {
    setTimeout(function() {
      this.checkTX_RX_DataGathered();
    }.bind(this), 500);
  }
}

getDataForTX_RX(paramsForData:any,name:any){
  console.log("In getDataForTX_RX ");
  console.log(new Date());

    try{
      this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log(name ,": TX_RX : ",new Date());
            console.log(res);
            if(res==undefined)
            res=[];
            this.rxData=this.rxData.concat(res);
      });
    }
    catch(e)
    {
      this.rxDataReceived=true;
      this.txDataReceived=true;
    }
}

getUsedDataForTr_Rv(paramsForData:any){

    try{
      console.log("IN getUsedDataForTr_Rv");

      this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("USED DATA TX_RX : ",new Date());
            console.log(res);
            if(res==undefined)
            res=[];
            this.totalData= this.totalData.concat(res);
            console.log(this.totalData);

      });
    }
    catch(e)
    {
      this.rxDataReceived=true;
      this.txDataReceived=true;
    }
}

convertBytesToMegaBytes(data:any)
{
  if((data!=undefined)&&(data!=undefined))
  {
    let packetCount = Number(data);
    var ext="";
    data = (packetCount)/1024; //KB
    ext=" KB";
    //console.log("Data : "+data);
    data = Math.round(data);
    var dataStr="0";
    if( (ext==" KB")&&(data>1024) )
    {
        data = data/1024; //MB
        //data = Math.round(data);
        dataStr= data.toFixed(3);
        ext=" MB";
    }
    else
    {
      dataStr= data.toFixed(3);
      ext=" KB";
    }
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
wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

refreshAllCharts()
{
  console.log("Refreshing Chart...");
  setTimeout(function(){
    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        let clses;
        try{
        if(buttons[i].classList.contains("chartRefreshButton"))
          buttons[i].click();
        }
        catch(e){console.log("Exception");console.log(e)}
    }
    //this._spinner.hide();
  }.bind(this),200);
}

onApnUserSelect(event:any){
  console.log(event);
  console.log("In Click");
  try{
    var locType= event.node.data.locationType;
    var loc= event.node.data.key;
    console.log(locType);
    console.log(loc);
    if(locType=="user")
    {
      ///show wizard
      this._spinner.show();
      let uuid = event.node.data.uuid;
      this.getApnUserData(uuid);


      //
    }
  }
  catch(e)
  {
    this._spinner.hide();
  }

}

getApnUserData(uuid:string){
  console.log("In getApnUserData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("ApnUserRegistration");
      paramsForData["limit"]=-1;
      let pipeLine = [
        {"$match":{"uuid":uuid}}
      ];
        paramsForData["dataQuery"]= pipeLine;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("USER DATA...");
            console.log(res);
            if(res!=undefined&&res.length>0)
            {
              this.currentSelectedApnUserDataCollected=true;
              this.currentSelectedApnUserInfo=[];
              let temp =res[0];
              let keys=Object.keys(temp);
              let cnt=0;
              keys.forEach(key => {
                cnt++;
                if(key!="_id"&&key!="uuid"&&key!="date")
                this.currentSelectedApnUserInfo.push({
                  "key":key.toUpperCase(),"value":temp[key]
                })

              });
            }
            this._spinner.hide();
            $('#alertModalButton').click();
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
      this._spinner.hide();
    }
}
getTitleOfAlert(){
  if(!this.currentSelectedApnUserDataCollected)
  return "Alert";
  else
  return "APN User Info";
}

  //for testing tree
  public sidebar:any;
  Click(event:any):void{
    console.log(event);
   console.log("In Click");
   var locType= event.node.data.locType;
   var loc= event.node.data.key;

   let proceed=false;
   if((locType!="buildingHolder")&&(locType!="vehicleHolder")&&(locType!=undefined))
    this.assetFilterQuery={};
   if(locType=="continent")
    {
      this.currentLocationType= "Continent";
      this.assetFilterQuery["Continent"] = loc;
      proceed=true;
    }
    else if(locType=="country")
    {
      this.currentLocationType= "Country";
      this.assetFilterQuery["Continent"] = event.node.parent.data.key;
      this.assetFilterQuery["Country"] = loc;
      proceed=true;
    }

    else if(locType=="city")
   {
     this.currentLocationType= "City";
     this.assetFilterQuery["Continent"] = event.node.parent.parent.data.key;
     this.assetFilterQuery["Country"] = event.node.parent.data.key;
     this.assetFilterQuery["City"] = loc;
     proceed=true;
   }

   else if(locType=="building")
   {
     this.currentLocationType= "Building";
     this.assetFilterQuery["Continent"] = event.node.parent.parent.parent.parent.data.key;
     this.assetFilterQuery["Country"] = event.node.parent.parent.parent.data.key;
     this.assetFilterQuery["City"] = event.node.parent.parent.data.key;
     this.assetFilterQuery["Building"] = loc;
     proceed=true;
   }
   else if(locType=="floor")
    {
      this.currentLocationType= "Floor";
      this.floorUUID=event.node.data.floorUUID;
      this.assetFilterQuery["floorUUID"] = this.floorUUID;
      console.log(this.floorUUID);
      proceed=true;
    }
    else if(locType=="vehicle")
    {
      this.currentLocationType= "vehicle";
      this.deviceID = event.node.data.macAddress;
      this.assetFilterQuery["macAddress"]=this.deviceID;
      proceed=true;
    }

   if(proceed)
   {
     this.currentLocation = loc;
     console.log(this.currentLocationType);
     console.log(this.currentLocation);
     this._spinner.show();
     this.showCharts=false;
     this.initiateDataCollection();
     //this.refreshAllCharts();
   }
   else
   {
     console.log("Not allowed...");
     console.log(this.currentLocationType);
     console.log(this.currentLocation);
     console.log(this.assetFilterQuery);
   }
}
getSecsToTime(time)
{
let retStr;
    try{
      if(time==""||time==" ")
      return "0 Secs";

    if(time<60)
    return  String(time)+" Secs";
    time = Math.floor(time/60); ///MINTUES

    let minExt="mins", hrExt="hr";
    if(time<=60)
      retStr = String(time)+minExt;
    else
    {
      let hrs=Math.floor(time/60);
      let mins= Math.floor(time%60);
      if(hrs<24)
        retStr = String(hrs)+" "+hrExt+", "+String(mins)+" "+minExt;
      else
      {
        let days=Math.floor(hrs/24);
        hrs = hrs%24;
        retStr = String(days)+" Day(s), "+String(hrs)+" "+hrExt+", "+String(mins)+" "+minExt;
      }
    }
    }catch(e){retStr="~~o~~"}
    return retStr;
}
getDashboardRSSIPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardRSSIPipeLine();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
pipeline[0]["$match"]["macAddress"]={"$in":this.assetMACs};
if(this.customDateUsed)
pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};

console.log("PIPELINE");
console.log(JSON.stringify(pipeline));
return pipeline;
}

getDashboardSINRPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardSINRPipeLine();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
pipeline[0]["$match"]["macAddress"]={"$in":this.assetMACs};
if(this.customDateUsed)
pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
/*console.log("PIPELINE");
console.log(JSON.stringify(pipeline));*/
return pipeline;
}

getDashboardRSRPPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardRSRPPipeLine();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
pipeline[0]["$match"]["macAddress"]={"$in":this.assetMACs};
if(this.customDateUsed)
pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
return pipeline;
}

getDashboardUpTimePipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardUpTimePipeLine();
  if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  return [];
  pipeline[0]["$match"]["macAddress"]={"$in":this.assetMACs};
  if(this.customDateUsed)
  pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
  return pipeline;
}

getDashboardTXTHRPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardTXTHRPipeLine();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
let match={};
match["macAddress"]={"$in":this.assetMACs};
if(this.customDateUsed)
pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
return pipeline;
}

getDashboardRXTHRPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardRXTHRPipeLine();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
let match={};
match["macAddress"]={"$in":this.assetMACs};
if(this.customDateUsed)
pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
return pipeline;
}

getDashboardTrDataPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardTrDataPipeLine();
  console.log("pipeline");
  console.log(pipeline);
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
let match={};
match["macAddress"]={"$in":this.assetMACs};
if(this.customDateUsed)
pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
return pipeline;
}

getDashboardRvDataPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardRvDataPipeLine();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
let match={};
match["macAddress"]={"$in":this.assetMACs};
if(this.customDateUsed)
pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
return pipeline;
}

getDashboardTotalDataPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardTotalDataPipeLine();
if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
return [];
let match={};
match["macAddress"]={"$in":this.assetMACs};
if(this.customDateUsed)
pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
return pipeline;
}

getDashboardTxDeltaDataPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardTxDeltaUsedDataPipeLine();
  if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  return [];
  let match={};
  match["macAddress"]={"$in":this.assetMACs};
  if(this.customDateUsed)
  pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
  return pipeline;
}
getDashboardRxDeltaDataPipeLineQuery(){
  let pipeline = this.aggrQuery.getDashboardRxDeltaUsedDataPipeLine();
  if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  return [];
  let match={};
  match["macAddress"]={"$in":this.assetMACs};
  if(this.customDateUsed)
  pipeline[0]["$match"]["date"]={"$gte":this.customStartDate,"$lte":this.customEndDate};
  return pipeline;
}



}
