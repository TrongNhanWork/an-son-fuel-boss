using backend_AnSonFuelBoss.Data;
using backend_AnSonFuelBoss.Models;
using backend_AnSonFuelBoss.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/accessory-sales")]
public class AccessorySalesController : ControllerBase
{
    private readonly AppDbContext _db;

    public AccessorySalesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Sell(AccessorySaleDto dto)
    {
        // chặn productId = 0
        if (dto.ProductId <= 0)
            return BadRequest("ProductId must be greater than 0");

        // chặn quantity = 0
        if (dto.Quantity <= 0)
            return BadRequest("Quantity must be greater than 0");

        var product = await _db.AccessoryProducts
            .FirstOrDefaultAsync(x => x.Id == dto.ProductId);

        if (product == null)
            return BadRequest("Product not found");

        if (product.Stock < dto.Quantity)
            return BadRequest("Not enough stock");

        // trừ tồn kho
        product.Stock -= dto.Quantity;

        var sale = new AccessorySale
        {
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            UnitPrice = product.SellPrice,
            TotalAmount = product.SellPrice * dto.Quantity,
            CreatedAt = DateTime.Now
        };

        _db.AccessorySales.Add(sale);

        await _db.SaveChangesAsync();

        return Ok(sale);
    }
}