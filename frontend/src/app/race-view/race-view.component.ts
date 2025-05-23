import { Component } from '@angular/core';
import { RacesService, RaceResult } from '../shared/services/races.service';
import { Races } from '../shared/Model/Races';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Comment } from '../shared/Model/Comment';
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
  selector: 'app-race-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, FormsModule],
  templateUrl: './race-view.component.html',
  styleUrl: './race-view.component.scss'
})
export class RaceViewComponent {
  races?: Races;
  comments?: Comment[];
  commentText: string = '';
  currentUser?: User;
  scriptTagInComment: boolean = false;
  editMode: boolean = false;
  editedComment: string = '';
  selectedCommentToEdit: string = '';
  wikipediaUrl: string = '';
  wikiResults: { position: string; driver: string; team: string; time: string; laps: string }[] = [];
  private subs = new Subscription();

  constructor(private authService: AuthService,
    private racesService: RacesService,
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

    raceSubscription = 
    this.racesService.getRace(this.route.snapshot.paramMap.get('id')!).subscribe(
      (data) => {
        this.races = data;
        this.comments = data.comments as unknown as Comment[];
        this.comments?.forEach(comment => { comment.comment = comment.comment.replace(/\n/g, '<br>'); });
        this.comments?.forEach(comment => {
          comment.comment = comment.comment.replace(/<img/g, '<img width="90%"');
        });
        console.log(data);

        if (data.wikipediaUrl) {
          this.wikipediaUrl = data.wikipediaUrl;
          this.loadWikipedia();
        }


      }, (err) => {
        console.log(err);
        this.router.navigateByUrl('/races');
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
  
    updateRace() {
      const id = this.route.snapshot.paramMap.get('id');
      this.racesService.getRace(id!).subscribe({
        next: (data) => {
          this.races = data;
          this.comments = data.comments as unknown as Comment[];
          this.comments?.forEach(comment => { comment.comment = comment.comment.replace(/\n/g, '<br>'); });
          this.comments?.forEach(comment => {
            comment.comment = comment.comment.replace(/<img/g, '<img width="90%"');
          });
          console.log(data);
        }, error: (err) => {
          console.log(err);
        }
      });
    }
  
    likeRace(racesId: string) {
      this.racesService.likeRace(this.races!._id).subscribe({
        next: (data) => {
          console.log(data);
          this.races = data;
        }, error: (err) => {
          console.log(err);
        }
      });
    }
  

    dislikeRace(racesId: string) {
      this.racesService.dislikeRace(this.races!._id).subscribe({
        next: (data) => {
          console.log(data);
          this.races = data;
        }, error: (err) => {
          console.log(err);
        }
      });
    }
  
    addComment() {
      if (this.commentText.length > 0) {
        if (this.commentText.includes('<script')) {
          console.log('Your comment contains script tag');
          this.scriptTagInComment = true;
        } else {
          this.scriptTagInComment = false;
          this.racesService.addComment(this.races!._id, this.commentText).subscribe({
            next: (data) => {
              console.log(data);
              data.comment = data.comment.replace(/\n/g, '<br>');
              this.comments?.push(data as any as Comment);
              this.commentText = '';
            }, error: (err) => {
              console.log(err);
            }
          });
        }
      }
    }
  
    deleteComment(commentId: string) {
      const dialogRef = this.dialog.open(DialogComponent, { data: { message: 'comment' } });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.racesService.deleteComment(this.races!._id, commentId).subscribe({
            next: (data) => {
              console.log(data);
              this.comments = this.comments?.filter(c => c._id !== commentId);
            }, error: (err) => {
              console.log(err);
            }
          });
        }
      });
    }
  
    editModeOff() {
      this.editMode = false;
      this.editedComment = '';
      this.selectedCommentToEdit = '';
    }
  
    editModeToggle(commentId: string) {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.selectedCommentToEdit = commentId;
        this.editedComment = this.comments!.find(c => c._id === commentId)!.comment;
        this.editedComment = this.editedComment.replace(/<br>/g, '\n');
      } else {
        this.selectedCommentToEdit = '';
        this.editedComment = '';
      }
    }

    editComment(commentId: string) {
      const tmpComment = this.editedComment.replace(/\n/g, '<br>');
      if (this.comments!.find(c => c._id === commentId)!.comment !== tmpComment) {
        this.racesService.editComment(this.races!._id, commentId, this.editedComment).subscribe({
          next: (data) => {
            console.log(data);
            this.comments = this.comments!.map(c => {
              if (c._id === commentId) {
                c.comment = this.editedComment;
                c.comment = c.comment.replace(/\n/g, '<br>');
              }
              return c;
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

    hasUserLikedRaces(races: Races): boolean {
      if (!races!.usersLikesRaces) return false;
      if (races!.usersLikesRaces && races.usersLikesRaces.length === 0) return false;
      return races.usersLikesRaces.some(user => user.username === this.currentUser?.email);
    }

    loadWikipedia() {
      if (!this.wikipediaUrl.trim()) {
        return alert('Adj meg egy érvényes Wikipedia URL-t');
      }
      const raceId = this.route.snapshot.paramMap.get('id')!;
      this.racesService.getRaceResults(raceId, this.wikipediaUrl).pipe(
        catchError(err => {
          console.error('Wiki scraping hiba', err);
          alert('Nem sikerült betölteni az eredményeket.');
          return EMPTY;
        })
      ).subscribe(results => {
        this.wikiResults = results;
        this.racesService.updateWikipediaLink(raceId, this.wikipediaUrl).subscribe({
          next: updatedRace => console.log('WikiUrl mentve:', updatedRace.wikipediaUrl),
          error: err => console.error('WikiUrl mentése sikertelen', err)
      });
    });
  }
  
    navigate(to: string) {
      console.log(to);
      
      this.router.navigateByUrl(to);
    }
}
