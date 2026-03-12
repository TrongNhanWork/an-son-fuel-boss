using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TanksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TanksController(AppDbContext db)
    {
        _db = db;
    }

    // GET: /api/tanks
    [HttpGet]
    public async Task<ActionResult<List<TankDto>>> GetAll()
    {
        var tanks = await _db.Tanks
            .AsNoTracking()
            .Include(t => t.Fuel)
            .Select(t => new TankDto
            {
                Id = t.Id,
                Name = t.Name,
                CapacityLit = t.CapacityLit,
                CurrentLit = t.CurrentLit,
                LowLevelLit = t.LowLevelLit,
                FuelId = t.FuelId,

                Fuel = t.Fuel == null ? null : new FuelDto
                {
                    Id = t.Fuel.Id,
                    Name = t.Fuel.Name,
                    UnitPrice = t.Fuel.UnitPrice,
                    Active = t.Fuel.Active
                }
            })
            .ToListAsync();

        return Ok(tanks);
    }

    // GET: /api/tanks/alerts
    [HttpGet("alerts")]
    public async Task<IActionResult> GetTankAlerts()
    {
        var tanks = await _db.Tanks.ToListAsync();

        var alerts = tanks
            .Select(t =>
            {
                double percent = t.CapacityLit == 0
                    ? 0
                    : ((double)t.CurrentLit / t.CapacityLit) * 100;

                string status = "NORMAL";
                string message = "";

                if (percent < 20)
                {
                    status = "CRITICAL";
                    message = $"Bể {t.Name} sắp hết. Còn {percent:F1}%";
                }
                else if (percent <= 40)
                {
                    status = "LOW";
                    message = $"Bể {t.Name} tồn kho thấp. Còn {percent:F1}%";
                }

                return new
                {
                    tank = t.Name,
                    percent,
                    status,
                    message
                };
            })
            .Where(x => x.status != "NORMAL")
            .ToList();

        return Ok(alerts);
    }
}