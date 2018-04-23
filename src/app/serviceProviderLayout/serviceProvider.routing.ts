import { Routes, RouterModule }  from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import {ServiceProviderLayout} from "./serviceProvider.component";
import {ServiceProviderRouteGuard} from "../commonServices/serviceProviderRouteGuard.service";
import {ServiceProviderDashboardLayout} from "../serviceProviderDashboardLayout/dashboardLayout.component";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'serviceProvider',
    component: ServiceProviderLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {path: 'home', canActivate:[ServiceProviderRouteGuard],loadChildren: 'app/serviceProviderLayout/serviceProviderHome/serviceProviderHome.module#ServiceProviderHomeModule'},
      {path: 'manager', canActivate:[ServiceProviderRouteGuard],loadChildren: 'app/serviceProviderLayout/serviceProviderManager/serviceProviderManager.module#ServiceProviderManagerModule'}
      ]
  },
  {
    path: 'serviceProviderDashboardLayout',
    component: ServiceProviderDashboardLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard' ,canActivate:[ServiceProviderRouteGuard],loadChildren: 'app/serviceProviderDashboardLayout/dashboardLayout.module#DashboardLayoutModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);