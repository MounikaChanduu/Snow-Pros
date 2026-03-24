namespace HotelBooking.API.Models
{
    public class Room
    {
        public int Id { get; set; }

        public string RoomType { get; set; }

        public decimal Price { get; set; }

        public bool IsAvailable { get; set; } = true;

        public int HotelId { get; set; }
        public Hotel Hotel { get; set; }

        public ICollection<Booking> Bookings { get; set; }
    }
}