import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './mediaDashboard.routing';
import { MediaDashboard } from './mediaDashboard.component';
import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";

import {ChartsModule} from "../../commonModules/chartsComponent/charts.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    CollectionTableModule,
    routing,
    ChartsModule
  ],
  declarations: [
    MediaDashboard,
  ],
  exports:[
    
    MediaDashboard,
    
   ],
})
export class MediaDashboardModule {}
