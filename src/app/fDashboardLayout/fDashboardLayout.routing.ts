import { Routes, RouterModule }  from '@angular/router';
import { FDashboardLayout } from './fDashboardLayout.component';
import {FDHistLogs} from "./fDHistLogs.component";
import { ModuleWithProviders } from '@angular/core';
import {OrgViewerRouteGuard} from "../commonServices/orgViewerRouterGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
 
  {
    path: 'org/onlyDashboard',
    canActivate:[OrgViewerRouteGuard],
    component: FDashboardLayout,
    /*children: [
      { path: '', redirectTo: 'onlyDashboard', pathMatch: 'full' },
      { path: 'onlyDashboard', canActivate:[OrgRouteGuard],loadChildren: 'app/fDashboardLayout/fDashboardLayout.module#FDashboardLayoutModule' }
    ]*/
  },
  {
    path:'org/onlyHLogs',
    canActivate:[OrgViewerRouteGuard],
    component:FDHistLogs
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
