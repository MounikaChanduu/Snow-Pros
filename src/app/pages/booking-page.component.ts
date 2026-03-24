import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import { CatalogService } from '../catalog.service';
import { HotelService } from '../hotel.service';
import { LocalBookingService } from '../local-booking.service';
import { BookingRequest, Hotel, Room } from '../models/hotel';
import { getApiErrorMessage } from '../utils/api-error';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css'
})
export class BookingPageComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private hotelService = inject(HotelService);
  private catalogService = inject(CatalogService);
  private localBookingService = inject(LocalBookingService);

  hotels = signal<Hotel[]>(this.catalogService.getHotels());
  rooms = signal<Room[]>([]);
  loading = signal(false);
  submitting = signal(false);
  error = signal('');
  successMessage = signal('');
  confirmation = signal<{
    hotelName: string;
    roomType: string;
    city: string;
    nights: number;
    baseFare: number;
    taxes: number;
    total: number;
    checkIn: string;
    checkOut: string;
  } | null>(null);
  today = new Date().toISOString().split('T')[0];

  bookingForm = this.fb.group({
    hotelId: this.fb.control<number | null>(null, Validators.required),
    roomId: this.fb.control<number | null>(null, Validators.required),
    checkIn: this.fb.control('', Validators.required),
    checkOut: this.fb.control('', Validators.required),
  });

  formValue = toSignal(
    this.bookingForm.valueChanges.pipe(startWith(this.bookingForm.getRawValue())),
    { initialValue: this.bookingForm.getRawValue() }
  );

  selectedHotel = computed(() => this.hotels().find((hotel) => hotel.id === this.formValue().hotelId) || null);
  selectedRoom = computed(() => this.rooms().find((room) => room.id === this.formValue().roomId) || null);
  nights = computed(() => {
    const checkIn = this.formValue().checkIn;
    const checkOut = this.formValue().checkOut;
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = this.parseLocalDate(checkIn);
    const end = this.parseLocalDate(checkOut);
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
  });
  subtotal = computed(() => this.nights() * (this.selectedRoom()?.price || 0));
  taxes = computed(() => Math.round(this.subtotal() * 0.12));
  total = computed(() => this.subtotal() + this.taxes());

  constructor() {
    const selectedHotelId = Number(this.route.snapshot.paramMap.get('id'));
    const defaultHotelId = Number.isFinite(selectedHotelId) && selectedHotelId > 0 ? selectedHotelId : this.hotels()[0]?.id ?? null;
    this.bookingForm.controls.hotelId.valueChanges
      .pipe(startWith(defaultHotelId))
      .subscribe((hotelId) => this.onHotelChange(hotelId));

    this.bookingForm.patchValue({ hotelId: defaultHotelId });
  }

  loadHotels() {
    this.loading.set(true);
    this.error.set('');

    this.hotelService.listHotels().subscribe({
      next: (hotels) => {
        const merged = [...this.catalogService.getHotels()];
        hotels.forEach((hotel) => {
          if (!merged.some((item) => item.id === hotel.id || `${item.name}|${item.location}` === `${hotel.name}|${hotel.location}`)) {
            merged.push({
              ...hotel,
              city: hotel.location.split(',').pop()?.trim(),
              description: 'Comfortable business and leisure stay in a well-connected city location.',
              startingPrice: 5500,
              rating: 4.2,
              source: 'backend'
            });
          }
        });

        this.hotels.set(merged);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Unable to refresh hotel inventory.'));
        this.loading.set(false);
      }
    });
  }

  onHotelChange(hotelId: number | null) {
    this.rooms.set([]);
    this.confirmation.set(null);
    this.bookingForm.patchValue({ roomId: null }, { emitEvent: false });

    if (!hotelId) {
      return;
    }

    const catalogRooms = this.catalogService.getRoomsByHotel(hotelId);
    if (catalogRooms.length) {
      this.rooms.set(catalogRooms);
      const routeRoomId = Number(this.route.snapshot.queryParamMap.get('roomId'));
      const defaultRoomId = catalogRooms.some((room) => room.id === routeRoomId) ? routeRoomId : catalogRooms[0]?.id ?? null;
      this.bookingForm.patchValue({ roomId: defaultRoomId });
      return;
    }

    this.loading.set(true);
    this.hotelService.getRoomsByHotel(hotelId).subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
        const queryRoomId = Number(this.route.snapshot.queryParamMap.get('roomId'));
        const defaultRoomId = rooms.some((room) => room.id === queryRoomId) ? queryRoomId : rooms[0]?.id ?? null;
        this.bookingForm.patchValue({ roomId: defaultRoomId });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Unable to load rooms for the selected hotel.'));
        this.loading.set(false);
      }
    });
  }

  submitBooking() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    if (this.nights() <= 0) {
      this.error.set('Please choose a valid stay duration.');
      return;
    }

    const form = this.bookingForm.getRawValue();
    this.submitting.set(true);
    this.error.set('');
    this.successMessage.set('');

    const hotel = this.selectedHotel();
    const room = this.selectedRoom();

    if (hotel?.source === 'catalog' || room?.source === 'catalog') {
      this.confirmCurrentSelection(form.checkIn as string, form.checkOut as string);
      this.localBookingService.add({
        hotelName: hotel?.name || 'Selected hotel',
        roomType: room?.roomType || 'Selected room',
        city: hotel?.city || hotel?.location || '',
        nights: this.nights(),
        baseFare: this.subtotal(),
        taxes: this.taxes(),
        total: this.total(),
        checkIn: form.checkIn as string,
        checkOut: form.checkOut as string,
        createdAt: new Date().toISOString(),
        source: 'catalog'
      });
      this.successMessage.set('Your booking has been confirmed in Book My Stay.');
      this.submitting.set(false);
      return;
    }

    const payload: BookingRequest = {
      roomId: form.roomId as number,
      checkIn: this.parseLocalDate(form.checkIn as string).toISOString(),
      checkOut: this.parseLocalDate(form.checkOut as string).toISOString(),
    };

    this.hotelService.bookRoom(payload).subscribe({
      next: (response) => {
        this.confirmCurrentSelection(form.checkIn as string, form.checkOut as string);
        this.successMessage.set(String(response.message || 'Your booking has been confirmed.'));
        this.submitting.set(false);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err, 'Booking request failed.'));
        this.submitting.set(false);
      }
    });
  }

  private parseLocalDate(value: string) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  private confirmCurrentSelection(checkIn: string, checkOut: string) {
    const hotel = this.selectedHotel();
    const room = this.selectedRoom();

    this.confirmation.set({
      hotelName: hotel?.name || 'Selected hotel',
      roomType: room?.roomType || 'Selected room',
      city: hotel?.city || hotel?.location || '',
      nights: this.nights(),
      baseFare: this.subtotal(),
      taxes: this.taxes(),
      total: this.total(),
      checkIn,
      checkOut,
    });
  }
}
