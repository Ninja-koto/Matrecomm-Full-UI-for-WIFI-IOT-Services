import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'collection-table-column',
  template: `<ng-content></ng-content>`
})
export class CollectionTableColumnEleComponent implements OnInit {

    constructor() { 
    }
    
    ngOnInit() {
    }

}
