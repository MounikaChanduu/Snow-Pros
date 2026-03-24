import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';
import { getApiErrorMessage } from '../utils/api-error';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  loginMode = this.route.snapshot.data['loginMode'] === 'admin' ? 'admin' : 'user';

  form = this.fb.group({
    username: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.authService.login(this.form.getRawValue() as { username: string; password: string })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          const requiredRole = this.loginMode === 'admin' ? 'Admin' : 'User';
          if (!this.authService.hasRole(requiredRole)) {
            this.authService.logout();
            this.error.set(
              this.loginMode === 'admin'
                ? 'Login worked, but the server did not return an Admin role for this account. Use the admin registration page or update the backend role assignment.'
                : 'Please use the admin login page for admin accounts.'
            );
            return;
          }

          this.successMessage.set(this.loginMode === 'admin' ? 'Admin login successful.' : 'Login successful.');
          this.router.navigate([this.loginMode === 'admin' ? '/' : '/book']);
        },
        error: (err) => {
          this.error.set(getApiErrorMessage(err, 'Login failed.'));
        }
      });
  }
}
