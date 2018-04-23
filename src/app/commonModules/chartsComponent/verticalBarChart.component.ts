import { Component,OnChanges,SimpleChanges, OnInit,ViewContainerRef, ViewEncapsulation, Input } from '@angular/core';

import { BarChart } from './barchart';
import {single} from "./data";
import {ViewDataCollectorService} from "../../commonServices/viewDataCollector.service";
import {SessionStorageService} from "ngx-webstorage"
import {NameSpaceUtil} from "../../commonServices/nameSpaceUtil";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './verticalBarChart.component.html',
  viewProviders:[ViewDataCollectorService]

})
export class VerticalBarChartComponent implements OnInit,OnChanges{

  @Input() pipeLine:any=[];
  @Input() getFrom:string="collection";
  @Input() filterData:boolean=true;

@Input() chartTitle:string;
@Input() removeChartTitle:boolean=false;
@Input() chartWidth:string="400px;";
@Input() chartHeight:string="300px;";
@Input() viewName:any;
@Input() locationType:string;
@Input() locationName:string;
@Input() yAxisLabel:string;
@Input() xAxisLabel:string;
@Input() showXAxis:boolean = true;
@Input() showYAxis:boolean = true;
@Input() showXAxisLabel:boolean = true;
@Input() showYAxisLabel:boolean = true;

  view: any[] = [250, 300];
chartData:any[]=[];
  // options

  gradient = false;
  showLegend = false;


  showChart=false;
  nsObj: NameSpaceUtil;
namespace:string="";
interValID:any;
lastUpdatedTime:number;
rowsOnEachPage:number=1000;
storedData:any[]=[];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#1052a2','#C7B42C','#55ACD2', '#391B3C','#453080',  '#6c97cb','#33FFFF','#FDD6E3', '#8CFC9D','#80deea', '#FAAD67','#FFFC63', '#b3e5fc',]
  };
  //colorScheme = {domain:[]};
config={};
  constructor(private storage:SessionStorageService,private viewDataCollectService:ViewDataCollectorService, vcRef: ViewContainerRef) {
    this.lastUpdatedTime = new Date().getTime();
    let clrs=[];
    this.config = this.storage.retrieve("configParams");
    if(this.config["colorsList"]!==undefined)
    {
      if(Array.isArray(this.config["colorsList"]))
        if(this.config["colorsList"].length>0)
          this.colorScheme.domain=this.config["colorsList"];
    }
    /*for(let i=0;i<50;i++)
      {
        var color = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ","
        + Math.floor(Math.random() * 255) + ")";
        clrs.push(color);
      }
      this.colorScheme.domain=clrs;*/
      console.log("COLORS : ");
      console.log(clrs);
  }
ngOnChanges(changes: SimpleChanges) {
  /*console.log("On changes....");
  for (let propName in changes) {
    let chng = changes[propName];
    console.log(propName);
    let cur  = JSON.stringify(chng.currentValue);
    let prev = JSON.stringify(chng.previousValue);
    console.log("Current : "+cur);
    console.log("Previous : "+prev);
  }*/
}
    ngOnInit() {

      this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.viewName;//this.nsObj.getNameSpace(this.viewName);
      console.log("NameSpace : "+this.namespace);
      try{
        var paramsForData={};
        let query={};
            paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=this.rowsOnEachPage;
        if(this.getFrom=="aggregate")
          {
            let tempObj=this.pipeLine;
            let dateObj;
            try{
              dateObj = {"$gte":String(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString()),"$lte":String(new Date().toISOString()) };
              //tempObj[0]["$match"]["date"] = dateObj;
              }
              catch(e){ }
              paramsForData["dataQuery"]= tempObj;
              this.viewDataCollectService.getAggregatedData(paramsForData)
                .subscribe(result => {
                  var res = result;//.json();
                  //this.tableData= res.data;
                  //this.showChart=true;
                  this.storeData(res.data);
            });
          }
          else
          {
            this.viewDataCollectService.getPostDataForApStats(paramsForData)
              .subscribe(result => {
                var res = result;//.json();
                //this.tableData= res.data;
                //this.showChart=true;
                this.storeData(res.data);
            });
          }

      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
      this.startInterval();
  /*
   Object.assign(this.BarChart,{chart})
    */
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

            //paramsForData["limit"]=this.rowsOnEachPage;
            if(this.getFrom=="aggregate")
                {
                  let tempObj=this.pipeLine;
                  let dateObj;
                  try{
                    dateObj = {"$gte":String(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString()),"$lte":String(new Date().toISOString()) };
                    //tempObj[0]["$match"]["date"] = dateObj;
                    }
                    catch(e){ }
                    paramsForData["dataQuery"]= tempObj;
                    this.viewDataCollectService.getAggregatedData(paramsForData)
                      .subscribe(result => {
                        var res = result;//.json();
                        //this.tableData= res.data;
                        //this.showChart=true;
                        this.storeData(res.data);
                  });
                }
                else
                {
                  this.viewDataCollectService.getPostDataForApStats(paramsForData)
                    .subscribe(result => {
                      var res = result;//.json();
                      //this.tableData= res.data;
                      //this.showChart=true;
                      this.storeData(res.data);
                  });
                }

        }
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }
    }, 300000);
}

ngOnDestroy() {
  if (this.interValID) {
    console.log("In NgxLineChart Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}

storeData(data:any)
{ console.log("Storing DAta...");
  console.log(new Date());
  console.log("Loc Type : "+this.locationType);
  console.log("Loc : "+this.locationName);
  this.storedData=data;
  console.log(this.storedData);
  if(this.filterData)
    this.filterDataForCharts();
  else
  {
    this.chartData= this.parseDocs(data);
    if(this.showChart==false)
      this.showChart=true;
  }
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
    filteredData = temp;
    //var filteredData= this.storedData;
    /*console.log("Filtered data...");
    console.log(filteredData);*/

    this.chartData= this.parseDocs(filteredData);
  if(this.showChart==false)
  {
    this.showChart=true;
  }
}

parseDocs(docs:any[])///To Avoid duplication in NAME
{
    var temp={};
			for(var len=0;len<docs.length;len++)
			{
        if(String(temp[docs[len].name])=="undefined")
          {
            if(String(docs[len].value)!="undefined")
              temp[docs[len].name] = docs[len].value;
            else
              temp[docs[len].name] = 0;
          }
        else if(String(temp[docs[len].name])!="undefined")
        {
          if(String(docs[len].value)!="undefined")
            temp[docs[len].name] = Number(temp[docs[len].name])+Number(docs[len].value);
          else
            temp[docs[len].name] = Number(temp[docs[len].name])+0;
        }
      }

      let finalData=[];
      var keys = Object.keys(temp);
			for(var len=0;len<keys.length;len++)
			{
        finalData.push({"name":String(keys[len]),"value":Number(temp[keys[len]])});
      }
      /*if(keys.length<1)
      {
        finalData.push({"name":"Model","value":Number(1)});
      }*/
  return finalData;
}
  refreshData(event)
  {
    /*console.log("In Bar Chart refresh...");
    console.log("Loc Type : "+this.locationType);
    console.log("Loc : "+this.locationName);*/
    this.filterDataForCharts();
  }

  onSelect(event) {
    console.log(event);
  }

  }
