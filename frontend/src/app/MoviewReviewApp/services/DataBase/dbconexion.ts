import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DBconexion {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3500/';

  sendMessage(endpoint: string, data: any) {
    return this.http.post(this.apiUrl + endpoint, data);
  }
}
