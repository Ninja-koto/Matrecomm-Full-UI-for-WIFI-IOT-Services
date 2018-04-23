
import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { Routes } from '@angular/router';
import {FormGroup,FormBuilder,Validators} from "@angular/forms"
import { TreeMenuService } from './sidebar/treeMenu/treeMenu.service';
import { ADDMGMTDASHBOARDLAYOUT_MENU } from './addManagementDashboardLayout.menu';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import { CollectionTableDataCollectorService } from '../commonServices/tableDataCollector.service';
import {ViewDataCollectorService} from "../commonServices/viewDataCollector.service";
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import {BaThemeSpinner} from "../theme/services";
import {} from "@agm/core"
import {AggrQueryService} from "../commonServices/pipeLine_AggrQueries";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AgmCoreModule } from '@agm/core';


@Component({
  selector: 'addMgmtDashboardLayout',
  templateUrl:'addManagementDashboardLayout.component.html' ,
  styleUrls:['addManagementDashboardLayout.component.scss'],
  providers:[CollectionTableDataCollectorService,AggrQueryService,ViewDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class AddMgmtDashboardLayout {
  @ViewChild('validationModal')
  modal: ModalComponent;
  animation: boolean = true;
  keyboard: boolean = false;
  lat: number = 51.678418;
  lng: number = 7.809007;
  settings = {
    columns: {
      firstName: {
        title: ' First Name'
      },
      lastName: {
        title: 'Last Name'
      },
      mobileNumber: {
        title: 'Mobile Number'
      },
      userName: {
        title: 'User Name'
      },
      date: {
        title: 'Date'
      }
    }
  };
  dataForPeople = 
    [{
      firstName: "Yolo",
      lastName: "Leanne Graham",
      mobileNumber: "Bret",
      userName: "Sincere@april.biz",
      date: "Store 1"
    }] ;
    people = [];
    data ={};
    currentLocation:string="India";
    currentLocationType:string="Country";

    mainTab:string = "snir";
    dataDisplayTab:string="overallStats";
    innerTab:string="ApInventoryTab";
    data1:any[]
    data2:any[]
    interValID:any;
    lastUpdatedTime:number;
    assetsData:any=[];
    assetsStatu_Uptime:any={};

    nsObj: NameSpaceUtil;
    namespace:string="";
    assetDataGathered:Boolean=true;
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

    roundChartsDate:Boolean=false;
    view: any[] = [700, 400];

    uptimeData:any=[];
    upDataModified:Boolean=false;
    stopUpdating:Boolean=false;
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
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
    userCountByUsageDurationData:any=[];
    userCountByUsageDurationDataDayOfWeek:any=[];
    userCountByUsageDurationDataTimeOfDay:any=[];
    userCountByHoursDurationData:any=[];
    weekData:any=[];
    userCountTimeOfDay:any=[];
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

    startDate:any="";
    endDate:any="";
    customDateUsed:Boolean=false;
    customStartDate:any="";
    customEndDate:any="";

    rxDataReceived:Boolean=true;
    rxData:any=[];
    txDataReceived:Boolean=true;
    txData:any=[];

    totalData:any=[];

    pastMonthInterval:any={};

    private myForm: FormGroup;
  constructor(private _menuService: TreeMenuService,private storage:SessionStorageService,
   private tableDataCollectService:CollectionTableDataCollectorService,
   private viewDataCollectService:ViewDataCollectorService, private _spinner: BaThemeSpinner,
  private aggrQuery:AggrQueryService, private formBuilder: FormBuilder) {
    this._spinner.show();
    this.lastUpdatedTime = new Date().getTime();
    this.assetFilterQuery[this.currentLocationType]=this.currentLocation;
    this.config = this.storage.retrieve("configParams");
    this.roundChartsDate =this.config.roundChartsDate;
    let range = this.aggrQuery.getDataRange();

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
}

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>ADDMGMTDASHBOARDLAYOUT_MENU);
    this.startInterval();
    this.getPeopleData();
    console.log("People Data");
    console.log(this.people);
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
console.log("dismissed...");
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

getNewUsersTrafficByTimePipeLineQuery(){
  return [
    {"$project":{"date":1,"y":{"$year":"$date"},"m":{"$month":"$date"},"d":{"$dayOfMonth":"$date"},"w":{"$dayOfWeek":"$date"},"h":{"$hour":"$date"}}},
    { "$group": {"_id": { "day": "$d",  "month":"$m","hour": "$h" },"value": { $sum: 1 },"date":{$last:"$date"}}},
    {"$sort":{"_id.hour":-1}},
    { "$group": { "_id": {"day":"$_id.day","month":"$_id.month"},"series": { "$push": { "name": { $concat:[ {$cond:{ if:{ $lt: [ "$_id.hour", 10 ] }, then:{$concat: ["0",{"$substr":["$_id.hour",0,-1]}]}, else:{"$substr":["$_id.hour",0,-1]} }} ,":00"] },  "value": "$value"}  }  }},
    {$addFields:{"name":{ $concat:[ {
      $switch: {
          branches: [
          {case: {$eq: ["$_id.month", 1]},then: "Jan"},
          {case: {$eq: ["$_id.month", 2]},then: "Feb"},
          {case: {$eq: ["$_id.month", 3]},then: "Mar"},
          {case: {$eq: ["$_id.month", 4]},then: "Apr"},
          {case: {$eq: ["$_id.month", 5]},then: "May"},
          {case: {$eq: ["$_id.month", 6]},then: "Jun"},
          {case: {$eq: ["$_id.month", 7]},then: "Jul"},
          {case: {$eq: ["$_id.month", 8]},then: "Aug"},
          {case: {$eq: ["$_id.month", 9]},then: "Sep"},
          {case: {$eq: ["$_id.month", 10]},then: "Oct"},
          {case: {$eq: ["$_id.month", 11]},then: "Nov"},
          {case: {$eq: ["$_id.month", 12]},then: "Dec"},
          ],
          default: "Unknown"
      }} ," ",{"$substr":["$_id.day",0,-1]}] } }}
  ];
}
getUserCountByHourOfFewDaysChartData(){
  console.log("In getUserCountByHourOfFewDaysChartData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempUserRegistration");
      paramsForData["limit"]=-1;
      let pipeLine = [
        {"$project":{"date":1,"y":{"$year":"$date"},"m":{"$month":"$date"},"d":{"$dayOfMonth":"$date"},"w":{"$dayOfWeek":"$date"},"h":{"$hour":"$date"}}},
        { "$group": {"_id": { "day": "$d",  "month":"$m","hour": "$h" },"value": { $sum: 1 },"date":{$last:"$date"}}},
        {"$sort":{"_id.hour":-1}},
        { "$group": { "_id": {"day":"$_id.day","month":"$_id.month"},"series": { "$push": { "name": { $concat:[ {$cond:{ if:{ $lt: [ "$_id.hour", 10 ] }, then:{$concat: ["0",{"$substr":["$_id.hour",0,-1]}]}, else:{"$substr":["$_id.hour",0,-1]} }} ,":00"] },  "value": "$value"}  }  }},
        {$addFields:{"name":{ $concat:[ {
          $switch: {
              branches: [
              {case: {$eq: ["$_id.month", 1]},then: "Jan"},
              {case: {$eq: ["$_id.month", 2]},then: "Feb"},
              {case: {$eq: ["$_id.month", 3]},then: "Mar"},
              {case: {$eq: ["$_id.month", 4]},then: "Apr"},
              {case: {$eq: ["$_id.month", 5]},then: "May"},
              {case: {$eq: ["$_id.month", 6]},then: "Jun"},
              {case: {$eq: ["$_id.month", 7]},then: "Jul"},
              {case: {$eq: ["$_id.month", 8]},then: "Aug"},
              {case: {$eq: ["$_id.month", 9]},then: "Sep"},
              {case: {$eq: ["$_id.month", 10]},then: "Oct"},
              {case: {$eq: ["$_id.month", 11]},then: "Nov"},
              {case: {$eq: ["$_id.month", 12]},then: "Dec"},
              ],
              default: "Unknown"
          }} ," ",{"$substr":["$_id.day",0,-1]}] } }}
      ];
      let tempObj= pipeLine;

        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            var newRes = result.data;
            console.log("TEST DATA...");
            console.log(JSON.stringify(res));
            let tempObj=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            this.multi1=res;
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}
getPeopleData(){
  console.log("In People Data ");
  console.log(new Date());
    try{
      var paramsForData={};
      let query={};
      let dataQuery={};
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= 'CraftAirProdMgr.936c44d2-e3df-11e7-9deb-74e543b9101b.TempUserRegistration'
      paramsForData["limit"]=-1;

        paramsForData["dataQuery"]= dataQuery;
        this.viewDataCollectService.getPostData(paramsForData)
          .subscribe(result => {
            var res = result.data;
            for(let i=0;i<res.length;i++) {
              //console.log("Ant")
              //console.log(res[i].firstName);
              this.data["firstName"]= res[i].firstName;
              this.data["lastName"] = res[i].lastName;
                this.data["mobileNumber"]=res[i].mobileNumber;
                  this.data["userName"] = res[i].userName;
                    this.data["date"]= res[i].date;
                    this.people.push(this.data)
            }
      });
    }
    catch(e)
    {
      console.log("Initial Data For People load Failed... ");
    }
}

getUserCountByUsageDurationByDatePipeLineQuery(){
  return [
    {"$project":{"lastUpdateTime":1,"sessionID":1,"accessTime":1,"y":{"$year":"$accessTime"},"m":{"$month":"$accessTime"},"d":{"$dayOfMonth":"$accessTime"},"w":{"$dayOfWeek":"$accessTime"},"h":{"$hour":"$accessTime"}}},
    { "$sort": {"lastUpdateTime":1}},
    { "$group": {"_id": {ses:"$sessionID"},
            year:{"$last":"$y"},
            month:{"$last":"$m"},
            day:{"$last":"$d"},
            durationInMins:{"$last":{ "$divide": [ { "$subtract": [ "$lastUpdateTime", "$accessTime" ] },1000 * 60]}}
    }},
    {$sort:{durationInMins:-1}},
    {
      "$project":{
        /*ldt:1,*/year:1,month:1,day:1,
        val:"$durationInMins",
        durationInMins:{$concat: [ {
              $switch: {
                  branches: [
                  {case: { $lt: [ "$durationInMins", 5 ] },then: "<5 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 5 ] },{ $lt: [ "$durationInMins", 10 ] }]},then: ">=5 and < 10 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 10 ] },{ $lt: [ "$durationInMins", 20 ] }]},then: ">=10 and < 20 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 20 ] },{ $lt: [ "$durationInMins", 30 ] }]},then: ">=20 and < 30 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 30 ] },{ $lt: [ "$durationInMins", 45 ] }]},then: ">=30 and < 45 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 45 ] },{ $lt: [ "$durationInMins", 60 ] }]},then: ">=45 and < 60 Mins"},
                  {case: { $gte: [ "$durationInMins", 60 ] },then: ">=60 Mins"},
                  ],
                  default: "Unknown"
              }
          }]
        }
      }
    },
    { "$group": {
      "_id": {"cnt":"$durationInMins"},
      "day":{"$last":"$day"},
      "month":{"$last":"$month"},
      "year":{"$last":"$year"},
      "durationInMins":{"$last":"$durationInMins"},
      "countOfDurationType": {"$sum":1}
    }},
    { "$group": {
      "_id": {"d":"$day","m":"$month","y":"$year"},
      "day":{"$last":"$day"},
      "month":{"$last":"$month"},
      "series": { "$push": { "name": "$durationInMins",  "value": "$countOfDurationType"}  }
      }},
    {$addFields:{
        "name":{ $concat:[
            {
              $switch: {
                  branches: [
                  {case: {$eq: ["$_id.m", 1]},then: "Jan"},
                  {case: {$eq: ["$_id.m", 2]},then: "Feb"},
                  {case: {$eq: ["$_id.m", 3]},then: "Mar"},
                  {case: {$eq: ["$_id.m", 4]},then: "Apr"},
                  {case: {$eq: ["$_id.m", 5]},then: "May"},
                  {case: {$eq: ["$_id.m", 6]},then: "Jun"},
                  {case: {$eq: ["$_id.m", 7]},then: "Jul"},
                  {case: {$eq: ["$_id.m", 8]},then: "Aug"},
                  {case: {$eq: ["$_id.m", 9]},then: "Sep"},
                  {case: {$eq: ["$_id.m", 10]},then: "Oct"},
                  {case: {$eq: ["$_id.m", 11]},then: "Nov"},
                  {case: {$eq: ["$_id.m", 12]},then: "Dec"},
                  ],
                  default: "Unknown"
              }
            },
            " ",
            {"$substr":["$_id.d",0,-1]}
            ] }
        }}
];
}
getUserCountByUsageDurationOfFewDaysChartData(){
  console.log("In getUserCountByUsageDurationOfFewDaysChartData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempRadiusAcctActiveSessions");
      paramsForData["limit"]=-1;
      let pipeLine = [
        {"$project":{"lastUpdateTime":1,"sessionID":1,"accessTime":1,"y":{"$year":"$accessTime"},"m":{"$month":"$accessTime"},"d":{"$dayOfMonth":"$accessTime"},"w":{"$dayOfWeek":"$accessTime"},"h":{"$hour":"$accessTime"}}},
        { "$sort": {"lastUpdateTime":1}},
        { "$group": {"_id": {ses:"$sessionID"},
                //ldt:{"$last":"$lastUpdateTime"},
                year:{"$last":"$y"},
                month:{"$last":"$m"},
                day:{"$last":"$d"},
                durationInMins:{"$last":{ "$divide": [ { "$subtract": [ "$lastUpdateTime", "$accessTime" ] },1000 * 60]}}
        }},
        {$sort:{durationInMins:-1}},
        {
          "$project":{
           year:1,month:1,day:1,
            val:"$durationInMins",
            durationInMins:{$concat: [ {
                  $switch: {
                      branches: [
                      {case: { $lt: [ "$durationInMins", 5 ] },then: "<5 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 5 ] },{ $lt: [ "$durationInMins", 10 ] }]},then: ">=5 and < 10 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 10 ] },{ $lt: [ "$durationInMins", 20 ] }]},then: ">=10 and < 20 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 20 ] },{ $lt: [ "$durationInMins", 30 ] }]},then: ">=20 and < 30 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 30 ] },{ $lt: [ "$durationInMins", 45 ] }]},then: ">=30 and < 45 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 45 ] },{ $lt: [ "$durationInMins", 60 ] }]},then: ">=45 and < 60 Mins"},
                      {case: { $gte: [ "$durationInMins", 60 ] },then: ">=60 Mins"},
                      ],
                      default: "Unknown"
                  }
              }]
            }
          }
        },
        { "$group": {
          "_id": {"cnt":"$durationInMins"},
          "day":{"$last":"$day"},
          "month":{"$last":"$month"},
          "year":{"$last":"$year"},
          "durationInMins":{"$last":"$durationInMins"},
          "countOfDurationType": {"$sum":1}
        }},
        { "$group": {
          "_id": {"d":"$day","m":"$month","y":"$year"},
          "day":{"$last":"$day"},
          "month":{"$last":"$month"},
          "series": { "$push": { "name": "$durationInMins",  "value": "$countOfDurationType"}  }
          }},
        {$addFields:{
            "name":{ $concat:[
                {
                  $switch: {
                      branches: [
                      {case: {$eq: ["$_id.m", 1]},then: "Jan"},
                      {case: {$eq: ["$_id.m", 2]},then: "Feb"},
                      {case: {$eq: ["$_id.m", 3]},then: "Mar"},
                      {case: {$eq: ["$_id.m", 4]},then: "Apr"},
                      {case: {$eq: ["$_id.m", 5]},then: "May"},
                      {case: {$eq: ["$_id.m", 6]},then: "Jun"},
                      {case: {$eq: ["$_id.m", 7]},then: "Jul"},
                      {case: {$eq: ["$_id.m", 8]},then: "Aug"},
                      {case: {$eq: ["$_id.m", 9]},then: "Sep"},
                      {case: {$eq: ["$_id.m", 10]},then: "Oct"},
                      {case: {$eq: ["$_id.m", 11]},then: "Nov"},
                      {case: {$eq: ["$_id.m", 12]},then: "Dec"},
                      ],
                      default: "Unknown"
                  }
                },
                " ",
                {"$substr":["$_id.d",0,-1]}
                ] }
            }}
  ];
      let tempObj= pipeLine;

        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("TEST DATA...");
            console.log(JSON.stringify(res));
            this.userCountByUsageDurationData=res;
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

