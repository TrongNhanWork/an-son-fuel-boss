namespace backend_AnSonFuelBoss.Dtos;

public class SaleRecentDto
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public DateTime CreatedAt { get; set; }

    public int Liters { get; set; }
    public int UnitPrice { get; set; }
    public int TotalAmount { get; set; }

    public int PumpId { get; set; }
    public string PumpCode { get; set; } = "";

    public int FuelId { get; set; }
    public string FuelName { get; set; } = "";
}