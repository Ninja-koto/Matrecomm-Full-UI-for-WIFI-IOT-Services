import { Component, OnInit, Input, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../../commonServices/tableDataCollector.service';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {NameSpaceUtil} from "../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'db-users-table',
  templateUrl: './dashboardUsersTable.component.html',
  providers:	[CollectionTableDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class DashboardUsersTable implements OnInit {

      tableData :any=[];
@ViewChild('modal')
@Input() locationType:string;
@Input() locationName:string;
@Input() collName:string="";
@Input() assetsData:any=[];
@Input() tableTitle:string="";
@Input() dateRange:any={};
@Input() dataType="radius";
@Input() columns:any=[];
@Input() assignedTo:string="";
@Input() deviceID:string="";
@Input() pipeline:any=[];
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
    assetMACs:any=[];
    queryResponse:any=[];

    constructor(private storage:SessionStorageService, private tableDataCollectService:CollectionTableDataCollectorService
, vcRef: ViewContainerRef) {
      this.lastUpdatedTime = new Date().getTime();
    }

  ngOnInit() {
      this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace(this.collName);
      //console.log("NameSpace : "+this.namespace);
      let macs=[];
      this.assetsData.forEach(asset => {
        macs.push(asset.macAddress);
      });
      this.assetMACs= macs;
      this.collectData();
}

collectData(){
      try{

        var paramsForData={};
        let query={};
        //paramsForData["match"]
        paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=-1;
        paramsForData["dataQuery"]= this.pipeline; /*[
            {"$sort":{"lastUpdateTime":1}},
            {$project: {"lastUpdateTime":1,"sessionID":1,apMAC:1,inputOctets:1,outputOctets:1,userName:1,accessTime:1,userIPAddress:1}},
            {
                "$group":{
                            "_id":"$sessionID",
                            "value":{$max:{
                            "$sum":{"$divide":[{"$add":["$inputOctets","$outputOctets"]},1048576]}
                            }},
                            lastUpdateTime : {$first:"$lastUpdateTime"},
                            apMAC:{$first:"$apMAC"},
                            userName:{$first:"$userName"},
                            accessTime:{$first:"$accessTime"},
                            userIPAddress: {$first:"$userIPAddress"}
                        }
            },
            {$addFields:{"usedData":{ $concat:[{"$substr":["$value",0,-1]}," MB"] } }}
        ];*/
        this.tableDataCollectService.getAggregatedData(paramsForData)
            .subscribe(result => {
              var res = result;//.json();
              //this.tableData= res.data;
              //this.showChart=true;
              //console.log("RESULT");
              //console.log(res);
              this.queryResponse = res.data;
              //console.log(this.assetsData);
              this.storeData(res.data);
        });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
}

storeData(temp:any[])
{
  this.storedData=temp;
  this.filterDataForCharts();
}
filterDataForCharts()
{
  //Filter data according to locs
  //console.log("in filterDataForTable");
  //console.log(this.storedData);
    var temp=[];
    let locType = this.locationType;
    let loc = this.locationName;
let deviceID = this.deviceID;
    if(locType=="vehicle")
    {//console.log("Filtering with MACs");
    //console.log("Device ID : ",deviceID);
      locType = "apMAC";
      loc = deviceID;
    }
    else
    {
      //console.log("vehicle not found in filtering...");
      //console.log(deviceID);
    }

    let assetUsedData={};
    let docs=[];
    this.queryResponse.forEach(element => {

        let currDoc = this.assetsData.filter(val=>val.macAddress==element.apMAC);

        var ext="";
        let usedData=0;
        if(element.value!=undefined)
            usedData = element.value;
        var data = usedData; //MB
        ext=" MB";
        data = Math.round(data);
        var dataStr= data.toFixed(3);

        if( (ext==" MB")&&(data>1024) )
        {
            data = data/1024; //MB
            dataStr = data.toFixed(3);
            ext=" GB";
        }

        if(currDoc.length>0)
        {
            if(this.assignedTo=="Vehicle")
            {
              if(this.locationType=="vehicle")
                element["location"] = this.locationName;
              else
                element["location"] = String(currDoc[0].City);
            }
            else if(this.assignedTo=="Location")
                element["location"] = String(currDoc[0].Building)+", "+String(currDoc[0].City);
            else if(this.assignedTo=="Common")
                element["location"] = String(currDoc[0].Building)+", "+String(currDoc[0].City);
            else if(this.assignedTo=="")
                element["location"] = "";
            element["Building"] = currDoc[0].Building;
            element["City"] = currDoc[0].City;
            element["Country"] = currDoc[0].Country;
            element["Continent"] = currDoc[0].Continent;
        }
        element["usedData"] = String(dataStr)+ext;
        element["accessTime"] = this.getLocalDate(element.accessTime);
        element["lastUpdateTime"] = this.getLocalDate(element.lastUpdateTime);
        docs.push(element);;
    });

        //console.log("docs");
        //console.log(docs);
    var filteredData = docs.reduce(function(buckets,item){
                  if(String(item[locType])===String(loc))
                    temp.push(item);
              return temp;
          },{});
    //console.log("Filtered data...");
    //console.log(filteredData);

    this.tableData = temp;//this.storedData; //filteredData;
  /*if(this.showChart==false)
  {
    this.showChart=true;
  } */
}
refreshData(event)
  {
    //console.log("Data Table Refreshing...");

    this.collectData();
  }
  filterChartData(event)
  {
    //console.log("In Bar Chart filter...");
    this.filterDataForCharts();
  }

  startInterval(){
    this.interValID = setInterval(() => {
        let currTime = new Date().getTime();
        //if(((currTime-this.lastUpdatedTime)/1000)<90)
          //  {
                this.collectData();
          /*}
          else
          {
            //console.log("Not in Focus...");
            clearInterval(this.interValID);
            this.interValID="undefined";
          }*/
      }, 5000);
  }

ngOnDestroy() {
  if (this.interValID) {
    //console.log("In User Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}
resetClock(){
  if ((this.interValID)&&(this.interValID!="undefined")) {
    console.log("REsetting to zero....");
    this.lastUpdatedTime = new Date().getTime();
  }
  else
  {
    console.log("Creating New Interval");
    this.startInterval();
    this.lastUpdatedTime = new Date().getTime();
  }
}
selectedRowData(e)
{
  console.log("selectedRowData");
}
selectedWizardOperation(e)
{
  console.log("selectedWizardOperation");
}
getLocalDate(dat)
{
	var temp = new Date(dat);
	var time = String(temp.toTimeString());
	return temp.toLocaleDateString() +" "+ temp.toLocaleTimeString();

}

}

