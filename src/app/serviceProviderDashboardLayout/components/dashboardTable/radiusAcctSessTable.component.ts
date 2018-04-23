import { Component, OnInit, Input, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {RadiusTableDataCollectorService} from "./radiusAcctSessTable.service";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'radius-acct-table',
  templateUrl: './radiusAcctSessTable.component.html',
  providers:	[RadiusTableDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class RadiusAcctSessionsTable implements OnInit {

      tableData :any;
    columns= [
      {
        key: 'userName',
        label: 'UserName'
      },
      {
          key:'location',
          label:'Location'
      },
      {
        key:'usedData',
        label:'Used Data'
      },
      {
          key:'accessTime',
          label:'Access Time'
      },
      {
          key:'lastUpdateTime',
          label:'Last Updated Time'
      }
      ];

@ViewChild('modal')
@Input() locationType:string;
@Input() locationName:string;
@Input() assetsData:any=[];

    modal: ModalComponent;
    //model: AddPerson = new AddPerson();

     index: number = 0;
    backdropOptions = [true, false, 'static'];
    cssClass: string = '';

    animation: boolean = true;
    keyboard: boolean = false;
    backdrop: string | boolean = 'static';
    css: boolean = false;

    selected: string;
    output: string;

    currWizardOp:string;
    currWizardData:any;
    addWizard:boolean=false;
    modifyWizard:boolean=false;
    rowsOnEachPage=5;
    replaceWithNewData=false;

   // eraseModal:boolean = false;
    interValID:any;
    lastUpdatedTime:number;
    deleteParamForSelected:any;

    nsObj: NameSpaceUtil;
    namespace:string="";
    storedData:any[]=[];
    finalParsedData:any[]=[];

    constructor(private storage:SessionStorageService, private tableDataCollectService:RadiusTableDataCollectorService
, vcRef: ViewContainerRef) {
      this.lastUpdatedTime = new Date().getTime();
    }

  ngOnInit() {
      this.nsObj = new NameSpaceUtil(this.storage);
      //console.log("assetsData");
      //console.log(this.assetsData);
      this.namespace = this.nsObj.getNameSpace("radiusAcctActiveSessions");
      //console.log("NameSpace : "+this.namespace);
      try{
        var paramsForData={};
        paramsForData["namespace"]= this.namespace;
        let query={};
            paramsForData["dataQuery"]= query;
          paramsForData["limit"]=1000;

          //this.tableDataCollectService.getData(paramsForData);
          //this.tableDataCollectService.project.subscribe(result => {
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                  var res = result;//json();
                  console.log(res);
                  //this.tableData= res.data;
                  this.storeData(res.data);
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
      this.startInterval();
}

storeData(temp:any[])
{
    console.log("in storage");
  this.storedData=temp;
  this.filterDataForCharts();
}
filterDataForCharts()
{
  //Filter data according to locs
  console.log("in filterDataForCharts");
    var temp=[];
    let locType = this.locationType;
    let loc = this.locationName;

    var apDocs = this.storedData.reduce(function(buckets,item){
			//console.log(buckets[item.sessionID]);
 			if(String(buckets[item.sessionID]) =="undefined")
		    {//console.log("Initializing....");
		     buckets[item.sessionID] = {"lastUpdateTime":0};
		    }
		    var oldTime =new Date(buckets[item.sessionID].lastUpdateTime).getTime();
		    var newTime = new Date(item.lastUpdateTime).getTime();
		    if(Number(oldTime)< Number(newTime) )
		    {
				buckets[item.sessionID] = item;
		    }
		    //console.log(buckets);
			return buckets;
		},{});
    var keys = Object.keys(apDocs);

    let docs=[];
        for(var len=0;len<keys.length;len++)
        {
            var ap = apDocs[keys[len]];
            var packets = 0;
            let packetCount = Number(ap.inputOctets)+Number(ap.outputOctets);
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
            if( (ext==" MB")&&(data>1024) )
            {
                data = data/1024; //MB
                dataStr = data.toFixed(3);
                ext=" GB";
            }

            ap.apMAC
            let currDoc = this.assetsData.filter(val=>val.macAddress==ap.apMAC);
            if(currDoc.length>0)
            {
                ap["location"] = String(currDoc[0].Building)+", "+String(currDoc[0].City);
                ap["Building"] = currDoc[0].Building;
                ap["City"] = currDoc[0].City;
                ap["Country"] = currDoc[0].Country;
                ap["Continent"] = currDoc[0].Continent;
            }
            ap["usedData"] = String(dataStr)+ext;
            ap["accessTime"] = this.getLocalDate(ap.accessTime);
            ap["lastUpdateTime"] = this.getLocalDate(ap.lastUpdateTime);
            docs.push(ap);
        }
        //console.log("docs");
        //console.log(docs);
    var filteredData = docs.reduce(function(buckets,item){
                  if(String(item[locType])===String(loc))
                    temp.push(item);
              return temp;
          },{});
    console.log("Filtered data...");
    console.log(filteredData);

    this.tableData = temp;//this.storedData; //filteredData;
  /*if(this.showChart==false)
  {
    this.showChart=true;
  } */
}
refreshData(event)
  {
    console.log("Data Table Refreshing...");

    this.filterDataForCharts();
  }

startInterval(){
  var paramsForData={};
 // console.log("In start Interval...");
  this.interValID = setInterval(() => {
      paramsForData["limit"]=-1;
      let query={};
            paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.namespace;
      let currTime = new Date().getTime();
      if(((currTime-this.lastUpdatedTime)/1000)<30)
          {
              paramsForData["limit"]=1000;

          /*this.tableDataCollectService.getData(paramsForData)
          this.tableDataCollectService.project.subscribe(result => {*/
          this.tableDataCollectService.getPostData(paramsForData)
              .subscribe(result => {
            var res = result;//.json();
            //console.log(res);
                //this.tableData= res.data;
                this.storeData(res.data);
          });
        }
        else
        {
          //console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }
    }, 10000);
}

ngOnDestroy() {
  if (this.interValID) {
    //console.log("In User Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}
resetClock(){
  if ((this.interValID)&&(this.interValID!="undefined")) {
    //console.log("REsetting to zero....");
    this.lastUpdatedTime = new Date().getTime();
  }
  else
  {
    //console.log("Creating New Interval");
    this.startInterval();
    this.lastUpdatedTime = new Date().getTime();
  }
}
selectedRowData(e)
{
  //console.log("selectedRowData");
}
selectedWizardOperation(e)
{
  //console.log("selectedWizardOperation");
}
getLocalDate(dat)
{
	var temp = new Date(dat);
	var time = String(temp.toTimeString());
	return temp.toLocaleDateString() +" "+ temp.toLocaleTimeString();

}

}

