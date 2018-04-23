import { Routes, RouterModule }  from '@angular/router';

import { blockedDevice } from './blockedDevice.component';

// noinspection TypeScriptValidateTypes
export const routes:Routes=[
    {
        path:'',
        component:blockedDevice
    }
]


export const routing = RouterModule.forChild(routes);