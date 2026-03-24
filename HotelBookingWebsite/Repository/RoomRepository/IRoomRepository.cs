using HotelBooking.API.Models;

namespace HotelBooking.API.Interfaces
{
    public interface IRoomRepository
    {
        Task<IEnumerable<Room>> GetRoomsByHotel(int hotelId);
        Task<Room> GetById(int id);
        Task Add(Room room);
    }
}
