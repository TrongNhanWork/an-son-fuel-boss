namespace backend_AnSonFuelBoss.Dtos;

public class FuelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal UnitPrice { get; set; } // VND/Lít
    public bool Active { get; set; }
}