getUserCountByUsageDurationDayofWeekPipeLineQuery(){
  return [
    {"$project":{"lastUpdateTime":1,"sessionID":1,"accessTime":1,"y":{"$year":"$accessTime"},"m":{"$month":"$accessTime"},"d":{"$dayOfMonth":"$accessTime"},"w":{"$dayOfWeek":"$accessTime"},"h":{"$hour":"$accessTime"}}},
    { "$sort": {"lastUpdateTime":1}},
    { "$group": {"_id": {ses:"$sessionID"},
            //ldt:{"$last":"$lastUpdateTime"},
            weekDay:{"$last":"$w"},
            year:{"$last":"$y"},
            month:{"$last":"$m"},
            day:{"$last":"$d"},
            durationInMins:{"$last":{ "$divide": [ { "$subtract": [ "$lastUpdateTime", "$accessTime" ] },1000 * 60]}}
    }},
    {$sort:{durationInMins:-1}},
    {
      "$project":{
        /*ldt:1,*/year:1,month:1,day:1,weekDay:1,
        val:"$durationInMins",
        durationInMins:{$concat: [ {
              $switch: {
                  branches: [
                  {case: { $lt: [ "$durationInMins", 5 ] },then: "<5 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 5 ] },{ $lt: [ "$durationInMins", 10 ] }]},then: ">=5 and < 10 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 10 ] },{ $lt: [ "$durationInMins", 20 ] }]},then: ">=10 and < 20 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 20 ] },{ $lt: [ "$durationInMins", 30 ] }]},then: ">=20 and < 30 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 30 ] },{ $lt: [ "$durationInMins", 45 ] }]},then: ">=30 and < 45 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 45 ] },{ $lt: [ "$durationInMins", 60 ] }]},then: ">=45 and < 60 Mins"},
                  {case: { $gte: [ "$durationInMins", 60 ] },then: ">=60 Mins"},
                  ],
                  default: "Unknown"
              }
          }]
        }
      }
    },
    { "$group": {
      "_id": {"cnt":"$durationInMins"},
      "day":{"$last":"$day"},
      "weekDay":{"$last":"$weekDay"},
      "month":{"$last":"$month"},
      "year":{"$last":"$year"},
      "durationInMins":{"$last":"$durationInMins"},
      "countOfDurationType": {"$sum":1}
    }},
    { "$group": {
      "_id": "$weekDay",
      "weekDay":{"$last":"$weekDay"},
      "day":{"$last":"$day"},
      "month":{"$last":"$month"},
      "series": { "$push": { "name": "$durationInMins",  "value": "$countOfDurationType"}  }
      }},
    {$addFields:{
        "name":{ $switch: {
                  branches: [
                  {case: {$eq: ["$_id", 1]},then: "Sunday"},
                  {case: {$eq: ["$_id", 2]},then: "Monday"},
                  {case: {$eq: ["$_id", 3]},then: "Tuesday"},
                  {case: {$eq: ["$_id", 4]},then: "Wednesday"},
                  {case: {$eq: ["$_id", 5]},then: "Thursday"},
                  {case: {$eq: ["$_id", 6]},then: "Friday"},
                  {case: {$eq: ["$_id", 7]},then: "Saturday"},
                  ],
                  default: "Unknown"
              }
            }
    }}
];
}
getUserCountByUsageDurationDayofWeekChartData(){
  console.log("In getUserCountByUsageDurationDayofWeekChartData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempRadiusAcctActiveSessions");
      paramsForData["limit"]=-1;
      let pipeLine = [
        {"$project":{"lastUpdateTime":1,"sessionID":1,"accessTime":1,"y":{"$year":"$accessTime"},"m":{"$month":"$accessTime"},"d":{"$dayOfMonth":"$accessTime"},"w":{"$dayOfWeek":"$accessTime"},"h":{"$hour":"$accessTime"}}},
        { "$sort": {"lastUpdateTime":1}},
        { "$group": {"_id": {ses:"$sessionID"},
                //ldt:{"$last":"$lastUpdateTime"},
                weekDay:{"$last":"$w"},
                year:{"$last":"$y"},
                month:{"$last":"$m"},
                day:{"$last":"$d"},
                durationInMins:{"$last":{ "$divide": [ { "$subtract": [ "$lastUpdateTime", "$accessTime" ] },1000 * 60]}}
        }},
        {$sort:{durationInMins:-1}},
        {
          "$project":{
            /*ldt:1,*/year:1,month:1,day:1,weekDay:1,
            val:"$durationInMins",
            durationInMins:{$concat: [ {
                  $switch: {
                      branches: [
                      {case: { $lt: [ "$durationInMins", 5 ] },then: "<5 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 5 ] },{ $lt: [ "$durationInMins", 10 ] }]},then: ">=5 and < 10 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 10 ] },{ $lt: [ "$durationInMins", 20 ] }]},then: ">=10 and < 20 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 20 ] },{ $lt: [ "$durationInMins", 30 ] }]},then: ">=20 and < 30 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 30 ] },{ $lt: [ "$durationInMins", 45 ] }]},then: ">=30 and < 45 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 45 ] },{ $lt: [ "$durationInMins", 60 ] }]},then: ">=45 and < 60 Mins"},
                      {case: { $gte: [ "$durationInMins", 60 ] },then: ">=60 Mins"},
                      ],
                      default: "Unknown"
                  }
              }]
            }
          }
        },
        { "$group": {
          "_id": {"cnt":"$durationInMins"},
          "day":{"$last":"$day"},
          "weekDay":{"$last":"$weekDay"},
          "month":{"$last":"$month"},
          "year":{"$last":"$year"},
          "durationInMins":{"$last":"$durationInMins"},
          "countOfDurationType": {"$sum":1}
        }},
        { "$group": {
          "_id": "$weekDay",
          "weekDay":{"$last":"$weekDay"},
          "day":{"$last":"$day"},
          "month":{"$last":"$month"},
          "series": { "$push": { "name": "$durationInMins",  "value": "$countOfDurationType"}  }
          }},
        {$addFields:{
            "name":{ $switch: {
                      branches: [
                      {case: {$eq: ["$_id", 1]},then: "Sunday"},
                      {case: {$eq: ["$_id", 2]},then: "Monday"},
                      {case: {$eq: ["$_id", 3]},then: "Tuesday"},
                      {case: {$eq: ["$_id", 4]},then: "Wednesday"},
                      {case: {$eq: ["$_id", 5]},then: "Thursday"},
                      {case: {$eq: ["$_id", 6]},then: "Friday"},
                      {case: {$eq: ["$_id", 7]},then: "Saturday"},
                      ],
                      default: "Unknown"
                  }
                }
        }}
];
      let tempObj= pipeLine;

        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("TEST DATA...");
            console.log(JSON.stringify(res));
            this.userCountByUsageDurationDataDayOfWeek=res;
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}


