import { Component,Input,Output,EventEmitter } from '@angular/core';
import {NameSpaceUtil} from "../../commonServices/nameSpaceUtil";
import {SessionStorageService} from "ngx-webstorage";
import {CollectionTableDataCollectorService} from "../../commonServices/tableDataCollector.service";

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    providers:	[CollectionTableDataCollectorService],
    styleUrls:['./tree.component.css']
})
export class TreeComponent {

interValID:any;
lastUpdatedTime:number;
nsObj: NameSpaceUtil;
namespace:string="";
replaceWithNewData=true;
rowsOnEachPage:number=10;
treeData:any[]=[];
@Input() treeType:string="common";
@Output() notify:EventEmitter<any>=new EventEmitter<string>();

  constructor(private storage:SessionStorageService, private tableDataCollectService:CollectionTableDataCollectorService) {
      this.lastUpdatedTime = new Date().getTime();
    }

  onEvent = (event) =>{
      //console.log(event);
      /*var locType= event.node.data.locType;
      var loc= event.node.data.key;
      var floorUUID="";
      if(locType=="floor")
      {
        floorUUID= event.node.data.floorUUID;*/
        //this.notify.emit(JSON.stringify({"locationType":locType,"location":loc,"floorUUID":floorUUID}),event);
        this.notify.emit(event);
      /*}
      else
        this.notify.emit(JSON.stringify({"locationType":locType,"location":loc}),event);*/
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
     this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("OrgUITree");
      //console.log("NameSpace : "+this.namespace);
      try{
        var paramsForData={};
        let query={};
        query["treeType"]= this.treeType;//"location";
            paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=this.rowsOnEachPage;
          /*this.tableDataCollectService.getData(paramsForData);
          this.tableDataCollectService.project.subscribe(result => {*/
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                  var res = result;//.json();
                  //console.log("Tree DAta");
                  //console.log(res.data);
                  if(this.replaceWithNewData==true)
                  {
                    this.treeData= res.data;
                    //this.replaceWithNewData=false;
                  }
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
      this.startInterval();
}
startInterval(){
  var paramsForData={};
  //console.log("In start Interval...");
  this.interValID = setInterval(() => {
    let query={};
    query["treeType"]= this.treeType//"location";
            paramsForData["dataQuery"]= query;
      paramsForData["limit"]=this.rowsOnEachPage;
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
                //console.log("Tree DAta");
                  //console.log(res.data);
                if(this.treeData.length<=0)
                {
                  if(res.data!=undefined)
                  this.treeData= res.data;
                }
          });
        }
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
        }
    }, 10000);
}

ngOnDestroy() {
  if (this.interValID) {
    console.log("In Tree Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}

}
