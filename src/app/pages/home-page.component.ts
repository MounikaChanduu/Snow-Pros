import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CatalogService } from '../catalog.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  private authService = inject(AuthService);
  private catalogService = inject(CatalogService);

  featuredHotels = this.catalogService.getHotels().slice(0, 3);
  featuredCities = computed(() => [...new Set(this.catalogService.getHotels().map((hotel) => hotel.city).filter(Boolean))].slice(0, 6));
  isLoggedIn = this.authService.isLoggedIn;
  isAdmin = computed(() => this.authService.currentRole() === 'Admin');
  isUser = computed(() => this.authService.currentRole() === 'User');
}
