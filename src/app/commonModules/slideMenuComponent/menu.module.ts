import { MultiselectDropdown } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import {MenuComponent} from "./menu.component";
import {MenuItemComponent} from "./menuItem.component"
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  imports: [CommonModule,
    BrowserAnimationsModule,
     FormsModule],
  exports: [MenuComponent, MenuItemComponent],
  declarations: [MenuComponent, MenuItemComponent],
})
export class SlideMenuModule { }
