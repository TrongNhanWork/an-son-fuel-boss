namespace backend_AnSonFuelBoss.Models
{
    public class AccessorySale
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public AccessoryProduct Product { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}