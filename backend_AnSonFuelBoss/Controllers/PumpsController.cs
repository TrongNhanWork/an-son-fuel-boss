using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PumpsController : ControllerBase
{
    private readonly AppDbContext _db;
    public PumpsController(AppDbContext db) => _db = db;

    // GET: /api/pumps
    [HttpGet]
    public async Task<ActionResult<List<PumpDto>>> GetAll()
    {
        var pumps = await _db.Pumps
            .AsNoTracking()
            .Select(p => new PumpDto
            {
                Id = p.Id,
                Code = p.Code,
                Active = p.Active,
                FuelId = p.FuelId,
                TankId = p.TankId,
                Fuel = new FuelDto
                {
                    Id = p.Fuel!.Id,
                    Name = p.Fuel!.Name,
                    UnitPrice = p.Fuel!.UnitPrice,
                    Active = p.Fuel!.Active
                }
            })
            .ToListAsync();

        return Ok(pumps);
    }
}