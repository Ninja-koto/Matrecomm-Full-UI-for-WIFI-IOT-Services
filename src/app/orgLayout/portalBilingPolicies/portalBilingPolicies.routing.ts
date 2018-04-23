import { Routes, RouterModule }  from '@angular/router';
import { PortalBilingPolicies } from './portalBilingPolicies.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: PortalBilingPolicies,
    children: [
      //{ path: 'treeview', component: TreeViewComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
