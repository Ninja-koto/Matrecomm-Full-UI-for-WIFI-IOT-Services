import { Routes, RouterModule }  from '@angular/router';
import { VehicleLayout } from './vehicle.component';
import { ModuleWithProviders } from '@angular/core';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'vehicle',
    component: VehicleLayout,
    children: [
      { path: '', redirectTo: 'manager', pathMatch: 'full' },
      //{ path: 'dashboard', canActivate:[OrgRouteGuard],loadChildren: 'app/vehicleManagementLayout/vehicleWiFiDashboard/vehicleWiFiDashboard.module#VehicleDashboardModule' },      
      { path: 'manager', canActivate:[OrgRouteGuard],loadChildren: 'app/vehicleManagementLayout/vehicleWiFiManager/vehicleWiFiManager.module#VehicleWiFiManagerModule' },
      {path: 'customizedCaptivePortal', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/portalBilingPolicies/portalBilingPolicies.module#PortalBilingPolicyModule'},
      {path: 'userManagement', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/userManagement/userManagement.module#UserManagementModule'},
      {path: 'historicalLogs', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/historicalLogs/historicalLogs.module#HistoricalLogsModule'}
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);