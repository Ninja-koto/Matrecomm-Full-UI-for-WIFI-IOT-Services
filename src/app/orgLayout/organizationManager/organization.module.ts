import { CUSTOM_ELEMENTS_SCHEMA,NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { OrganizationManager } from './organization.component';
import { routing }       from './organization.routing';
import {EmailServerComponent} from "./emailServer/emailServer.component";
import {EmailAddWizardComponent} from "./emailServer/add-wizard/email-wizard.component";

import {SMSGatewayComponent} from "./smsGateway/smsGateway.component";
import {SMSAddWizardComponent } from "./smsGateway/add-wizard/smsGateway-wizard.component";
import { RadiusServerComponent } from "./radiusServer/radiusServer.component";
import { RadiusAddWizardComponent} from './radiusServer/add-wizard/radiusServer-wizard.component';
import { AdminComponent } from "./admin/admin.component";
import {  AdminAddWizardComponent } from "./admin/add-wizard/admin-wizard.component";
import { SNMPComponent } from './snmpCredentials/snmp.component';
import { SNMPAddWizardComponent } from './snmpCredentials/add-wizard/snmp-wizard.component';
import { SSHComponent } from './sshCredentials/ssh.component';
import { SSHAddWizardComponent } from './sshCredentials/add-wizard/ssh-wizard.component';
import { TelnetComponent } from './telnetCredentials/telnet.component';
import { TelnetAddWizardComponent } from './telnetCredentials/add-wizard/telnet-wizard.component';
import { WEBComponent } from './webCredentials/web.component';
import { WEBAddWizardComponent } from './webCredentials/add-wizard/web-wizard.component';

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import {TabsPanelModule} from "../../commonModules/tabsPanelComponent/tabsPanel.module";

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';


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
    TabsPanelModule
  ],
  declarations: [
      EmailServerComponent,
      EmailAddWizardComponent,
      SMSGatewayComponent,
      SMSAddWizardComponent,
      RadiusServerComponent,
      RadiusAddWizardComponent,
      AdminComponent,
      AdminAddWizardComponent,
      SNMPComponent,
      SNMPAddWizardComponent,
      SSHComponent,
      SSHAddWizardComponent,
      TelnetComponent,
      TelnetAddWizardComponent,
      WEBComponent,
      WEBAddWizardComponent,
    OrganizationManager
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
      //EmailServerService
  ]
})
export class OrganizationModule {}
