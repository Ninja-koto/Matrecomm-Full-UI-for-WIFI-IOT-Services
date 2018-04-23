import { Routes, RouterModule }  from '@angular/router';

import { mediaLibrary } from './mediaLibrary.component';

// noinspection TypeScriptValidateTypes
export const routes:Routes=[
    {
        path:'',
        component:mediaLibrary
    }
]


export const routing = RouterModule.forChild(routes);