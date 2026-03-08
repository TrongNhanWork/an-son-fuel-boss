using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Dtos;
using backend_AnSonFuelBoss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly AppDbContext _db;
    public SalesController(AppDbContext db) => _db = db;

    // POST: /api/sales
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSaleRequest req)
    {
        if (req == null) return BadRequest("Body không hợp lệ.");
        if (req.Liters <= 0) return BadRequest("Số lít phải > 0.");

        // 1) phải có ca đang mở
        var shift = await _db.Shifts
            .OrderByDescending(s => s.Id)
            .FirstOrDefaultAsync(s => s.Status == ShiftStatus.Open);

        if (shift == null) return BadRequest("Chưa mở ca. Hãy mở ca trước khi bán.");

        // 2) lấy trụ bơm + bồn + nhiên liệu
        var pump = await _db.Pumps
            .Include(p => p.Fuel)
            .FirstOrDefaultAsync(p => p.Id == req.PumpId && p.Active);

        if (pump == null) return BadRequest("Không tìm thấy trụ bơm hoặc trụ đang tắt.");
        if (pump.TankId == null) return BadRequest("Trụ bơm chưa gắn bồn chứa.");

        var tank = await _db.Tanks.FirstOrDefaultAsync(t => t.Id == pump.TankId.Value);
        if (tank == null) return BadRequest("Không tìm thấy bồn chứa của trụ bơm.");

        // 3) kiểm tra tồn bồn
        if (tank.CurrentLit < req.Liters)
            return BadRequest($"Không đủ tồn bồn. Hiện còn {tank.CurrentLit} lít.");

        var unitPrice = pump.Fuel!.UnitPrice;
        var totalAmount = unitPrice * req.Liters;

        // 4) trừ bồn + tạo sale (transaction để an toàn)
        using var tx = await _db.Database.BeginTransactionAsync();

        tank.CurrentLit -= req.Liters;
        await _db.SaveChangesAsync();

        var sale = new Sale
        {
            Code = $"SALE-{DateTime.Now:yyyyMMddHHmmss}",
            CreatedAt = DateTime.UtcNow,
            ShiftId = shift.Id,
            PumpId = pump.Id,
            TotalLit = req.Liters,          // ✅ đúng theo model
            TotalAmount = totalAmount       // ✅ đúng theo model
        };

        _db.Sales.Add(sale);
        await _db.SaveChangesAsync();

        await tx.CommitAsync();

        // ✅ Trả ra SaleDto (bạn đang dùng format này ở PowerShell)
        return Ok(new SaleDto
        {
            Id = sale.Id,
            Code = sale.Code,
            CreatedAt = sale.CreatedAt,
            ShiftId = shift.Id,
            PumpId = pump.Id,
            FuelId = pump.FuelId,
            TankId = tank.Id,
            Liters = req.Liters,
            UnitPrice = unitPrice,
            TotalAmount = totalAmount
        });
    }

    // GET: /api/sales/recent?take=5
    [HttpGet("recent")]
    public async Task<IActionResult> Recent([FromQuery] int take = 5)
    {
        if (take <= 0) take = 5;
        if (take > 50) take = 50;

        var list = await _db.Sales
            .AsNoTracking()
            .Include(s => s.Pump)
                .ThenInclude(p => p!.Fuel)
            .OrderByDescending(s => s.Id)
            .Take(take)
            .Select(s => new SaleRecentDto
            {
                Id = s.Id,
                Code = s.Code,
                CreatedAt = s.CreatedAt,

                // ✅ Sale model dùng TotalLit
                Liters = s.TotalLit,

                // ✅ UnitPrice không lưu trong Sale -> suy ra từ Fuel.UnitPrice
                UnitPrice = (s.Pump != null && s.Pump.Fuel != null) ? s.Pump.Fuel.UnitPrice : 0,

                TotalAmount = s.TotalAmount,

                PumpId = s.PumpId ?? 0,
                PumpCode = s.Pump != null ? s.Pump.Code : "",

                FuelId = (s.Pump != null) ? s.Pump.FuelId : 0,
                FuelName = (s.Pump != null && s.Pump.Fuel != null) ? s.Pump.Fuel.Name : ""
            })
            .ToListAsync();

        return Ok(list);
    }
}