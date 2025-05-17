import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Races } from '../shared/Model/Races';
import { RacesService } from '../shared/services/races.service';
import { CommonModule } from '@angular/common';
import { InputFieldsComponent } from './input-fields/input-fields.component';
import {MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-races',
  standalone: true,
  imports: [CommonModule, InputFieldsComponent, MatIconModule, FormsModule, MatDialogModule, MatCardModule],
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
  searchTerm: string = '';

  constructor(private racesService: RacesService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
          'trash',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/trash.svg')
        );
        iconRegistry.addSvgIcon(
          'pencil',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pencil.svg')
        );
        iconRegistry.addSvgIcon(
          'cancel',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cross-circle.svg')
        );
        iconRegistry.addSvgIcon(
          'check',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/check-circle.svg')
        );
      }

    ngOnInit() {
      this.racesService.getAll(this.searchTerm).subscribe({
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

    onSearchChange(term: string) {
      this.searchTerm = term;
      this.loadRaces();
    }

    loadRaces() {
      this.racesService.getAll(this.searchTerm)
        .subscribe(r => this.races = r);
    }

    navigate(to: string) {
      to = '/races/' + to;
      this.router.navigateByUrl(to);
    }
}
