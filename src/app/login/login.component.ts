import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from '../shared/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router) { }
  loginForm: FormGroup;
  login$: Subscription;
  isLogin: boolean = false;
  isPasswordSame: boolean = false;
  buttonText: String = 'Sign In'
  ngOnInit() {

    if (this.router.url === '/login') {
      this.isLogin = true;
    } else {
      this.isLogin = false;
      this.buttonText = 'Sign Up'
    }
    this.createForm();
  }

  createForm() {
    if (this.isLogin) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
    } else {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        name: ['', [Validators.required]],
        username: ['', [Validators.required]]
      });
    }
  }

  onSubmit() {
    if (this.isLogin) {
      this.onLoginUser();
    } else {
      this.onSignUpUser();
    }
  }

  onLoginUser() {
    if (this.loginForm.valid) {
      this.login$ = this.loginService.login(this.loginForm.value).subscribe(res => {
        if (res['success']) {
          // this.toastrService.success("Login Success", '', {
          //   timeOut: 2000
          // });
          localStorage.setItem('user-data', JSON.stringify(res['data']));
          localStorage.setItem('token', res['token']);
          this.router.navigate(['home']);
        } else {
          // this.toastrService.error("Login Failed", '', {
          //   timeOut: 5000
          // });
        }
      },
        err => {
          // this.toastrService.error("Login Failed", '', {
          //   timeOut: 5000
          // });
          console.error(err);
        })
    }
  }

  onSignUpUser() {
    this.isPasswordSame = this.loginForm.controls['password'].value === this.loginForm.controls['confirmPassword'].value
    if (this.loginForm.valid && this.isPasswordSame) {
      this.login$ = this.loginService.signUp(this.loginForm.value).subscribe(res => {
        if (res['success']) {
          // this.toastrService.success("Login Success", '', {
          //   timeOut: 2000
          // });
          this.router.navigate(['login']);
        } else {
          // this.toastrService.error("Login Failed", '', {
          //   timeOut: 5000
          // });
        }
      },
        err => {
          // this.toastrService.error("Login Failed", '', {
          //   timeOut: 5000
          // });
          console.error(err);
        })
    }
  }

  redirectTo(path) {
    this.router.navigate([path]);
  }


  ngOnDestroy() {
    if (this.login$) {
      this.login$.unsubscribe();
    }
  }

}
