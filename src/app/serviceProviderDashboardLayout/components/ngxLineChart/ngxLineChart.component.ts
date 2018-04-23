import { Component, OnInit,Input, OnChanges, SimpleChanges} from '@angular/core';
import {multi} from './data'
import * as jQuery from "jquery";
import {DashBoardDataParser} from "../../../commonServices/dashboardDataParserForCharts";
import { DatePipe } from '@angular/common';
import {ViewDataCollectorService} from "../../../commonServices/viewDataCollector.service";
import {SessionStorageService} from "ngx-webstorage"
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";

@Component({
  selector: 'app-ngxline-chart',
  templateUrl: './ngxLineChart.component.html',
  providers:[DatePipe, ViewDataCollectorService]
  //styles:[
    //'.abc {overflow-y:hidden}',
   // '.abc:hover {overflow-y:auto}'
   // ]
})
export class NgxLineChartComponent implements OnInit, OnChanges{
  currentData: any[];
  storedData:any[];
  showChart:boolean=false;
  view: any[] = [1000, 300];

  // options


  gradient = false;


  dataParser:DashBoardDataParser;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#1052a2','#C7B42C','#55ACD2', '#391B3C','#453080',  '#6c97cb','#33FFFF','#FDD6E3', '#8CFC9D','#80deea', '#FAAD67','#FFFC63', '#b3e5fc',]
  };

  // line, area
  @Input() removeChartTitle:boolean=false;
  @Input() viewName:any;
  @Input() chartTitle:string;
  @Input() lTitle:string="Legend";
  @Input() yAxisLabel:string;
  @Input() timeLine:boolean=false;
  @Input() xAxisLabel:string;
  @Input() locationType:string="Country";
  @Input() locationName:string="India";
  @Input() showXAxis:boolean = true;
  @Input() showYAxis:boolean = true;
  @Input() showLegend:boolean = true;
  @Input() showXAxisLabel:boolean = true;
  @Input() showYAxisLabel:boolean = true;
  @Input() chartHeight:string="300px";
  @Input() filterData:boolean=true;

nsObj: NameSpaceUtil;
namespace:string="";
interValID:any;
lastUpdatedTime:number;
rowsOnEachPage:number=1000;

  constructor(private datePipe: DatePipe,private storage:SessionStorageService,private viewDataCollectService:ViewDataCollectorService) {
    this.dataParser = new DashBoardDataParser();
    this.lastUpdatedTime = new Date().getTime();
  }
  ngOnInit(){
    this.initiateDataCollection();
  }
  initiateDataCollection(){
    console.log("Line Chart Init ");
    console.log(new Date());
    console.log("Loc Type : "+this.locationType);
    console.log("Loc : "+this.locationName);
      this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.viewName;//this.nsObj.getNameSpace(this.viewName);
      console.log("NameSpace : "+this.namespace);
      try{
        var paramsForData={};
        let query={};
            paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=this.rowsOnEachPage;
            this.viewDataCollectService.getPostData(paramsForData)
              .subscribe(result => {
                var res = result;//.json();
                //this.tableData= res.data;
                //this.showChart=true;
                this.storeData(res.data);
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
      this.startInterval();
    //this.currentData = this.dataParser.getDataForMultiLineChart(this.rawData,this.keySelector,this.xAxisDataType,this.yAxisDataType);

    //Object.assign(this, {multi});
    Object.assign(this);
  }
ngOnChanges(change:SimpleChanges){
    console.log("In NGX Line SimpleChanges...")
    console.log(change);
    //this.initiateDataCollection();
  }
ngOnDestroy() {
  if (this.interValID) {
    console.log("In NgxLineChart Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
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
      if(((currTime-this.lastUpdatedTime)/1000)<100)
          {
              paramsForData["limit"]=this.rowsOnEachPage;
                this.viewDataCollectService.getPostData(paramsForData)
              .subscribe(result => {
                var res = result;
                    console.log("Dashboard Data...");
                      console.log(res.data);
                      this.storeData(res.data);
              });
        }
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }
    }, 300000);
}

storeData(data:any)
{ //console.log("Storing DAta...");
  console.log(new Date());
  /*console.log("Loc Type : "+this.locationType);
  console.log("Loc : "+this.locationName);*/
  this.storedData=data;
  console.log(this.storedData);
  this.filterDataForCharts();
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

    //console.log(new Date());
    filteredData=temp;
    filteredData.forEach(element => {
      element.series.forEach(inner => {
        ///ROUNDING OF DATE TO NEAREST 5 MINUTES
        var coeff = 1000 * 60 * 5;
        var date = new Date(inner.name);  //or use any other date
        var rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
        inner["name"]=rounded;
      });
    });
    console.log("Filtered data...");
    console.log(filteredData);
    //console.log(new Date());
//console.log(filteredData);
if(this.filterData)
    this.currentData= filteredData;
  else
    this.currentData= this.storedData;
console.log("Line Chart Filtered Data...")
console.log(this.currentData);
  if(this.showChart==false)
  {
    //this.currentData = this.storedData;
    this.showChart=true;
  }
}
  refreshData(event)
  {
    console.log("In Line Chart refresh...");
    /*console.log("Loc Type : "+this.locationType);
    console.log("Loc : "+this.locationName);*/
    this.filterDataForCharts();
  }
  onSelect(event) {
    //console.log("on onSelect");
    //console.log(event);
  }
  onActive(event){
    //console.log("In onActive");
    //console.log(event);
  }
  onDeactivate(event){
    //console.log("In onDeactivate");
    //console.log(event);
  }
  xAxisTickFormattingFun(value)
  {
    //console.log(this.datePipe.transform(e, 'short'));
    /*let temp = new Date(value);
    let hr= temp.getHours();
    let min = temp.getMinutes();
    if((Number(min)>=0)&&(Number(min)<=15))
      min=0;
    else if((Number(min)>15)&&(Number(min)<=45))
      min=30;
    else if((Number(min)>45)&&(Number(min)<=59))
    {
      min=0;
      hr= hr+1;
    }
    if(min==0)
      return String(hr);
    else
      return String(hr)+" : "+String(min);*/
    let time = new Date(value).toLocaleTimeString();
    let tail = "";
    if((time.indexOf("AM")>0)||(time.indexOf("am")>0))
      tail = "AM";
    else if ((time.indexOf("PM")>0)||(time.indexOf("pm")>0))
      tail = "PM";
    time = time.substring(0,time.lastIndexOf(":"));

    return time+" "+tail;
  }
  showTimeLine(e)
  {
    console.log("In show TimeLine....");
    console.log(e);
    this.timeLine=true;
  }
  hideTimeLine(e)
  {
    console.log("In hide TimeLine....");
    console.log(e);
    this.timeLine=false;
  }
}
