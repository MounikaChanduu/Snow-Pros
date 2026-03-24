using HotelBooking.API.DTOs;
using HotelBooking.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _service;

        public RoomController(IRoomService service)
        {
            _service = service;
        }

        // 🔥 Get rooms by hotel
        [HttpGet("byHotel/{hotelId}")]
        public async Task<IActionResult> GetRooms(int hotelId)
        {
            return Ok(await _service.GetRoomsByHotel(hotelId));
        }

        // 🔐 Only Admin can add rooms
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddRoom(RoomDto dto)
        {
            await _service.AddRoom(dto);

            return Ok(new { message = "Room Added Successfully" });
        }
    }
}
