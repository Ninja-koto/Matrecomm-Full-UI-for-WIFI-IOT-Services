import { Component, OnInit, Input, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {NameSpaceUtil} from "../../commonServices/nameSpaceUtil";
import {DashboardTableDataCollectorService} from "./dashboardTable.service";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'dashboard-table',
  templateUrl: './dashboardTable.component.html',
  providers:	[DashboardTableDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class DashboardCollectionTable implements OnInit {

      tableData :any=[];
    /*columns= [
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
      ];*/

@ViewChild('modal')
@Input() locationType:string;
@Input() locationName:string;
@Input() tableTitle:string="";
@Input() assetsData:any=[];
@Input() assignedTo:string="";//Location, Vehcile, Common
@Input() collName:string="";
@Input() columns:any=[];
@Input() deviceID:string="";
@Input() dateRange:any={};
@Input() dataType="radius";
    assetMACs:any=[];

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

    constructor(private storage:SessionStorageService, private tableDataCollectService:DashboardTableDataCollectorService
, vcRef: ViewContainerRef) {
      this.lastUpdatedTime = new Date().getTime();
    }

  ngOnInit() {
    //console.log("DB TABLE NG ON INIT");
    let macs=[];
    this.assetsData.forEach(asset => {
      macs.push(asset.macAddress);
    });
    this.assetMACs= macs;


      this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace(this.collName);
      this.collectData();
      this.startInterval();
}

collectData(){
  try{
    console.log("IN collectdata");
          var paramsForData={};
          let query=this.dateRange;
          console.log(this.dateRange);
          if(this.dataType=="radius")
            query["apMAC"]={"$in":this.assetMACs};
          else
            query["macAddress"]={"$in":this.assetMACs};
          console.log("DASHBOARD TABLE");
          console.log("QUERY : ");
          console.log(query);
          paramsForData["dataQuery"]= query;
          paramsForData["namespace"]= this.namespace;
          paramsForData["limit"]=10000;

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
}

startInterval(){
  this.interValID = setInterval(() => {
      let currTime = new Date().getTime();
      if(((currTime-this.lastUpdatedTime)/1000)<90)
          {
              this.collectData();
        }
        else
        {
          //console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }
    }, 5000);
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
  console.log("in filterDataForTable");
  console.log(this.storedData);
    var temp=[];
    let locType = this.locationType;
    let loc = this.locationName;
let deviceID = this.deviceID;
    if(locType=="vehicle")
    {console.log("Filtering with MACs");
    console.log("Device ID : ",deviceID);
      locType = "apMAC";
      loc = deviceID;
    }
    else
    {
      console.log("vehicle not found in filtering...");
      console.log(deviceID);
    }
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
                if(this.assignedTo=="Vehicle")
                {
                  if(this.locationType=="vehicle")
                  ap["location"] = this.locationName;
                  else
                  ap["location"] = String(currDoc[0].City);
                }
                else if(this.assignedTo=="Location")
                  ap["location"] = String(currDoc[0].Building)+", "+String(currDoc[0].City);
                else if(this.assignedTo=="Common")
                  ap["location"] = String(currDoc[0].Building)+", "+String(currDoc[0].City);
                else if(this.assignedTo=="")
                  ap["location"] = "";
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

