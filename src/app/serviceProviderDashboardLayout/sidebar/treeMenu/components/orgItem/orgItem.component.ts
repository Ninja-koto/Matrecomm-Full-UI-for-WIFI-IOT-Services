import 'style-loader!./orgItem.scss';
import { Component,Input,Output,EventEmitter } from '@angular/core';
import {NameSpaceUtil} from "../../../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from "ngx-webstorage";
import {CollectionTableDataCollectorService} from "../../../../../commonServices/tableDataCollector.service";

@Component({
  selector: 'org-item',
  templateUrl: './orgItem.html',
  providers:	[CollectionTableDataCollectorService],
})
export class OrgItem {
  interValID:any;
lastUpdatedTime:number;
nsObj: NameSpaceUtil;
namespace:string="";
replaceWithNewData=true;
rowsOnEachPage:number=1000;
treeData:any[]=[];

@Output() notify:EventEmitter<any>=new EventEmitter<string>();

  constructor(private storage:SessionStorageService, private tableDataCollectService:CollectionTableDataCollectorService) {
      this.lastUpdatedTime = new Date().getTime();
    }

  onEvent = (event) =>{
        this.notify.emit(event);
  }

  options = {
  allowDrag: false,
  displayField: 'key',
  childrenField: 'values',
  idField: 'uuid',
  allowDrop: (element, to) =>{
    // return true / false based on element, to.parent, to.index. e.g.
    return to.parent.hasChildren;
  }
};

onMoveNode($event) {
  console.log(
    "Moved",
    $event.node.key,
    "to",
    $event.to.parent.key,
    "at index",
    $event.to.index);
};

ngOnInit() {
     this.initiateDataCollection();
}
startInterval(){
  var paramsForData={};
  //console.log("In start Interval...");
  this.interValID = setInterval(() => {
      paramsForData["limit"]=this.rowsOnEachPage;
      let query={};
            paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.namespace;
      let currTime = new Date().getTime();
      if(((currTime-this.lastUpdatedTime)/1000)<200)
          {
              paramsForData["limit"]=this.rowsOnEachPage;
          /*this.tableDataCollectService.getData(paramsForData)
          this.tableDataCollectService.project.subscribe(result => {*/
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                var res = result;
                if(this.replaceWithNewData==true)
                  {
                  let orgs=[];
                    res.data.forEach(org => {
                      orgs.push({
                          "key" : org.organizationName,
                          "type":org.orgType,
                          "city":org.orgCity,
                          "country":org.orgCountry,
                          "orgUUID" : org.uuid
                      });
                    });
                    let tData=[];
                    tData.push({"key":"Organizations","values":orgs})
                    console.log("Organization Tree Data...");
                    console.log(tData);
                    this.treeData= tData;//res.data;
                }
          });
        }
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
          this.replaceWithNewData=true;
        }
    }, 10000);
}
initiateDataCollection(){
this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("OrgProfile");
      //console.log("NameSpace : "+this.namespace);
      try{
        var paramsForData={};
        let query={};
            paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=this.rowsOnEachPage;
          /*this.tableDataCollectService.getData(paramsForData);
          this.tableDataCollectService.project.subscribe(result => {*/
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                  var res = result;//.json();
                  if(this.replaceWithNewData==true)
                  {
                    let orgs=[];
                    res.data.forEach(org => {
                      orgs.push({
                          "key" : org.organizationName,
                          "type":org.orgType,
                          "city":org.orgCity,
                          "country":org.orgCountry,
                          "orgUUID" : org.uuid
                      });
                    });
                    let tData=[];
                    tData.push({"key":"Organizations","values":orgs})
                    console.log("Organization Tree Data...");
                    console.log(tData);
                    this.treeData= tData;//res.data;
                    this.replaceWithNewData=false;
                }
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
      this.startInterval();
}
orgTreeDivClicked(e)
{
  /*console.log("In orgTreeDivClicked");
  console.log(e);
  if(String(this.interValID)!="undefined")
    clearInterval(this.interValID);
  this.interValID="undefined";
  this.replaceWithNewData=true;
  this.initiateDataCollection();*/
}
ngOnDestroy() {
  if (this.interValID) {
    console.log("In Tree Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}

}
