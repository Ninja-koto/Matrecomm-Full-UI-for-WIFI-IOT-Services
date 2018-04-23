import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import { routing }       from './pages.routing';
import { NgaModule } from '../theme/nga.module';

import { Pages } from './pages.component';
//import {UsersComponent} from "./users/users.component";
import {Ng2Webstorage} from 'ngx-webstorage';
import { Login } from './login/login.component';

@NgModule({
  imports: [Ng2Webstorage ,CommonModule,
    FormsModule,ReactiveFormsModule,
     NgaModule, routing],
  declarations: [Pages/*, UsersComponent*/,Login]
})
export class PagesModule {
}
