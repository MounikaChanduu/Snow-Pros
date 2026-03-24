using HotelBooking.API.DTOs;
using HotelBooking.API.Interfaces;
using HotelBooking.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _service;

        public BookingController(IBookingService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Book(BookingDto dto)
        {
            // ✅ VALIDATION
            if (dto.CheckIn >= dto.CheckOut)
                return BadRequest(new { message = "Invalid date range" });

            var userId = int.Parse(User.FindFirst("UserId").Value);

            var booking = new Booking
            {
                RoomId = dto.RoomId,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                UserId = userId
            };

            var result = await _service.BookRoom(booking);

            if (result.Contains("already"))
                return BadRequest(new { message = result });

            return Ok(new { message = result });
        }

        [HttpGet("my")]
        public async Task<IActionResult> MyBookings()
        {
            var userId = int.Parse(User.FindFirst("UserId").Value);

            var data = await _service.GetUserBookings(userId);

            return Ok(data);
        }
    }
}