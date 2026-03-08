namespace backend_AnSonFuelBoss.Models;

public class Fuel
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int UnitPrice { get; set; } // VND/lít
    public bool Active { get; set; } = true;

    //public List<Tank> Tanks { get; set; } = new();
    //public List<Pump> Pumps { get; set; } = new();
}