using System.ComponentModel.DataAnnotations;

namespace backend_AnSonFuelBoss.Models
{
    public class AccessoryProduct
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Description { get; set; }

        public string Category { get; set; }

        public decimal ImportPrice { get; set; }

        public decimal SellPrice { get; set; }

        public int Stock { get; set; }

        public string Unit { get; set; } = "chai";

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}