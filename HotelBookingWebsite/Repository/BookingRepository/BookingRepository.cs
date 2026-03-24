using HotelBooking.API.Interfaces;
using HotelBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.API.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Booking booking)
        {
            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Booking>> GetUserBookings(int userId)
        {
            return await _context.Bookings
                .Include(b => b.Room)
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> IsRoomAvailable(int roomId, DateTime checkIn, DateTime checkOut)
        {
            return !await _context.Bookings.AnyAsync(b =>
                b.RoomId == roomId &&
                !(checkOut <= b.CheckIn || checkIn >= b.CheckOut)
            );
        }
    }
}