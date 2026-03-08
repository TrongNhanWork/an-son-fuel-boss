using backend_AnSonFuelBoss.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Fuel> Fuels => Set<Fuel>();
    public DbSet<Tank> Tanks => Set<Tank>();
    public DbSet<Pump> Pumps => Set<Pump>();
    public DbSet<Shift> Shifts => Set<Shift>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Import> Imports { get; set; }
    public DbSet<InventoryHistory> InventoryHistories { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Fuel>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<Pump>()
            .HasIndex(x => x.Code)
            .IsUnique();
    }
}