import { Component } from '@angular/core';
import { DriversService, DriverStat } from '../shared/services/drivers.service';
import { Drivers } from '../shared/Model/Drivers';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { User } from '../shared/Model/User';
import { AuthService } from '../shared/services/auth.service';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-driver-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, FormsModule],
  templateUrl: './driver-view.component.html',
  styleUrl: './driver-view.component.scss'
})
export class DriverViewComponent {
drivers?: Drivers;
  currentUser?: User;
  scriptTagInComment: boolean = false;
  editMode: boolean = false;
  wikipediaUrl: string = '';
  wikiResults: { key: string; value: string; }[] = [];
  photoUrl: string | null = null;
  private subs = new Subscription();

  constructor(private authService: AuthService,
    private driversService: DriversService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon(
        'empty_heart',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/empty_heart.svg')
      );
      iconRegistry.addSvgIcon(
        'full_heart',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/full_heart.svg')
      );
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

    driverSubscription = 
    this.driversService.getDriver(this.route.snapshot.paramMap.get('id')!).subscribe(
      (data) => {
        this.drivers = data;
        console.log(data);

        if (data.wikipediaUrl) {
          this.wikipediaUrl = data.wikipediaUrl;
          this.loadWikipedia();
        }


      }, (err) => {
        console.log(err);
        this.router.navigateByUrl('/drivers');
      }
    );

    ngOnInit() {
      this.authService.whoAmI().subscribe({
        next: (data) => {
          this.currentUser = data;
        }, error: (err) => {
          console.log(err);
        }
      });
    }

    ngOnDestroy() {
      this.subs.unsubscribe();
    }
  
    updateDriver() {
      const id = this.route.snapshot.paramMap.get('id');
      this.driversService.getDriver(id!).subscribe({
        next: (data) => {
          this.drivers = data;
          console.log(data);
        }, error: (err) => {
          console.log(err);
        }
      });
    }
  
    likeDriver(driversId: string) {
      this.driversService.likeDriver(this.drivers!._id).subscribe({
        next: (data) => {
          console.log(data);
          this.drivers = data;
        }, error: (err) => {
          console.log(err);
        }
      });
    }

    dislikeDriver(driversId: string) {
      this.driversService.dislikeDriver(this.drivers!._id).subscribe({
        next: (data) => {
          console.log(data);
          this.drivers = data;
        }, error: (err) => {
          console.log(err);
        }
      });
    }

    hasUserLikedDrivers(drivers: Drivers): boolean {
      if (!drivers!.usersLikesDrivers) return false;
      if (drivers!.usersLikesDrivers && drivers.usersLikesDrivers.length === 0) return false;
      return drivers.usersLikesDrivers.some(user => user.username === this.currentUser?.email);
    }

    loadWikipedia() {
      if (!this.wikipediaUrl.trim()) {
        return alert('Adj meg egy érvényes Wikipedia URL-t');
      }
      const driverId = this.route.snapshot.paramMap.get('id')!;
      this.driversService.getDriverStat(driverId, this.wikipediaUrl).pipe(
        catchError(err => {
          console.error('Wiki scraping hiba', err);
          alert('Nem sikerült betölteni az eredményeket.');
          return EMPTY;
        })
      ).subscribe(results => {
        this.wikiResults = results.rows;
        this.photoUrl = results.img ?? null;
        this.driversService.updateWikipediaLink(driverId, this.wikipediaUrl).subscribe({
          next: updatedDriver => console.log('WikiUrl mentve:', updatedDriver.wikipediaUrl),
          error: err => console.error('WikiUrl mentése sikertelen', err)
      });
    });
  }
  
    navigate(to: string) {
      console.log(to);
      
      this.router.navigateByUrl(to);
    }
}
