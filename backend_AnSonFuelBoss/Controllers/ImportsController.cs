using backend_AnSonFuelBoss.Data;
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
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        return Ok(imports);
    }

    // POST: api/imports
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Import request)
    {
        var tank = await _db.Tanks
            .FirstOrDefaultAsync(t => t.Id == request.TankId);

        if (tank == null)
            return BadRequest("Không tìm thấy bể chứa");

        // 🔥 CẬP NHẬT TỒN KHO
        tank.CurrentLit += request.Quantity;

        _db.Imports.Add(request);
        await _db.SaveChangesAsync();

        return Ok(request);
    }
}