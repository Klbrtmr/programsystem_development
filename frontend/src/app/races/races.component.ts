import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Races } from '../shared/Model/Races';
import { RacesService } from '../shared/services/races.service';
import { CommonModule } from '@angular/common';
import { InputFieldsComponent } from './input-fields/input-fields.component';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-races',
  standalone: true,
  imports: [CommonModule, InputFieldsComponent, MatIconModule, FormsModule, MatDialogModule],
  templateUrl: './races.component.html',
  styleUrl: './races.component.scss'
})
export class RacesComponent {
  races?: Races[];
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  isEditMode: boolean = false;
  selectedRaceToEdit: string = '';
  // editedLocationName: string = '';
  editedTrackName: string = '';
  editedLocationName: string = '';

  constructor(private racesService: RacesService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog) { }

    ngOnInit() {
      this.racesService.getAll().subscribe({
        next: (data) => {
          this.races = data;
        }, error: (err) => {
          console.log(err);
        }
      });
  
      this.authService.checkAuth().subscribe({
        next: (data) => {
          this.isAuthenticated = data;
        }, error: (err) => {
          console.log('You are currently not logged in.');
        }
      });
  
      this.authService.isAdmin().subscribe({
        next: (data) => {
          this.isAdmin = data;
        }, error: (err) => {
          console.log('You are not an admin.');
        }
      });
    }

    deleteRace(racesId: string) {
      const dialogRef = this.dialog.open(DialogComponent, {data: { message: 'races' } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.racesService.deleteRace(racesId).subscribe({
            next: (data) => {
              console.log(data);
              this.races = this.races!.filter(races => races._id !== racesId);
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      });
    }

    editModeToggle(racesId: string) {
      this.isEditMode = !this.isEditMode;
      if (this.isEditMode) {
        this.selectedRaceToEdit = racesId;
        this.editedTrackName = this.races!.find(races => races._id === racesId)!.trackName;
        this.editedLocationName = this.races!.find(races => races._id === racesId)!.locationName;
      } else {
        this.selectedRaceToEdit = '';
        this.editedTrackName = '';
        this.editedLocationName = '';
      }
    }
  
    editModeOff() {
      this.isEditMode = false;
      this.selectedRaceToEdit = '';
      this.editedTrackName = '';
      this.editedLocationName = '';
    }
  
    editRace(racesId: string) {
      if ((this.races!.find(races => races._id === racesId)!.trackName !== this.editedTrackName) ||
          (this.races!.find(races => races._id === racesId)!.locationName !== this.editedLocationName)) {
        this.racesService.editRace(racesId, this.editedTrackName, this.editedLocationName).subscribe({
          next: (data) => {
            console.log(data);
            this.races = this.races!.map(races => {
              if (races._id === racesId) {
                races.trackName = this.editedTrackName;
                races.locationName = this.editedLocationName;
              }
              return races;
            });
            this.editModeOff();
          }, error: (err) => {
            console.log(err);
          }
        });
      } else {
        this.editModeOff();
      }
    }
  
    recieveRace(event: any) {
      this.races?.push(event);
    }
  
    navigate(to: string) {
      to = '/races/' + to;
      this.router.navigateByUrl(to);
    }
}
