import * as _ from "lodash";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'collectionTableDataFilter'
})
export class CollectionTablePipe implements PipeTransform {

  transform(array: any[], query: string): any {
    let temp=[];
    if (query) {
        for(let doc of array)
        {
          var currItem = JSON.stringify(doc).toLowerCase();
          if(currItem.indexOf(String(query).toLowerCase()) > -1)
            temp=temp.concat(doc);
        }
        //return  _.filter(array, row=>row.AuthCode.indexOf(query) > -1);
      }
      else
        temp = array;
      return temp;
  }

}
