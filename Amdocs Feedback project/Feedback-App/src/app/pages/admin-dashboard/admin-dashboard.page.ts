import { Component, OnInit, ViewChild   } from '@angular/core';

import { Chart } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Area, Subarea, Ticket, Admin } from '../../shared/interfaces';
import { ServerService } from '../../services/server.service';
import { AuthService } from '../../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {

  @ViewChild('barChart') barChart;
  @ViewChild('doughnutChart') doughnutChart;
  areas: Area[] = [];
  subareas: Subarea[] = [];
  tickets: Ticket[] = [];
  areaid: string = null;
  rating: number = null;
  area: Area = null;

  constructor(
    private server: ServerService,
    private auth: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {

    const loading = await this.loadingCtrl.create({
      message: "Cargando...",
      spinner: "crescent",
      translucent: true
    });
    await loading.present();

    await this.loadInformation();

    if( this.auth.getIsAdmin() == 1 ) {
      this.server.getAdmins().subscribe( (result: any) => {
        if( result.status == "ok" ) {
          result.admins.forEach( (admin: Admin) => {
            if( admin.user == this.auth.getId() ) {
              this.areaid = admin.area;
              this.server.getArea( this.areaid ).subscribe( async (result: any) => {
                if(  result.status == "ok" ) {
                  this.area = result.area;
                  this.avgRating();
                  this.createDoughnutChart();
                }
                await loading.dismiss();
              });
            }
          });
        }
      });
    } else if ( this.auth.getIsAdmin() == 2 ) {
      this.areaid = this.auth.getArea();
      this.server.getArea( this.areaid ).subscribe( async (result: any) => {
        if(  result.status == "ok" ) {
          this.area = result.area;
          this.avgRating();
          this.createDoughnutChart();
        }
        await loading.dismiss();
      });
    }
  }

  ionViewDidEnter() {
    this.createBarChart();
  }

  avgRating() {
    this.server.avgRating(this.areaid)
    .pipe(takeUntil(this.destroy$))
    .subscribe( (result: any) => {
      if( result.status === "ok" ) {
        this.rating = result.average[0][0];
        this.createDoughnutChart();
      } else {
        this.router.navigate(['/login']);
      }
  });
  }

  createBarChart() {
    const chart = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [
          {
            label: 'This Year',
            data: [40, 38, 45, 25, 32, 40, 45, 30],
            backgroundColor: 'rgba(204, 0, 136, 0.2)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(204, 0, 136)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
          {
            label: 'Last year',
            data: [35, 40, 56, 38, 47, 52, 38, 25],
            backgroundColor: 'rgba(56, 128, 255,0.2)', // array should have same number of elements as number of dataset
            borderColor: 'rgba(56, 128, 255,1)', // array should have same number of elements as number of dataset
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  createDoughnutChart() {
    const chart = new Chart(this.doughnutChart.nativeElement, {
        type: 'doughnut',
        data: {
          // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Good Job',
                'Room for Improvement',
            ],
            datasets: [{
              data: [this.rating, 10 - this.rating],
              backgroundColor: [
                  '#EAB330',
                  'rgba(220, 220, 220, 0.1)',
              ],
              borderColor: 'none',
              borderWidth: 2
            }],
        },
        options: {
          circumference: 2 * Math.PI,
          rotation: -2 * Math.PI
        }
    });
  }

  private destroy$: Subject<void> = new Subject<void>();
  async loadInformation() {

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


}
