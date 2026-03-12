namespace backend_AnSonFuelBoss.Dtos;

public class SaleRecentDto
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public DateTime CreatedAt { get; set; }

    public decimal Liters { get; set; }
    public decimal UnitPrice { get; set; }   // sửa int -> decimal

    public decimal TotalAmount { get; set; } // sửa int -> decimal

    public int PumpId { get; set; }
    public string PumpCode { get; set; } = "";

    public int FuelId { get; set; }
    public string FuelName { get; set; } = "";
}