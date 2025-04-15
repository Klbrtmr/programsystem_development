import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  message = '';

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:3000').subscribe((res: any) => {
      this.message = res;
    });
  }
}