getUserCountByUsageDurationTimeOfDayPipeLineQuery(){
  return  [
    {"$project":{"lastUpdateTime":1,"sessionID":1,"accessTime":1,"y":{"$year":"$accessTime"},"m":{"$month":"$accessTime"},"d":{"$dayOfMonth":"$accessTime"},"w":{"$dayOfWeek":"$accessTime"},"h":{"$hour":"$accessTime"}}},
    { "$sort": {"lastUpdateTime":1}},
    { "$group": {"_id": {ses:"$sessionID"},
            //ldt:{"$last":"$lastUpdateTime"},
            hour:{"$last":"$h"},
            year:{"$last":"$y"},
            month:{"$last":"$m"},
            day:{"$last":"$d"},
            durationInMins:{"$last":{ "$divide": [ { "$subtract": [ "$lastUpdateTime", "$accessTime" ] },1000 * 60]}}
    }},
    {$sort:{durationInMins:-1}},
    {
      "$project":{
        /*ldt:1,*/year:1,month:1,day:1,hour:1,
        val:"$durationInMins",
        durationInMins:{$concat: [ {
              $switch: {
                  branches: [
                  {case: { $lt: [ "$durationInMins", 5 ] },then: "<5 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 5 ] },{ $lt: [ "$durationInMins", 10 ] }]},then: ">=5 and < 10 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 10 ] },{ $lt: [ "$durationInMins", 20 ] }]},then: ">=10 and < 20 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 20 ] },{ $lt: [ "$durationInMins", 30 ] }]},then: ">=20 and < 30 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 30 ] },{ $lt: [ "$durationInMins", 45 ] }]},then: ">=30 and < 45 Mins"},
                  {case: {$and:[{ $gte: [ "$durationInMins", 45 ] },{ $lt: [ "$durationInMins", 60 ] }]},then: ">=45 and < 60 Mins"},
                  {case: { $gte: [ "$durationInMins", 60 ] },then: ">=60 Mins"},
                  ],
                  default: "Unknown"
              }
          }]
        }
      }
    },
    { "$group": {
      "_id": {"cnt":"$durationInMins"},
      "day":{"$last":"$day"},
      "hour":{"$last":"$hour"},
      "month":{"$last":"$month"},
      "year":{"$last":"$year"},
      "durationInMins":{"$last":"$durationInMins"},
      "countOfDurationType": {"$sum":1}
    }},
    { "$group": {
      "_id": "$hour",
      "hour":{"$last":"$hour"},
      "day":{"$last":"$day"},
      "month":{"$last":"$month"},
      "name":{$last:{$concat:[ {$cond:{ if:{ $lt: [ "$hour", 10 ] }, then:{$concat: ["0",{"$substr":["$hour",0,-1]}]}, else:{"$substr":["$hour",0,-1]} }},":00" ]}},
      "series": { "$push": { "name": "$durationInMins",  "value": "$countOfDurationType"}  }
      }},
];
}
getUserCountByUsageDurationTimeOfDayChartData(){
  console.log("In getUserCountByUsageDurationTimeOfDayChartData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempRadiusAcctActiveSessions");
      paramsForData["limit"]=-1;
      let pipeLine = [
        {"$project":{"lastUpdateTime":1,"sessionID":1,"accessTime":1,"y":{"$year":"$accessTime"},"m":{"$month":"$accessTime"},"d":{"$dayOfMonth":"$accessTime"},"w":{"$dayOfWeek":"$accessTime"},"h":{"$hour":"$accessTime"}}},
        { "$sort": {"lastUpdateTime":1}},
        { "$group": {"_id": {ses:"$sessionID"},
                //ldt:{"$last":"$lastUpdateTime"},
                hour:{"$last":"$h"},
                year:{"$last":"$y"},
                month:{"$last":"$m"},
                day:{"$last":"$d"},
                durationInMins:{"$last":{ "$divide": [ { "$subtract": [ "$lastUpdateTime", "$accessTime" ] },1000 * 60]}}
        }},
        {$sort:{durationInMins:-1}},
        {
          "$project":{
            /*ldt:1,*/year:1,month:1,day:1,hour:1,
            val:"$durationInMins",
            durationInMins:{$concat: [ {
                  $switch: {
                      branches: [
                      {case: { $lt: [ "$durationInMins", 5 ] },then: "<5 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 5 ] },{ $lt: [ "$durationInMins", 10 ] }]},then: ">=5 and < 10 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 10 ] },{ $lt: [ "$durationInMins", 20 ] }]},then: ">=10 and < 20 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 20 ] },{ $lt: [ "$durationInMins", 30 ] }]},then: ">=20 and < 30 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 30 ] },{ $lt: [ "$durationInMins", 45 ] }]},then: ">=30 and < 45 Mins"},
                      {case: {$and:[{ $gte: [ "$durationInMins", 45 ] },{ $lt: [ "$durationInMins", 60 ] }]},then: ">=45 and < 60 Mins"},
                      {case: { $gte: [ "$durationInMins", 60 ] },then: ">=60 Mins"},
                      ],
                      default: "Unknown"
                  }
              }]
            }
          }
        },
        { "$group": {
          "_id": {"cnt":"$durationInMins"},
          "day":{"$last":"$day"},
          "hour":{"$last":"$hour"},
          "month":{"$last":"$month"},
          "year":{"$last":"$year"},
          "durationInMins":{"$last":"$durationInMins"},
          "countOfDurationType": {"$sum":1}
        }},
        { "$group": {
          "_id": "$hour",
          "hour":{"$last":"$hour"},
          "day":{"$last":"$day"},
          "month":{"$last":"$month"},
          "name":{$last:{$concat:[ {$cond:{ if:{ $lt: [ "$hour", 10 ] }, then:{$concat: ["0",{"$substr":["$hour",0,-1]}]}, else:{"$substr":["$hour",0,-1]} }},":00" ]}},
          "series": { "$push": { "name": "$durationInMins",  "value": "$countOfDurationType"}  }
          }},
];
      let tempObj= pipeLine;

        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("TEST DATA...");
            console.log(JSON.stringify(res));
            this.userCountByUsageDurationDataTimeOfDay=res;
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

