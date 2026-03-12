namespace backend_AnSonFuelBoss.Dtos
{
    public class AccessoryProductDto
    {
        public string Name { get; set; }

        public string? Description { get; set; }

        public string Category { get; set; }

        public decimal ImportPrice { get; set; }

        public decimal SellPrice { get; set; }

        public int Stock { get; set; }

        public string Unit { get; set; }
    }
}