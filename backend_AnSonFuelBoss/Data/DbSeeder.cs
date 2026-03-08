using System.Security.Cryptography;
using System.Text;
using backend_AnSonFuelBoss.Models;

namespace backend_AnSonFuelBoss.Data;

public static class DbSeeder
{
    private static string Sha256(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }

    public static void Seed(AppDbContext db)
    {
        // Seed Users
        if (!db.Users.Any())
        {
            db.Users.AddRange(
                new User
                {
                    Username = "manager",
                    FullName = "Quản lý",
                    Role = UserRole.Manager,
                    PasswordHash = Sha256("123456"),
                    Active = true
                },
                new User
                {
                    Username = "cashier",
                    FullName = "Thu ngân",
                    Role = UserRole.Cashier,
                    PasswordHash = Sha256("123456"),
                    Active = true
                },
                new User
                {
                    Username = "warehouse",
                    FullName = "Kho",
                    Role = UserRole.Warehouse,
                    PasswordHash = Sha256("123456"),
                    Active = true
                }
            );

            db.SaveChanges();
        }

        // Seed cây xăng (chỉ seed nếu chưa có)
        if (db.Fuels.Any() || db.Tanks.Any() || db.Pumps.Any()) return;

        var ron95 = new Fuel { Name = "Xăng RON 95", UnitPrice = 26000, Active = true };
        var e5 = new Fuel { Name = "Xăng E5", UnitPrice = 24500, Active = true };
        var doOil = new Fuel { Name = "Dầu DO", UnitPrice = 23000, Active = true };

        db.Fuels.AddRange(ron95, e5, doOil);
        db.SaveChanges();

        var t1 = new Tank { Name = "Bể RON95 #1", FuelId = ron95.Id, CapacityLit = 20000, CurrentLit = 15500, LowLevelLit = 5000 };
        var t2 = new Tank { Name = "Bể E5 #1", FuelId = e5.Id, CapacityLit = 25000, CurrentLit = 8200, LowLevelLit = 6000 };
        var t3 = new Tank { Name = "Bể DO #1", FuelId = doOil.Id, CapacityLit = 18000, CurrentLit = 15350, LowLevelLit = 4000 };

        db.Tanks.AddRange(t1, t2, t3);
        db.SaveChanges();

        db.Pumps.AddRange(
            new Pump { Code = "TRU-01", FuelId = ron95.Id, TankId = t1.Id, Active = true },
            new Pump { Code = "TRU-02", FuelId = e5.Id, TankId = t2.Id, Active = true },
            new Pump { Code = "TRU-03", FuelId = doOil.Id, TankId = t3.Id, Active = true }
        );

        db.SaveChanges();
    }
}