import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { routing }       from './mediaLibrary.routing';
import { mediaLibrary }  from './mediaLibrary.component';
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import { NgaModule } from '../../theme/nga.module';
import {Ng2Webstorage} from 'ngx-webstorage';
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";
import {MediaLibraryAddWizardComponent} from "../mediaStore/add-wizard/mediaLibrary-wizard.component";

import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  imports: [
    CommonModule,
    routing,
     ModalModule,
    WizardModule,
    FormsModule,
     ReactiveFormsModule,
     CollectionTableModule,
     NgaModule,
     Ng2Webstorage,
     MultiselectDropdownModule,
     FilterPipeModule
  ],
  declarations: [
    mediaLibrary,
    MediaLibraryAddWizardComponent
  ]
})
export class mediaLibraryModule { }


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/