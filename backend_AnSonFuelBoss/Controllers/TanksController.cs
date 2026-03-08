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
    public TanksController(AppDbContext db) => _db = db;

    // GET: /api/tanks
    [HttpGet]
    public async Task<ActionResult<List<TankDto>>> GetAll()
    {
        var tanks = await _db.Tanks
            .AsNoTracking()
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

        return Ok(tanks);
    }
}