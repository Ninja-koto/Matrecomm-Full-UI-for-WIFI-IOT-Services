import {FormControl} from '@angular/forms';


export class CustomValidator {
static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'minPortErr': 'Port should be greaterthan 100',
            'maxPortErr': 'Port should be lessthan 65535',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'maxlength': `Maximum length ${validatorValue.requiredLength}`,
            'selectError':'Selection required',
            'ipv4Err':'Please provide valid IPv4 Address',
            'ipv6Err':'Please enter correct ipv6 address Ex:2001:cdba:0000:0000:0000:0000:3257:9652',
            'email':'Please provide a valid email',
            'mobile':'Please provide valid mobile number',
            'invalidConfigFile':'Please provide valid config file',
            'selectConfigFile':'Please select config file',
            'invalidCSVFile':'Please provide valid csv file',
            'selectCSVFile':'Please select csv file',
            "stSTet":"Start time should be smaller",
            "etGTst":"End time should be greater",
            "selectWeekDays":"Please select week days",
            "ftpUrlErr":"Format should be ftp://abc.com",
            "tftpUrlErr":"Format should be tftp://abc.com",
            "httpUrlErr":"Format should be http://abc.com",
            "macError":"Please enter valid Mac Address",
            'subnetErr':'Please enter a valid subnet mask  Ex. 255.255.255.0',
            "zip":"Please provide a valid zipCode",
            'maxVlanErr': 'Vlan should be greaterthan 1 and lessthan 4094', 
            'leaseTimeErr': 'Lease time should be greater than 179 sec',
            'maxArubaPortErr': 'Port should be lessthan 65535',
            'aaaPortErr':'port should be >= 1 and <= 65535 ',
            'arubaleaseTimeErr':'Minutes should be >= 2  and <= 1440 mins ',
            'arubaVpnPktSendFreqErr':'Seconds should be >= 1  and <= 3600 secs ',
            'arubaVpnPktLostCntErr':'Packets should be >= 1  and <= 1000 Packets ',
            'arubaReconnectTimeErr':'Seconds should be >= 30  and <= 900 secs ',
            'arubaHoldTimeErr':'Seconds should be >= 0  and <= 950399 secs ',
            'arubaBeaconErr':'Seconds should be >= 60  and <= 500 secs ',
            'arubaInactivityErr':'Seconds should be >= 60  and <= 86400 secs ',
            'arubaMaxClientsErr':'Clients should be >= 0  and <= 255 clients',
            'arubaAcctIntervalErr':'Seconds should be >= 0  and <= 3600 secs ',
            "matrecommLeaseTimeErr":'Lease time should be >= 1 and <= 24 hrs',
            "matrecommLimitAddressesErr":'Maximum addresses should be >= 1 and <= 255 ',
            "matrecommStartAddressesErr":'Start address should be >= 1 and <= 255 ',
        };

        return config[validatorName];
    }
   static isValidMailFormat(control: FormControl){
     //   let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        let EMAIL_REGEXP =/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/; 
        if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
          //  return { "Please provide a valid email": true };
          return { "email": true };
        }
        return null;
    }

static zipcodeValidation(control:FormControl)
    {
       let ZipCode_REGEXP =/^[a-zA-Z0-9]{2,}$/; 
        if (control.value != "" && (control.value.length <6 || !ZipCode_REGEXP.test(control.value))) {
          //  return { "Please provide a valid zipCode": true };
          return { "zip": true };
        }
        return null;
    }

static mobileNumberValidation(control:FormControl)
    {
       let Mobile_REGEXP =/^(\+\d{1,3}[- ]?)?\d{10}$/; 
       if(control.value==null)
       return { "mobile": true };
        if (control.value != "" && (control.value.length <= 5 || !Mobile_REGEXP.test(control.value))) {
          //  return { "Please provide a valid email": true };
          return { "mobile": true };
        }
        return null;
    }
