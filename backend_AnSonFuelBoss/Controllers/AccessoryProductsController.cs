using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Models;
using backend_AnSonFuelBoss.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/accessories")]
public class AccessoryProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AccessoryProductsController(AppDbContext db)
    {
        _db = db;
    }

    // =========================================
    // GET: api/accessories?category=LUBRICANT
    // =========================================
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var query = _db.AccessoryProducts.AsQueryable();

        // Nếu có category thì lọc theo category
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(x => x.Category.ToUpper() == category.ToUpper());
        }

        var list = await query
            .OrderByDescending(x => x.Id)
            .ToListAsync();

        return Ok(list);
    }

    // =========================================
    // CREATE
    // =========================================
    [HttpPost]
    public async Task<IActionResult> Create(AccessoryProductDto dto)
    {
        var p = new AccessoryProduct
        {
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            ImportPrice = dto.ImportPrice,
            SellPrice = dto.SellPrice,
            Stock = dto.Stock,
            Unit = dto.Unit,
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        _db.AccessoryProducts.Add(p);
        await _db.SaveChangesAsync();

        return Ok(p);
    }

    // =========================================
    // UPDATE
    // =========================================
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AccessoryProductDto dto)
    {
        var p = await _db.AccessoryProducts.FindAsync(id);

        if (p == null)
            return NotFound();

        p.Name = dto.Name;
        p.Description = dto.Description;
        p.Category = dto.Category;
        p.ImportPrice = dto.ImportPrice;
        p.SellPrice = dto.SellPrice;
        p.Stock = dto.Stock;
        p.Unit = dto.Unit;

        await _db.SaveChangesAsync();

        return Ok(p);
    }

    // =========================================
    // DELETE
    // =========================================
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await _db.AccessoryProducts.FindAsync(id);

        if (p == null)
            return NotFound();

        _db.AccessoryProducts.Remove(p);
        await _db.SaveChangesAsync();

        return Ok();
    }
}