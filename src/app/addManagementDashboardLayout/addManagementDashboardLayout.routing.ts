import { Routes, RouterModule }  from '@angular/router';
import { AddMgmtDashboardLayout } from './addManagementDashboardLayout.component';
import { ModuleWithProviders } from '@angular/core';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'addMgmtDashboardLayout',
    component: AddMgmtDashboardLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',canActivate:[OrgRouteGuard] ,loadChildren: 'app/addManagementDashboardLayout/addManagementDashboardLayout.module#AddMgmtDashboardLayoutModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
