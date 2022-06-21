import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
// SERVICES
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public formSubmitted: boolean = false;
  username: string;
  password: string;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async login() {
    this.formSubmitted = true;
    if (!this.loginForm.invalid) {

      const loading = await this.loadingCtrl.create({
        message: "Cargando...",
        translucent: true,
        spinner: "crescent"
      });
      await loading.present();

      let body = {
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value,
      }
      this.authService.login(body).subscribe(
        async (res) => {
          await loading.dismiss();
          this.authService.gotoDashboard();
        },
        async (err) => {
          await loading.dismiss();
          await this.presentAlert();
        }
      );
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'bad',
      header: 'Wrong Email or Password',
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
