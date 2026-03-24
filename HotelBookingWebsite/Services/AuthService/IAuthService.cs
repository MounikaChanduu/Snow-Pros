using HotelBooking.API.DTOs;

namespace HotelBooking.API.Interfaces
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDto dto);
        Task<string> Login(LoginDto dto);
    }
}
