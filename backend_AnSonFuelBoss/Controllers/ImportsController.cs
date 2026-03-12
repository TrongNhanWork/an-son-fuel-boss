using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Dtos;
using backend_AnSonFuelBoss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ImportsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ImportsController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/imports
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var imports = await _db.Imports
            .Include(i => i.Tank)
            .ThenInclude(t => t.Fuel)
            .Include(i => i.Supplier)
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => new
            {
                i.Id,
                tankName = i.Tank.Name,
                fuelTypeName = i.Tank.Fuel.Name,
                quantity = i.Quantity,
                unitPrice = i.UnitPrice,
                totalPrice = i.TotalPrice,
                supplierName = i.Supplier.Name,
                createdAt = i.CreatedAt
            })
            .ToListAsync();

        return Ok(imports);
    }

    // POST: api/imports
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ImportCreateDto dto)
    {
        var tank = await _db.Tanks
            .FirstOrDefaultAsync(t => t.Id == dto.TankId);

        if (tank == null)
            return BadRequest("Không tìm thấy bể chứa");

        var supplier = await _db.Suppliers
            .FirstOrDefaultAsync(s => s.Id == dto.SupplierId);

        if (supplier == null)
            return BadRequest("Không tìm thấy nhà cung cấp");

        var import = new Import
        {
            TankId = dto.TankId,
            SupplierId = dto.SupplierId,
            Quantity = dto.Quantity,
            UnitPrice = dto.UnitPrice,
            TotalPrice = dto.Quantity * dto.UnitPrice,
            CreatedAt = DateTime.Now
        };

        // 🔥 cập nhật tồn bể
        tank.CurrentLit += dto.Quantity;

        _db.Imports.Add(import);

        await _db.SaveChangesAsync();

        return Ok(import);
    }
}