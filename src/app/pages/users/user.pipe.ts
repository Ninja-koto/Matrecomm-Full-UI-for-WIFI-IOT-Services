import * as _ from "lodash";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class UserPipe implements PipeTransform {

  transform(array: any[], query: string): any {
    var temp=[];
    if (query) {
        for(var i=0;i<array.length;i++)
        {
          var currItem = JSON.stringify(array[i]);
          if(currItem.indexOf(String(query)) > -1)
            temp=temp.concat(array[i]);
        }
        //return  _.filter(array, row=>row.AuthCode.indexOf(query) > -1);
      }
      else
        temp = array;
      return temp;
  }

}
