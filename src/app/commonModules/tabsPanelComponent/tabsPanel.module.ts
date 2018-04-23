import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {TabComponent} from "./tab.component";
import {TabsPanelComponent} from "./tabsPanel.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TabComponent,
        TabsPanelComponent
    ],
    exports: [
        TabComponent,
        TabsPanelComponent
    ]
})
export class TabsPanelModule {

}