getUserCountByHoursDurationOfFewDaysPipeLineQuery(){
  return [
    {"$project":{"LogInTime":1,"y":{"$year":"$LogInTime"},"m":{"$month":"$LogInTime"},"d":{"$dayOfMonth":"$LogInTime"},"w":{"$dayOfWeek":"$LogInTime"},"h":{"$hour":"$LogInTime"}}},
    { "$group": {"_id": {year:"$y",month:"$m",day:"$d",hour:"$h"},
            date:{"$last":"$LogInTime"},
            year:{"$last":"$y"},
            month:{"$last":"$m"},
            day:{"$last":"$d"},
            hr:{"$last":"$h"},
            loginCountByHour:{"$sum":1}
    }},
    { "$sort": {"year":1,"month":1,"day":1,"hr":1}},
    {
      "$project":{
        date:1,year:1,month:1,day:1,hr:1,loginCountByHour:1,
        val:"$loginCountByHour",
        durationInHrsRange:{$concat: [ {
                      $switch: {
                          branches: [
                          {case: {$and:[{ $gte: [ "$hr", 0 ] },{ $lt: [ "$hr", 4 ] }]},then: "12 am to 04 am"},
                          {case: {$and:[{ $gte: [ "$hr", 4 ] },{ $lt: [ "$hr", 8 ] }]},then: "04 am to 08 am"},
                          {case: {$and:[{ $gte: [ "$hr", 8 ] },{ $lt: [ "$hr", 12 ] }]},then: "08 am to 12 pm"},
                          {case: {$and:[{ $gte: [ "$hr", 12 ] },{ $lt: [ "$hr", 16 ] }]},then: "12 pm to 04 pm"},
                          {case: {$and:[{ $gte: [ "$hr", 16 ] },{ $lt: [ "$hr", 20 ] }]},then: "04 pm to 08 pm"},
                          {case: {$and:[{ $gte: [ "$hr", 20 ] },{ $lt: [ "$hr", 24 ] }]},then: "08 pm to 12 pm"}
                          ],
                          default: "Unknown"
                      }
                  }]
        }
      }
    },
    { "$group": {
      "_id": {"cnt":"$durationInHrsRange"},
      "day":{"$last":"$day"},
      "month":{"$last":"$month"},
      "year":{"$last":"$year"},
      "date":{"$last":"$date"},
      "hr":{"$last":"$hr"},
      "durationInHrsRange":{"$last":"$durationInHrsRange"},
      "countOfDurationType": {"$sum":1}
    }},
    { "$group": {
      "_id": {"d":"$day","m":"$month","y":"$year"},
      "day":{"$last":"$day"},
      "month":{"$last":"$month"},
      "series": { "$push": { "name": "$durationInHrsRange",  "value": "$countOfDurationType"}  }
      }},
      {$addFields:{
        "name":{ $concat:[
            {
              $switch: {
                  branches: [
                  {case: {$eq: ["$_id.m", 1]},then: "Jan"},
                  {case: {$eq: ["$_id.m", 2]},then: "Feb"},
                  {case: {$eq: ["$_id.m", 3]},then: "Mar"},
                  {case: {$eq: ["$_id.m", 4]},then: "Apr"},
                  {case: {$eq: ["$_id.m", 5]},then: "May"},
                  {case: {$eq: ["$_id.m", 6]},then: "Jun"},
                  {case: {$eq: ["$_id.m", 7]},then: "Jul"},
                  {case: {$eq: ["$_id.m", 8]},then: "Aug"},
                  {case: {$eq: ["$_id.m", 9]},then: "Sep"},
                  {case: {$eq: ["$_id.m", 10]},then: "Oct"},
                  {case: {$eq: ["$_id.m", 11]},then: "Nov"},
                  {case: {$eq: ["$_id.m", 12]},then: "Dec"},
                  ],
                  default: "Unknown"
              }
            },
            " ",
            {"$substr":["$_id.d",0,-1]}
            ] }
        }}
];
}
getUserCountByHoursDurationOfFewDaysChartData(){
  console.log("In getUserCountByHoursDurationOfFewDaysChartData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempNatLogs");
      paramsForData["limit"]=-1;
      let pipeLine = [
        {"$project":{"LogInTime":1,"y":{"$year":"$LogInTime"},"m":{"$month":"$LogInTime"},"d":{"$dayOfMonth":"$LogInTime"},"w":{"$dayOfWeek":"$LogInTime"},"h":{"$hour":"$LogInTime"}}},
        { "$group": {"_id": {year:"$y",month:"$m",day:"$d",hour:"$h"},
                date:{"$last":"$LogInTime"},
                year:{"$last":"$y"},
                month:{"$last":"$m"},
                day:{"$last":"$d"},
                hr:{"$last":"$h"},
                loginCountByHour:{"$sum":1}
        }},
        { "$sort": {"year":1,"month":1,"day":1,"hr":1}},
        {
          "$project":{
            date:1,year:1,month:1,day:1,hr:1,loginCountByHour:1,
            val:"$loginCountByHour",
            durationInHrsRange:{$concat: [ {
                          $switch: {
                              branches: [
                              {case: {$and:[{ $gte: [ "$hr", 0 ] },{ $lt: [ "$hr", 4 ] }]},then: "12 am to 04 am"},
                              {case: {$and:[{ $gte: [ "$hr", 4 ] },{ $lt: [ "$hr", 8 ] }]},then: "04 am to 08 am"},
                              {case: {$and:[{ $gte: [ "$hr", 8 ] },{ $lt: [ "$hr", 12 ] }]},then: "08 am to 12 pm"},
                              {case: {$and:[{ $gte: [ "$hr", 12 ] },{ $lt: [ "$hr", 16 ] }]},then: "12 pm to 04 pm"},
                              {case: {$and:[{ $gte: [ "$hr", 16 ] },{ $lt: [ "$hr", 20 ] }]},then: "04 pm to 08 pm"},
                              {case: {$and:[{ $gte: [ "$hr", 20 ] },{ $lt: [ "$hr", 24 ] }]},then: "08 pm to 12 pm"}
                              ],
                              default: "Unknown"
                          }
                      }]
            }
          }
        },
        { "$group": {
          "_id": {"cnt":"$durationInHrsRange"},
          "day":{"$last":"$day"},
          "month":{"$last":"$month"},
          "year":{"$last":"$year"},
          "date":{"$last":"$date"},
          "hr":{"$last":"$hr"},
          "durationInHrsRange":{"$last":"$durationInHrsRange"},
          "countOfDurationType": {"$sum":1}
        }},
        { "$group": {
          "_id": {"d":"$day","m":"$month","y":"$year"},
          "day":{"$last":"$day"},
          "month":{"$last":"$month"},
          "series": { "$push": { "name": "$durationInHrsRange",  "value": "$countOfDurationType"}  }
          }},
          {$addFields:{
            "name":{ $concat:[
                {
                  $switch: {
                      branches: [
                      {case: {$eq: ["$_id.m", 1]},then: "Jan"},
                      {case: {$eq: ["$_id.m", 2]},then: "Feb"},
                      {case: {$eq: ["$_id.m", 3]},then: "Mar"},
                      {case: {$eq: ["$_id.m", 4]},then: "Apr"},
                      {case: {$eq: ["$_id.m", 5]},then: "May"},
                      {case: {$eq: ["$_id.m", 6]},then: "Jun"},
                      {case: {$eq: ["$_id.m", 7]},then: "Jul"},
                      {case: {$eq: ["$_id.m", 8]},then: "Aug"},
                      {case: {$eq: ["$_id.m", 9]},then: "Sep"},
                      {case: {$eq: ["$_id.m", 10]},then: "Oct"},
                      {case: {$eq: ["$_id.m", 11]},then: "Nov"},
                      {case: {$eq: ["$_id.m", 12]},then: "Dec"},
                      ],
                      default: "Unknown"
                  }
                },
                " ",
                {"$substr":["$_id.d",0,-1]}
                ] }
            }}
  ];
      let tempObj= pipeLine;
        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("TEST DATA...");
            console.log(JSON.stringify(res));
            this.userCountByHoursDurationData=res;
      });
    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

