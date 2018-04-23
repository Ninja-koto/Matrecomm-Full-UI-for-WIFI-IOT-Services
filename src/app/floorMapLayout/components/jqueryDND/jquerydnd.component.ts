import { Component,OnInit,Output,EventEmitter, ViewChild,Input, ElementRef, Inject,AfterViewChecked,ViewContainerRef, ViewEncapsulation} from '@angular/core';

//import * as $ from 'jquery';
import * as $ from "jquery";
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from 'ngx-webstorage';
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';

import * as h from "../../../js/heatmap.js"


//declare var jQuery:any;
//declare var $:any;
@Component({
    selector: 'jquery-dnd',
    templateUrl: './jquerydnd.component.html',
     styleUrls:['./jquerydnd.component.scss'],
     providers:[CollectionTableDataCollectorService],
    encapsulation: ViewEncapsulation.None

})



export class jqueryDragAndDropComponent implements OnInit{
  @ViewChild('validationModal')
  //@ViewChild("chessCanvas") chessCanvas: ElementRef;
  modal: ModalComponent;
  animation: boolean = true;
    keyboard: boolean = false;
    backdrop: string | boolean = 'static';

@Input() locationType:string="";
@Input() locationName:string="";
@Input() locationStruct:any={};
@Input() floorUUID:string="";
@Input() floorMapErrorMsg:string="";
@Input() floorMapImage:string="";
@Input() floorAssignedAssetsData:any[]=[];
@Input() floorUnAssignedAssetsData:any[]=[];
@Input() currentLocationName:string="";
@Output() mapRefresh  = new EventEmitter<any>();
@Output() deleteAsset  = new EventEmitter<any>();
    currentFloorAssetsData:any[]=[];
    currentClickedAssetData:any={};
    currWizardData:any={};
  constructor(private storage:SessionStorageService, private tableDataCollectService:CollectionTableDataCollectorService, vcRef: ViewContainerRef) {

    }

imgSrc:string="";
offsetX1:string="0";
offsetY1:string="0";
offsetX2:string="0";
offsetY2:string="0";
heatmap:any;
 ngOnInit(){
  //   jQuery(this.elementRef.nativeElement).find("#draggable").draggable();
     /*$(function() {
    $( "#draggable" ).draggable();
    $( "#droppable" ).droppable({
      drop: function( event, ui ) {
        $( this )
          .addClass( "ui-state-highlight" )
          .find( "p" )
            .html( "Dropped!" );
      }
    });
  } );*/

 }
 ngAfterViewInit() { // wait for the view to init before using the element
   $('#heat').css('background-image', 'url(' + this.floorMapImage + ')');
    this.heatmap=h.create({
          container: document.querySelector('#heat'),
        //radius:120
            });
      var canvas = this.heatmap._renderer.canvas;
      this.heatmap.addData([]);
      this.drawHeatMaps()
      console.log("Flor Image....");
      //console.log(this.floorMapImage);
    }

drawHeatMaps(){
console.log("In drawHeatMaps");
console.log(this.floorAssignedAssetsData);
let heatData=[];
this.floorAssignedAssetsData.forEach(asset => {
		var x1= asset.xcoordinate;
		var y1= asset.ycoordinate;
    var rad= 60//asset.radius;
    var mac = asset.macAddress;
    heatData.push({x: x1,y: y1,radius:rad,value: 1});
});
/*var heatmap=h.create({
  			container: document.querySelector('#heat'),
			//radius:120
     			});
var canvas = heatmap._renderer.canvas;*/
this.heatmap.addData(heatData);


  this.floorAssignedAssetsData.forEach(asset => {
		var x1= asset.xcoordinate;
		var y1= asset.ycoordinate;
    var mac = asset.macAddress;

    var id= 'iconImage'+mac;
		console.log("ID : "+id);
		var ele = document.createElement("img");
			ele.id=id;
		document.getElementById('droppable').appendChild(ele);
		var img = document.getElementById(id);

    console.log(x1+" : "+y1);
    console.log(asset);
    x1=x1-20;
    y1=y1-40;
			img["src"] = "assets/img/wi-fi.png" ;
			img.style.position = "absolute";
			img.style["z-index"]="3";
			img.style.width = "40px";
			img.style.height = "40px";
			img.style.left = x1+"px";
      img.style.top = y1+"px";
      //"1)&#009;A&#013;&#010;2)&#009;B"
      let titleText="MAC : "+asset.macAddress+",\nModel: "+asset.model+",\nVendor: "+asset.vendor;
      img.title= titleText;

      //img.addEventListener("click", this.boundExportToForm.bind(this));
      img.addEventListener("dblclick", this.deleteAssignedAsset.bind(this));
			var src = document.getElementById("droppable");
			src.appendChild(img);

    //TO DELETE HEAT MAP
    /*$('#'+id).contextmenu({
      'target':'#context-menu',
      before: function (e, element, target) {
          //console.log(e);
          var id=e.target.id;
          var mac=id.substring(9);//Upto 9th position "iconImage" is defined and static
        console.log("MAC : "+mac);
          //console.log(element);
          //console.log(target);
        },
      onItem: function(context, e) {
        e.preventDefault();
            //console.log(e);
            this.deleteHeatIcon();
            //alert($(e.target).text());
          }
    });*/
  });
}
deleteAssignedAsset(e){
  console.log("In deleteAssignedAsset...");
  console.log(e);
  //this.deleteAsset.emit(e);
  var id=e.target.id;
  var mac=id.substring(9);
  var params={};
  var assignedAssetData = this.floorAssignedAssetsData.filter(asset=>asset.macAddress==mac);
  if(assignedAssetData.length>0)
  this.currentClickedAssetData = assignedAssetData[0];
  console.log(assignedAssetData);
  $('#alertModalButton').click();
}
proceedToDeleteAsset(e)
{
  console.log("IN Proceed to Delete Asset");
  console.log(e);
  this.deleteAsset.emit(this.currentClickedAssetData.macAddress);
}
boundExportToForm(e){
  console.log("In ICON Click");
  console.log(e)

}
deleteHeatIcon()
{
  console.log("In deleteHeatIcon...");
}

onDrop(e)
{
  console.log("In onDrop...");
  console.log(e)
  e.preventDefault();
  console.log(e.target.localName);
  console.log(e.target.nodeName);

  if((e.target.localName=="canvas")||(e.target.nodeName=="CANVAS"))
  {
    this.removeDraggedImages();
    console.log("removed ICONS");
    this.offsetX2 = e.offsetX;
    this.offsetY2 = e.offsetY;
    let x1= Number(this.offsetX2);
    let y1= Number(this.offsetY2);
    let id = "draggedImage"
    var ele = document.createElement("img");
			ele.id=id;
		document.getElementById('droppable').appendChild(ele);
		var img = document.getElementById(id);

		console.log(x1+" : "+y1);
    x1=x1-20;
    y1=y1-40;
			img["src"] = "assets/img/wi-fi.png" ;
			img.style.position = "absolute";
			img.style["z-index"]="3";
			img.style.width = "40px";
			img.style.height = "40px";
			img.style.left = x1+"px";
      img.style.top = y1+"px";
      img.title="New Asset...";
      //img.addEventListener("click", this.boundExportToForm.bind(this));
      img.addEventListener("dblclick", this.doubleCick.bind(this));

			var src = document.getElementById("droppable");
			src.appendChild(img);
      this.modal.open('lg');

  }

}
doubleCick(e){
  console.log("In ICON Double Click");
  console.log(e);
  this.removeDraggedImages();
}
removeDraggedImages()
{
  var elem = document.getElementById('draggedImage');
  if(elem!=null)
    elem.parentNode.removeChild(elem);
}

refreshData(e)
{
  console.log("In refresh Data");
  console.log(e);
  e.target.disabled=true;
  $('#refreshSpinner').show();
  //this.drawHeatMaps();
  //this.heatmap.addData();
}

dragStart(event) {
  console.log("In dragStart");
  console.log(event);
    event.dataTransfer.setData("Text", event.target.id);
}


dragenter(e)
{
  console.log("In dragenter");
  e.preventDefault();
}
dragend(e){}

dragleave(e){}

dragover(e)
{
  console.log("In dragover");
  console.log(e);
  e.preventDefault();
  this.offsetX1 = e.offsetX;
  this.offsetY1 = e.offsetY;
}
getXpos(a)
{
  let x = Number(a.xcoordinate)-75;
  return String(x)+"px";
}
getYpos(a)
{
  let y = Number(a.ycoordinate)-75;
  return String(y)+"px";
}

closed() {
    console.log("Trying to close...");
    //console.log("emitting map refresh signal");
      //this.output = '(closed) ' + this.selected;
  }
close1(){
  //this.eraseModal=true;
  console.log("Event caught to replace Table data....");
  this.currWizardData={};
  this.mapRefresh.emit();
    console.log("In close1...");
}
dismissed() {
  console.log("dismissed...");
  this.currWizardData={};
  this.modal.dismiss();
  this.modal.close();
}
opened() {
    console.log("Trying to Open...");
    console.log(this.floorUnAssignedAssetsData);
}

open() {
    //this.modal.open();
}

}


