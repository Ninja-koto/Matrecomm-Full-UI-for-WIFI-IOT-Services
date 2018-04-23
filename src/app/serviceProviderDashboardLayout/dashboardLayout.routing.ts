import { Routes, RouterModule }  from '@angular/router';
import { ServiceProviderDashboardLayout } from './dashboardLayout.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
 
  {
    path: 'serviceProviderDashboardLayout',
    component: ServiceProviderDashboardLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard' ,loadChildren: 'app/serviceProviderDashboardLayout/dashboardLayout.module#ServiceProviderDashboardLayoutModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
