import {Pipe, PipeTransform} from '@angular/core';
import {layoutPaths} from '../../theme';

@Pipe({name: 'ProfilePicture'})
export class ProfilePicturePipe implements PipeTransform {

  transform(input:string, ext = 'png'):string {
    return layoutPaths.images.profile + input + '.' + ext;
  }
}
