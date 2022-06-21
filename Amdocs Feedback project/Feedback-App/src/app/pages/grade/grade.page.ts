import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.page.html',
  styleUrls: ['./grade.page.scss'],
})
export class GradePage {

  ticketId = '0';
  rating = 7;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private server: ServerService,
    private router: Router,
    private authService: AuthService
  ) {
    this.ticketId = this.route.snapshot.paramMap.get('id');
  }

  onRate( event ) {
    this.rating = event.detail.value;
  }

  async onSubmit() {
    this.server.updateRating( this.ticketId, this.rating.toString() )
    .pipe(takeUntil(this.destroy$))
    .subscribe( () => {
      this.authService.gotoDashboard();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
