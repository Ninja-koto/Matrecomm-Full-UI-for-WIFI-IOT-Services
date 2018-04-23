import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { ServiceProviderManager } from './serviceProviderManager.component';
import { routing }       from './serviceProviderManager.routing';
import {EmailServerComponent} from "./emailServer/emailServer.component";
import {EmailAddWizardComponent} from "./emailServer/add-wizard/email-wizard.component";

import {SMSGatewayComponent} from "./smsGateway/smsGateway.component";
import {SMSAddWizardComponent } from "./smsGateway/add-wizard/smsGateway-wizard.component";
import { AdminComponent } from "./admin/admin.component";
import {  AdminAddWizardComponent } from "./admin/add-wizard/admin-wizard.component";
import {DataCenterComponent} from "./dataCenter/dataCenter.component";
import {DataCenterWizardComponent} from "./dataCenter/add-wizard/add-wizard.component";
import {ProductManagerOrganizationComponent} from "./organization/organization.component";
import {ProductManagerOrganizationWizardComponent} from "./organization/add-wizard/add-wizard.component";

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';
//import {MultiselectDropdownModule} from "angular-2-dropdown-multiselect";
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";
import {DateTimePickerModule} from "ng-pick-datetime";
import {TabsPanelModule} from "../../commonModules/tabsPanelComponent/tabsPanel.module";

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
    MultiselectDropdownModule,
    DateTimePickerModule,
    ModalModule,
    WizardModule
  ],
  declarations: [
      EmailServerComponent,
      EmailAddWizardComponent,
      SMSGatewayComponent,
      SMSAddWizardComponent,
      AdminComponent,
      AdminAddWizardComponent,
      DataCenterComponent,
      DataCenterWizardComponent,
      ProductManagerOrganizationComponent,
      ProductManagerOrganizationWizardComponent,
      ServiceProviderManager
  ],
  providers: [
      //EmailServerService
  ]
})
export class ServiceProviderManagerModule {}
