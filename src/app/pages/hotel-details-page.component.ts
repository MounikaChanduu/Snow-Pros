import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../catalog.service';
import { HotelService } from '../hotel.service';
import { Hotel, Room } from '../models/hotel';
import { getApiErrorMessage } from '../utils/api-error';

@Component({
  selector: 'app-hotel-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-details-page.component.html',
  styleUrl: './hotel-details-page.component.css'
})
export class HotelDetailsPageComponent {
  private route = inject(ActivatedRoute);
  private hotelService = inject(HotelService);
  private catalogService = inject(CatalogService);

  hotel = signal<Hotel | null>(null);
  rooms = signal<Room[]>([]);
  loading = signal(true);
  error = signal('');

  selectedHotelCity = computed(() => this.hotel()?.city || this.hotel()?.location.split(',').pop()?.trim() || '');

  constructor() {
    this.loadHotel();
  }

  loadHotel() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const catalogHotel = this.catalogService.getHotelById(id);

    if (catalogHotel) {
      this.hotel.set(catalogHotel);
      this.rooms.set(this.catalogService.getRoomsByHotel(id));
      this.loading.set(false);
      return;
    }

    this.hotelService.getHotelById(id).subscribe({
      next: (hotel) => {
        this.hotel.set({
          ...hotel,
          city: hotel.city || hotel.location.split(',').pop()?.trim(),
          description: hotel.description || 'Thoughtfully located city stay with comfortable rooms and travel-ready amenities.',
          startingPrice: hotel.startingPrice || 5500,
          rating: hotel.rating || 4.2,
          source: 'backend'
        });
        this.loadRooms(hotel.id);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Unable to load hotel details right now.'));
        this.loading.set(false);
      }
    });
  }

  private loadRooms(hotelId: number) {
    this.hotelService.getRoomsByHotel(hotelId).subscribe({
      next: (rooms) => {
        this.rooms.set(rooms.map((room) => ({ ...room, capacity: room.capacity || 2, benefits: room.benefits || ['Flexible check-in', 'Comfort bedding'] })));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Room details are not available right now.'));
        this.loading.set(false);
      }
    });
  }
}
