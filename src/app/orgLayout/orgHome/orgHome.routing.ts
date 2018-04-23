import { Routes, RouterModule }  from '@angular/router';

import { OrganizationHome } from './orgHome.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: OrganizationHome,
    children: [
      //{ path: 'treeview', component: TreeViewComponent }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
