import { Component, OnInit,Input, OnChanges, SimpleChanges} from '@angular/core';
import * as jQuery from "jquery";
import { DatePipe } from '@angular/common';
import {ViewDataCollectorService} from "../commonServices/viewDataCollector.service";
import {SessionStorageService} from "ngx-webstorage"
import {NameSpaceUtil} from "../commonServices/nameSpaceUtil";

@Component({
  selector: 'upTime-chart',
  templateUrl: './upTimeChart.component.html',
  providers:[DatePipe, ViewDataCollectorService]
  //styles:[
    //'.abc {overflow-y:hidden}',
   // '.abc:hover {overflow-y:auto}'
   // ]
})
export class UpTimeChartComponent implements OnInit, OnChanges{
  currentData: any[];
  storedData:any[]=[];
  showChart:boolean=false;
  view: any[] = [1000, 300];

  // options


  gradient = false;

  /*colorScheme = {
    domain: ['#5AA454', '#A10A28', '#1052a2','#C7B42C','#55ACD2', '#391B3C','#453080',  '#6c97cb','#33FFFF','#FDD6E3', '#8CFC9D','#80deea', '#FAAD67','#FFFC63', '#b3e5fc',]
  };*/
  colorScheme = {domain:[]};

  // line, area
  @Input() roundChartsDate:Boolean=false;
  @Input() removeChartTitle:boolean=false;
  @Input() startDate:any="";
  @Input() endDate:any="";
  @Input() rawData:any=[];
  @Input() viewName:any;
  @Input() pipeLine:any=[];
  @Input() getFrom:string="collection";
  @Input() chartTitle:string;
  @Input() lTitle:string="Legend";
  @Input() yAxisLabel:string;
  @Input() timeLine:boolean=false;
  @Input() xAxisLabel:string;
  @Input() showXAxis:boolean = true;
  @Input() showYAxis:boolean = false;
  @Input() showLegend:boolean = false;
  @Input() showXAxisLabel:boolean = true;
  @Input() showYAxisLabel:boolean = true;
  @Input() chartHeight:string="300px";

nsObj: NameSpaceUtil;
namespace:string="";
interValID:any;
lastUpdatedTime:number;
rowsOnEachPage:number=1000;
config:any={};

  constructor(private datePipe: DatePipe,private storage:SessionStorageService,private viewDataCollectService:ViewDataCollectorService) {
    this.lastUpdatedTime = new Date().getTime();
    let clrs=[];
    for(let i=0;i<50;i++)
      {
        var color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
        + Math.floor(Math.random() * 255) + ")";
        clrs.push(color);
      }
      this.colorScheme.domain=clrs;
      this.config = this.storage.retrieve("configParams");
      /*console.log("COLORS : ");
      console.log(clrs);
      console.log(this.config.dataCheckInterval);*/
  }
  ngOnInit(){
    this.nsObj = new NameSpaceUtil(this.storage);
    this.namespace = this.viewName;//this.nsObj.getNameSpace(this.viewName);
    console.log("NameSpace : "+this.namespace);
    this.initiateDataCollection();
    //this.startInterval();
    //this.currentData = this.dataParser.getDataForMultiLineChart(this.rawData,this.keySelector,this.xAxisDataType,this.yAxisDataType);
    //Object.assign(this, {multi});
    Object.assign(this);
  }
  initiateDataCollection(){
    /*console.log("Line Chart Init ");
    console.log(new Date());*/

      try{

        var paramsForData={};
        let query={};
        //paramsForData["match"]
        paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=-1;
        let currDate = new Date();
        let tempEnd = new Date(this.endDate);
        if( (currDate.getFullYear()==tempEnd.getFullYear())&&
        (currDate.getMonth()==tempEnd.getMonth())&&
        (currDate.getDate()==tempEnd.getDate()) )
        {
          console.log("STOP UPDATING ");
          this.endDate=new Date().toISOString();
        }
        paramsForData["startDate"]=this.startDate;
        paramsForData["endDate"]=this.endDate;

            let tempObj=this.pipeLine;
            console.log("IN CHART PIPELINE");
            console.log(JSON.stringify(paramsForData));
            let dateObj;
              paramsForData["dataQuery"]= tempObj;
              this.viewDataCollectService.getAggregatedDataForUpTime(paramsForData)
                .subscribe(result => {
                  var res = result;//.json();
                  //this.tableData= res.data;
                  //this.showChart=true;
                  console.log(res.data);
                  this.storeData(res.data);
            });

      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }

  }
ngOnChanges(change:SimpleChanges){
    //console.log("In NGX Line SimpleChanges...")
    //console.log(change);
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
    this.initiateDataCollection();
    }, /*60000*/this.config.dataCheckInterval);
}