getUserCountTimeOfDayPipeLineQuery(){
  return [
    { "$project": {
         "y":{"$year":"$date"},
         "m":{"$month":"$date"},
         "d":{"$dayOfMonth":"$date"},
         "h":{"$hour":"$date"}
         }
    },
    {"$sort":{"h":-1}},
    { "$group":{
          "_id": {"hour":"$h"},
          value: { $sum: 1 },
          name:{$last:{$concat:[ {$cond:{ if:{ $lt: [ "$h", 10 ] }, then:{$concat: ["0",{"$substr":["$h",0,-1]}]}, else:{"$substr":["$h",0,-1]} }},":00" ]}}
      }
    }];
}
collectUserCountTimeOfDayChartData(){
  console.log("In collectUserCountTimeOfDayChartData ");
  console.log(new Date());

    try{

      var paramsForData={};
      let query={};
      //paramsForData["match"]
      paramsForData["dataQuery"]= query;
      paramsForData["filter"]= false;
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempUserRegistration");
      paramsForData["limit"]=-1;
      let pipeLine = [
        { "$project": {
             "y":{"$year":"$date"},
             "m":{"$month":"$date"},
             "d":{"$dayOfMonth":"$date"},
             "h":{"$hour":"$date"}
             }
        },
        {"$sort":{"h":-1}},
        { "$group":{
              "_id": {"hour":"$h"},
              value: { $sum: 1 },
              name:{$last:{$concat:[ {$cond:{ if:{ $lt: [ "$h", 10 ] }, then:{$concat: ["0",{"$substr":["$h",0,-1]}]}, else:{"$substr":["$h",0,-1]} }},":00" ]}}
          }
        }];
      let tempObj= pipeLine;

        paramsForData["dataQuery"]= tempObj;
        this.viewDataCollectService.getAggregatedData(paramsForData)
          .subscribe(result => {
            var res = result.data;//json();
            console.log("USER COUNT HOURS DATA...");
            console.log(JSON.stringify(res));
            //let tempObj=["","Sunday","Monday","Tueday","Wednesday","Thursday","Friday","Saturday"];
            /*res.forEach(function(element) {
              let name = String(element.name);
              if(name.length==1)
                element.name="0"+name+":00";
              else
                element.name=name+":00";
            });*/
            this.userCountTimeOfDay=res;
      });

    }
    catch(e)
    {
      console.log("Initial Data load Failed... ");
    }
}

