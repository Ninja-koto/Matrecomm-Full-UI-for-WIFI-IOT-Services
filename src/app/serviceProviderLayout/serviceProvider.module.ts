import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { routing }       from './serviceProvider.routing';
import { NgaModule } from '../theme/nga.module';

import { ServiceProviderLayout } from './serviceProvider.component';
import {ServiceProviderRouteGuard} from "../commonServices/serviceProviderRouteGuard.service";
import {ServiceProviderDashboardLayoutModule} from "../serviceProviderDashboardLayout/dashboardLayout.module";
//import {UsersComponent} from "./users/users.component";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";
@NgModule({
  imports: [
    PageTopModule,
    ServiceProviderDashboardLayoutModule,
    CommonModule, 
    NgaModule, 
    routing
    ],
  declarations: [ServiceProviderLayout],
  providers:[ServiceProviderRouteGuard]
})
export class ServiceProviderModule {
    
}
