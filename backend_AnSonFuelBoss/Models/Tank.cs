namespace backend_AnSonFuelBoss.Models;

public class Tank
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int CapacityLit { get; set; }
    public int CurrentLit { get; set; }
    public int LowLevelLit { get; set; }

    public int FuelId { get; set; }
    public Fuel? Fuel { get; set; }
}