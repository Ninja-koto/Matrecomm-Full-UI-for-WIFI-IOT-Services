import { CUSTOM_ELEMENTS_SCHEMA,NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing }       from './nocDashboardLayout.routing';
import { NgaModule } from '../theme/nga.module';
import { NocDashboardLayout } from './nocDashboardLayout.component';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { TreeSidebar } from './sidebar/treeSidebar/treeSidebar.component';
import {  TreeMenu } from './sidebar/treeMenu/treeMenu.component';
import {TreeMenuItem } from './sidebar/treeMenu/components/treeMenuItem/treeMenuItem.component';
import {UserItem} from "./sidebar/treeMenu/components/userItem/userItem.component";
import { TreeModule } from 'angular-tree-component';
import {TreeMenuService} from "./sidebar/treeMenu/treeMenu.service";
import { TreeComponentModule } from "../commonModules/treeComponent/tree.module";
//import {TabsPanelModule} from "../commonModules/tabsPanelComponent/tabsPanel.module";
//import {CollectionTableModule} from "../commonModules/collectionTable/collectionTable.module";
import {CollectionTableModule1} from "../commonModules/collectionTable1/collectionTable.module1";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";
//import {ChartsModule} from "../commonModules/chartsComponent/charts.module";
import {ChartsModule1} from "../commonModules/chartsComponent1/charts.module1";
import { Daterangepicker } from 'ng2-daterangepicker';
import {DashTabComponent} from "./dashTab.component";
import {DashTabsPanelComponent} from "./dashTabsPanel.component"
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import {UpTimeChartComponent} from "./upTimeChart.component";
import {TXRXChartComponent} from "./txrxChart.component";
//import { AgmCoreModule } from '@agm/core';
@NgModule({ 
    imports: [
      ModalModule,
      Daterangepicker,
      ChartsModule1,
      PageTopModule,
      TreeModule,
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    NgxChartsModule,
    TreeComponentModule,
    //TabsPanelModule,
    CollectionTableModule1/*,
    AgmCoreModule.forRoot({
      apiKey: ''
    })*/
  ],
  declarations: [
    TXRXChartComponent,
    UpTimeChartComponent,
    NocDashboardLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    UserItem,
    DashTabComponent,
    DashTabsPanelComponent
  ],
 exports:[
  TXRXChartComponent,
  UpTimeChartComponent,
    NocDashboardLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    UserItem,
    DashTabComponent,
    DashTabsPanelComponent 
  ],
    schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    TreeMenuService
  ]
})
export class NocDashboardLayoutModule {
}
