import { Routes, RouterModule }  from '@angular/router';

import { UserManagement } from './userManagement.component';

// noinspection TypeScriptValidateTypes
export const routes:Routes=[
    {
        path:'',
        component:UserManagement
    }
]


export const routing = RouterModule.forChild(routes);