
import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {LoginService} from "./login.service";
import {Router} from "@angular/router";
import {Credentials} from "./credentials";
import 'style-loader!./login.scss';
import {CoolSessionStorage} from "angular2-cool-storage";
import {SessionStorage} from "../../commonServices/sessionStorage";
import {SessionStorageService} from "ngx-webstorage";
import {BaThemeSpinner} from "../../theme/services";

@Component({
  selector: 'login',
  templateUrl: './login.html',
  providers:[LoginService]
})
export class Login {

  sessionStorage:CoolSessionStorage;
  public form:FormGroup;
  public UserID:AbstractControl;
  public Password:AbstractControl;
  public submitted:boolean = false;
  showLoginErrorMsg:string = "none";
  errorMsg:string="";

  constructor(fb:FormBuilder, private storage:SessionStorageService,private _spinner:BaThemeSpinner,
   private loginService:LoginService, private router:Router) {
    //SessionStorage.getInstance().clear();
    this.storage.clear();
    this.form = fb.group({
      'UserID': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'Password': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });

    this.UserID = this.form.controls['UserID'];
    this.Password = this.form.controls['Password'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    this.errorMsg="";
    this.showLoginErrorMsg="none";
    if (this.form.valid) {
      // your code goes here
       console.log(values);
       this._spinner.show();
       const credentials = new Credentials(
            this.form.value.UserID,
            this.form.value.Password);

         this.loginService.signin(credentials)
        .subscribe(
            data=>{
                /*localStorage.setItem('token',data.token);
                localStorage.setItem('userId',data.userId);
                this.router.navigateByUrl('/userManagement');*/
                console.log("response data");
                console.log(data);
                let resData = JSON.parse(data.result);
                console.log(resData);
                try{
                  if((String(resData.Status)=="Success")||(String(resData.Status)=="success"))
                  {
                      this.storage.store("role",resData.role);
                      this.storage.store("loginStatus",resData.Status);
                      this.storage.store("productMgrName",resData.CraftAirProductMgrName);
                      this.storage.store("productMgrUUID",resData.CraftAirProductMgrUUID);
                    if(String(resData.role)=="CraftAirOrgMgr")
                    {console.log("In Org...");
                      this.storage.store("AccessPrivileges",resData.AccessPrivileges);
                      this.storage.store("orgMgrName",resData.CraftAirOrgMgrName);
                      this.storage.store("orgMgrUUID",resData.CraftAirOrgMgrUUID);
                      this.storage.store("orgLicenseStatus",resData.LicenseStatus);
                      this.storage.store("orgLicenseMessage",resData.LoginLicenseMessage);
                      this.storage.store("orgMessage",resData.Message);
                      if((String(resData.OrgType)!="undefined")&&(String(resData.OrgType)!=""))
                        this.storage.store("orgType",resData.OrgType);
                      this.storage.store("loggedInUserName",resData.userName);
                      if((String(resData.CraftAirProviderMgrUUID)!="undefined")&&(String(resData.CraftAirProviderMgrUUID)!=""))
                        this.storage.store("providerMgrUUID",resData.CraftAirProviderMgrUUID);
                      
                      if(String(values["UserID"]).indexOf("digivive")>=0 )
                        this.router.navigateByUrl("/mediaMgmt1/mediaStore");
                      else
                        this.router.navigateByUrl("/org/organization");
                      //this.router.navigateByUrl("/dashboardLayout/dashboard");
                    }
                    else if(String(resData.role)=="CraftAirOrgViewer")
                    {
                      this.storage.store("AccessPrivileges",resData.AccessPrivileges);
                      this.storage.store("orgMgrName",resData.CraftAirOrgMgrName);
                      this.storage.store("orgMgrUUID",resData.CraftAirOrgMgrUUID);
                      if((String(resData.OrgType)!="undefined")&&(String(resData.OrgType)!=""))
                        this.storage.store("orgType",resData.OrgType);
                      this.storage.store("loggedInUserName",resData.userName);
                      if((String(resData.CraftAirProviderMgrUUID)!="undefined")&&(String(resData.CraftAirProviderMgrUUID)!=""))
                        this.storage.store("providerMgrUUID",resData.CraftAirProviderMgrUUID);
                      console.log("storage");
                      console.log(this.storage);
                      //this.router.navigateByUrl("/org/organization");
                      //this.router.navigateByUrl("/org/onlyDashboard")
                      this.router.navigateByUrl("/commonDashboardLayout/dashboard")
                    }
                    else if(String(resData.role)=="CraftAirProductMgr")
                    {
                      console.log("In serviceProvider...");

                      this.router.navigateByUrl("/serviceProvider/home");
                    }
                    else if(String(resData.role)=="CraftAirVehicleAdmin")
                    {console.log("In Vehicle Layout...");
                      this.storage.store("AccessPrivileges",resData.AccessPrivileges);
                      this.storage.store("orgMgrName",resData.CraftAirOrgMgrName);
                      this.storage.store("orgMgrUUID",resData.CraftAirOrgMgrUUID);
                      this.storage.store("orgLicenseStatus",resData.LicenseStatus);
                      this.storage.store("orgLicenseMessage",resData.LoginLicenseMessage);
                      this.storage.store("orgMessage",resData.Message);
                      if((String(resData.OrgType)!="undefined")&&(String(resData.OrgType)!=""))
                        this.storage.store("orgType",resData.OrgType);
                      this.storage.store("loggedInUserName",resData.userName);
                      if((String(resData.CraftAirProviderMgrUUID)!="undefined")&&(String(resData.CraftAirProviderMgrUUID)!=""))
                        this.storage.store("providerMgrUUID",resData.CraftAirProviderMgrUUID);
                      console.log("storage");
                      console.log(this.storage);
                      this.router.navigateByUrl("/vehicle/manager");
                    }
                    else{
                    this.errorMsg="Invalid Credentials";
                    this.showLoginErrorMsg="block";
                    this._spinner.hide();
                    }
                }
                else
                {
                  this.errorMsg="Invalid UserName/ Password";
                  this.showLoginErrorMsg="block";
                  this._spinner.hide();
                }
              }
              catch(e)
              {
                console.log(e);
                this.errorMsg="Invalid Credentials";
                this.showLoginErrorMsg="block";
                this._spinner.hide();
              }

           },
            error => {
              console.error(error)
              console.log(this.form.pristine);
              console.log(this.form.value.UserID);
              this.errorMsg="Server Not Reachable";
              this.showLoginErrorMsg="block";
              this._spinner.hide();
              this.form.reset();
            },
        );
        console.log(this.form.pristine);
        console.log(this.form.value.UserID);
        this.form.reset();
    }
  }
}
