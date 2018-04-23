import { Component,OnChanges,SimpleChanges, OnInit,ViewContainerRef, ViewEncapsulation, Input } from '@angular/core';
import { BarchartService } from './verticalBarChart.service';
import { BarChart } from './barchart';
import {single} from "./data";
import {ViewDataCollectorService} from "../../../commonServices/viewDataCollector.service";
import {SessionStorageService} from "ngx-webstorage"
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './verticalBarChart.component.html',
  viewProviders:[ViewDataCollectorService]

})
export class VerticalBarChartComponent implements OnInit,OnChanges{


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

  constructor(private storage:SessionStorageService,private viewDataCollectService:ViewDataCollectorService, vcRef: ViewContainerRef) {
    this.lastUpdatedTime = new Date().getTime();
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
            this.viewDataCollectService.getPostData(paramsForData)
              .subscribe(result => {
                var res = result;
                this.storeData(res.data);
          });
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
  console.log(this.namespace);
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
{ /*console.log("Storing DAta...");
  console.log(new Date());
  console.log("Loc Type : "+this.locationType);
  console.log("Loc : "+this.locationName);*/
  this.storedData=data;
  //console.log(this.storedData);
  this.filterDataForCharts();
}
filterDataForCharts()
{
  //Filter data according to locs
    var temp=[];
    let locType = this.locationType;
    let loc = this.locationName;
    /*var filteredData = this.storedData.reduce(function(buckets,item){
                  if(String(item[locType])===String(loc))
                    temp.push(item);
              return temp;
          },{});*/

    this.chartData= this.storedData; //this.parseDocs(filteredData);
    console.log("Filtered data...");
    console.log(this.chartData);
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
          temp[docs[len].name] = docs[len].value;
        else if(String(temp[docs[len].name])!="undefined")
        {
          temp[docs[len].name] = Number(temp[docs[len].name])+Number(docs[len].value);
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
