namespace backend_AnSonFuelBoss.Dtos;

public class CreateSaleRequest
{
    public int PumpId { get; set; }      // trụ bơm
    public int Liters { get; set; }      // số lít bán
}