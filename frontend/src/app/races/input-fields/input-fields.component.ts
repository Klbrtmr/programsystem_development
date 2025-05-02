import { Component, EventEmitter, Output } from '@angular/core';
import { RacesService } from '../../shared/services/races.service';
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
  trackName: string = '';
  locationName: string = '';
  date: string = '';
  @Output() race = new EventEmitter<any>();

  constructor(private racesService: RacesService, private router: Router) { }

  CreateRace() {
    this.racesService.newRace(this.trackName, this.locationName, this.date).subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.router.navigateByUrl('/races').then(() => {
            window.location.reload();
          });
          this.trackName = '';
          this.locationName = '';
          this.date = '';
          this.race.emit(data);
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}
