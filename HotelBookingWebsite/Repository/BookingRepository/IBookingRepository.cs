using HotelBooking.API.Models;

namespace HotelBooking.API.Interfaces
{
    public interface IBookingRepository
    {
        Task AddAsync(Booking booking);

        Task<IEnumerable<Booking>> GetUserBookings(int userId);

        // 🔥 NEW METHOD
        Task<bool> IsRoomAvailable(int roomId, DateTime checkIn, DateTime checkOut);
    }
}
