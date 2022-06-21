import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { User } from '../../../shared/interfaces';

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss'],
})
export class ProfileDropdownComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  user: User;

  constructor(
    private popoverCtrl: PopoverController,
    private router: Router,
    private serverService: ServerService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.serverService.getUser( this.authService.getId() )
      .pipe(takeUntil(this.destroy$))
      .subscribe( async (result: any) => {
      if( result.status == 'ok' ) {
        this.user=result.user;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onProfile() {
    this.router.navigate(['/profile']);
    await this.popoverCtrl.dismiss();
  }

  async signOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
    await this.popoverCtrl.dismiss();
  }
}
