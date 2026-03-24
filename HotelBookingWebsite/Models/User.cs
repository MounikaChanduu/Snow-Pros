using System.ComponentModel.DataAnnotations;

namespace HotelBooking.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Role { get; set; } = "User"; // Admin / User

        public ICollection<Booking> Bookings { get; set; }
    }
}
