using backend_AnSonFuelBoss.Models;

public class FuelPriceHistory
{
    public int Id { get; set; }

    public int FuelId { get; set; }

    public Fuel Fuel { get; set; }

    public decimal OldPrice { get; set; }

    public decimal NewPrice { get; set; }

    public DateTime ChangedAt { get; set; }
}