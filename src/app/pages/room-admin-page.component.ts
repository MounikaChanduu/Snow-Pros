import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HotelService } from '../hotel.service';
import { Hotel } from '../models/hotel';
import { getApiErrorMessage } from '../utils/api-error';

@Component({
  selector: 'app-room-admin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './room-admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class RoomAdminPageComponent {
  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);

  hotels = signal<Hotel[]>([]);
  loading = signal(true);
  error = signal('');
  successMessage = signal('');

  form = this.fb.group({
    roomType: this.fb.control('', Validators.required),
    price: this.fb.control(0, [Validators.required, Validators.min(0)]),
    hotelId: this.fb.control<number | null>(null, Validators.required),
  });

  constructor() {}

  loadHotels() {
    this.hotelService.listHotels().subscribe({
      next: (hotels) => {
        this.hotels.set(hotels);
        this.form.patchValue({ hotelId: hotels[0]?.id ?? null });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Unable to load hotels.'));
        this.loading.set(false);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.hotelService.createRoom(this.form.getRawValue() as { roomType: string; price: number; hotelId: number }).subscribe({
      next: () => {
        this.successMessage.set('Room request sent successfully.');
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Room creation failed.'));
        this.loading.set(false);
      }
    });
  }
}
