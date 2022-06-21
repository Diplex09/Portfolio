import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ticket } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private server_api_key: string = "Rao!&iFgtD0nvViVHa!jplc%5y0S40aG9VKPQSkJhK0b5B^4An";
  private url: string = "https://mail.comunica.me:5003";
  private h = new HttpHeaders();

  constructor(
    private http: HttpClient
  ) {
    this.h = this.h.set('Content-Type', 'application/json');
    this.h = this.h.set('x-api-key', this.server_api_key);
  }

  public test() {
    return this.http.get(this.url + "/test", {headers: this.h});
  }

  public getAreas() {
    return this.http.get(this.url + "/areas", {headers: this.h});
  }

  public postArea(name: string, icon: string) {

    const body = {
      name: name,
      icon: icon
    }

    return this.http.post(this.url + '/area', JSON.stringify(body), {headers: this.h});
  }

  public updateArea(area:string, status:boolean){
    const body = {
      area:area,
      status:status
    }
    return this.http.put(this.url + '/area', JSON.stringify(body), {headers: this.h})
  }

  public updateCategory(category:string, status:boolean){
    const body = {
      category:category,
      status:status
    }
    return this.http.put(this.url + '/category', JSON.stringify(body), {headers: this.h})
  }

  public postCategoria(name:string){
    const body = {
      name: name,
      icon: "document-text-outline"
    }
    return this.http.post(this.url + '/category', JSON.stringify(body), {headers: this.h})
  }

  public updateSubarea(subarea:string, status:boolean){

    let n: number = 1;
    if( status ) {
      n = 1;
    } else {
      n = 0;
    }

    const body = {
      subarea: subarea,
      status: n
    }
    return this.http.put(this.url + '/subarea', JSON.stringify(body), {headers: this.h})
  }

  public getCategories() {
    return this.http.get(this.url + "/categories", {headers: this.h});
  }

  public getSubareas(area: string) {
    return this.http.get(this.url + `/subarea?area=${ area }`, {headers: this.h});
  }

  public postSubarea(name: string, area: string) {

    const body = {
      name: name,
      area: area
    }

    return this.http.post(this.url + '/subarea', JSON.stringify(body), {headers: this.h})
  }

  public postMessage(text: string, ticket: string, from_user: boolean) {

    const body = {
      text: text,
      ticket: ticket,
      from_user: from_user
    }

    return this.http.post(this.url + '/message', JSON.stringify(body), {headers: this.h})
  }

  public getTickets(uid: string) {
    return this.http.get(this.url + `/tickets?user=${uid}`, {headers: this.h});
  }

  public updateRating(ticket: string, rating: string) {

    const body = {
      rating: rating,
      ticket: ticket
    }

    return this.http.put(this.url + '/ticket/rating', JSON.stringify(body), {headers: this.h});
  }

  public getMessages(ticket: string) {

    return this.http.get(this.url + `/messages?ticket=${ ticket }`, {headers: this.h});
  }

  public getArea(id: string) {

    return this.http.get(this.url + `/area?area=${ id }`, {headers: this.h});
  }

  public postTicket(ticket: Ticket) {

    return this.http.post(this.url + "/ticket", JSON.stringify(ticket), {headers: this.h});
  }

  public getUser(uid: string) {
    return this.http.get(this.url + `/user?user=${ uid }`, {headers: this.h});
  }

  public ticketsAdmin(uid: string) {
    return this.http.get(this.url + `/tickets/admin?uid=${ uid }`, {headers: this.h});
  }

  public updateTicket( id: string, active: boolean ) {

    let body = {
      _id: id,
      active: active
    }

    return this.http.put(this.url + "/ticket", JSON.stringify(body), {headers: this.h});
  }

  public getUsers() {
    return this.http.get(this.url + "/users", {headers: this.h});
  }

  public getAdmins() {
    return this.http.get(this.url + "/admins", {headers: this.h});
  }

  public updateAdmin( user: string, area: string ) {

    const body = {
      user: user,
      area: area
    }

    return this.http.put(this.url + "/admin", JSON.stringify(body), {headers: this.h});
  }

  public avgRating(areaid?) {
    if (areaid) {
      return this.http.get(this.url + `/grafica/rating?area=${areaid}`, {headers: this.h});
    }
    return this.http.get(this.url + `/grafica/rating`, {headers: this.h});
  }

  public quantityAreaTickets() {
    return this.http.get(this.url + '/grafica/area/quantity', {headers: this.h});
  }
}
