using backend_AnSonFuelBoss.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReportsController(AppDbContext db)
    {
        _db = db;
    }

    // =========================================================
    // HELPER: LẤY KHOẢNG THỜI GIAN
    // =========================================================
    private (DateTime from, DateTime to) GetPeriod(string period)
    {
        var today = DateTime.UtcNow.Date;

        if (period == "thisWeek")
        {
            int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
            var start = today.AddDays(-diff);
            return (start, start.AddDays(7));
        }

        if (period == "lastWeek")
        {
            int diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
            var end = today.AddDays(-diff);
            return (end.AddDays(-7), end);
        }

        if (period == "thisMonth")
        {
            var start = new DateTime(today.Year, today.Month, 1);
            return (start, start.AddMonths(1));
        }

        int d = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
        var s = today.AddDays(-d);
        return (s, s.AddDays(7));
    }

    // =========================================================
    // HELPER: LABEL THỨ
    // =========================================================
    private string Label(DateTime d)
    {
        var dow = d.DayOfWeek;
        return dow == DayOfWeek.Sunday ? "CN" : $"T{((int)dow) + 1}";
    }


    // =========================================================
    // 1. WEEKLY FUEL REPORT
    // =========================================================
    [HttpGet("weekly-fuel")]
    public async Task<IActionResult> WeeklyFuel(string period = "thisWeek")
    {
        var (from, to) = GetPeriod(period);

        var raw = await _db.Sales
            .AsNoTracking()
            .Where(s => s.CreatedAt >= from && s.CreatedAt < to)
            .Join(_db.Pumps.AsNoTracking(),
                s => s.PumpId,
                p => (int?)p.Id,
                (s, p) => new
                {
                    s.CreatedAt,
                    s.TotalLit,
                    p.FuelId
                })
            .ToListAsync();

        var days = Enumerable.Range(0, (to - from).Days)
            .Select(i => from.AddDays(i))
            .ToList();

        var result = days.Select(d =>
        {
            var start = d;
            var end = d.AddDays(1);

            var items = raw.Where(x => x.CreatedAt >= start && x.CreatedAt < end);

            decimal ron95 = items.Where(x => x.FuelId == 1).Sum(x => x.TotalLit);
            decimal e5 = items.Where(x => x.FuelId == 2).Sum(x => x.TotalLit);
            decimal @do = items.Where(x => x.FuelId == 3).Sum(x => x.TotalLit);

            return new
            {
                date = Label(d),
                ron95,
                e5,
                @do
            };
        });

        return Ok(result);
    }


    // =========================================================
    // 2. ACCESSORIES REPORT
    // =========================================================
    [HttpGet("accessories-week")]
    public async Task<IActionResult> AccessoriesWeek(string period = "thisWeek")
    {
        var (from, to) = GetPeriod(period);

        var raw = await _db.AccessorySales
            .Include(x => x.Product)
            .Where(x => x.CreatedAt >= from && x.CreatedAt < to)
            .ToListAsync();

        var result = raw
            .GroupBy(x => new
            {
                Day = x.CreatedAt.Date,
                Product = x.Product.Name
            })
            .Select(g => new
            {
                date = Label(g.Key.Day),
                product = g.Key.Product,
                quantity = g.Sum(x => x.Quantity)
            })
            .OrderBy(x => x.date)
            .ToList();

        return Ok(result);
    }


    // =========================================================
    // 3. REVENUE REPORT
    // =========================================================
    [HttpGet("revenue-week")]
    public async Task<IActionResult> RevenueWeek(string period = "thisWeek")
    {
        var (from, to) = GetPeriod(period);

        var raw = await _db.Sales
            .AsNoTracking()
            .Where(x => x.CreatedAt >= from && x.CreatedAt < to)
            .ToListAsync();

        var days = Enumerable.Range(0, (to - from).Days)
            .Select(i => from.AddDays(i))
            .ToList();

        var result = days.Select(d =>
        {
            var start = d;
            var end = d.AddDays(1);

            var items = raw.Where(x => x.CreatedAt >= start && x.CreatedAt < end);

            return new
            {
                date = Label(d),
                revenue = items.Sum(x => x.TotalAmount),
                transactions = items.Count()
            };
        });

        return Ok(result);
    }


    // =========================================================
    // 4. LITERS REPORT
    // =========================================================
    [HttpGet("liters-week")]
    public async Task<IActionResult> LitersWeek(string period = "thisWeek")
    {
        var (from, to) = GetPeriod(period);

        var raw = await _db.Sales
            .AsNoTracking()
            .Where(x => x.CreatedAt >= from && x.CreatedAt < to)
            .ToListAsync();

        var days = Enumerable.Range(0, (to - from).Days)
            .Select(i => from.AddDays(i))
            .ToList();

        var result = days.Select(d =>
        {
            var start = d;
            var end = d.AddDays(1);

            var items = raw.Where(x => x.CreatedAt >= start && x.CreatedAt < end);

            return new
            {
                date = Label(d),
                liters = items.Sum(x => x.TotalLit)
            };
        });

        return Ok(result);
    }


    // =========================================================
    // 5. FUEL RATIO
    // =========================================================
    [HttpGet("fuel-ratio")]
    public async Task<IActionResult> FuelRatio()
    {
        var data = await _db.Sales
            .Join(_db.Pumps,
                s => s.PumpId,
                p => p.Id,
                (s, p) => new
                {
                    s.TotalLit,
                    p.FuelId
                })
            .GroupBy(x => x.FuelId)
            .Select(g => new
            {
                fuelId = g.Key,
                liters = g.Sum(x => x.TotalLit)
            })
            .ToListAsync();

        return Ok(data);
    }
}