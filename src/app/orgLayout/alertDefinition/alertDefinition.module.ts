import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import {routing} from "./alertDefinition.routing";

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';

import {AlertTeamUsersTable} from "./alertTeamUsersTable/alertTeamUsersTable";
import {AlertTeamUsersAddWizardComponent } from './alertTeamUsersTable/add-wizard/alertTeamUsers-wizard.component';

import {AlertEscalationProfileTable} from "./alertEscalationProfileTable/alertEscalationProfileTable";
import { AlertEscalationAddWizardComponent} from './alertEscalationProfileTable/add-wizard/alertEscalationProfile-wizard.component';

import { AlertNotificationAddWizardComponent} from './alertNotificationTable/add-wizard/alertNotification-wizard.component';

import {AlertNotificationTable} from "./alertNotificationTable/alertNotificationTable";

import { AlertTeamProfilesTable} from "./alertTeamProfilesTable/alertTeamProfilesTable";
import { AlertTeamProfilesAddWizardComponent} from './alertTeamProfilesTable/add-wizard/alertTeamProfiles-wizard.component';

//import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";
//import {MultiselectDropdown} from "angular-2-dropdown-multiselect";

import {AlertDefinition} from "./alertDefinition.component";
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
        MultiselectDropdownModule,

    // Ng2FileInputModule.forRoot()
  ],
  declarations: [
    AlertTeamUsersTable,
    AlertTeamUsersAddWizardComponent,
    AlertEscalationProfileTable,
    AlertEscalationAddWizardComponent,
    AlertNotificationTable,
    AlertTeamProfilesTable,
    AlertTeamProfilesAddWizardComponent,
AlertNotificationAddWizardComponent,
    AlertDefinition
    ]
})
export class AlertDefinitionModule {
}
