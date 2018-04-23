import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import {BrowserModule} from "@angular/platform-browser";
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import {OrganizationHome} from './orgHome.component';
import { routing }       from './orgHome.routing';

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
//import {Ng2FileDropModule} from "ng2-file-drop";


@NgModule({
  imports: [
    //BrowserModule,
   // Ng2FileDropModule,
   DynamicFormModule,
    Ng2Webstorage,
    CoolStorageModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppTranslationModule,
    NgaModule,
    routing
  ],
  declarations: [
      OrganizationHome
  ],
  providers: [
      //EmailServerService
  ]
})
export class OrganizationHomeModule {}
