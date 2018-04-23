import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import {routing} from "./portalBilingPolicies.routing";

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';

import {LoginPortalPolicyTable} from "./loginPortalPolicyTable/loginPortalPolicyTable";
import { LoginPortalPolicyAddWizardComponent} from "./loginPortalPolicyTable/add-wizard/loginPortalPolicy-wizard.component";

import {BillingPolicyTable} from "./billingPolicyTable/billingPolicyTable";
import { BillingPolicyAddWizardComponent} from "./billingPolicyTable/add-wizard/billingPolicy-wizard.component";

import {TabsPanelModule} from "../../commonModules/tabsPanelComponent/tabsPanel.module";
import {PortalBilingPolicies} from "./portalBilingPolicies.component";
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
    // Ng2FileInputModule.forRoot()
  ],
  declarations: [
    LoginPortalPolicyTable,
    LoginPortalPolicyAddWizardComponent,
    BillingPolicyTable,
    BillingPolicyAddWizardComponent,
    PortalBilingPolicies
    ]
})
export class PortalBilingPolicyModule {
}
