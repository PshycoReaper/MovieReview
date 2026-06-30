import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  private api = environment.tmdb.url;

  private headers = new HttpHeaders({

    accept: 'application/json',

    Authorization: `Bearer ${environment.tmdb.token}`

  });

  constructor(private http: HttpClient) {}

}
