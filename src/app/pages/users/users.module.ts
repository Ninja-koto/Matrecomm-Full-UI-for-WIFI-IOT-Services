
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import {HttpModule} from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './users.routing';
import {UsersComponent} from "./users.component";
import {UserPipe} from "./user.pipe";
import {UsersService} from "./users.service";

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";


//import {DefaultModal} from "./default-modal/default-modal.component";
//import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {AddWizardComponent} from "./add-wizard/add-wizard.component";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    CollectionTableModule,
    WizardModule,
    //NgbDropdownModule,NgbModalModule,
    ModalModule,
    HttpModule
  ],
  declarations: [
    UsersComponent,
    UserPipe,
    AddWizardComponent
  ],
  entryComponents: [
    //DefaultModal
  ],
})
export class UsersModule {}
