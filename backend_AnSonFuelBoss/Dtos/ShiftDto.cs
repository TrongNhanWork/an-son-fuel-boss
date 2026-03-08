namespace backend_AnSonFuelBoss.Dtos;

public class ShiftDto
{
    public int Id { get; set; }
    public string Code { get; set; } = "";
    public string Status { get; set; } = "Open";
    public DateTime OpenedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    public int OpeningCash { get; set; }
    public int ExpectedCash { get; set; }
    public int? CountedCash { get; set; }
    public int? Difference { get; set; }
}