import { Routes, RouterModule }  from '@angular/router';
import { OrgLayout } from './org.component';
import { ModuleWithProviders } from '@angular/core';
import {OrganizationModule} from "./organizationManager"
import {OrgRouteGuard} from "../commonServices/routeGuard.service";
//import {CommonDashboardLayout} from "../commonDashboardLayout/commonDashboardLayout.component";
import {VehicleManagementdashboardLayout} from "../vehicleManagementDashboardLayout/vehicleManagementdashboardLayout.component";
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'org',
    component: OrgLayout,
    children: [
      { path: '', redirectTo: 'organization', pathMatch: 'full' },
      { path: 'organization', canActivate:[OrgRouteGuard] ,loadChildren: 'app/orgLayout/organizationManager/organization.module#OrganizationModule' },
      {path: 'assetRegistration', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/assetRegistration/assetRegistration.module#AssetRegistrationModule'},
      {path: 'assetInventory', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/assetInventory/assetInventory.module#AssetInventoryModule'},
      {path: 'assetAuthorization', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/assetAuthorization/assetAuthorization.module#AssetAuthorizationModule'},
      {path: 'orgHome', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/orgHome/orgHome.module#OrganizationHomeModule'},
      {path: 'locationManagement', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/locationManagement/locationManagement.module#LocationManagementModule'},
      {path: 'assetConfigurationTemplates', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/assetConfigurationTemplate/assetConfigurationTemplate.module#AssetConfigurationTemplateModule'},
      {path: 'alertManager', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/alertDefinition/alertDefinition.module#AlertDefinitionModule'},
      {path: 'customizedCaptivePortal', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/portalBilingPolicies/portalBilingPolicies.module#PortalBilingPolicyModule'},
      {path: 'eventManagement', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/eventManagement/eventManagement.module#EventManagementModule'},
      {path: 'apnUserManagement', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/airtelNocSpecific/apnUserManagement.module#APNUserManagementModule'},
      {path: 'userManagement', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/userManagement/userManagement.module#UserManagementModule'},
      {path: 'historicalLogs', canActivate:[OrgRouteGuard],loadChildren: 'app/orgLayout/historicalLogs/historicalLogs.module#HistoricalLogsModule'},
      { path: 'vehicleManager', canActivate:[OrgRouteGuard],loadChildren: 'app/vehicleManagementLayout/vehicleWiFiManager/vehicleWiFiManager.module#VehicleWiFiManagerModule' }
      
    ]
  },
  /*{
    path:'addMgmt',
    component:OrgLayout,
    children:[
      { path: 'media', canActivate:[OrgRouteGuard],loadChildren: 'app/addManagementLayout/mediaManagement/mediaManagement.module#MediaManagementModule' },
      {
        path:'advertisement',canActivate:[OrgRouteGuard],
        loadChildren:'app/addManagementLayout/advertisementManagement/advMgmt.module#AdvertisementManagementModule'
      }
    ]
  },*/
  {
    path:'mediaMgmt',
    component:OrgLayout,
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
  {
    path:'hotelMgmt',
    component:OrgLayout,
    children:[
      {
        path:'userManagement',canActivate:[OrgRouteGuard],
        loadChildren:'app/hotelManagementLayout/userManagement/userManagement.module#UserManagementModule'
      }
    ]
  },
  /*{
    path: 'commonDashboardLayout',
    component: CommonDashboardLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard' ,canActivate:[OrgRouteGuard],loadChildren: 'app/commonDashboardLayout/commonDashboardLayout.module#CommonDashboardLayoutModule' }
    ]
  },*/
  {
    path: 'vehicle',
    component: VehicleManagementdashboardLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard' ,canActivate:[OrgRouteGuard],loadChildren: 'app/vehicleManagementDashboardLayout/vehicleManagementdashboardLayout.module#VehicleManagementDashboardLayoutModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);