import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected readonly title = signal('HotelBooking');
  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly isAdmin = computed(() => this.authService.currentRole() === 'Admin');
  protected readonly isUser = computed(() => this.authService.currentRole() === 'User');

  protected logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
