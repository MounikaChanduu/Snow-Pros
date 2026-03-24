using HotelBooking.API.Models;

namespace HotelBooking.API.Interfaces
{
    public interface IHotelService
    {
        Task<IEnumerable<Hotel>> GetAllHotels();

        Task<Hotel> GetHotelById(int id);

        Task AddHotel(Hotel hotel);
    }
}