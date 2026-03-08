using backend_AnSonFuelBoss.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReportsController(AppDbContext db) => _db = db;

    // GET: /api/reports/weekly-fuel
    // Trả về sản lượng theo ngày (7 ngày gần nhất), nhóm theo fuel
    [HttpGet("weekly-fuel")]
    public async Task<IActionResult> WeeklyFuel()
    {
        var from = DateTime.UtcNow.Date.AddDays(-6);
        var to = DateTime.UtcNow.Date.AddDays(1);

        // Sales không có FuelId trực tiếp -> join qua Pump.FuelId
        var raw = await _db.Sales
            .AsNoTracking()
            .Where(s => s.CreatedAt >= from && s.CreatedAt < to)
            .Join(_db.Pumps.AsNoTracking(),
                s => s.PumpId,
                p => (int?)p.Id,
                (s, p) => new { s.CreatedAt, s.TotalLit, p.FuelId })
            .ToListAsync();

        // build 7 ngày (T2..CN theo vi-VN)
        var days = Enumerable.Range(0, 7)
            .Select(i => from.AddDays(i))
            .ToList();

        string Label(DateTime d)
        {
            // T2..CN
            var dow = d.DayOfWeek; // Sunday=0
            return dow == DayOfWeek.Sunday ? "CN" : $"T{((int)dow) + 1}";
        }

        // FuelId mapping theo seed hiện tại của bạn: 1=RON95, 2=E5, 3=DO
        // Nếu sau này thay đổi, bạn có thể map theo bảng Fuels
        var result = days.Select(d =>
        {
            var dayStart = d;
            var dayEnd = d.AddDays(1);

            var items = raw.Where(x => x.CreatedAt >= dayStart && x.CreatedAt < dayEnd);

            int ron95 = items.Where(x => x.FuelId == 1).Sum(x => x.TotalLit);
            int e5 = items.Where(x => x.FuelId == 2).Sum(x => x.TotalLit);
            int @do = items.Where(x => x.FuelId == 3).Sum(x => x.TotalLit);

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
}