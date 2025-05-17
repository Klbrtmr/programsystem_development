import { Component, EventEmitter, Output } from '@angular/core';
import { DriversService } from '../../shared/services/drivers.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-fields',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-fields.component.html',
  styleUrl: './input-fields.component.scss'
})
export class InputFieldsComponent {
  driverName: string = '';
  wikipediaUrl: string = '';
  @Output() driver = new EventEmitter<any>();

  constructor(private driversService: DriversService, private router: Router) { }

  CreateDriver() {
    this.driversService.newDriver(this.driverName, this.wikipediaUrl).subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.router.navigateByUrl('/drivers').then(() => {
            window.location.reload();
          });
          this.driverName = '';
          this.wikipediaUrl = '';
          this.driver.emit(data);
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}
