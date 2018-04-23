import { Component, OnInit, Input, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { CollectionTableDataCollectorService } from '../../commonServices/tableDataCollector.service';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {NameSpaceUtil} from "../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'db-ba-asset-table',
  templateUrl: './dashboardBasicAssetTable.component.html',
  providers:	[CollectionTableDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class DashboardBasicAssetTable implements OnInit {

      tableData :any=[];
    columns= [
      {
        key: 'macAddress',
        label: 'Asset ID'
      },
      {
        key: 'Building',
        label: 'Building'
      },
      {
        key: 'City',
        label: 'City'
      },
      {
        key: 'Country',
        label: 'Country'
      }
      ]

@ViewChild('modal')
@Input() locationType:string;
@Input() locationName:string;
@Input() collName:string="";
@Input() assetsData:any=[];
@Input() tableTitle:string="";
@Input() dateRange:any={};
@Input() dataType="radius";
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


        this.storeData(this.storedData);

      }
      catch(e)
      {
        //console.log("Initial Data load Failed... ");
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

    let docs=[];
        for(var len=0;len<this.assetsData.length;len++)
        {
            var ap = this.assetsData[len];

            if(this.assignedTo=="Vehicle")
            {
              if(this.locationType=="vehicle")
              ap["location"] = this.locationName;
              else
              ap["location"] = String(ap.City);
            }
            else if(this.assignedTo=="Location")
              ap["location"] = String(ap.Building)+", "+String(ap.City);
            else if(this.assignedTo=="Common")
              ap["location"] = String(ap.Building)+", "+String(ap.City);
            else if(this.assignedTo=="")
              ap["location"] = "";
            ap["Building"] = ap.Building;
            ap["City"] = ap.City;
            ap["Country"] = ap.Country;
            ap["Continent"] = ap.Continent;

            //ap["accessTime"] = this.getLocalDate(ap.accessTime);
            //ap["lastUpdateTime"] = this.getLocalDate(ap.lastUpdateTime);
            docs.push(ap);
        }
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
    console.log("In User Component Destroying Set Interval...");
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

