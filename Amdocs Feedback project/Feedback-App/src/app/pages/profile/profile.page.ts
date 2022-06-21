import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { User } from '../../shared/interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  user: User;

  constructor(
    private alertController: AlertController, 
    private serverService: ServerService,
    private auth: AuthService,
    ) {}

  ngOnInit() {
    this.serverService.getUser( this.auth.getId() )
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

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Contact tech support',
      message: 'If you want to report a problem, please contact tech support at 33135642',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

}
