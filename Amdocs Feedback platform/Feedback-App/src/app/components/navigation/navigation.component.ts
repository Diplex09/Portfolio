import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { MenuController, PopoverController, NavController  } from '@ionic/angular';
import { ProfileDropdownComponent } from './profile-dropdown/profile-dropdown.component';
import { ServerService } from 'src/app/services/server.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { User } from '../../shared/interfaces';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  user: User;

  @Input() noDefault = false;

  @Input() currentRouteIndex = 0;

  navigation = [
    {
      name: 'Dashboard',
      icon: 'pie-chart-outline',
      url: '/dashboard'
    },
    {
      name: 'Feedbacks',
      icon: 'chatbox-ellipses-outline',
      url: '/feedbacks'
    },
    {
      name: 'Messages',
      icon: 'chatbubbles-outline',
      url: '/chat'
    },
    {
      name: 'Help',
      icon: 'help-circle-outline',
      url: null,
      external: 'https://www.amdocs.com/contact',
    },
  ];

  constructor(
    private nav: NavController,
    private menu: MenuController,
    private popoverController: PopoverController,
    private authService: AuthService,
    private serverService: ServerService,
    ) { }

  showInfo(){
    this.serverService.getUser( this.authService.getId() )
      .pipe(takeUntil(this.destroy$))
      .subscribe( async (result: any) => {
      if( result.status == 'ok' ) {
        this.user=result.user;
      }
    });
  }

  ngOnInit() {
    this.authService.getEmitter().subscribe((res) => {
      this.showInfo();
    });
    this.showInfo();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* Menu
  -------------------------------------------------------------------*/
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  navigateTo(navigation: any) {
    if (navigation.external) {
      window.open(navigation.external, '_blank');
    } else if (navigation.url) {
      if (navigation.url == '/dashboard') {
        this.authService.gotoDashboard();
      } else {
        this.nav.navigateRoot(navigation.url);
      }
    }
  }

  /* Popover
  -------------------------------------------------------------------*/
  async presentPopover() {
    const popover = await this.popoverController.create({
      component: ProfileDropdownComponent,
      cssClass: 'profile-pop',
      translucent: false
    });
    return await popover.present();
  }


}
