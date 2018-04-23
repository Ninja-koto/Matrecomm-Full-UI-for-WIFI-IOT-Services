import {Routes,RouterModule} from "@angular/router"
import {ModuleWithProviders} from "@angular/core"
import {AdvertisementManagement} from "./advMgmt.component"

export const routes:Routes=[
    {
        path:'',
        component:AdvertisementManagement
    }
]

export const routing:ModuleWithProviders= RouterModule.forChild(routes);