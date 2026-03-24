using HotelBooking.API.Interfaces;
using HotelBooking.API.Models;

namespace HotelBooking.API.Services
{
    public class HotelService : IHotelService
    {
        private readonly IHotelRepository _repo;

        public HotelService(IHotelRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Hotel>> GetAllHotels()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Hotel> GetHotelById(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task AddHotel(Hotel hotel)
        {
            await _repo.AddAsync(hotel);
        }
    }
}