using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Dtos;
using backend_AnSonFuelBoss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShiftsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ShiftsController(AppDbContext db) => _db = db;

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrent()
    {
        var shift = await _db.Shifts
            .FirstOrDefaultAsync(s => s.Status == ShiftStatus.Open);

        if (shift == null)
            return Ok(null);

        var revenue = await _db.Sales
            .Where(s => s.ShiftId == shift.Id)
            .SumAsync(s => (int?)s.TotalAmount) ?? 0;

        return Ok(new ShiftDto
        {
            Id = shift.Id,
            Code = shift.Code,
            Status = shift.Status.ToString(),
            OpenedAt = shift.OpenedAt,
            ClosedAt = shift.ClosedAt,
            OpeningCash = shift.OpeningCash,

            // ✅ Cộng cả tiền đầu ca
            ExpectedCash = shift.OpeningCash + revenue
        });
    }

    public class OpenShiftRequest
    {
        public int OpeningCash { get; set; } = 0;
    }

    [HttpPost("open")]
    public async Task<IActionResult> Open([FromBody] OpenShiftRequest req)
    {
        var hasOpen = await _db.Shifts.AnyAsync(s => s.Status == ShiftStatus.Open);
        if (hasOpen) return BadRequest("Đang có ca mở. Hãy chốt ca trước.");

        var shift = new Shift
        {
            Code = $"SHIFT-{DateTime.Now:yyyyMMddHHmmss}",
            Status = ShiftStatus.Open,
            OpenedAt = DateTime.UtcNow,
            OpeningCash = req.OpeningCash
        };

        _db.Shifts.Add(shift);
        await _db.SaveChangesAsync();

        return Ok(new ShiftDto
        {
            Id = shift.Id,
            Code = shift.Code,
            Status = shift.Status.ToString(),
            OpenedAt = shift.OpenedAt,
            OpeningCash = shift.OpeningCash,
            ExpectedCash = shift.ExpectedCash
        });
    }

    public class CloseShiftRequest
    {
        public int CountedCash { get; set; }
    }

    [HttpPost("close")]
    public async Task<IActionResult> Close([FromBody] CloseShiftRequest req)
    {
        var shift = await _db.Shifts
            .OrderByDescending(s => s.Id)
            .FirstOrDefaultAsync(s => s.Status == ShiftStatus.Open);

        if (shift == null) return BadRequest("Không có ca đang mở.");

        var expected = await _db.Sales
            .Where(s => s.ShiftId == shift.Id)
            .SumAsync(s => (int?)s.TotalAmount) ?? 0;

        shift.ExpectedCash = expected;
        shift.CountedCash = req.CountedCash;
        shift.Difference = req.CountedCash - (shift.OpeningCash + expected);
        shift.Status = ShiftStatus.Closed;
        shift.ClosedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new ShiftDto
        {
            Id = shift.Id,
            Code = shift.Code,
            Status = shift.Status.ToString(),
            OpenedAt = shift.OpenedAt,
            ClosedAt = shift.ClosedAt,
            OpeningCash = shift.OpeningCash,
            ExpectedCash = shift.ExpectedCash,
            CountedCash = shift.CountedCash,
            Difference = shift.Difference
        });
    }
}