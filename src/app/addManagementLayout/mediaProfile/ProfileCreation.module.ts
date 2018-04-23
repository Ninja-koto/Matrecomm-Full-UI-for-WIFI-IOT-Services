import { NgModule }      from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { routing }       from './ProfileCreation.routing';
import {TabsPanelModule} from "../../commonModules/tabsPanelComponent/tabsPanel.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import { profileCreation }  from './ProfileCreation.component';
import {ProfileMediaTable} from './ProfileMedia/ProfileMedia.component';
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import { NgaModule } from '../../theme/nga.module';
import {Ng2Webstorage} from 'ngx-webstorage';
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";
import {ProfileMediaAddWizardComponent} from "../mediaProfile/add-wizard/ProfileCreation-wizard.component"
import { AngularDualListBoxModule } from 'angular-dual-listbox';


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
     AngularDualListBoxModule
      ],
  declarations: [
    profileCreation,
    ProfileMediaTable,
    ProfileMediaAddWizardComponent
  ],
  bootstrap: [ profileCreation ]
})
export class profileCreationModule { }


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/