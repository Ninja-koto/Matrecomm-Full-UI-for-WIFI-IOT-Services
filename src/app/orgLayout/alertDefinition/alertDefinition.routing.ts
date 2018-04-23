import { Routes, RouterModule }  from '@angular/router';
import { AlertDefinition } from './alertDefinition.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: AlertDefinition,
    children: [
      //{ path: 'treeview', component: TreeViewComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
