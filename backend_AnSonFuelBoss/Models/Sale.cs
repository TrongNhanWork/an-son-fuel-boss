namespace backend_AnSonFuelBoss.Models;

public class Sale
{
    public int Id { get; set; }
    public string Code { get; set; } = "";       // SALE-...
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int ShiftId { get; set; }
    public Shift? Shift { get; set; }

    public int? PumpId { get; set; }
    public Pump? Pump { get; set; }

    public decimal TotalLit { get; set; }

    public decimal TotalAmount { get; set; } // sửa int -> decimal
}