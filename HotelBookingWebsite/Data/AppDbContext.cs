using HotelBooking.API.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Hotel> Hotels { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Ensure decimal precision for Room.Price to avoid silent truncation warnings
        modelBuilder.Entity<Room>()
            .Property(r => r.Price)
            .HasPrecision(18, 2);

        base.OnModelCreating(modelBuilder);
    }
}
