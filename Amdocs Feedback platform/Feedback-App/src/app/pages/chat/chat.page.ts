import { Component } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Ticket, Message, Area, Subarea, Category } from '../../shared/interfaces';
import { ConversationComponent } from '../../components/conversation/conversation.component';
import { AuthService } from '../../services/auth.service';
import { ServerService } from '../../services/server.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {

  slidesOpts = {
    allowSlideNext: false,
    allowSlidePrev: false
  };

  isAdmin: number = 0;
  tickets: Ticket[] = [];
  ticketsArea: Ticket[] = [];
  areas: Area[] = [];
  subareas: Subarea[] = [];
  categories: Category[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private server: ServerService
  ) {}

  async ionViewWillEnter() {
    // Mostrar el loading
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'crescent',
      translucent: true,
      duration: 500
    });
    await loading.present();

    // Tomar las areas existentes
    this.server.getAreas()
    .pipe(takeUntil(this.destroy$))
    .subscribe( (result: any) => {
      if( result.status == 'ok' ) {
        this.areas = result.areas;

        this.areas.forEach( area => {

          // Tomar las subareas
          this.server.getSubareas( area._id )
            .pipe(takeUntil(this.destroy$))
            .subscribe( (result: any) => {
              if( result.status == 'ok' ) {
                this.subareas.push( ...result.subareas );
              }
          });

        });
      }
    });

    // Tomar todos los tickets
    this.server.getTickets(this.auth.getId())
    .pipe(takeUntil(this.destroy$))
    .subscribe( (result: any) => {
      console.log(result);
      if( result.status == 'ok' ) {
        this.tickets = result.tickets;
      }
    });
    
    // Tomar todas las categorias
    this.server.getCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe( async (result: any) => {
      if( result.status == 'ok' ) {
        this.categories = result.categories;
        await loading.dismiss();
      }
    });

    // Tomar si el usuario es administrador
    this.isAdmin = this.auth.getIsAdmin();
    if( this.auth.getIsAdmin() == 1 ) {
      this.server.ticketsAdmin( this.auth.getId() ).subscribe( (result: any) => {
        if( result.status == "ok" ) {
          this.ticketsArea = result.tickets;
        }
      });
    }

  }

  async onTicketSelected( ticket: Ticket, admin: boolean ) {

    const modal = await this.modalCtrl.create({
      component: ConversationComponent,
      componentProps: {
        ticket,
        admin
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        this.ticketsArea.forEach( t => {
          if( t._id == data.data ) {
            t.active = false;
          }
        });
    });

    return await modal.present();
  }

  getAreaName(name: string) {
    let x = this.areas.filter( a => a._id == name);
    if( x.length > 0 ) {
      return x[0].name;
    }
    else {
      return null;
    }
  }
  
  getSubareaName(name: string) {
    let x = this.subareas.filter( a => a._id == name);
    if( x.length > 0 ) {
      return x[0].name;
    }
    else {
      return null;
    }
  }
  
  getAreaIcon(name: string) {
    let x = this.areas.filter( a => a._id == name);
    if( x.length > 0 ) {
      return x[0].icon;
    }
    else {
      return null;
    }
  }
  
  getCategoryName(name: string) {
    let x = this.categories.filter( c => c._id == name);
    if( x.length > 0 ) {
      return x[0].name;
    }
    else {
      return null;
    }
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
