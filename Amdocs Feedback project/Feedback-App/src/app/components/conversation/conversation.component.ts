import { Component, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Message, Ticket, Area } from '../../shared/interfaces';
import { ServerService } from '../../services/server.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent {


  @Input() ticket: Ticket;
  @Input() admin: boolean;
  area: Area = null;
  areaIcon: string = null;
  mensaje: string;
  messages: Message[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private server: ServerService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: "Cargando...",
      translucent: true,
      spinner: "crescent"
    });
    await loading.present();

    this.server.getArea( this.ticket.area ).subscribe( (result: any) => {
      if( result.status == "ok" ) {
        this.area = result.area.name;
        this.areaIcon = result.area.icon;
      }
    });
    this.server.getMessages( this.ticket._id ).pipe(takeUntil(this.destroy$)).subscribe( async (result: any) => {
      if( result.status == "ok" ) {
        if( this.admin ) {
          result.messages.forEach( message => {

            message.from_user = !message.from_user;

            this.messages.push(message);
          });
        } else {
          this.messages = result.messages;
        }
      }
      await loading.dismiss();
      await this.alert("Remember", "To reload the messages just close and open the chat")
    });
  }

  async onClose() {
    await this.modalCtrl.dismiss();
  }

  async send() {

    if( !this.ticket.active ) {
      return await this.alert( "Oops!", "You can't send messages to a closed chat" );
    }

    this.server.postMessage(this.mensaje, this.ticket._id, !this.admin).subscribe( () => {
      this.messages.push({
        text: this.mensaje,
        from_user: true,
        ticket: this.ticket._id
      });
      this.mensaje = "";
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async alert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      translucent: true,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async closeTicket( ticket: Ticket ) {

    const alert = await this.alertCtrl.create({
      header: "Are you sure?",
      message: "No messages can be send to a closed ticket",
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel'
        },
        {
          text: "Cerrar",
          handler: () => {
            this.server.updateTicket( ticket._id, false ).subscribe( async () => {
              await this.toast( "Ticket closed successfully" ).then( () => {
                this.modalCtrl.dismiss(ticket._id);
              });
            });
          }
        }
      ]
    });
    await alert.present();

  }

  async toast( message: string ) {
    const toast = await this.toastCtrl.create({
      duration: 1500,
      message,
      translucent: true
    });
    await toast.present();
  }

}
