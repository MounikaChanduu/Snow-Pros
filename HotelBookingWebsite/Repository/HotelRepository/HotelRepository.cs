using HotelBooking.API.Interfaces;
using HotelBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.API.Repositories
{
    public class HotelRepository : IHotelRepository
    {
        private readonly AppDbContext _context;

        public HotelRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Hotel>> GetAllAsync()
        {
            return await _context.Hotels.Include(h => h.Rooms).ToListAsync();
        }

        public async Task<Hotel> GetByIdAsync(int id)
        {
            return await _context.Hotels.Include(h => h.Rooms)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task AddAsync(Hotel hotel)
        {
            await _context.Hotels.AddAsync(hotel);
            await _context.SaveChangesAsync();
        }
    }
}
