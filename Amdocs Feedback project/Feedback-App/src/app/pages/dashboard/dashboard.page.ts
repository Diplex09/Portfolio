import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ticket, Subarea, Area } from '../../shared/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  inputText = 'Hola';
  areas: Area[] = [];
  subareas: Subarea[] = [];
  tickets: Ticket[] = [];

  mostrar = false;

  onClick() {
    this.mostrar = !this.mostrar;
  }

  private destroy$: Subject<void> = new Subject<void>();
  async loadInformation() {
    const loading = await this.loadingCtrl.create({
      message: "Cargando...",
      spinner: "crescent",
      translucent: true
    });
    await loading.present();

    this.server.getAreas()
    .pipe(takeUntil(this.destroy$))
    .subscribe( (result: any) => {
      if( result.status == 'ok' ) {
        this.areas = result.areas;

        this.areas.forEach( area => {

          // Tomar las subareas
          this.server.getSubareas( area._id )
            .pipe(takeUntil(this.destroy$))
            .subscribe( async (result: any) => {
              if( result.status == 'ok' ) {
                this.subareas.push( ...result.subareas );
                await loading.dismiss();
              }
          });

        });

      }
    });
    this.server.getTickets( this.auth.getId() ).pipe(takeUntil(this.destroy$)).subscribe( (result: any) => {
      if( result.status == "ok" ) {
        this.tickets = result.tickets;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private server: ServerService,
    private router: Router,
    private auth: AuthService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.loadInformation();
  }

}
