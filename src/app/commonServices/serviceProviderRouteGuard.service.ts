import { Injectable} from '@angular/core';
import {CanActivate,Router} from "@angular/router";
import {SessionStorageService} from "ngx-webstorage";


@Injectable()

export class ServiceProviderRouteGuard implements CanActivate {
    constructor(protected router: Router, private storage:SessionStorageService) {}
     canActivate() {
         console.log("In canActivate");
         if((String(this.storage.retrieve("productMgrName"))=="null")||
            (String(this.storage.retrieve("role"))=="null"))
            {
                this.router.navigate(['/login']);
                return false;
            }
            else
            {
                if(String(this.storage.retrieve("role"))=="CraftAirProductMgr")
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