static macAddressValidation(control:any)
    {
       //let Mac_REGEXP = /^[0-9A-Fa-f]{12}$/;
       var Mac_REGEXP = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (!Mac_REGEXP.test(control.value)) {
          //  return { "Please provide a valid email": true };
          return { "macError": true };
        }
        return null;
    }

    static portValidation(control:FormControl)
    {
      if(Number(control.value)<100)
        return {'minPortErr':true};
      else if(Number(control.value)>65535)
        return {'maxPortErr':true};
      else
        return null;
    }

    static selectFromSelectBox(control:FormControl)
    {console.log("Value...");
        console.log(control.value);
        if(String(control.value)=="")
            return {'selectError':true};
        else
            return null;
    }
 static subnetValidation(control:FormControl)
    {
        var ipRegEx=/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          if(String(control.value)=="")
         return null;
        if (control.value != "" && (!ipRegEx.test(control.value))) {
            return { "subnetErr": true };
        }
        else
            return null;
    }
    static ipv4AddressValidation(control:FormControl)
    {
        var ipRegEx=/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (control.value != "" && (!ipRegEx.test(control.value))) {
            return { "ipv4Err": true };
        }
        else
            return null;
    }
    static ipv6AddressValidation(control:FormControl)
    {
      //  var ipRegEx=/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
     var ipRegEx=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

        if (control.value != "" && (!ipRegEx.test(control.value))) {
            return { "ipv6Err": true };
        }
        else
            return null;
    }

    //Aruba Specific
    static portArubaValidation(control:FormControl)
    {
      if(Number(control.value)<1)
        return {'minArubaPortErr':true};
      else if(Number(control.value)>65535)
        return {'maxArubaPortErr':true};
      else
        return null;
    }
    static vlanValidation(control:FormControl)
    { 
      console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<1 || Number(control.value)>4094)
      {
        console.log('aaaa...');   
        return {'maxVlanErr':true};
      }
      else
        return null;
    }
    static leaseTimeValidation(control:FormControl)
    {
      if(Number(control.value)<179)
        return {'leaseTimeErr':true};
    //  else if(Number(control.value)>65535)
       // return {'maxArubaPortErr':true};
      else
        return null;
    }

     static arubaLeaseTimeValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<2 || Number(control.value)>1440)
      {
        return {'arubaleaseTimeErr':true};
      }
      else
        return null;
    }       
 static arubaBeaconValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<60 || Number(control.value)>500)
      {
        return {'arubaBeaconErr':true};
      }
      else
        return null;
    }        

static arubaAccountingIntervalValidation(control:FormControl)
    { 
      //console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<0 || Number(control.value)>60)
      {
        return {'arubaAcctIntervalErr':true};
      }
      else
        return null;
    }  


 static arubaMaxClientsValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<0 || Number(control.value)>255)
      {
        return {'arubaMaxClientsErr':true};
      }
      else
        return null;
    }        

static arubaInactivityValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<60 || Number(control.value)>86400)
      {
        return {'arubaInactivityErr':true};
      }
      else
        return null;
    }     
 static arubaHoldTimeValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<0 || Number(control.value)>950399)
      {
        return {'arubaHoldTimeErr':true};
      }
      else
        return null;
    }      

static arubaReconnectTimeValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<30 || Number(control.value)>900)
      {
        return {'arubaReconnectTimeErr':true};
      }
      else
        return null;
    }       
static arubavpnPktLostCntValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<1 || Number(control.value)>3600)
      {
        return {'arubaVpnPktLostCntErr':true};
      }
      else
        return null;
    }    
static arubavpnPktSendFreqValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<1 || Number(control.value)>1000)
      {
        return {'arubaVpnPktSendFreqErr':true};
      }
      else
        return null;
    }
    static motoAAAPortValidation(control:FormControl)
    { 
   //   console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<1 || Number(control.value)>65535)
      {
     //   console.log('aaaa...');   
        return {'aaaPortErr':true};
      }
      else
        return null;
    }
    static matrecommLeaseTimeValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<1 || Number(control.value)>24)
      {
        return {'matrecommLeaseTimeErr':true};
      }
      else
        return null;
    }        

    static matrecommLimitAddressValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<1 || Number(control.value)>255)
      {
        return {'matrecommLimitAddressesErr':true};
      }
      else
        return null;
    }            

    static matrecommStartAddressValidation(control:FormControl)
    { 
 //     console.log(control.value);
      if(String(control.value)=="")
      return null;
       if(Number(control.value)<1 || Number(control.value)>255)
      {
        return {'matrecommStartAddressesErr':true};
      }
      else
        return null;
    }

    
}