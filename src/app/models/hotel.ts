export interface Hotel {
  id: number;
  name: string;
  location: string;
  city?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  startingPrice?: number;
  amenities?: string[];
  source?: 'backend' | 'catalog';
}

export interface Room {
  id: number;
  roomType: string;
  price: number;
  hotelId: number;
  capacity?: number;
  benefits?: string[];
  source?: 'backend' | 'catalog';
}

export interface BookingRequest {
  roomId: number;
  checkIn: string;
  checkOut: string;
}

export interface HotelCreateRequest {
  name: string;
  location: string;
}

export interface RoomCreateRequest {
  roomType: string;
  price: number;
  hotelId: number;
}

export interface BookingResponse {
  message?: string;
  statusCode?: number;
  [key: string]: unknown;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'Admin' | 'User';
}

export interface AuthResponse {
  token?: string;
  message?: string;
  statusCode?: number;
  [key: string]: unknown;
}
