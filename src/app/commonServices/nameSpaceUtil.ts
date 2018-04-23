
import {SessionStorageService} from "ngx-webstorage";
export class NameSpaceUtil
{
    ns:string="";;
    currentRole:string="";
    currentOrgType:string="";
    prodMgrName:string="";
    prodMgrUUID:string="";
    providerMgrUUID:string="";
    orgMgrName:string="";
    orgMgrUUID:string="";

    constructor(private storage:SessionStorageService) {
        /*console.log("In NameSpace Util...");
        console.log(this.storage.retrieve('productMgrName'));
        console.log(this.storage.retrieve('orgMgrUUID'));
        console.log(this.storage.retrieve('role'));
        console.log(this.storage.retrieve('orgType'));*/

        if(String(this.storage.retrieve("productMgrName"))!="undefined")
            this.prodMgrName = this.storage.retrieve("productMgrName");
        if(String(this.storage.retrieve("productMgrUUID"))!="undefined")
            this.prodMgrUUID = this.storage.retrieve("productMgrUUID");
        if(String(this.storage.retrieve("orgMgrName"))!="undefined")
            this.orgMgrName = this.storage.retrieve("orgMgrName");
        if(String(this.storage.retrieve("orgMgrUUID"))!="undefined")
            this.orgMgrUUID = this.storage.retrieve("orgMgrUUID");
        if(String(this.storage.retrieve("orgType"))!="undefined")
            this.currentOrgType = this.storage.retrieve("orgType");
        if(String(this.storage.retrieve("role"))!="undefined")
            this.currentRole = this.storage.retrieve("role");
        if(String(this.storage.retrieve("providerMgrUUID"))!="undefined")
            this.providerMgrUUID = this.storage.retrieve("providerMgrUUID")
    }
    getNameSpace(collName:string) {
        //console.log("In getNameSpace...");
        //console.log(this.prodMgrName+" . "+this.orgMgrUUID);
        if(String(this.currentRole)=="CraftAirOrgMgr")
        {
            if( (String(this.prodMgrName)!="")&&(String(this.orgMgrUUID)!="")&&(String(collName)!="") )
            {
                this.ns = this.prodMgrName+"."+this.orgMgrUUID+"."+collName;
                //this.ns = this.prodMgrName+"."+this.providerMgrUUID+"."+this.orgMgrUUID+"."+collName;
            }
            else
                this.ns="";
        }
        else if(String(this.currentRole)=="CraftAirVehicleAdmin")
        {
            if( (String(this.prodMgrName)!="")&&(String(this.orgMgrUUID)!="")&&(String(collName)!="") )
            {
                this.ns = this.prodMgrName+"."+this.orgMgrUUID+"."+collName;
                //this.ns = this.prodMgrName+"."+this.providerMgrUUID+"."+this.orgMgrUUID+"."+collName;
            }
            else
                this.ns="";
        }
        else if(String(this.currentRole)=="CraftAirOrgViewer")
        {
            if( (String(this.prodMgrName)!="")&&(String(this.orgMgrUUID)!="")&&(String(collName)!="") )
            {
                this.ns = this.prodMgrName+"."+this.orgMgrUUID+"."+collName;
                //this.ns = this.prodMgrName+"."+this.providerMgrUUID+"."+this.orgMgrUUID+"."+collName;
            }
            else
                this.ns="";
        }

        else if(String(this.currentRole)=="CraftAirProductMgr")
        {
            if( (String(this.prodMgrName)!="")&&(String(collName)!="") )
            {
                this.ns = this.prodMgrName+"."+collName;
            }
            else
                this.ns="";
        }
        return this.ns;
    }


}
