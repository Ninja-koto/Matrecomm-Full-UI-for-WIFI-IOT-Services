import { Routes, RouterModule }  from '@angular/router';
import { DigiviveLayout } from './digiviveTempLayout.component';
import { ModuleWithProviders } from '@angular/core';
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path:'mediaMgmt1',
    component:DigiviveLayout,
    children:[
      { path: 'media', canActivate:[OrgRouteGuard],loadChildren: 'app/addManagementLayout/mediaManagement/mediaManagement.module#MediaManagementModule' },
      {
        path:'mediaStore',canActivate:[OrgRouteGuard],
        loadChildren:'app/addManagementLayout/mediaStore/mediaLibrary.module#mediaLibraryModule'
      },
      {
        path:'mediaProfile',canActivate:[OrgRouteGuard],
        loadChildren:'app/addManagementLayout/mediaProfile/ProfileCreation.module#profileCreationModule'
      },
      {
        path:'mediaAssetInventory',canActivate:[OrgRouteGuard],
        loadChildren:'app/addManagementLayout/mediaAssetInventory/CreateAsset.module#CreateAssetModule'
      },
      {
        path:'mediaAssetBlock',canActivate:[OrgRouteGuard],
        loadChildren:'app/addManagementLayout/mediaAssetBlock/blockedDevice.module#blockedDeviceCreationModule'
      },
      {
        path:'mediaProfileDeployment',canActivate:[OrgRouteGuard],
        loadChildren:'app/addManagementLayout/mediaProfileDeployment/deployment.module#deploymentCreationModule'
      },
      {
        path:'mediaAssetGroup',canActivate:[OrgRouteGuard],
        loadChildren:'app/addManagementLayout/mediaAssetGroup/mediaAssetGroup.module#MediaAssetGroupModule'
      },     
      {
        path:'mediaDashboard',canActivate:[OrgRouteGuard],
        loadChildren:'app/addManagementLayout/mediaDashboard/mediaDashboard.module#MediaDashboardModule'
      }
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);