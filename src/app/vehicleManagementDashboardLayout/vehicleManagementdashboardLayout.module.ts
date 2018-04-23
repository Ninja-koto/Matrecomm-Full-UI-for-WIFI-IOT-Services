import { CUSTOM_ELEMENTS_SCHEMA,NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing }       from './vehicleManagementdashboardLayout.routing';
import { NgaModule } from '../theme/nga.module';
import { VehicleManagementdashboardLayout } from './vehicleManagementdashboardLayout.component';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {ChartsModule} from "../commonModules/chartsComponent/charts.module";



import { TreeSidebar } from './sidebar/treeSidebar/treeSidebar.component';
import {  TreeMenu } from './sidebar/treeMenu/treeMenu.component';
import {TreeMenuItem } from './sidebar/treeMenu/components/treeMenuItem/treeMenuItem.component';
import {TreeMenuService} from "./sidebar/treeMenu/treeMenu.service";

import { TreeModule } from 'angular-tree-component';
import { TreeComponentModule } from "../commonModules/treeComponent/tree.module";
import {TabsPanelModule} from "../commonModules/tabsPanelComponent/tabsPanel.module";
import {CollectionTableModule} from "../commonModules/collectionTable/collectionTable.module";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";

@NgModule({ 
    imports: [
      ChartsModule,
      PageTopModule,
      TreeModule,
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    NgxChartsModule,
    TreeComponentModule,
    TabsPanelModule,
    CollectionTableModule
  ],
  declarations: [
    //TreeComponent,
    VehicleManagementdashboardLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
  ],
 exports:[
    VehicleManagementdashboardLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem 
  ],
    schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    TreeMenuService
  ]
})
export class VehicleManagementDashboardLayoutModule {
}
