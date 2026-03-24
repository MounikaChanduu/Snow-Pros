using System.ComponentModel.DataAnnotations;

namespace HotelBooking.API.Models
{
    public class Hotel
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Location { get; set; }

        public ICollection<Room> Rooms { get; set; }
    }
}