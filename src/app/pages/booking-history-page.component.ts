import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HotelService } from '../hotel.service';
import { LocalBookingRecord, LocalBookingService } from '../local-booking.service';
import { getApiErrorMessage } from '../utils/api-error';

interface BackendBookingRecord {
  id?: number;
  hotelName?: string;
  roomType?: string;
  city?: string;
  total?: number;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  status?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-booking-history-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-history-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class BookingHistoryPageComponent {
  private hotelService = inject(HotelService);
  private localBookingService = inject(LocalBookingService);

  loading = signal(false);
  error = signal('');
  backendBookings = signal<BackendBookingRecord[]>([]);
  previewBookings = signal<LocalBookingRecord[]>(this.localBookingService.list());

  hasAnyBookings = computed(() => this.backendBookings().length > 0 || this.previewBookings().length > 0);

  loadBookings() {
    this.loading.set(true);
    this.error.set('');

    this.hotelService.getMyBookings().subscribe({
      next: (bookings) => {
        this.backendBookings.set(Array.isArray(bookings) ? (bookings as BackendBookingRecord[]) : []);
        this.previewBookings.set(this.localBookingService.list());
        this.loading.set(false);
      },
      error: (err) => {
        this.backendBookings.set([]);
        this.previewBookings.set(this.localBookingService.list());
        this.error.set(getApiErrorMessage(err, 'Unable to load backend booking history. Showing app-confirmed stays below.'));
        this.loading.set(false);
      }
    });
  }
}
