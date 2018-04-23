import { CUSTOM_ELEMENTS_SCHEMA,NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing }       from './dashboardLayout.routing';
import { NgaModule } from '../theme/nga.module';
import { ServiceProviderDashboardLayout } from './dashboardLayout.component';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

//import {TreeComponent} from "../treeComponent/tree.component";

import { TreeSidebar } from './sidebar/treeSidebar/treeSidebar.component';
import {  TreeMenu } from './sidebar/treeMenu/treeMenu.component';
import {TreeMenuItem } from './sidebar/treeMenu/components/treeMenuItem/treeMenuItem.component';
import {OrgItem} from "./sidebar/treeMenu/components/orgItem/orgItem.component";
import { TreeModule } from 'angular-tree-component';
import {TreeMenuService} from "./sidebar/treeMenu/treeMenu.service";
import { TreeComponentModule } from "../commonModules/treeComponent/tree.module";
import {TabsPanelModule} from "../commonModules/tabsPanelComponent/tabsPanel.module";
import {CollectionTableModule} from "../commonModules/collectionTable/collectionTable.module";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";


/*import { NgxLineChartComponent } from './components/ngxLineChart/ngxLineChart.component';
import { VerticalBarChartComponent } from './components/verticalBarChart/verticalBarChart.component';
import { AdvancedPieChartComponent } from './components/advancedPieChart/advancedPieChart.component';
import {DashboardTable} from "./components/dashboardTable/dashboardTable.component";
import {RadiusAcctSessionsTable} from "./components/dashboardTable/radiusAcctSessTable.component";*/
import {ServiceProviderDashboard} from "./components/dashboard.component";
import {ChartsModule} from "../commonModules/chartsComponent/charts.module";
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
    /*NgxLineChartComponent,
    VerticalBarChartComponent,
    AdvancedPieChartComponent,
    DashboardTable,
    RadiusAcctSessionsTable,*/
    ServiceProviderDashboardLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    OrgItem,
    ServiceProviderDashboard
  ],
 exports:[
   /*NgxLineChartComponent,
    VerticalBarChartComponent,
    AdvancedPieChartComponent,
    DashboardTable,
    RadiusAcctSessionsTable,*/
    ServiceProviderDashboardLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    OrgItem,
    ServiceProviderDashboard
  ],
    schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    TreeMenuService
  ]
})
export class ServiceProviderDashboardLayoutModule {
}
