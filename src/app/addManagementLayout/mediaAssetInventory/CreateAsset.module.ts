import { NgModule }      from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { routing }       from './CreateAsset.routing';
import {TabsPanelModule} from "../../commonModules/tabsPanelComponent/tabsPanel.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import { CreateAsset }  from './CreateAsset.component';
import {CreateAssetMediaTable} from "../mediaAssetInventory/CreateAssetMain/CreateAssetMain.component";;
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import { NgaModule } from '../../theme/nga.module';
import {Ng2Webstorage} from 'ngx-webstorage';
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";
import {CreateAssetAddWizardComponent} from "../mediaAssetInventory/add-wizard/CreateAsset-wizard.component"


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
     MultiselectDropdownModule
      ],
  declarations: [
      CreateAsset,
    CreateAssetMediaTable,
    CreateAssetAddWizardComponent
  ],
  bootstrap: [ CreateAsset ]
})
export class CreateAssetModule { }


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/