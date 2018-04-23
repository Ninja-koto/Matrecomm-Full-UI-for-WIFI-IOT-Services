import { Routes, RouterModule }  from '@angular/router';
import { NocDashboardLayout } from './nocDashboardLayout.component';
import { ModuleWithProviders } from '@angular/core';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
 
  {
    path: 'nocDashboardLayout',
    component: NocDashboardLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', canActivate:[OrgRouteGuard],loadChildren: 'app/nocDashboardLayout/nocDashboardLayout.module#NocDashboardLayoutModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
