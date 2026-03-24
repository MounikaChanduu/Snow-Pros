import { Injectable } from '@angular/core';
import { Hotel, Room } from './models/hotel';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly hotels: Hotel[] = [
    {
      id: 1001,
      name: 'Skyline Grand',
      location: 'Bandra Kurla Complex, Mumbai',
      city: 'Mumbai',
      description: 'A premium city hotel close to business districts, nightlife, and coastal dining.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      rating: 4.8,
      startingPrice: 9200,
      amenities: ['Rooftop pool', 'Airport transfer', 'Breakfast included'],
      source: 'catalog'
    },
    {
      id: 1002,
      name: 'Capital Crown',
      location: 'Connaught Place, New Delhi',
      city: 'New Delhi',
      description: 'Elegant rooms in the heart of the capital with quick access to shopping and landmarks.',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
      rating: 4.6,
      startingPrice: 7800,
      amenities: ['Business lounge', 'City view', 'Late checkout'],
      source: 'catalog'
    },
    {
      id: 1003,
      name: 'Garden Tech Suites',
      location: 'Indiranagar, Bengaluru',
      city: 'Bengaluru',
      description: 'A modern stay for work and weekend travel with spacious suites and fast connectivity.',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      rating: 4.7,
      startingPrice: 6900,
      amenities: ['Work pods', 'Fitness studio', 'Cafe on site'],
      source: 'catalog'
    },
    {
      id: 1004,
      name: 'Marina Bay Residences',
      location: 'Mylapore, Chennai',
      city: 'Chennai',
      description: 'Coastal comfort with calm interiors, family-friendly rooms, and classic South Indian dining.',
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      rating: 4.5,
      startingPrice: 6200,
      amenities: ['Family rooms', 'Free breakfast', 'Near marina'],
      source: 'catalog'
    },
    {
      id: 1005,
      name: 'Pearl Heights',
      location: 'Banjara Hills, Hyderabad',
      city: 'Hyderabad',
      description: 'Stylish urban hotel known for comfort, food experiences, and great evening city views.',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      rating: 4.7,
      startingPrice: 7100,
      amenities: ['Signature dining', 'Spa', 'Sky lounge'],
      source: 'catalog'
    },
    {
      id: 1006,
      name: 'Riverfront Luxe',
      location: 'Koregaon Park, Pune',
      city: 'Pune',
      description: 'Boutique luxury with a calm neighborhood feel, designed for longer stays and weekend escapes.',
      imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
      rating: 4.4,
      startingPrice: 5800,
      amenities: ['Garden deck', 'Smart rooms', 'All-day dining'],
      source: 'catalog'
    }
  ];

  private readonly rooms: Room[] = [
    { id: 9001, hotelId: 1001, roomType: 'Deluxe King', price: 9200, capacity: 2, benefits: ['King bed', 'Breakfast', 'City skyline'], source: 'catalog' },
    { id: 9002, hotelId: 1001, roomType: 'Executive Twin', price: 10800, capacity: 2, benefits: ['Lounge access', 'Twin beds', 'Airport pickup'], source: 'catalog' },
    { id: 9013, hotelId: 1001, roomType: 'Sea View Studio', price: 12400, capacity: 3, benefits: ['Floor-to-ceiling windows', 'Breakfast', 'Harbor view'], source: 'catalog' },
    { id: 9014, hotelId: 1001, roomType: 'Business Club Room', price: 13800, capacity: 2, benefits: ['Express laundry', 'Meeting room credit', 'Club access'], source: 'catalog' },
    { id: 9003, hotelId: 1002, roomType: 'Heritage Queen', price: 7800, capacity: 2, benefits: ['Queen bed', 'Breakfast', 'Historic district view'], source: 'catalog' },
    { id: 9004, hotelId: 1002, roomType: 'Capital Suite', price: 11900, capacity: 3, benefits: ['Separate living area', 'Priority check-in'], source: 'catalog' },
    { id: 9015, hotelId: 1002, roomType: 'Diplomat Room', price: 9600, capacity: 2, benefits: ['Work desk', 'Evening tea service', 'City view'], source: 'catalog' },
    { id: 9016, hotelId: 1002, roomType: 'Royal Family Suite', price: 14500, capacity: 4, benefits: ['Two-room layout', 'Breakfast', 'Private transfer'], source: 'catalog' },
    { id: 9005, hotelId: 1003, roomType: 'Studio Room', price: 6900, capacity: 2, benefits: ['Workspace', 'Fast Wi-Fi', 'Coffee setup'], source: 'catalog' },
    { id: 9006, hotelId: 1003, roomType: 'Tech Suite', price: 9800, capacity: 3, benefits: ['Living zone', 'Meeting table', 'Breakfast'], source: 'catalog' },
    { id: 9017, hotelId: 1003, roomType: 'Innovation Loft', price: 11200, capacity: 3, benefits: ['Smart controls', 'Standing desk', 'Snack bar'], source: 'catalog' },
    { id: 9018, hotelId: 1003, roomType: 'Weekend Family Den', price: 8900, capacity: 4, benefits: ['Sofa bed', 'Game console', 'Late checkout'], source: 'catalog' },
    { id: 9007, hotelId: 1004, roomType: 'Comfort Room', price: 6200, capacity: 2, benefits: ['Breakfast', 'Garden view', 'Flexible checkout'], source: 'catalog' },
    { id: 9008, hotelId: 1004, roomType: 'Family Studio', price: 8600, capacity: 4, benefits: ['Two queen beds', 'Kids menu'], source: 'catalog' },
    { id: 9019, hotelId: 1004, roomType: 'Marina Deluxe', price: 7800, capacity: 2, benefits: ['Partial sea view', 'Filter coffee setup', 'Breakfast'], source: 'catalog' },
    { id: 9020, hotelId: 1004, roomType: 'Coastal Suite', price: 10800, capacity: 3, benefits: ['Lounge area', 'Dinner credit', 'Premium bath amenities'], source: 'catalog' },
    { id: 9009, hotelId: 1005, roomType: 'Premium King', price: 7100, capacity: 2, benefits: ['Welcome drink', 'Spa access'], source: 'catalog' },
    { id: 9010, hotelId: 1005, roomType: 'Skyline Club', price: 10200, capacity: 2, benefits: ['Club lounge', 'Late checkout'], source: 'catalog' },
    { id: 9021, hotelId: 1005, roomType: 'Nizam Deluxe', price: 8400, capacity: 2, benefits: ['Breakfast buffet', 'City-facing windows', 'Tea service'], source: 'catalog' },
    { id: 9022, hotelId: 1005, roomType: 'Pearl Signature Suite', price: 12900, capacity: 4, benefits: ['Dining nook', 'Butler service', 'Airport transfer'], source: 'catalog' },
    { id: 9011, hotelId: 1006, roomType: 'Boutique Queen', price: 5800, capacity: 2, benefits: ['Balcony', 'Breakfast'], source: 'catalog' },
    { id: 9012, hotelId: 1006, roomType: 'River Suite', price: 8900, capacity: 3, benefits: ['Living area', 'Evening snacks'], source: 'catalog' },
    { id: 9023, hotelId: 1006, roomType: 'Garden Terrace Room', price: 7200, capacity: 2, benefits: ['Private sit-out', 'Breakfast', 'Rain shower'], source: 'catalog' },
    { id: 9024, hotelId: 1006, roomType: 'Weekend Retreat Suite', price: 10400, capacity: 4, benefits: ['Separate lounge', 'Brunch for two', 'Pool access'], source: 'catalog' }
  ];

  getHotels(): Hotel[] {
    return this.hotels;
  }

  getHotelById(id: number): Hotel | undefined {
    return this.hotels.find((hotel) => hotel.id === id);
  }

  getRoomsByHotel(hotelId: number): Room[] {
    return this.rooms.filter((room) => room.hotelId === hotelId);
  }
}
