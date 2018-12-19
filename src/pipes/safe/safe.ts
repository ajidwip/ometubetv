import { Injectable, Pipe } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Pipe({
  name: 'safe',
})
@Injectable()
export class SafePipe {

  constructor(protected _sanitizer: DomSanitizer) { }

  kFormater(num) {
    parseInt(num);
    return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
  }
  transform(value: string, type: string) {
    switch (type) {
      case 'resourceUrl':
        return this._sanitizer.bypassSecurityTrustResourceUrl(value)
      case 'KFormate':
        return this.kFormater(value);
    }
  }
}
