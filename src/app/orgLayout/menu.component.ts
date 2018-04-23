import { Component, OnInit,Input, Output, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
 @Input() items=[];
  @Output() taskSelected = new EventEmitter<any>();

  
  constructor() { 
    /*this.items=[
      {
        id:1,
        name:"Item 1",
        percentage:100
      },
      {
        id:2,
        name:"Item 2",
        percentage:50
      },
      {
        id:3,
        name:"Item 3",
        percentage:30
      }
    ]*/
    console.log(this.items);
  }

  ngOnInit() {
  }
  
  removeSelectedTask(item)
  {
    console.log("In removeSelectedTask");
    console.log(item);
    
    let index = this.items.findIndex(val => val._id==item._id);
    this.items.splice(index,1);
    console.log("SENDING REQUEST TO REMOVE/ CANCEL TASK");
    
  }
  showSelectedTaskDetails(item)
  {
    console.log("Will show Details");
    this.taskSelected.emit(item);
  }

}
