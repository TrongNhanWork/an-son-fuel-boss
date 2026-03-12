namespace backend_AnSonFuelBoss.Models
{
    public class Import
    {
        public int Id { get; set; }

        public int TankId { get; set; }
        public Tank Tank { get; set; }

        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; }

        public int Quantity { get; set; }

        public int UnitPrice { get; set; }

        public int TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}