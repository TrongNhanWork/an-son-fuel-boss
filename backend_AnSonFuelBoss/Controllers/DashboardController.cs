using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Dtos;
using backend_AnSonFuelBoss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    [HttpGet("today")]
    public async Task<IActionResult> Today()
    {
        var todayStart = DateTime.UtcNow.Date;
        var yesterdayStart = todayStart.AddDays(-1);

        // ===== TODAY FUEL =====
        var fuelRevenueToday = await _db.Sales.AsNoTracking()
            .Where(s => s.CreatedAt >= todayStart)
            .SumAsync(s => (decimal?)s.TotalAmount) ?? 0;

        var fuelTransactionsToday = await _db.Sales.AsNoTracking()
            .CountAsync(s => s.CreatedAt >= todayStart);

        var litersToday = await _db.Sales.AsNoTracking()
            .Where(s => s.CreatedAt >= todayStart)
            .SumAsync(s => (decimal?)s.TotalLit) ?? 0;

        // ===== TODAY ACCESSORY =====
        var accessoryRevenueToday = await _db.AccessorySales.AsNoTracking()
            .Where(a => a.CreatedAt >= todayStart)
            .SumAsync(a => (decimal?)a.TotalAmount) ?? 0;

        var accessoryTransactionsToday = await _db.AccessorySales.AsNoTracking()
            .CountAsync(a => a.CreatedAt >= todayStart);

        // ===== TOTAL TODAY =====
        var revenueToday = fuelRevenueToday + accessoryRevenueToday;
        var transactionsToday = fuelTransactionsToday + accessoryTransactionsToday;

        // ===== YESTERDAY FUEL =====
        var fuelRevenueYesterday = await _db.Sales.AsNoTracking()
            .Where(s => s.CreatedAt >= yesterdayStart && s.CreatedAt < todayStart)
            .SumAsync(s => (decimal?)s.TotalAmount) ?? 0;

        var fuelTransactionsYesterday = await _db.Sales.AsNoTracking()
            .CountAsync(s => s.CreatedAt >= yesterdayStart && s.CreatedAt < todayStart);

        var litersYesterday = await _db.Sales.AsNoTracking()
            .Where(s => s.CreatedAt >= yesterdayStart && s.CreatedAt < todayStart)
            .SumAsync(s => (decimal?)s.TotalLit) ?? 0;

        // ===== YESTERDAY ACCESSORY =====
        var accessoryRevenueYesterday = await _db.AccessorySales.AsNoTracking()
            .Where(a => a.CreatedAt >= yesterdayStart && a.CreatedAt < todayStart)
            .SumAsync(a => (decimal?)a.TotalAmount) ?? 0;

        var accessoryTransactionsYesterday = await _db.AccessorySales.AsNoTracking()
            .CountAsync(a => a.CreatedAt >= yesterdayStart && a.CreatedAt < todayStart);

        // ===== TOTAL YESTERDAY =====
        var revenueYesterday = fuelRevenueYesterday + accessoryRevenueYesterday;
        var transactionsYesterday = fuelTransactionsYesterday + accessoryTransactionsYesterday;

        // ===== TÍNH % =====
        decimal CalcPercent(decimal today, decimal yesterday)
        {
            if (yesterday == 0) return today > 0 ? 100 : 0;
            return Math.Round(((today - yesterday) / yesterday) * 100, 1);
        }

        var revenuePercent = CalcPercent(revenueToday, revenueYesterday);
        var transactionPercent = CalcPercent(transactionsToday, transactionsYesterday);
        var litersPercent = CalcPercent(litersToday, litersYesterday);

        var openShifts = await _db.Shifts.AsNoTracking()
            .CountAsync(s => s.Status == ShiftStatus.Open);

        var tanks = await _db.Tanks.AsNoTracking()
            .Select(t => new TankDto
            {
                Id = t.Id,
                Name = t.Name,
                CapacityLit = t.CapacityLit,
                CurrentLit = t.CurrentLit,
                LowLevelLit = t.LowLevelLit,
                FuelId = t.FuelId,
                Fuel = new FuelDto
                {
                    Id = t.Fuel!.Id,
                    Name = t.Fuel!.Name,
                    UnitPrice = t.Fuel!.UnitPrice,
                    Active = t.Fuel!.Active
                }
            })
            .ToListAsync();

        return Ok(new
        {
            revenueToday,
            transactionsToday,
            litersToday,
            openShifts,
            tanks,

            revenuePercent,
            transactionPercent,
            litersPercent
        });
    }
}