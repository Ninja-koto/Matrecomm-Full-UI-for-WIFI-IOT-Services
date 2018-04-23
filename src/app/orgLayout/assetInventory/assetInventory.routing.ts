import { Routes, RouterModule }  from '@angular/router';

import {AssetInventory} from "./assetInventory.component";
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: AssetInventory,
    children: [
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
