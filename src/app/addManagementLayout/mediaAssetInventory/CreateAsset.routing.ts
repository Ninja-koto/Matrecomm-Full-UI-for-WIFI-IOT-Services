import { Routes, RouterModule }  from '@angular/router';

import { CreateAsset } from './CreateAsset.component';

// noinspection TypeScriptValidateTypes
export const routes:Routes=[
    {
        path:'',
        component:CreateAsset
    }
]


export const routing = RouterModule.forChild(routes);