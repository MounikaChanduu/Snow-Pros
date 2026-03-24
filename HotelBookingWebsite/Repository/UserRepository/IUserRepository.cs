using HotelBooking.API.Models;

namespace HotelBooking.API.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByUsernameAsync(string username);
        Task AddUserAsync(User user);
    }
}
