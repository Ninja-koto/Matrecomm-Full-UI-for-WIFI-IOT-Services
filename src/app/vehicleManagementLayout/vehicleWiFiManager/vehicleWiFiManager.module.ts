import { CUSTOM_ELEMENTS_SCHEMA,NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { VehicleWiFiManager } from './vehicleWiFiManager.component';
import { routing }       from './vehicleWiFiManager.routing';

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import {TabsPanelModule} from "../../commonModules/tabsPanelComponent/tabsPanel.module";

import { VehicleConfigurationComponent } from "./vehicleConfigurationTable/vehicleConfigurationTable";
import { VehicleConfigurationAddWizardComponent} from "./vehicleConfigurationTable/add-wizard/vehicleConfiguration-wizard.component";

import { GPSVehicleConfigurationComponent } from "./gpsVehicleConfigurationTable/gpsVehicleConfigurationTable";
import { GPSVehicleConfigurationAddWizardComponent} from "./gpsVehicleConfigurationTable/add-wizard/gpsVehicleConfiguration-wizard.component";

import { GPSVehicleRouteConfigurationComponent } from "./gpsVehicleRouteConfigurationTable/gpsVehicleRouteConfigurationTable";
import { GPSVehicleRouteConfigurationAddWizardComponent } from "./gpsVehicleRouteConfigurationTable/add-wizard/gpsVehicleRouteConfiguration-wizard.component";

import { VehiclePolicyComponent } from "./vehiclePolicyTable/vehiclePolicyTable";
import { VehiclePolicyAddWizardComponent } from "./vehiclePolicyTable/add-wizard/vehiclePolicy-wizard.component";

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';
import { DateTimePickerModule } from 'ng-pick-datetime';


@NgModule({
  imports: [
      DateTimePickerModule,
    Ng2Webstorage,
    CoolStorageModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    CollectionTableModule,
    ModalModule,
    WizardModule,
    TabsPanelModule
  ],
  declarations: [
    //jqueryDragAndDropComponent,
    VehicleWiFiManager,
    VehicleConfigurationComponent,
    VehicleConfigurationAddWizardComponent,
    GPSVehicleConfigurationComponent,
    GPSVehicleConfigurationAddWizardComponent,
    GPSVehicleRouteConfigurationComponent,
    GPSVehicleRouteConfigurationAddWizardComponent,
    VehiclePolicyComponent,
   VehiclePolicyAddWizardComponent    
    //AssignAssetsWizardComponent
  ],
    exports: [   
    VehicleWiFiManager,
    VehicleConfigurationComponent,
    VehicleConfigurationAddWizardComponent ,
    GPSVehicleConfigurationComponent,
    GPSVehicleConfigurationAddWizardComponent,
    GPSVehicleRouteConfigurationComponent,
    GPSVehicleRouteConfigurationAddWizardComponent,
    VehiclePolicyComponent,
    VehiclePolicyAddWizardComponent       
 ],
 schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
      //EmailServerService
  ]
})
export class VehicleWiFiManagerModule {}
