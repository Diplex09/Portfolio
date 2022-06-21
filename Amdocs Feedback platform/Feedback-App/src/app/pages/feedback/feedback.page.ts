import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Area, Ticket } from 'src/app/shared/interfaces';
import { ServerService } from '../../services/server.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AuthService } from 'src/app/services/auth.service';
import { Category } from '../../shared/interfaces';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  @ViewChild('slides', { static: false }) slides: IonSlides;

  constructor(
    private router: Router,
    private serverService: ServerService,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  progressbarValue = 0.17;
  slideOpts = {
    allowTouchMove: false
  };
  text: string;
  showFooter = true;
  categorySelected: string = null;
  subcategorySelected: string = null;
  ticketSelected: string = null;
  areas: Area[] = [];
  id: string = null;
  categories: Category[] = [];
  subareas: Area[] = [];
  anonSelected: boolean;

  ngOnInit() {
    this.serverService.getAreas()
      .pipe(takeUntil(this.destroy$))
      .subscribe( (result: any) => {
        if( result.status === "ok" ) {
          this.areas = result.areas.filter( area => area.active );
        } else {
          this.authService.gotoDashboard();
        }
    });

    this.serverService.getCategories().pipe(takeUntil(this.destroy$)).subscribe( (result: any) => {
      if( result.status == "ok") {
        this.categories = result.categories.filter( x => x.active );
      }
    });

    this.id = this.authService.getId();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCategory( id: string ) {
    this.categorySelected = id;
    this.serverService.getSubareas(id).pipe(takeUntil(this.destroy$)).subscribe( (result: any) => {
      if( result.status == "ok" ) {
        this.subareas = result.subareas.filter( x => x.active );
      }
    })
    this.nextSlide();
  }

  onSubCategory( name: string ) {
    this.subcategorySelected = name;
    this.nextSlide();
  }

  onTicket( name: string ) {
    console.log( name );
    this.ticketSelected = name;
    this.nextSlide();
  }

  onAnonimity( isAnon: boolean ) {
    this.anonSelected = isAnon;
    this.nextSlide();
  }

  onTextDone() {
    this.showFooter = false;
    let ticket: Ticket = {
      area: this.categorySelected,
      sub_area: this.subcategorySelected,
      anonymous: this.anonSelected,
      category: this.ticketSelected,
      rating: 0,
      user: this.id
    }

    this.serverService.postTicket(ticket).subscribe( (result: any) => {
      if( result.status == "ok" ) {
        this.serverService.postMessage(this.text, result.ticket, true).subscribe( async () => {
          await this.toast( "Ticket received. We will get to you ASAP." );
        });
      }
    });

    this.nextSlide();
  }

  nextSlide() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    this.progressbarValue += 0.17;
  }

  prevSlide() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
    this.progressbarValue -= 0.17;
  }

  onLastSlide() {
    this.prevSlide();
  }

  async onCancel() {

    let isStart = false;
    let i = 0;

    while ( !isStart ) {
      i++;
      if ( i > 10 ) {
        break;
      }

      this.prevSlide();
      await this.slides.isBeginning().then( result => {
        isStart = result;
        console.log(isStart);
      });
    }
    this.authService.gotoDashboard();
  }

  async toast( message: string ) {
    const toast = await this.toastCtrl.create({
      message,
      translucent: true,
      duration: 1500
    });
    await toast.present();
  }

}
