using HotelBooking.API.Models;

namespace HotelBooking.API.Interfaces
{
    public interface IHotelRepository
    {
        Task<IEnumerable<Hotel>> GetAllAsync();
        Task<Hotel> GetByIdAsync(int id);
        Task AddAsync(Hotel hotel);
    }
}
