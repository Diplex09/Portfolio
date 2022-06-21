import { Component, OnInit, ViewEncapsulation, Input  } from '@angular/core';
import { Area, Ticket } from 'src/app/shared/interfaces';
import { ServerService } from '../../services/server.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subarea } from '../../shared/interfaces';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reports-table',
  templateUrl: './reports-table.component.html',
  styleUrls: ['./reports-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportsTableComponent implements OnInit {

  @Input() limit = 10;
  @Input() areas: Area[] = [];
  @Input() subareas: Subarea[] = [];
  @Input() tickets: Ticket[] = [];
  theme: string;
  private destroy$: Subject<void> = new Subject<void>();

  getAreaIcon(area: any) {
    let x = this.areas.filter( a => a._id == area);
    return x[0].icon;
  }
  
  getAreaName(area: any) {
    let x = this.areas.filter( a => a._id == area);
    return x[0].name;
  }
  
  getSubareaName(subarea: any) {
    let x = this.subareas.filter( a => a._id == subarea);
    if(x.length >0) {
      return x[0].name;
    } else {
      return null;
    }
  }
  
  getAnonValue(value: boolean) {
    if(value) {
      return 'checkmark-circle-outline';
    } else {
      return 'close-circle-outline';
    }
  }

  getRatingValue(value: number) {
    if( value == 0 ) {
      return 'NA';
    } else {
      return value;
    }
  }

  async onActivate(event) {
    if(event.type == 'click') {
      if( event.row.rating == 0 ) {
        this.router.navigate([`/rating/${event.row._id}`]);
      } else {
        await this.alert( "The rating can't be updated after it has been given." );
      }
    }
  }

  constructor(
    private server: ServerService,
    private router: Router,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  async ionViewWillEnter() {
  }

  async ngOnInit() {
  }

  async alert( message: string ) {
    const alert = await this.alertCtrl.create({
      message,
      header: "Oops!",
      translucent: true,
      buttons: ['Ok']
    });
    await alert.present();
  }

}
