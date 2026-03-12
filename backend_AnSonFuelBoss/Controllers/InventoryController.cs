using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.DTOs;
using backend_AnSonFuelBoss.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend_AnSonFuelBoss.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _db;

        public InventoryController(AppDbContext db)
        {
            _db = db;
        }

        // ================== GET INVENTORY ==================
        [HttpGet]
        public async Task<IActionResult> GetInventory()
        {
            var items = await _db.Tanks
                .Include(t => t.Fuel)
                .Select(t => new
                {
                    id = t.Id,
                    tankName = t.Name,
                    fuelName = t.Fuel != null ? t.Fuel.Name : "",
                    currentLit = t.CurrentLit,
                    capacityLit = t.CapacityLit,
                    lowLevelLit = t.LowLevelLit,

                    // Tính giá trị tồn kho
                    inventoryValue = t.Fuel != null
                        ? (decimal)t.CurrentLit * t.Fuel.UnitPrice
                        : 0
                })
                .ToListAsync();

            return Ok(items);
        }

        // ================== GET HISTORY ==================
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var history = await _db.InventoryHistories
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(history);
        }

        // ================== ADJUST INVENTORY ==================
        [HttpPost("adjust")]
        public async Task<IActionResult> AdjustInventory([FromBody] AdjustInventoryRequest request)
        {
            var tank = await _db.Tanks
                .Include(t => t.Fuel)
                .FirstOrDefaultAsync(t => t.Id == request.TankId);

            if (tank == null)
                return NotFound("Không tìm thấy bể");

            // Điều chỉnh tồn
            tank.CurrentLit += (int)request.Quantity;

            if (tank.CurrentLit < 0)
                tank.CurrentLit = 0;

            // Lưu lịch sử
            var history = new InventoryHistory
            {
                TankId = tank.Id,
                TankName = tank.Name,
                ChangeType = "ADJUST",
                Quantity = request.Quantity,
                CreatedAt = DateTime.Now
            };

            _db.InventoryHistories.Add(history);

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Điều chỉnh thành công",
                currentLit = tank.CurrentLit
            });
        }
    }
}