
import { Component, OnInit,Input, Output, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-menu-item',
  templateUrl: './menuItem.component.html',
  styleUrls: ['./menuItem.component.scss']
})
export class MenuItemComponent implements OnInit {
 
    @Input() data={};
  @Output() taskSelected = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
currTime:any="";
  constructor() { 
    
  }

  ngOnInit() {
      //console.log("ITEM DATA");;
      //console.log(this.data);
      try{
      this.currTime = new Date(this.data["date"]).toTimeString();
      }catch(e){}
  }
  removeSelectedTask()
  {
    //console.log("In removeSelectedTask");
    //console.log(this.data);
    this.remove.emit(this.data);
  }
  showSelectedTaskDetails()
  {
    //console.log("Will show Details");
    //console.log(this.data);
    this.taskSelected.emit(this.data);
  }

  
}
