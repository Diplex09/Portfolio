import { AuthService } from 'src/app/services/auth.service';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rating-opinion',
  templateUrl: './rating-opinion.component.html',
  styleUrls: ['./rating-opinion.component.scss'],
})
export class RatingOpinionComponent {

  @Input() rating: number;
  @Input() ticket: string;
  message = '';

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  async onSubmit() {
    console.log('RATING: ', this.rating);
    console.log('TICKET: ', this.ticket);
    console.log('MESSAGE: ', this.message);

    this.authService.gotoDashboard();
    await this.modalCtrl.dismiss();
  }

  async onClose() {
    await this.modalCtrl.dismiss();
  }

}
