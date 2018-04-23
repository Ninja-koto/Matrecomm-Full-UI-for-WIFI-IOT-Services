import { Component,Input,Output,EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import {NameSpaceUtil} from "../../commonServices/nameSpaceUtil";
import {SessionStorageService} from "ngx-webstorage";
import {CollectionTableDataCollectorService} from "../../commonServices/tableDataCollector.service";

@Component({
    selector: 'asset-tree',
    templateUrl: './assetTree.component.html',
    providers:	[CollectionTableDataCollectorService],
    styleUrls:['./assetTree.component.scss']
})
export class AssetTreeComponent implements OnChanges {

interValID:any;
lastUpdatedTime:number;
nsObj: NameSpaceUtil;
namespace:string="";
replaceWithNewData=true;
rowsOnEachPage:number=10000;
@Input() treeData:any=[];
storedAssetTreeData:any=[];
@Input() floorUUID:string="";
@Input() errMsg:string="";
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
ngOnChanges(changes: SimpleChanges) {
  //console.log("Asset Tree On changes....");
  for (let propName in changes) {
    let chng = changes[propName];
    //console.log(chng);
    let cur  = JSON.stringify(chng.currentValue);
    let prev = JSON.stringify(chng.previousValue);
    /*if(String(propName)=="floorUUID")
      this.filterAssetTreeData();*/
  }
}
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
}


ngOnDestroy() {
  if (this.interValID) {
    console.log("In Tree Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}

}
