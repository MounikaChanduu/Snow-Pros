import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HotelService } from '../hotel.service';
import { getApiErrorMessage } from '../utils/api-error';

@Component({
  selector: 'app-hotel-admin-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, JsonPipe],
  templateUrl: './hotel-admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class HotelAdminPageComponent {
  private fb = inject(FormBuilder);
  private hotelService = inject(HotelService);

  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  pagedResult = signal<unknown>(null);

  createForm = this.fb.group({
    name: this.fb.control('', Validators.required),
    location: this.fb.control('', Validators.required),
  });

  pagedForm = this.fb.group({
    page: this.fb.control(1, [Validators.required, Validators.min(1)]),
    pageSize: this.fb.control(5, [Validators.required, Validators.min(1)]),
  });

  createHotel() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successMessage.set('');

    this.hotelService.createHotel(this.createForm.getRawValue() as { name: string; location: string }).subscribe({
      next: () => {
        this.successMessage.set('Hotel request sent successfully.');
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Hotel creation failed.'));
        this.loading.set(false);
      }
    });
  }

  loadPagedHotels() {
    if (this.pagedForm.invalid) {
      this.pagedForm.markAllAsTouched();
      return;
    }

    const { page, pageSize } = this.pagedForm.getRawValue();

    this.loading.set(true);
    this.error.set('');

    this.hotelService.getPagedHotels(page as number, pageSize as number).subscribe({
      next: (result) => {
        this.pagedResult.set(result);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Paged hotel request failed.'));
        this.loading.set(false);
      }
    });
  }
}
