import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BookingRequest,
  BookingResponse,
  Hotel,
  HotelCreateRequest,
  Room,
  RoomCreateRequest
} from './models/hotel';

@Injectable({ providedIn: 'root' })
export class HotelService {
  constructor(private http: HttpClient) {}

  listHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>('Hotel');
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`Hotel/${id}`);
  }

  getPagedHotels(page: number, pageSize: number): Observable<unknown> {
    return this.http.get<unknown>(`Hotel/paged?page=${page}&pageSize=${pageSize}`);
  }

  createHotel(body: HotelCreateRequest): Observable<unknown> {
    return this.http.post<unknown>('Hotel', body);
  }

  getRoomsByHotel(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`Room/byHotel/${hotelId}`);
  }

  createRoom(body: RoomCreateRequest): Observable<unknown> {
    return this.http.post<unknown>('Room', body);
  }

  bookRoom(body: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>('Booking', body);
  }

  getMyBookings(): Observable<unknown[]> {
    return this.http.get<unknown[]>('Booking/my');
  }
}
