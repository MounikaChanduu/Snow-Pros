namespace HotelBooking.API.DTOs
{
    public class BookingDto
    {
        public int RoomId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
    }
}