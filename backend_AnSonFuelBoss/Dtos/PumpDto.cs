namespace backend_AnSonFuelBoss.Dtos;

public class PumpDto
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public bool Active { get; set; }

    public int FuelId { get; set; }
    public FuelDto? Fuel { get; set; }

    public int? TankId { get; set; }
}