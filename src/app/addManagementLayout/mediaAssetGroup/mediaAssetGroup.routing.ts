import { Routes, RouterModule }  from '@angular/router';

import { MediaAssetGroup } from './mediaAssetGroup.component';

// noinspection TypeScriptValidateTypes
export const routes:Routes=[
    {
        path:'',
        component:MediaAssetGroup
    }
]


export const routing = RouterModule.forChild(routes);