import { Injectable } from '@angular/core';

export interface LocalBookingRecord {
  hotelName: string;
  roomType: string;
  city: string;
  nights: number;
  baseFare: number;
  taxes: number;
  total: number;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  source: 'catalog';
}

@Injectable({ providedIn: 'root' })
export class LocalBookingService {
  private readonly storageKey = 'book_my_stay_local_bookings';

  list(): LocalBookingRecord[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as LocalBookingRecord[]) : [];
    } catch {
      return [];
    }
  }

  add(record: LocalBookingRecord) {
    const current = this.list();
    current.unshift(record);
    localStorage.setItem(this.storageKey, JSON.stringify(current));
  }
}
