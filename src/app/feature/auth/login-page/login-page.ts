import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(Auth);

  ngOnInit(): void {
    this.initLoginForm();

    // Si ya hay token => ir a returnUrl o por defecto
    const token = localStorage.getItem('token');
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';

    if (token) {
      console.log('[LoginPage] Token detectado, redirigiendo a:', returnUrl);
      this.router.navigateByUrl(returnUrl);
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('[LoginPage] Token recibido:', response.token);

        // Guarda token
        localStorage.setItem('token', response.token);

        // Redirige a la ruta que se intentó visitar o /products
        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] || '/products';

        console.log('[LoginPage] Redirigiendo a:', returnUrl);
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        console.error('[LoginPage] Error de login:', err);
        alert('Nombre de usuario o contraseña incorrectos');
      },
    });
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      passwordHash: ['', [Validators.required]],
    });
  }
}
