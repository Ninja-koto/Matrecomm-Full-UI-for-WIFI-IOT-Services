import {Routes, RouterModule} from "@angular/router"
import {ModuleWithProviders} from "@angular/core"
import {MediaManagement}from "./mediaManagement.component"
export const routes:Routes=[
    {
        path:"",
        component:MediaManagement,
        children:[
        ]
    }
]
export const routing: ModuleWithProviders = RouterModule.forChild(routes);

