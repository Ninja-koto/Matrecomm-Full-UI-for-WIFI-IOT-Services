import { CUSTOM_ELEMENTS_SCHEMA,NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing }       from './fDashboardLayout.routing';
import { NgaModule } from '../theme/nga.module';
import { FDashboardLayout } from './fDashboardLayout.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {ChartsModule} from "../commonModules/chartsComponent/charts.module";
import {FDHistLogs} from "./fDHistLogs.component";

import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import { TreeSidebar } from './sidebar/treeSidebar/treeSidebar.component';
import {  TreeMenu } from './sidebar/treeMenu/treeMenu.component';
import {TreeMenuItem } from './sidebar/treeMenu/components/treeMenuItem/treeMenuItem.component';
import {TreeMenuService} from "./sidebar/treeMenu/treeMenu.service";

import { TreeModule } from 'angular-tree-component';
import { TreeComponentModule } from "../commonModules/treeComponent/tree.module";
import {TabsPanelModule} from "../commonModules/tabsPanelComponent/tabsPanel.module";
import {CollectionTableModule} from "../commonModules/collectionTable/collectionTable.module";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";
import { DateTimePickerModule } from 'ng-pick-datetime';
import{MultiselectDropdownModule} from "../commonModules/multiSelect/dropdown.module";
import {OrgViewerRouteGuard} from "../commonServices/orgViewerRouterGuard.service";

@NgModule({ 
    imports: [
      MultiselectDropdownModule,
      DateTimePickerModule,
      ModalModule,
      ChartsModule,
      PageTopModule,
      TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    FDashboardLayout,
    FDHistLogs,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
  ],
 exports:[
    FDashboardLayout,
    FDHistLogs,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem 
  ],
    schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    TreeMenuService,
    OrgViewerRouteGuard
  ]
})
export class FDashboardLayoutModule {
}
