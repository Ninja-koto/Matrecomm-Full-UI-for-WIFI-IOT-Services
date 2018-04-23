import { Routes, RouterModule }  from '@angular/router';

import { profileCreation } from './ProfileCreation.component';

// noinspection TypeScriptValidateTypes
export const routes:Routes=[
    {
        path:'',
        component:profileCreation
    }
]


export const routing = RouterModule.forChild(routes);