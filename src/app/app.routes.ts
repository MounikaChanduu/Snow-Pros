import { Routes } from '@angular/router';
import { adminGuard, userGuard } from './guards/auth-role.guard';
import { LoginPageComponent } from './pages/login-page.component';
import { BookingPageComponent } from './pages/booking-page.component';
import { BookingHistoryPageComponent } from './pages/booking-history-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { HotelAdminPageComponent } from './pages/hotel-admin-page.component';
import { HotelDetailsPageComponent } from './pages/hotel-details-page.component';
import { HotelsPageComponent } from './pages/hotels-page.component';
import { RegisterPageComponent } from './pages/register-page.component';
import { RoomAdminPageComponent } from './pages/room-admin-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'hotels', component: HotelsPageComponent },
  { path: 'hotels/:id', component: HotelDetailsPageComponent },
  { path: 'hotel-admin', component: HotelAdminPageComponent, canActivate: [adminGuard] },
  { path: 'room-admin', component: RoomAdminPageComponent, canActivate: [adminGuard] },
  { path: 'book', component: BookingPageComponent, canActivate: [userGuard] },
  { path: 'book/:id', component: BookingPageComponent, canActivate: [userGuard] },
  { path: 'booking-history', component: BookingHistoryPageComponent, canActivate: [userGuard] },
  { path: 'login', component: LoginPageComponent, data: { loginMode: 'user' } },
  { path: 'admin-login', component: LoginPageComponent, data: { loginMode: 'admin' } },
  { path: 'register', component: RegisterPageComponent, data: { registerMode: 'user' } },
  { path: 'admin-register', component: RegisterPageComponent, data: { registerMode: 'admin' } },
  { path: '**', redirectTo: '' }
];
