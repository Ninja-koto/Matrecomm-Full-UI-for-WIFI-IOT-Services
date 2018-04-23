import { Injectable} from '@angular/core';
import {CanActivate,Router} from "@angular/router";
import {SessionStorageService} from "ngx-webstorage";

@Injectable()
export class OrgViewerRouteGuard implements CanActivate {
    constructor(protected router: Router, private storage:SessionStorageService) {}
     canActivate() {
         /*console.log("Checking for Active....");
         console.log(this.storage.retrieve("productMgrName"));
         console.log(this.storage.retrieve("productMgrUUID"));
         console.log(this.storage.retrieve("orgMgrName"));
         console.log(this.storage.retrieve("orgMgrUUID"));
         console.log(this.storage.retrieve("orgType"));
         console.log(this.storage.retrieve("role"));*/
         if((String(this.storage.retrieve("productMgrName"))=="null")||
            (String(this.storage.retrieve("productMgrUUID"))=="null")||
            (String(this.storage.retrieve("orgMgrName"))=="null")||
            (String(this.storage.retrieve("orgMgrUUID"))=="null")||
            //(String(this.storage.retrieve("orgType"))=="null")||
            (String(this.storage.retrieve("role"))=="null"))
            {
                this.router.navigate(['/login']);
                return false;
            }
            else
            {
                if((String(this.storage.retrieve("role"))=="CraftAirOrgMgr")||
                    (String(this.storage.retrieve("role"))=="CraftAirVehicleAdmin")||
                    (String(this.storage.retrieve("role"))=="CraftAirOrgViewer"))
                {
                    console.log("All are OK....");
                    return true;
                }
                else
                {
                    this.router.navigate(['/login']);
                    return false;
                }
            }
    }
}
