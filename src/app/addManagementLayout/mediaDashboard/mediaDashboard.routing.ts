import { Routes, RouterModule }  from '@angular/router';

import { MediaDashboard } from './mediaDashboard.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: MediaDashboard,
  }
];

export const routing = RouterModule.forChild(routes);
