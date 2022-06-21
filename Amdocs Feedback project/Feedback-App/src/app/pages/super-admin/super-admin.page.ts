import { Component, ViewChild, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AlertController, ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { ServerService } from 'src/app/services/server.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from '@angular/router';
import { Area, Category } from 'src/app/shared/interfaces';
import { Subarea, User, Admin } from '../../shared/interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.page.html',
  styleUrls: ['./super-admin.page.scss'],
})
export class SuperAdminPage {

  private destroy$: Subject<void> = new Subject<void>();
  // Graph
  @ViewChild('barChart') barChart;
  @ViewChild('doughnutChart') doughnutChart;
  @ViewChild('areaChart') areaChart;
  areas: Area[] = [];
  subareas: Subarea[] = [];
  categories: Category[] = [];
  users: User[] = [];
  admins: Admin[] = [];
  rating: number = null;
  areasGraph: string[] = [];
  quan: number[] = [];

  activeAreas: Array<any> = [];
  inactiveAreas: Array<any> = [];
  activeReports: Array<any> = [];
  inactiveReports: Array<any> = [];
  activeSubareas: Array<any> = [];
  inactiveSubareas: Array<any> = [];

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private serverService: ServerService,
    private router: Router,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    this.avgRating();
    this.quantityAreaTickets();
  }

  avgRating() {
    this.serverService.avgRating()
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

  quantityAreaTickets() {
    this.serverService.quantityAreaTickets()
    .pipe(takeUntil(this.destroy$))
    .subscribe( (result: any) => {
      if( result.status === "ok" ) {
        result.quantity.forEach( element => {
          this.areasGraph.push(element[1]);
          this.quan.push(element[0]);
        });

        this.createAreaChart();
      } else {
        this.router.navigate(['/login']);
      }
  });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadInformation() {
    // Obtener todas las categorias
    this.serverService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe( (result: any) => {
        if( result.status == "ok" ) {
          this.categories = result.categories;
          this.activeReports = result.categories.filter( cat => cat.active);
          this.inactiveReports = result.categories.filter( cat => !cat.active);
        }
    });

    // Obtener todas las areas y subareas
    this.serverService.getAreas()
      .pipe(takeUntil(this.destroy$))
      .subscribe( (result: any) => {
        if( result.status == 'ok' ) {
          this.areas = result.areas;
          this.activeAreas = result.areas.filter( ar => ar.active);
          this.inactiveAreas = result.areas.filter( ar => !ar.active);
          this.areas.forEach( area => {

            // Tomar las subareas
            this.serverService.getSubareas( area._id )
              .pipe(takeUntil(this.destroy$))
              .subscribe( (result: any) => {
                if( result.status == "ok" ) {
                  area.subareas = result.subareas;
                }
            });

          });
        }
    });

    // Obtener los usuarios
    this.serverService.getUsers()
    .pipe(takeUntil(this.destroy$))
      .subscribe( (result: any) => {
        if( result.status == 'ok' ) {
          this.users = result.users.filter( u => u.is_admin != 2);
        }
    });

    // Obtener los admins
    this.serverService.getAdmins()
    .pipe(takeUntil(this.destroy$))
      .subscribe( (result: any) => {
        if( result.status == 'ok' ) {
          this.admins = result.admins;
        }
    });

  }

  async ionViewWillEnter() {
    await this.loadInformation();
    await this.tutorial();
  }

  ionViewDidEnter() {
    this.createBarChart();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

  }

  async tutorial() {
    const alert = await this.alertCtrl.create({
      header: 'Have fun!',
      message: 'To re-order areas and types of reports <strong>drag and drop</strong> the element to the desired area and then save by clicking on <strong>SAVE CHANGES</strong>. To view all the information of an area just <strong>click on it</strong>.',
      buttons: ['Got it!']
    });
    await alert.present();
  }

  async changesSaved() {
    const toast = await this.toastCtrl.create({
      message: 'Your settings have been saved!',
      duration: 1500
    });
    toast.present();
  }

  updateArea(id, status) {
    this.serverService.updateArea(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe( async (result: any) => {
        if( result.status == "ok" ) {
          console.log("Category updated");
        } else {
          this.router.navigate(['/super-admin']);
        }
    });
  }

  async onSaveAreas() {
    this.activeAreas.forEach( activeArea => {
      this.updateArea(activeArea._id, true);
    });
    this.inactiveAreas.forEach(inactiveArea => {
      this.updateArea(inactiveArea._id, false);
    });
    await this.changesSaved();
    await this.loadInformation();
  }

  updateCategory(id, status) {
    this.serverService.updateCategory(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe( async (result: any) => {
        if( result.status == "ok" ) {
        } else {
          this.router.navigate(['/super-admin']);
        }
    });
  }

  async onSaveReports() {
    this.activeReports.forEach(activeReport => {
      this.updateCategory(activeReport._id, true);
    });
    this.inactiveReports.forEach(inactiveReport => {
      this.updateCategory(inactiveReport._id, false);
    });
    await this.loadInformation();
    await this.changesSaved();
  }

  updateSubarea(id, status) {
    this.serverService.updateSubarea(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe( (result: any) => {
        if( result.status == "ok" ) {
          console.log("Subarea Updated");
        } else {
          this.router.navigate(['/super-admin']);
        }
    });
  }

  async onSaveSubAreas() {
    this.areas.forEach( area => {
      area.subareas.forEach( subarea => {
        this.updateSubarea(subarea._id, subarea.active);
      });
    });
    await this.loadInformation();
    await this.changesSaved();
  }

  postCategory(name){
    this.serverService.postCategoria(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe( (result: any) => {
      if( result.status == "ok" ) {
        console.log("Category created");
      } else {
        this.router.navigate(['/super-admin']);
      }
    });
  }

  async newReport() {
    const alert = await this.alertCtrl.create({
      header: 'Write the new report category\'s name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Write here...'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Create!',
          handler: async (data) => {
            if ( data.name ) {
              this.postCategory(data.name);
              await this.loadInformation();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async newArea() {
    const alert = await this.alertCtrl.create({
      header: 'Write the new area\'s name',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Write here...'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Create!',
          handler: data => {
            if ( data.name ) {
              this.serverService.postArea(data.name, 'cube-outline').pipe(takeUntil(this.destroy$))
              .subscribe( async (result: any) => {
                await this.loadInformation();
                console.log( "area posted" );
              });
            }

          }
        }
      ]
    });

    await alert.present();
  }

  async onNewSubArea() {

    let Area: string;

    // Crear el arreglo de las áreas posibles para elegir
    const inputs = [];
    this.areas.forEach( area => {
      inputs.push(
        {
          name: area.name,
          type: 'radio',
          label: area.name,
          value: area._id,
          checked: false
        }
        );
    });

    const alert = await this.alertCtrl.create({
      header: 'Select the parent area for it.',
      inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Continue',
          handler: async (data) => {
            if ( data ) {

              Area = data;
              console.log("Area to add subarea", Area);

              const a = await this.alertCtrl.create({
                header: 'Write the new sub-area\'s name',
                inputs: [
                  {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Write here...'
                  },
                ],
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                  }, {
                    text: 'Create!',
                    handler: d => {
                      if ( d.name ) {

                        this.serverService.postSubarea(d.name, Area).pipe(takeUntil(this.destroy$))
                        .subscribe( async (result: any) => {
                          console.log(result);
                          await this.loadInformation();
                        });

                      }

                    }
                  }
                ]
              });
              await a.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async downloadReport() {

    const inputs = [];
    this.areas.forEach( area => {
      inputs.push(
        {
          name: area.name,
          type: 'checkbox',
          label: area.name,
          value: area.name,
          checked: true
        }
        );
    });

    const alert = await this.alertCtrl.create({
      header: 'Select the areas to include on the csv.',
      inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Download',
          handler: data => {
            console.log(data);
          }
        }
      ]
    });
    await alert.present();
  }

  /*
  Graphs -----------------------------------*/
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
            backgroundColor: 'rgba(213, 102, 95,0.2)', // array should have same number of elements as number of dataset
            borderColor: 'rgba(213, 102, 95,1)', // array s+hould have same number of elements as number of dataset
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
                  '#2EDE74',
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

  createAreaChart() {
    console.log(this.areasGraph);
    const chart = new Chart(this.areaChart.nativeElement, {
      type: 'radar',
      data: {
        labels: this.areasGraph,
        datasets: [
          {
            label: 'Tickets',
            data: this.quan,
            backgroundColor: 'rgba(255, 215, 0, 0.1)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(255, 215, 0)', // array should have same number of elements as number of dataset
            borderWidth: 1
          },
        ]
      },
      options: {
        scale: {
            angleLines: {
                display: false
            },
            ticks: {
                showLabelBackdrop: false, // hide square behind
                suggestedMin: 0,
                suggestedMax: 20
            },
            gridLines: {
              color: 'nan'
            },
        }
      }

    });
  }

  updateAdmin(area: string, event) {
    this.serverService.updateAdmin( event.detail.value, area ).pipe(takeUntil(this.destroy$)).subscribe( (result: any) => {
      if( result.status == "ok" ) {
        this.admins = result.admins;
      }
    });
  }

  getAdminOfArea( area ) {
    let x = this.admins.find( admin => admin.area == area)
    if( x ) {
      return x.user;
    } else {
      return null;
    }
  }

  GoToAdmin( id: string ) {
    this.auth.setArea( id );
    this.router.navigate(['/admin-dashboard']);
  }

}
