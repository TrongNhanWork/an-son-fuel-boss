using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FuelsController : ControllerBase
{
    private readonly AppDbContext _db;
    public FuelsController(AppDbContext db) => _db = db;

    // GET: /api/fuels
    [HttpGet]
    public async Task<ActionResult<List<FuelDto>>> GetAll()
    {
        var fuels = await _db.Fuels
            .AsNoTracking()
            .Select(f => new FuelDto
            {
                Id = f.Id,
                Name = f.Name,
                UnitPrice = f.UnitPrice,
                Active = f.Active
            })
            .ToListAsync();

        return Ok(fuels);
    }
}