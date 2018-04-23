import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import {ServiceProviderHome} from './serviceProviderHome.component';
import { routing }       from './serviceProviderHome.routing';

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
    routing
  ],
  declarations: [
      ServiceProviderHome
  ],
  providers: [
      //EmailServerService
  ]
})
export class ServiceProviderHomeModule {}
