using HotelBooking.API.DTOs;
using HotelBooking.API.Models;

namespace HotelBooking.API.Interfaces
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetRoomsByHotel(int hotelId);
        Task AddRoom(RoomDto dto);
    }
}