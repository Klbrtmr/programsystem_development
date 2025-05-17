import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Drivers } from '../shared/Model/Drivers';
import { DriversService } from '../shared/services/drivers.service';
import { CommonModule } from '@angular/common';
import { InputFieldsComponent } from './input-fields/input-fields.component';
import {MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, InputFieldsComponent, MatIconModule, FormsModule, MatDialogModule, MatCardModule],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent {
  drivers?: Drivers[];
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  isEditMode: boolean = false;
  selectedDriverToEdit: string = '';
  editedDriverName: string = '';
  editedWikipediaUrl: string = '';
  searchTerm: string = '';

  constructor(private driversService: DriversService,
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
      this.driversService.getAllDrivers(this.searchTerm).subscribe({
        next: (data) => {
          this.drivers = data;
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

    deleteDriver(driversId: string) {
      const dialogRef = this.dialog.open(DialogComponent, {data: { message: 'drivers' } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.driversService.deleteDriver(driversId).subscribe({
            next: (data) => {
              console.log(data);
              this.drivers = this.drivers!.filter(drivers => drivers._id !== driversId);
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      });
    }

    editModeToggle(driversId: string) {
      this.isEditMode = !this.isEditMode;
      if (this.isEditMode) {
        this.selectedDriverToEdit = driversId;
        this.editedDriverName = this.drivers!.find(drivers => drivers._id === driversId)!.driverName;
        this.editedWikipediaUrl = this.drivers!.find(drivers => drivers._id === driversId)!.wikipediaUrl;
      } else {
        this.selectedDriverToEdit = '';
        this.editedDriverName = '';
        this.editedWikipediaUrl = '';
      }
    }
  
    editModeOff() {
      this.isEditMode = false;
      this.selectedDriverToEdit = '';
      this.editedDriverName = '';
      this.editedWikipediaUrl = '';
    }
  
    editDriver(driversId: string) {
      if ((this.drivers!.find(drivers => drivers._id === driversId)!.driverName !== this.editedDriverName) ||
          (this.drivers!.find(drivers => drivers._id === driversId)!.wikipediaUrl !== this.editedWikipediaUrl)) {
        this.driversService.editDriver(driversId, this.editedDriverName, this.editedWikipediaUrl).subscribe({
          next: (data) => {
            console.log(data);
            this.drivers = this.drivers!.map(drivers => {
              if (drivers._id === driversId) {
                drivers.driverName = this.editedDriverName;
                drivers.wikipediaUrl = this.editedWikipediaUrl;
              }
              return drivers;
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
  
    recieveDriver(event: any) {
      this.drivers?.push(event);
    }

    onSearchChange(term: string) {
      this.searchTerm = term;
      this.loadDrivers();
    }

    loadDrivers() {
      this.driversService.getAllDrivers(this.searchTerm)
        .subscribe(r => this.drivers = r);
    }

    navigate(to: string) {
      to = '/drivers/' + to;
      this.router.navigateByUrl(to);
    }
}