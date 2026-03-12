namespace backend_AnSonFuelBoss.Dtos
{
    public class ImportCreateDto
    {
        public int TankId { get; set; }

        public int SupplierId { get; set; }

        public int Quantity { get; set; }

        public int UnitPrice { get; set; }
    }
}