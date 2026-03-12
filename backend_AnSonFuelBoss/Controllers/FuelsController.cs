using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Dtos;
using backend_AnSonFuelBoss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FuelsController : ControllerBase
{
    private readonly AppDbContext _db;

    public FuelsController(AppDbContext db)
    {
        _db = db;
    }

    // =============================
    // GET: /api/fuels
    // =============================
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

    // =============================
    // PUT: /api/fuels/{id}/price
    // =============================
    [HttpPut("{id}/price")]
    public async Task<IActionResult> UpdatePrice(int id, [FromBody] decimal newPrice)
    {
        var fuel = await _db.Fuels.FindAsync(id);

        if (fuel == null)
            return NotFound();

        var oldPrice = fuel.UnitPrice;

        fuel.UnitPrice = newPrice;

        _db.FuelPriceHistories.Add(new FuelPriceHistory
        {
            FuelId = id,
            OldPrice = oldPrice,
            NewPrice = newPrice,
            ChangedAt = DateTime.Now
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Price updated successfully"
        });
    }

    // =============================
    // GET: /api/fuels/price-history
    // =============================
    [HttpGet("price-history")]
    public async Task<IActionResult> GetPriceHistory()
    {
        var history = await _db.FuelPriceHistories
            .Include(h => h.Fuel)
            .OrderByDescending(h => h.ChangedAt)
            .Take(50)
            .Select(h => new
            {
                h.Id,
                h.FuelId,
                FuelName = h.Fuel.Name,
                h.OldPrice,
                h.NewPrice,
                h.ChangedAt
            })
            .ToListAsync();

        return Ok(history);
    }



    [HttpPost]
    public async Task<IActionResult> CreateFuel(CreateFuelDto dto)
    {
        var fuel = new Fuel
        {
            Name = dto.Name,
            UnitPrice = dto.Price,
            Active = true
        };

        _db.Fuels.Add(fuel);
        await _db.SaveChangesAsync();

        return Ok(fuel);
    }


    // DELETE: api/fuels/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFuel(int id)
    {
        var fuel = await _db.Fuels.FindAsync(id);

        if (fuel == null)
        {
            return NotFound();
        }

        _db.Fuels.Remove(fuel);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Đã xóa nhiên liệu" });
    }
}