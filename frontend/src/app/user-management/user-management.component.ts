import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../shared/Model/User';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users!: User[];
  columns = ['email', 'name', 'username', 'isAdmin', 'delete'];

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private dialog: MatDialog,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
                iconRegistry.addSvgIcon(
                  'trash',
                  sanitizer.bypassSecurityTrustResourceUrl('assets/icons/trash.svg')
                );
              } 

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  deleteUser(userId: string) {
    const dialogRef = this.dialog.open(DialogComponent, {data: { message: 'user' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: (data) => {
            console.log(data);
            this.users = this.users.filter(user => user._id !== userId);
          }, error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }
}
