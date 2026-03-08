using backend_AnSonFuelBoss.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Import
{
    public int Id { get; set; }

    [Required]
    public int TankId { get; set; }

    [ForeignKey("TankId")]
    public Tank Tank { get; set; }

    [Required]
    public int Quantity { get; set; } // số lít nhập

    [Required]
    public int UnitPrice { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}