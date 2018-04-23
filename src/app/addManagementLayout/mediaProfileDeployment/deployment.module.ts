import { NgModule }      from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { routing }       from './deployment.routing';
import {TabsPanelModule} from "../../commonModules/tabsPanelComponent/tabsPanel.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import { deployment }  from './deployment.component';
import {deploymentMainTable} from "../mediaProfileDeployment/deploymentMain/deploymentMain.component";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import { NgaModule } from '../../theme/nga.module';
import {Ng2Webstorage} from 'ngx-webstorage';
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";
import {DeploymentAddWizardComponent} from "../mediaProfileDeployment/add-wizard/deployment-wizard.component"
import { DateTimePickerModule } from 'ng-pick-datetime';


@NgModule({
  imports: [
    CommonModule,
    routing,
    TabsPanelModule,
    ModalModule,
    WizardModule,
    FormsModule,
    ReactiveFormsModule,
    CollectionTableModule,
    NgaModule,
    Ng2Webstorage,
    MultiselectDropdownModule,
    DateTimePickerModule,
    
      ],
  declarations: [
    deployment,
    deploymentMainTable,
    DeploymentAddWizardComponent
  ],
  bootstrap: [ deployment ]
})
export class deploymentCreationModule { }


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/