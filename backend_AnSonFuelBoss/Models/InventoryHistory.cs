using System;

namespace backend_AnSonFuelBoss.Models
{
    public class InventoryHistory
    {
        public int Id { get; set; }

        public int TankId { get; set; }

        public string TankName { get; set; }

        public string ChangeType { get; set; } // IMPORT | SALE | ADJUST

        public decimal Quantity { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}