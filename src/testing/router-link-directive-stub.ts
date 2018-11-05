import { Directive, Input } from '@angular/core';

// export for convenience.
export { RouterLink } from '@angular/router';

/* tslint:disable:directive-class-suffix */
@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Directive({
  selector: '[routerLinkActive]',
  exportAs: 'routerLinkActive'
})
export class RouterLinkActiveDirectiveStub {
  @Input('routerLinkActive') linkParams: any;
  isActive: boolean = true;
}

/// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    RouterLinkDirectiveStub, RouterLinkActiveDirectiveStub
  ]
})
export class RouterStubsModule { }
