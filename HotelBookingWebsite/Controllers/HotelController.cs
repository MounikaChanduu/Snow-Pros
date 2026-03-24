using HotelBooking.API.DTOs;
using HotelBooking.API.Interfaces;
using HotelBooking.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelController : ControllerBase
    {
        private readonly IHotelService _service;

        public HotelController(IHotelService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllHotels());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(await _service.GetHotelById(id));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add(HotelDto dto)
        {
            var hotel = new Hotel
            {
                Name = dto.Name,
                Location = dto.Location
            };

            await _service.AddHotel(hotel);

            return Ok(new { message = "Hotel Added Successfully" });
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged(int page = 1, int pageSize = 5)
        {
            var data = await _service.GetAllHotels();

            var result = data
                .Skip((page - 1) * pageSize)
                .Take(pageSize);

            return Ok(result);
        }
    }
}