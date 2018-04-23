import { Routes, RouterModule }  from '@angular/router';
import { FloorMapLayout } from './floorMapLayout.component';
import { ModuleWithProviders } from '@angular/core';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
 
  {
    path: 'floorMapLayout',
    canActivate:[OrgRouteGuard],
    component: FloorMapLayout
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
