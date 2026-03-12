namespace backend_AnSonFuelBoss.Models;

public class Fuel
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public decimal UnitPrice { get; set; } // VND/Lít
    public bool Active { get; set; } = true;

    //public List<Tank> Tanks { get; set; } = new();
    //public List<Pump> Pumps { get; set; } = new();
}