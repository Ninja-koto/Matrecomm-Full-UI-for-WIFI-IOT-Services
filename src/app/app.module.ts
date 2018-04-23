import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
//import {CollectionTableComponent} from "./commonComponents/collectionTable/collectionTable.component";
///import {CollectionTablePipe} from "./commonComponents/collectionTable/collectionTable.pipe";
//import {WizardStepComponent} from "./commonComponents/wizardComponent/wizard-step.component";
//import {WizardComponent} from "./commonComponents/wizardComponent/wizard.component";
//import {DataTableModule} from "angular2-datatable";

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import {CoolStorageModule} from "angular2-cool-storage";
import { PagesModule } from './pages/pages.module';
import {OrgLayoutModule} from "./orgLayout/org.module";
import {ServiceProviderModule} from"./serviceProviderLayout/serviceProvider.module";
import {FloorMapLayoutModule} from "./floorMapLayout/floorMapLayout.module";
import {CommonDashboardLayoutModule} from "./commonDashboardLayout/commonDashboardLayout.module";
import {AssetConfigurationManagerLayoutModule} from "./assetConfigurationManagerLayout/assetConfigurationManager.module";
import {VehicleLayoutModule} from "./vehicleManagementLayout/vehicle.module";
import {Ng2Webstorage} from 'ngx-webstorage';
import {UrlProvider} from "./commonServices/urlProvider";
import {VehicleManagementDashboardLayoutModule} from "./vehicleManagementDashboardLayout/vehicleManagementdashboardLayout.module";
import {FDashboardLayoutModule} from "./fDashboardLayout/fDashboardLayout.module";
import { SimpleNotificationsModule } from 'angular2-notifications';

import {NocDashboardLayoutModule} from "./nocDashboardLayout/nocDashboardLayout.module";
import {AddMgmtDashboardLayoutModule} from "./addManagementDashboardLayout/addManagementDashboardLayout.module"

import {DigiviveLayoutModule} from "./digiviveTempLayout/digiviveTempLayout.module"

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App,
   // WizardComponent,
    //WizardStepComponent
  ],
  imports: [ // import Angular's modules
  SimpleNotificationsModule.forRoot(),
  Ng2Webstorage,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    CoolStorageModule.forRoot(),
    PagesModule,
    OrgLayoutModule,
    ServiceProviderModule,
    FloorMapLayoutModule,
    CommonDashboardLayoutModule,
    AssetConfigurationManagerLayoutModule,
    VehicleLayoutModule,
    VehicleManagementDashboardLayoutModule,
    FDashboardLayoutModule,
    NocDashboardLayoutModule,
    AddMgmtDashboardLayoutModule,
    DigiviveLayoutModule,
    routing,
    //DataTableModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    UrlProvider
  ]
})

export class AppModule {

  constructor(public appRef: ApplicationRef,
              public appState: AppState) {
  }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
