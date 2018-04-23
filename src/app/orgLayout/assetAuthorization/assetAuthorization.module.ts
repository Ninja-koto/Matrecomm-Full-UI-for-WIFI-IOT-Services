import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import {routing} from "./assetAuthorization.routing";

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';

import {AssetAuthorizationMacTable} from "./assetAuthorizationMacTable/assetAuthorizationMacTable";
import {AssetAuthorizationMacAddWizardComponent } from './assetAuthorizationMacTable/addByMac-wizard/assetAuthorizationMac-wizard.component';
import {AssetAuthorizationVendorTable} from "./assetAuthorizationVendorTable/assetAuthorizationVendorTable";
import {AssetAuthorizationVendorAddWizardComponent } from './assetAuthorizationVendorTable/addByVendor-wizard/assetAuthorizationVendor-wizard.component';

import {SwitchAuthorizationMacTable} from "./switchAuthorizationMacTable/switchAuthorizationMacTable";
import {SwitchAuthorizationMacAddWizardComponent } from './switchAuthorizationMacTable/addByMac-wizard/switchAuthorizationMac-wizard.component';
import {SwitchAuthorizationVendorTable} from "./switchAuthorizationVendorTable/switchAuthorizationVendorTable";
import {SwitchAuthorizationVendorAddWizardComponent } from './switchAuthorizationVendorTable/addByVendor-wizard/switchAuthorizationVendor-wizard.component';

import {ClientAuthorizationMacTable} from "./clientAuthorizationMacTable/clientAuthorizationMacTable";
import {ClientAuthorizationMacAddWizardComponent } from './clientAuthorizationMacTable/addByMac-wizard/clientAuthorizationMac-wizard.component';
import {ClientAuthorizationVendorTable} from "./clientAuthorizationVendorTable/clientAuthorizationVendorTable";
import {ClientAuthorizationVendorAddWizardComponent } from './clientAuthorizationVendorTable/addByVendor-wizard/clientAuthorizationVendor-wizard.component';


import {AssetAuthorization} from "./assetAuthorization.component";
//import {MultiselectDropdownModule} from "angular-2-dropdown-multiselect";
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";
import {TabsPanelModule} from "../../commonModules/tabsPanelComponent/tabsPanel.module";
//import {CustomValidationMessagesComponent} from "../../commonServices/customValidationMessages.component";
//import { Ng2FileInputModule } from 'ng2-file-input';
@NgModule({
  imports: [
    TabsPanelModule,
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
    MultiselectDropdownModule
    // Ng2FileInputModule.forRoot()
  ],
  declarations: [
    AssetAuthorizationMacTable,
    AssetAuthorizationMacAddWizardComponent,
    AssetAuthorizationVendorTable,
    AssetAuthorizationVendorAddWizardComponent,
    SwitchAuthorizationMacTable,
    SwitchAuthorizationMacAddWizardComponent,
    SwitchAuthorizationVendorTable,
    SwitchAuthorizationVendorAddWizardComponent,
    ClientAuthorizationMacTable,
    ClientAuthorizationMacAddWizardComponent,
    ClientAuthorizationVendorTable,
 ClientAuthorizationVendorAddWizardComponent      ,
    AssetAuthorization
    ]
})
export class AssetAuthorizationModule {
}
