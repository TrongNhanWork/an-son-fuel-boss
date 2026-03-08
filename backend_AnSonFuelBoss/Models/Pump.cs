namespace backend_AnSonFuelBoss.Models;

public class Pump
{
    public int Id { get; set; }
    public string Code { get; set; } = ""; // TRU-01
    public bool Active { get; set; } = true;

    public int FuelId { get; set; }
    public Fuel? Fuel { get; set; }

    public int? TankId { get; set; }
    public Tank? Tank { get; set; }
}