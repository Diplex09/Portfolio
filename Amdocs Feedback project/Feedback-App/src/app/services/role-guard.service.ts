import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config on the data property
    const expectedRole = route.data.expectedRole;
    const admin_role = this.auth.getIsAdmin();

    if (!this.auth.isAuthenticated() || !expectedRole.includes(admin_role)) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
