import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  message = '';
  constructor(http: HttpClient) {
    http.get('http://localhost:3000', { responseType: 'text' }).subscribe(data => this.message = data);
  }
}
