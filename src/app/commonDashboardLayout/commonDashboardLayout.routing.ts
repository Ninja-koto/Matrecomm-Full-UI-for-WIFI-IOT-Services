import { Routes, RouterModule }  from '@angular/router';
import { CommonDashboardLayout } from './commonDashboardLayout.component';
import { ModuleWithProviders } from '@angular/core';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
 
  {
    path: 'commonDashboardLayout',
    component: CommonDashboardLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',canActivate:[OrgRouteGuard] ,loadChildren: 'app/commonDashboardLayout/commonDashboardLayout.module#CommonDashboardLayoutModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
