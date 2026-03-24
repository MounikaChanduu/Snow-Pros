using HotelBooking.API.Models;

namespace HotelBooking.API.Interfaces
{
    public interface IBookingService
    {
        Task<string> BookRoom(Booking booking);

        Task<IEnumerable<Booking>> GetUserBookings(int userId);
    }
}
