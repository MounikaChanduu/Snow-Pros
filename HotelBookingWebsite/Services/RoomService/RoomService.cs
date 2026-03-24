using HotelBooking.API.DTOs;
using HotelBooking.API.Interfaces;
using HotelBooking.API.Models;

namespace HotelBooking.API.Services
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _repo;

        public RoomService(IRoomRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Room>> GetRoomsByHotel(int hotelId)
        {
            return await _repo.GetRoomsByHotel(hotelId);
        }

        public async Task AddRoom(RoomDto dto)
        {
            var room = new Room
            {
                RoomType = dto.RoomType,
                Price = dto.Price,
                HotelId = dto.HotelId,
                IsAvailable = true
            };

            await _repo.Add(room);
        }
    }
}