getUserCountDayOfWeekPipeLineQuery(){
  return [
    { "$project": {
         "y":{"$year":"$date"},
         "m":{"$month":"$date"},
         "d":{"$dayOfMonth":"$date"},
         "w":{"$dayOfWeek":"$date"},
         "h":{"$hour":"$date"}
         }
    },
    {"$sort":{"w":-1}},
    { "$group":{
          "_id": {"week":"$w"},
          value: { $sum: 1 },
      }
    },
    {
         $addFields:{"name":{
          $switch: {
              branches: [
              {case: {$eq: ["$_id.week", 1]},then: "Sunday"},
              {case: {$eq: ["$_id.week", 2]},then: "Monday"},
              {case: {$eq: ["$_id.week", 3]},then: "Tueday"},
              {case: {$eq: ["$_id.week", 4]},then: "Wednesday"},
              {case: {$eq: ["$_id.week", 5]},then: "Thursday"},
              {case: {$eq: ["$_id.week", 6]},then: "Friday"},
              {case: {$eq: ["$_id.week", 7]},then: "Saturday"},
              ],
              default: "Unknown"
          }
        } }
     }
   ];
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
      paramsForData["namespace"]= this.nsObj.getNameSpace("TempUserRegistration");
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
        {"$sort":{"w":-1}},
        { "$group":{
              "_id": {"week":"$w"},
              value: { $sum: 1 },
          }
        },
        {
             $addFields:{"name":{
              $switch: {
                  branches: [
                  {case: {$eq: ["$_id.week", 1]},then: "Sunday"},
                  {case: {$eq: ["$_id.week", 2]},then: "Monday"},
                  {case: {$eq: ["$_id.week", 3]},then: "Tueday"},
                  {case: {$eq: ["$_id.week", 4]},then: "Wednesday"},
                  {case: {$eq: ["$_id.week", 5]},then: "Thursday"},
                  {case: {$eq: ["$_id.week", 6]},then: "Friday"},
                  {case: {$eq: ["$_id.week", 7]},then: "Saturday"},
                  ],
                  default: "Unknown"
              }
            } }
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
            /*res.forEach(function(element) {
              let name = String(element.name);
              element.name= String(tempObj[Number(name)]);
          });*/
            this.weekData=res;
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
        console.log("UPDATIONG CONTINUD.....");
        console.log(new Date().getTime()-this.lastUpdatedTime);
        console.log(this.stopUpdating);
        let currTime = new Date().getTime();

        /*if(((currTime-this.lastUpdatedTime)/1000)<30)
            {*/

              this.initiateDataCollection();
          /*}
          else
          {
            console.log("Not in Focus...");
            clearInterval(this.interValID);
            this.interValID="undefined";
          }*/
  }, /*60000*/this.config.dataCheckInterval);
}

dataDisplayTabChanged(e)
{
  console.log("MAIN Tab Changed...");
  console.log(e);
  this.dataDisplayTab = String(e.tabID);
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




}
