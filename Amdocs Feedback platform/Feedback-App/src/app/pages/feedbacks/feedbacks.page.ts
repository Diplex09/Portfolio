import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/shared/interfaces';
import { AuthService } from '../../services/auth.service';
import { ServerService } from '../../services/server.service';
import { Area, Subarea } from '../../shared/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.page.html',
  styleUrls: ['./feedbacks.page.scss'],
})
export class FeedbacksPage implements OnInit {

  uid: string = null;
  areas: Area[] = [];
  subareas: Subarea[] = [];
  tickets: Ticket[] = [];

  constructor(
    private auth: AuthService,
    private server: ServerService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
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
    this.server.getTickets( this.auth.getId() ).subscribe( (result: any) => {
      if( result.status == "ok" ) {
        this.tickets = result.tickets;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ionViewWillEnter() {
    await this.loadInformation();
  }

}
