import { Component, OnInit,Input, Output, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
 @Input() items=[];
  @Output() taskSelected = new EventEmitter<any>();
/*items1=[
  {"_id":"5a128e8bfb48180d933b7ee0",
  "date":"2017-11-21T07:59:50Z",
  "description":"Configuration Started in device with IP : 169.254.107.132",
  "name":"ConfigurationTask=>169.254.107.132",
  "percentage":20,
  "status":"Configuration Started in device with IP : 169.254.107.132",
  "uuid":"9ecfaaa6-cdca-11e7-8087-b4b52f34dbc0"},
  {"_id":"5a128e8bfb48180d933b7ee1",
  "date":"2017-11-21T07:59:50Z",
  "description":"Configuration Started in device with IP : 169.254.107.132",
  "name":"ConfigurationTask=>169.254.107.132",
  "percentage":20,
  "status":"Configuration Started in device with IP : 169.254.107.132",
  "uuid":"9ecfaaa6-cdca-11e7-8087-b4b52f34dbc1"},
  {"_id":"5a128e8bfb48180d933b7ee2",
  "date":"2017-11-21T07:59:50Z",
  "description":"Configuration Started in device with IP : 169.254.107.132",
  "name":"ConfigurationTask=>169.254.107.132",
  "percentage":20,
  "status":"Configuration Started in device with IP : 169.254.107.132",
  "uuid":"9ecfaaa6-cdca-11e7-8087-b4b52f34dbc2"},
  {"_id":"5a128e8bfb48180d933b7ee3",
  "date":"2017-11-21T07:59:50Z",
  "description":"Configuration Started in device with IP : 169.254.107.132",
  "name":"ConfigurationTask=>169.254.107.132",
  "percentage":20,
  "status":"Configuration Started in device with IP : 169.254.107.132",
  "uuid":"9ecfaaa6-cdca-11e7-8087-b4b52f34dbc3"},
  {"_id":"5a128e8bfb48180d933b7ee4",
  "date":"2017-11-21T07:59:50Z",
  "description":"Configuration Started in device with IP : 169.254.107.132",
  "name":"ConfigurationTask=>169.254.107.132",
  "percentage":20,
  "status":"Configuration Started in device with IP : 169.254.107.132",
  "uuid":"9ecfaaa6-cdca-11e7-8087-b4b52f34dbc4"},
  {"_id":"5a128e8bfb48180d933b7ee5",
  "date":"2017-11-21T07:59:50Z",
  "description":"Configuration Started in device with IP : 169.254.107.132",
  "name":"ConfigurationTask=>169.254.107.132",
  "percentage":20,
  "status":"Configuration Started in device with IP : 169.254.107.132",
  "uuid":"9ecfaaa6-cdca-11e7-8087-b4b52f34dbc5"},
  {"_id":"5a128e8bfb48180d933b7ee6",
  "date":"2017-11-21T07:59:50Z",
  "description":"Configuration Started in device with IP : 169.254.107.132",
  "name":"ConfigurationTask=>169.254.107.132",
  "percentage":20,
  "status":"Configuration Started in device with IP : 169.254.107.132",
  "uuid":"9ecfaaa6-cdca-11e7-8087-b4b52f34dbc6"},
  {"_id":"5a128e8bfb48180d933b7ee7",
  "date":"2017-11-21T07:59:50Z",
  "description":"Configuration Started in device with IP : 169.254.107.132",
  "name":"ConfigurationTask=>169.254.107.132",
  "percentage":20,
  "status":"Configuration Started in device with IP : 169.254.107.132",
  "uuid":"9ecfaaa6-cdca-11e7-8087-b4b52f34dbc7"},
];*/
  
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
    //console.log(this.items);
  }

  ngOnInit() {
  }
  
  removeSelectedTask(item)
  {
   // console.log("In removeSelectedTask");
    //console.log(item);
    
    let index = this.items.findIndex(val => val._id==item._id);
    this.items.splice(index,1);
    console.log("SENDING REQUEST TO REMOVE/ CANCEL TASK");
    
  }
  showSelectedTaskDetails(item)
  {
   // console.log("Will show Details");
    this.taskSelected.emit(item);
  }

}
