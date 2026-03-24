import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../catalog.service';
import { HotelService } from '../hotel.service';
import { Hotel } from '../models/hotel';
import { getApiErrorMessage } from '../utils/api-error';

@Component({
  selector: 'app-hotels-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hotels-page.component.html',
  styleUrl: './hotels-page.component.css'
})
export class HotelsPageComponent {
  private hotelService = inject(HotelService);
  private catalogService = inject(CatalogService);

  hotels = signal<Hotel[]>(this.catalogService.getHotels());
  loading = signal(false);
  error = signal('');
  selectedCity = signal('All Cities');
  searchTerm = signal('');

  cities = computed(() => ['All Cities', ...new Set(this.hotels().map((hotel) => hotel.city || this.extractCity(hotel.location)))]);

  filteredHotels = computed(() =>
    this.hotels().filter((hotel) => {
      const city = hotel.city || this.extractCity(hotel.location);
      const matchesCity = this.selectedCity() === 'All Cities' || city === this.selectedCity();
      const haystack = `${hotel.name} ${hotel.location} ${hotel.description || ''}`.toLowerCase();
      const matchesSearch = !this.searchTerm().trim() || haystack.includes(this.searchTerm().trim().toLowerCase());
      return matchesCity && matchesSearch;
    })
  );

  loadHotels() {
    this.loading.set(true);
    this.error.set('');

    this.hotelService.listHotels().subscribe({
      next: (hotels) => {
        const normalized = hotels.map((hotel) => ({
          ...hotel,
          city: this.extractCity(hotel.location),
          startingPrice: hotel.startingPrice ?? 5500,
          description: hotel.description ?? 'Comfortable stay with easy access to major city landmarks.',
          rating: hotel.rating ?? 4.2,
          source: 'backend' as const
        }));

        const merged = [...this.catalogService.getHotels()];
        normalized.forEach((hotel) => {
          if (!merged.some((item) => item.id === hotel.id || `${item.name}|${item.location}` === `${hotel.name}|${hotel.location}`)) {
            merged.push(hotel);
          }
        });

        this.hotels.set(merged);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Unable to refresh hotels right now.'));
        this.loading.set(false);
      }
    });
  }

  private extractCity(location: string) {
    return location.split(',').pop()?.trim() || location;
  }
}
