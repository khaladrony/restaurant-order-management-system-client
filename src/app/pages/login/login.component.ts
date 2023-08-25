import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Output,
  EventEmitter,
  SimpleChange,
  OnChanges,
  Input,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "src/app/services/auth.service";
import { ConfirmationModalService } from "src/app/services/confirmation-modal/confirmation-modal.service";
import { NotificationService } from "src/app/services/notification/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private confirmationModalService: ConfirmationModalService,
    private loader: NgxSpinnerService,
    private notifyService: NotificationService
  ) {}

  submitted = false;
  working = false;
  complete = false;
  strongPassword = false;

  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  bar4: string;

  private colors = ["#F00", "#F90", "#FF0", "#9F0", "#0F0"];
  public barLabel: string = "Password strength:";
  message: string;
  messageColor: string;

  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(["admin"]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loader.show();

      this.auth.login(this.loginForm.value).subscribe({
        next: (data) => {
          sessionStorage.setItem("token", data.jwtToken);
          sessionStorage.setItem("username", data.username);
        },
        complete: () => {
          this.router.navigate(["admin"]);
          this.loader.hide();
        },
        error: (err) => {
          this.loader.hide();
          console.log(err);
          this.notifyService.showError(
            "An Error Occurred Please Try Again later!",
            "ERROR"
          );
        },
      });
    }
  }

  private measureStrength(pass: string) {
    let score = 0;
    // award every unique letter until 5 repetitions
    let letters = {};
    for (let i = 0; i < pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1;
      score += 5.0 / letters[pass[i]];
    }
    // bonus points for mixing it up
    let variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass),
    };

    let variationCount = 0;
    for (let check in variations) {
      variationCount += variations[check] ? 1 : 0;
    }
    score += (variationCount - 1) * 10;
    return Math.trunc(score);
  }

  onPasswordStrengthChanged(event: string) {
    const password = event;
    this.setBarColors(5, "#DDD");
    if (password) {
      let c = this.getColor(this.measureStrength(password));
      this.setBarColors(c.idx, c.col);
    }
  }

  private getColor(score: number) {
    let idx = 0;
    if (score > 90) {
      idx = 4;
    } else if (score > 70) {
      idx = 3;
    } else if (score >= 40) {
      idx = 2;
    } else if (score >= 20) {
      idx = 1;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx],
    };
  }

  private setBarColors(count, col) {
    for (let _n = 0; _n < count; _n++) {
      this["bar" + _n] = col;
    }
  }
}
