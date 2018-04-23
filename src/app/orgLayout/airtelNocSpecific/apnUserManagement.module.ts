import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import {routing} from "./apnUserManagement.routing";

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';

import {APNUserManagementTable} from "./apnUserManagementTable/apnUserManagementTable";
import {APNUserManagementAddWizardComponent } from './apnUserManagementTable/add-wizard/apnUserManagement-wizard.component';
//import {UserManagementModifyWizardComponent} from "./userManagementTable/modify-wizard/userManagement-modifywizard.component";

import {APNUserManagement} from "./apnUserManagement.component";
//import {CustomValidationMessagesComponent} from "../../commonServices/customValidationMessages.component";
//import { Ng2FileInputModule } from 'ng2-file-input';
@NgModule({
  imports: [
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
    
    // Ng2FileInputModule.forRoot()
  ],
  declarations: [
    APNUserManagementTable,
    APNUserManagementAddWizardComponent,
    //UserManagementModifyWizardComponent,
    APNUserManagement
    ],
  exports: [
    APNUserManagementTable,
    APNUserManagementAddWizardComponent,
    //UserManagementModifyWizardComponent,
    APNUserManagement
  ]
})
export class APNUserManagementModule {
}
