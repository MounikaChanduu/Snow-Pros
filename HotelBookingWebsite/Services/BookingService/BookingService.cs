using HotelBooking.API.Interfaces;
using HotelBooking.API.Models;

namespace HotelBooking.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repo;

        public BookingService(IBookingRepository repo)
        {
            _repo = repo;
        }

        public async Task<string> BookRoom(Booking booking)
        {
            var isAvailable = await _repo.IsRoomAvailable(
                booking.RoomId,
                booking.CheckIn,
                booking.CheckOut
            );

            if (!isAvailable)
                return "Room is already booked for selected dates";

            await _repo.AddAsync(booking);

            return "Room booked successfully";
        }

        public async Task<IEnumerable<Booking>> GetUserBookings(int userId)
        {
            return await _repo.GetUserBookings(userId);
        }
    }
}