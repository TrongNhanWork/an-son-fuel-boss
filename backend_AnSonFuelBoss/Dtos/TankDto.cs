namespace backend_AnSonFuelBoss.Dtos;

public class TankDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int CapacityLit { get; set; }
    public int CurrentLit { get; set; }
    public int LowLevelLit { get; set; }

    public int FuelId { get; set; }
    public FuelDto? Fuel { get; set; }
}