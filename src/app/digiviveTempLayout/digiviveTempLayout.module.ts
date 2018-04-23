import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { routing }       from './digiviveTempLayout.routing';
import { NgaModule } from '../theme/nga.module';

import { DigiviveLayout } from './digiviveTempLayout.component';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
//import {UsersComponent} from "./users/users.component";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";
import {ChartsModule} from "../commonModules/chartsComponent/charts.module";
@NgModule({
  imports: [
    ChartsModule,
    PageTopModule,
    CommonModule, 
    NgaModule, 
    routing
    ],
  declarations: [DigiviveLayout],
  providers:[OrgRouteGuard]
})
export class DigiviveLayoutModule {
    
}
