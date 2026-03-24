import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';
import { getApiErrorMessage } from '../utils/api-error';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  registerMode = this.route.snapshot.data['registerMode'] === 'admin' ? 'admin' : 'user';

  form = this.fb.group({
    username: this.fb.control('', Validators.required),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: this.fb.control('', [Validators.required, Validators.minLength(6)]),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.controls.password.value !== this.form.controls.confirmPassword.value) {
      this.error.set('Password and confirm password must match.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    const { username, email, password } = this.form.getRawValue();

    this.authService.register({
      username: username as string,
      email: email as string,
      password: password as string,
      role: this.registerMode === 'admin' ? 'Admin' : 'User'
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          const requiredRole = this.registerMode === 'admin' ? 'Admin' : 'User';
          if (!this.authService.hasRole(requiredRole)) {
            this.authService.logout();
            this.error.set(
              this.registerMode === 'admin'
                ? 'Admin account creation completed, but the returned account does not have admin access.'
                : 'Account created, but the returned session is not a user account.'
            );
            return;
          }

          this.successMessage.set(
            this.registerMode === 'admin'
              ? 'Admin account created successfully. Redirecting to the admin dashboard...'
              : 'Account created successfully. Redirecting to your bookings...'
          );
          this.router.navigate([this.registerMode === 'admin' ? '/' : '/booking-history']);
        },
        error: (err) => {
          this.error.set(getApiErrorMessage(err, 'Registration failed.'));
        }
      });
  }
}