storeData(data:any)
{ /*console.log("Storing DAta...");
  console.log(new Date());
  console.log(data);*/
  /*console.log("Loc Type : "+this.locationType);
  console.log("Loc : "+this.locationName);*/
  this.storedData=data;
  console.log(this.storedData);
  //if(this.filterData)
    this.filterDataForCharts();
  /*else
  {
    this.currentData= data;
    if(this.showChart==false)
      this.showChart=true;
  }*/
      //this.filterDataForCharts();
}
filterDataForCharts()
{
  //Filter data according to locs
  if(this.roundChartsDate){
    console.log("ROUNDING CHARTS DATA");
    console.log(new Date());
    /*this.storedData.forEach(element => {
      //element.series.forEach(inner => inner["name"]= new Date(inner.name));
      /*element.series.forEach(inner => {
        ///ROUNDING OF DATE TO NEAREST 1 MINUTE
        var coeff = 1000 * 60 * 1;
        var date = new Date(inner.name);  //or use any other date
        var rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
        inner["name"]= new Date(inner.name);
        if((inner.value==undefined)||(inner.value==""))
          inner["value"]=0;
      });***
    });*/
    console.log(new Date());
  }
    console.log("Filtered data...");
    console.log(this.storedData);
    //console.log(new Date());
//console.log(filteredData);
    this.currentData= this.storedData;
    /*this.currentData=[{ "_id" : { "macAddress" : "84d47ec3fca0", "Country" : "India", "Continent" : "Asia", "City" : "Bengaluru", "Building" : "MatreComm" }, "series" : [ { "name" : "2017-09-21T12:20:34Z", "value" : 124.93074893951416 }, { "name" : "2017-09-21T12:21:40Z", "value" : 124.93074893951416 }, { "name" : "2017-09-21T12:33:37Z", "value" : 124.93074893951416 }, { "name" : "2017-09-21T12:36:38Z", "value" : 124.93074893951416 } ], "name" : "Transmit", "Country" : "India", "Continent" : "Asia", "City" : "Bengaluru", "Building" : "MatreComm", "macAddress" : "84d47ec3fca0" },
    { "_id" : { "macAddress" : "84d47ec3fca0", "Country" : "India", "Continent" : "Asia", "City" : "Bengaluru", "Building" : "MatreComm" }, "series" : [ { "name" : "2017-09-21T12:20:34Z", "value" : 18.322985649108887 }, { "name" : "2017-09-21T12:21:40Z", "value" : 18.322985649108887 }, { "name" : "2017-09-21T12:33:37Z", "value" : 18.322985649108887 }, { "name" : "2017-09-21T12:36:38Z", "value" : 18.322985649108887 } ], "name" : "Receive", "Country" : "India", "Continent" : "Asia", "City" : "Bengaluru", "Building" : "MatreComm", "macAddress" : "84d47ec3fca0" }]*/
  if(this.showChart==false)
  {
    //this.currentData = this.storedData;
    this.showChart=true;
  }
}
  refreshData(event)
  {
    /*console.log("In Line Chart refresh...");
    console.log("Loc Type : "+this.locationType);
    console.log("Loc : "+this.locationName);*/
    //this.filterDataForCharts();
    this.initiateDataCollection();
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
    //console.log(value);
    //console.log(this.datePipe.transform(e, 'short'));
    /*let temp = new Date(value);
    console.log(value);
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
    let hr = new Date(value).getHours();
    let min = new Date(value).getMinutes();
    //console.log(hr +" : "+min );

    if((String(hr)=="0")&&(String(min)=="0"))
      return new Date(value).toLocaleDateString();
    else
    {
    let time = new Date(value).toLocaleTimeString();
    let tail = "";
    if((time.indexOf("AM")>0)||(time.indexOf("am")>0))
      tail = "AM";
    else if ((time.indexOf("PM")>0)||(time.indexOf("pm")>0))
      tail = "PM";
    time = time.substring(0,time.lastIndexOf(":"));

    return time+" "+tail;
    }
    //return new Date(value).toLocaleTimeString();
  }
  showTimeLine(e)
  {
    /*console.log("In show TimeLine....");
    console.log(e);*/
    this.timeLine=true;
  }
  hideTimeLine(e)
  {
    /*console.log("In hide TimeLine....");
    console.log(e);*/
    this.timeLine=false;
  }
}
