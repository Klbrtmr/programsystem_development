import { Component } from '@angular/core';
import { RacesService } from '../shared/services/races.service';
import { Races } from '../shared/Model/Races';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Comment } from '../shared/Model/Comment';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { User } from '../shared/Model/User';
import { AuthService } from '../shared/services/auth.service';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private authService: AuthService,
    private racesService: RacesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog) { }

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
          //this.updateTopic();
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
          //this.updateTopic();
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
  /*
    likeComment(commentId: string) {
      this.racesService.likeComment(this.races!._id, commentId).subscribe({
        next: (data) => {
          console.log(data);
          if (data) {
            this.races = data;
            this.updateRace();
          }
        }, error: (err) => {
          console.log(err);
        }
      });
    }
  
    dislikeComment(commentId: string) {
      this.racesService.dislikeComment(this.races!._id, commentId).subscribe({
        next: (data) => {
          console.log(data);
          if (data) {
            this.races = data;
            this.updateRace();
          }
        }, error: (err) => {
          console.log(err);
        }
      });
    }*/
  
    hasUserLikedRace(races: Races): boolean {
      if (!races!.usersLikesRaces) return false;
      if (races!.usersLikesRaces && races.usersLikesRaces.length === 0) return false;
      return races.usersLikesRaces.some(user => user.username === this.currentUser?.email);
    }
  /*
    hasUserLikedComment(comment: Comment): boolean {
      return comment.usersLikesComment.some(user => user.username === this.currentUser?.email);
    }*/
  
    navigate(to: string) {
      console.log(to);
      
      this.router.navigateByUrl(to);
      //this.router.navigateByUrl('/login');
    }

}
