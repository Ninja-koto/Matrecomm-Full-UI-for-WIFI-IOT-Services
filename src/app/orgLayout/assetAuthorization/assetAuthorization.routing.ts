import { Routes, RouterModule }  from '@angular/router';
import { AssetAuthorization } from './assetAuthorization.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: AssetAuthorization,
    children: [
      //{ path: 'treeview', component: TreeViewComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
