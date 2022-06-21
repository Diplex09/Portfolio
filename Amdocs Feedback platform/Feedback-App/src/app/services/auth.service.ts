import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Subject, from, Observable, of, EMPTY, throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { switchMap, map, take, catchError, concatMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EventEmitter } from '@angular/core';
import {Output} from '@angular/core';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  @Output() fireIsLoggedIn: EventEmitter<any> = new EventEmitter<any>();
  private loggedInUserSource = new BehaviorSubject(null);
  private loggedInUser = this.loggedInUserSource.asObservable();

  private server_api_key: string =
    'Rao!&iFgtD0nvViVHa!jplc%5y0S40aG9VKPQSkJhK0b5B^4An';
  private url: string = 'https://mail.comunica.me:5003';
  private h = new HttpHeaders();

  constructor(private http: HttpClient, private nav: NavController) {
    this.h = this.h.set('Content-Type', 'application/json');
    this.h = this.h.set('x-api-key', this.server_api_key);
    this.loadToken();
  }

  private async setItem(token: string) {
    let decoded = helper.decodeToken(token); //Decode jwt
    this.loggedInUserSource.next(decoded); // Place docded info in behaviorsubject
    localStorage.setItem('token', token);
  }

  // Load token from memory whenever injected to a component.
  private async loadToken() {
    let decoded = helper.decodeToken(localStorage.getItem('token'));
    this.loggedInUserSource.next(decoded);
  }

  // Call endpoint with received credentials json.
  public login(body: any): Observable<any> {
    return this.http
      .post<any>(this.url + '/login', body, { headers: this.h })
      .pipe(
        take(2),
        map((res) => {
          return res;
        }),
        switchMap((res) => {
          if (res.token) {
            const result = new Subject<boolean>();
            this.setItem(res.token);
            result.next(true);
            result.complete();
            this.fireIsLoggedIn.emit(true);
            return result.toPromise();
          }
          return throwError('token not present');
        })
      );
  }

  getEmitter() { 
    //console.log(this.fireIsLoggedIn);
    return this.fireIsLoggedIn; 
  }

  public getIsAdmin(): any {
    return this.loggedInUserSource.getValue()?.is_admin;
  }

  public getId() {
    return this.loggedInUserSource.getValue()?.id;
  }

  public gotoDashboard() {
    switch (this.getIsAdmin()) {
      case 0:
        this.nav.navigateRoot('/dashboard');
        break;

      case 1:
        this.nav.navigateRoot('/admin-dashboard');
        break;

      case 2:
        this.nav.navigateRoot('/super-admin');
        break;

      default:
        this.nav.navigateRoot('/dashboard');
        break;
    }
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !helper.isTokenExpired(token);
  }

  public async logout() {
    localStorage.removeItem('token');
    this.loggedInUserSource.next(null);
  }

  public setArea(area: string) {
    localStorage.setItem('area', area);
  }

  public getArea() {
    const area = localStorage.getItem('area');
    return area;
  }
}
