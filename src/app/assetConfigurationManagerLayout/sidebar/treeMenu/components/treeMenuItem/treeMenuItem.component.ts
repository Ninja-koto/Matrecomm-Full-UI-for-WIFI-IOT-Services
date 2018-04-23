import {Component, Input, Output, EventEmitter} from '@angular/core';
import 'style-loader!./treeMenuItem.scss';
@Component({
  selector: 'tree-menu-item',
  templateUrl: './treeMenuItem.html'
})
export class TreeMenuItem {
public showMessage:any;

  @Input() menuItem:any;
  @Input() child:boolean = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  public onHoverItem($event):void {
    this.itemHover.emit($event);
  }

  public onToggleSubMenu($event, item):boolean {
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }
//for testing
//-----------------
@Output() treeMenuItem:EventEmitter<string>=new EventEmitter<string>();
onNotifyClicked(message:string):void{
  this.showMessage=message;
  this.treeMenuItem.emit(this.showMessage);
}


}
