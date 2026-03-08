namespace backend_AnSonFuelBoss.Models;

public enum ShiftStatus { Open = 0, Closed = 1 }

public class Shift
{
    public int Id { get; set; }
    public string Code { get; set; } = "";        // SHIFT-...
    public ShiftStatus Status { get; set; } = ShiftStatus.Open;

    public DateTime OpenedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ClosedAt { get; set; }

    public int OpeningCash { get; set; } = 0;     // tiền đầu ca
    public int ExpectedCash { get; set; } = 0;    // tiền mặt kỳ vọng (từ giao dịch)
    public int? CountedCash { get; set; }         // tiền thực đếm
    public int? Difference { get; set; }          // chênh lệch

    public List<Sale> Sales { get; set; } = new();
}