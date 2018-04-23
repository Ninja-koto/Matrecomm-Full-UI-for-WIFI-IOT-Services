import { Component,Input, Output, EventEmitter, OnInit,ViewContainerRef, ViewEncapsulation } from '@angular/core';

import * as jQuery from "jquery";
import {bootstrap} from "bootstrap";

/*  USAGE WITH FULL OPTIONS
    <collection-table
        [collectionTableData]= tableData
        [columns]= columns
        [hideWizardButtons]=false
        [hideSearchBox]=false
        tableID = "userTable1"
        tableTitle ="UserTAble"
        addButtonID="addWizard1"
        modifyButtonID="modifyWizard1"
        deleteButtonID="deleteWizard1"
        enableUnselectOnExit="yes"
        rowsOnPage = 3
        sortBy = "authcode"
        sortOrder = "asc"
        [rowsOnPageButtons] = [1,5,10,15]
        (clickedButtonID) = "clickedWizardButtonID($event)"
        (selectedData) = "selectedRowData($event)"
        (selectedWizardOperation) = "selectedWizardOperation($event)"
        >
    </collection-table>*/

@Component({
  selector: 'collection-table1',
  templateUrl: './collectionTable.component1.html',
  styleUrls: ['./collectionTable.component1.css'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionTableComponent1 implements OnInit {
    @Input() collectionTableData :any[];
    @Input() tableID:string;
    @Input() addButtonID:string;
    @Input() modifyButtonID:string="";
    @Input() deleteButtonID:string="";
    @Input() tableTitle:string;
    @Input() columns: any[];
    @Input() rowsOnPageButtons:any[];
    @Input() enableUnselectOnExit:string;
    @Input() hideWizardButtons:boolean= false;
    @Input() hideSearchBox:boolean=false;

    @Input() hideAddButton:boolean=false;
    @Input() hideModifyButton:boolean=false;
    @Input() hideDeleteButton:boolean=false;

    @Input() filterQuery:string;
    @Input() rowsOnPage : number=3;
    @Input() sortBy :string="";
    @Input() sortOrder :string;
    //@Output() clickedButtonID  = new EventEmitter<string>();
    @Output() selectedData  = new EventEmitter<any[]>();
    @Output() addModifyButtonClicked  = new EventEmitter<string>();
    @Output() deleteButtonClicked  = new EventEmitter<string>();
    @Output() selectedWizardOperation = new EventEmitter<string>();
    widthStyle:string;
    clickedRow:string;
    rowStyle="rowStyle";

    constructor() { 
    }
    getDataForColumnHeader(column:any)
    {
      return "<b>"+column+"</b>";
    }
    getDataForColumn(data:any,column:any)
    {
      try{
        /*if(String(column['multipleKeys'])!="undefined")
        {
          let arr= column['multipleKeys']
          let temp="";
          arr.forEach(element => {
            temp= temp+data[element]+",<br>";
          });
          return temp.slice(0,temp.length-2);
        }*/
        if(String(column['fn'])!="undefined")
        {
          return column.fn(data[column.key],data);
        }
        else
          return data[column.key];
      }
      catch(e)
      {
        console.log("Exception in CollectionTableComponent getDataForColumn ");
        console.log(e);
      }
    }
    pullSelectedRowData(data:any)
    {console.log(data);
      try{
        this.clickedRow=data._id;
        if(this.modifyButtonID!="")
          jQuery("#"+this.modifyButtonID).prop("disabled",false);
        if(this.deleteButtonID!="")
          jQuery("#"+this.deleteButtonID).prop("disabled",false);
        this.selectedData.emit(data);
      }
      catch(e)
      {
        console.log("Exception in CollectionTableComponent pullSelectedRowData ");
        console.log(e);
      }
    }
    unselectRowAndDisableButtons()
    {
      try{
        if(this.enableUnselectOnExit=="yes")
        {
          //console.log("Mouse Out Event Occurred...");
          if(this.modifyButtonID!="")
            jQuery("#"+this.modifyButtonID).prop("disabled",true);
          if(this.deleteButtonID!="")
            jQuery("#"+this.deleteButtonID).prop("disabled",true);
          this.clickedRow="";
        }
      }
      catch(e)
      {
        console.log("Exception in CollectionTableComponent unselectRowAndDisableButtons");
        console.log(e);
      }
    }
    buttonClicked(event)
    {
      try{
        console.log(event);
        event.preventDefault();
        if((String(event.target.textContent)=="Delete")||(String(event.target.className).indexOf("minus")>=0))
        {
          this.deleteButtonClicked.emit(/*event.target.textContent*/"Delete");
        this.selectedWizardOperation.emit(/*event.target.textContent*/"Delete");
          //this.clickedButtonID.emit(event.target.id);
        }
        else if((String(event.target.textContent)=="Add")||(String(event.target.className).indexOf("plus")>=0)
          ||(String(event.target.className).indexOf("star")>=0)||(String(event.target.textContent)=="Modify"))
        {
          //console.log("Click found...");
          if((String(event.target.textContent)=="Add")||(String(event.target.textContent)=="Modify"))
            {//console.log("throwbutton");
            this.addModifyButtonClicked.emit(event.target.textContent)
            this.selectedWizardOperation.emit(event.target.textContent);
            }
          else if(String(event.target.className).indexOf("plus")>=0)
            {//console.log("throw icon");
              this.addModifyButtonClicked.emit("Add")
              this.selectedWizardOperation.emit("Add");
            }
          else if(String(event.target.className).indexOf("star")>=0)
            {
              this.addModifyButtonClicked.emit("Modify")
              this.selectedWizardOperation.emit("Modify");
            }

          //this.clickedButtonID.emit(event.target.id);
        }
        else
        {
          console.log("Not found button type...");
          console.log(event);
        }
      }
      catch(e)
      {
        console.log("Exception in buttonClicked");
        console.log(e);
      }
    }
    ngOnInit() {
      try{
        //Setting Column Width
        this.widthStyle = String(90/this.columns.length)+"%";

        //Setting SORT Order
        if((this.sortOrder!="asc")&&(this.sortOrder!="desc"))
          this.sortOrder="asc";
        
        //Validation of SortBy Column
        let found=false;
        if(this.sortBy!="")//Checking sortBy present in the Columns or not
        {
          for(let column of this.columns)
              if(column.key==this.sortBy)
              {
                found=true;
                break;
              }
        }
        if((this.sortBy=="")||!found)//Setting sort to first Column
        {
          if(this.columns.length>0)
          {
            var firstColumn= this.columns[0];
            this.sortBy = firstColumn.key;
          }
        }
      }
      catch(e)
      {
        console.log("Exception in CollectionTableComponent OnInit");
        console.log(e);
      }
    }

}
