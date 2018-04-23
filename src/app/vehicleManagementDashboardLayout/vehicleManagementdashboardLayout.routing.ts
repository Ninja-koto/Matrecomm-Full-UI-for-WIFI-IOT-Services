import { Routes, RouterModule }  from '@angular/router';
import { VehicleManagementdashboardLayout } from './vehicleManagementdashboardLayout.component';
import { ModuleWithProviders } from '@angular/core';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
 
  {
    path: 'vehicle',
    component: VehicleManagementdashboardLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', canActivate:[OrgRouteGuard],loadChildren: 'app/vehicleManagementDashboardLayout/vehicleManagementdashboardLayout.module#VehicleManagementDashboardLayoutModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
