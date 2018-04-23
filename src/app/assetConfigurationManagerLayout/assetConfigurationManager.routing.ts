import { Routes, RouterModule }  from '@angular/router';
import { AssetConfigurationManagerLayout } from './assetConfigurationManager.component';
import { ModuleWithProviders } from '@angular/core';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
 
  {
    path: 'assetConfigurationManagerLayout',
    canActivate:[OrgRouteGuard],
    component: AssetConfigurationManagerLayout
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
