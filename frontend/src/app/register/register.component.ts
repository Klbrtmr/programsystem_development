import { CommonModule, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { Router } from "@angular/router";
import { isSubscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        username: [""],
        name: [""],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validator: this.mustMatch("password", "confirmPassword"),
      }
    );

    this.authService.checkAuth().subscribe({
      next: (data) => {
        if (data) {
          this.navigate("/races");
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && matchingControl.errors["mustMatch"]) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log("Form data:", this.signupForm.value);
      this.authService.register(this.signupForm.value).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigateByUrl("/login");
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      console.log("From is not valid.");
    }
  }

  goBack() {
    this.location.back();
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }
}
