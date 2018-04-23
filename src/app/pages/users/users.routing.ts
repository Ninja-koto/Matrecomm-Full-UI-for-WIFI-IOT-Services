import { Routes, RouterModule }  from '@angular/router';

import { UsersComponent } from './users.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: UsersComponent
  }
];

export const routing = RouterModule.forChild(routes);
