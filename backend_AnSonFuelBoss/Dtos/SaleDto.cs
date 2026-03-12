namespace backend_AnSonFuelBoss.Dtos;

public class SaleDto
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public DateTime CreatedAt { get; set; }

    public int ShiftId { get; set; }
    public int PumpId { get; set; }
    public int FuelId { get; set; }
    public int TankId { get; set; }

    public decimal Liters { get; set; }
    public decimal UnitPrice { get; set; }   // sửa int -> decimal

    public decimal TotalAmount { get; set; } // sửa int -> decimal
}