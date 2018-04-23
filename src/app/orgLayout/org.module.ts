import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { routing }       from './org.routing';
import { NgaModule } from '../theme/nga.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { OrgLayout } from './org.component';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
//import {CommonDashboardLayoutModule} from "../commonDashboardLayout/commonDashboardLayout.module";
//import {UsersComponent} from "./users/users.component";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";
//import {MenuComponent} from "./menu.component";
//import {MenuItemComponent} from "./menuItem.component";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import {SlideMenuModule} from "../commonModules/slideMenuComponent/menu.module"
@NgModule({
  imports: [
    SlideMenuModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    PageTopModule,
    //CommonDashboardLayoutModule,
    CommonModule, 
    NgaModule, 
    routing
    ],
  declarations: [OrgLayout/*,MenuComponent,MenuItemComponent*/],
  //exports:[MenuComponent,MenuItemComponent],
  providers:[OrgRouteGuard]
})
export class OrgLayoutModule {
    
}
