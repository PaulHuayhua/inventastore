import { Component, inject, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPage implements OnInit {
  
  loginForm: FormGroup = new FormGroup({});
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(Auth);

  ngOnInit(): void {
    this.initLoginForm();
  }

   login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Token recibido:', response.token);
        this.router.navigateByUrl('/suppliers');
      },
      error: (err) => {
        console.error('Error de login:', err);
        alert('Nombre de usuario o contraseña incorrectos');
      }
    });
  }


initLoginForm(): void {
  this.loginForm = this.fb.group({
    name: ['', [Validators.required]],
    passwordHash: ['', [Validators.required]]
  });
}

}