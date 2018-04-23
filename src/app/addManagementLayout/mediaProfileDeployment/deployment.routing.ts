import { Routes, RouterModule }  from '@angular/router';

import { deployment } from './deployment.component';

// noinspection TypeScriptValidateTypes
export const routes:Routes=[
    {
        path:'',
        component:deployment
    }
]


export const routing = RouterModule.forChild(routes);