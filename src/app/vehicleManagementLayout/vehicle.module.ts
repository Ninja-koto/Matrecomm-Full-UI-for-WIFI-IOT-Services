import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { routing }       from './vehicle.routing';
import { NgaModule } from '../theme/nga.module';

import { VehicleLayout } from './vehicle.component';
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
  declarations: [VehicleLayout],
  providers:[OrgRouteGuard]
})
export class VehicleLayoutModule {
    
}
